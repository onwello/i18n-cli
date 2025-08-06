import { TranslationExtractor } from './extractor';
import * as fs from 'fs-extra';
import { glob } from 'glob';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('glob', () => ({
  glob: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockGlob = glob as jest.MockedFunction<typeof glob>;

// Mock file stats for size filtering
const mockFileStats = {
  size: 1024, // 1KB file
  isFile: () => true,
  isDirectory: () => false
};

describe('TranslationExtractor', () => {
  let extractor: TranslationExtractor;

  beforeEach(() => {
    extractor = new TranslationExtractor();
    jest.clearAllMocks();
    
    // Mock file stats for size filtering
    (mockFs.stat as any).mockResolvedValue(mockFileStats);
    mockFs.existsSync.mockReturnValue(true);
  });

  describe('extract', () => {
    it('should extract translation keys from TypeScript files', async () => {
      const mockFiles = ['auth/src/services/auth.service.ts', 'profile/src/controllers/profile.controller.ts'];
      const mockContent1 = `
        throw new BadRequestException('User already exists with this email');
        return { message: 'Validation failed' };
        errors.push(\`The field '\${fieldName}' is required\`);
      `;
      const mockContent2 = `
        throw new NotFoundException('Profile not found');
        return { message: 'Profile updated successfully' };
      `;

      // Mock glob to return a Promise that resolves to the files
      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(7); // Multiple patterns found in same text (including new patterns)
      expect(result[0]).toMatchObject({
        key: expect.stringContaining('AUTH.AUTH_SERVICE.EXCEPTION'),
        text: 'User already exists with this email',
        type: 'EXCEPTION',
        file: 'auth/src/services/auth.service.ts'
      });
      // Find the RETURN_MESSAGE result for profile
      const profileReturnMessage = result.find(r => 
        r.type === 'RETURN_MESSAGE' && 
        r.file === 'profile/src/controllers/profile.controller.ts'
      );
      expect(profileReturnMessage).toMatchObject({
        key: expect.stringContaining('PROFILE.PROFILE_CONTROLLER.RETURN_MESSAGE'),
        text: 'Profile updated successfully',
        type: 'RETURN_MESSAGE',
        file: 'profile/src/controllers/profile.controller.ts'
      });
    });

    it('should handle file reading errors gracefully', async () => {
      const mockFiles = ['test.ts'];
      
      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockRejectedValue(new Error('File not found'));

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(0);
    });

    it('should extract exception messages with object parameters', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        throw new BadRequestException('User already exists with this email');
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        text: 'User already exists with this email',
        type: 'EXCEPTION'
      });
    });

    it('should extract exception object messages', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        throw new BadRequestException('User already exists with this email');
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        text: 'User already exists with this email',
        type: 'EXCEPTION'
      });
    });

    it('should extract return object messages', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        return { message: 'Validation failed' };
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(2); // RETURN_MESSAGE and MESSAGE_PROPERTY patterns match
      expect(result[0]).toMatchObject({
        text: 'Validation failed',
        type: 'RETURN_MESSAGE'
      });
      expect(result[1]).toMatchObject({
        text: 'Validation failed',
        type: 'MESSAGE_PROPERTY'
      });
    });

    it('should extract template literals', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        errors.push(\`The field '\${fieldName}' is required\`);
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        text: "The field '${fieldName}' is required",
        type: 'TEMPLATE_LITERAL'
      });
    });

    it('should handle empty files', async () => {
      const mockFiles = ['empty.ts'];
      const mockContent = '';

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(0);
    });

    it('should handle files with no translatable strings', async () => {
      const mockFiles = ['no-strings.ts'];
      const mockContent = `
        const x = 1;
        const y = 2;
        console.log('This is not translatable');
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(0);
    });

    it('should generate unique keys for each string', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        throw new BadRequestException('User already exists with this email');
        throw new BadRequestException('User already exists with this email');
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(1); // Should deduplicate
      expect(result[0]).toMatchObject({
        text: 'User already exists with this email',
        type: 'EXCEPTION'
      });
    });

    it('should handle multiple patterns in same file', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        throw new BadRequestException('User already exists with this email');
        return { message: 'Validation failed' };
        errors.push(\`The field '\${fieldName}' is required\`);
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(4); // Multiple patterns found (including new patterns)
      expect(result.map(r => r.text)).toContain('User already exists with this email');
      expect(result.map(r => r.text)).toContain('Validation failed');
      expect(result.map(r => r.text)).toContain("The field '${fieldName}' is required");
    });

    it('should handle verbose mode', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        throw new BadRequestException('User already exists with this email');
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: true,
        validate: false,
        maxFileSize: 100
      });

      expect(result).toHaveLength(1);
    });

    it('should respect ignore patterns', async () => {
      mockGlob.mockResolvedValue([]);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**', '**/dist/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(mockGlob).toHaveBeenCalledWith(
        expect.stringContaining('**/*.ts'),
        expect.objectContaining({
          ignore: ['**/node_modules/**', '**/dist/**']
        })
      );
      expect(result).toHaveLength(0);
    });

    it('should handle complex nested structures', async () => {
      const mockFiles = ['test.ts'];
      const mockContent = `
        if (error) {
          throw new BadRequestException('User already exists with this email');
        }
        return {
          success: true,
          message: 'Validation failed'
        };
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const result = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false
      });

      expect(result).toHaveLength(3); // Multiple patterns found (including MESSAGE_PROPERTY)
      expect(result.map(r => r.text)).toContain('User already exists with this email');
      expect(result.map(r => r.text)).toContain('Validation failed');
      expect(result.map(r => r.type)).toContain('MESSAGE_PROPERTY');
    });
  });
}); 