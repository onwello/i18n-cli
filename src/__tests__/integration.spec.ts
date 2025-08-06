import { TranslationExtractor } from '../utils/extractor';
import { TranslationGenerator } from '../utils/generator';
import { TranslationReplacer } from '../utils/replacer';
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

describe('Translation CLI Integration', () => {
  let extractor: TranslationExtractor;
  let generator: TranslationGenerator;
  let replacer: TranslationReplacer;

  beforeEach(() => {
    extractor = new TranslationExtractor();
    generator = new TranslationGenerator();
    replacer = new TranslationReplacer();
    jest.clearAllMocks();
    
    // Mock file stats for size filtering
    (mockFs.stat as any).mockResolvedValue(mockFileStats);
    mockFs.existsSync.mockReturnValue(true);
  });

  describe('Full workflow: extract -> generate -> replace', () => {
    it('should complete full translation workflow successfully', async () => {
      // Step 1: Extract translation keys
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

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2);

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(extractedKeys).toHaveLength(7); // Updated for new patterns
      expect(extractedKeys[0].text).toBe('User already exists with this email');
      expect(extractedKeys[1].text).toBe('Validation failed');
      expect(extractedKeys[2].text).toBe("The field '${fieldName}' is required");
      expect(extractedKeys[3].text).toBe('Validation failed'); // MESSAGE_PROPERTY pattern
      expect(extractedKeys[4].text).toBe('Profile not found');
      expect(extractedKeys[5].text).toBe('Profile updated successfully');
      expect(extractedKeys[6].text).toBe('Profile updated successfully'); // MESSAGE_PROPERTY pattern

      // Step 2: Generate translation files
      const mockKeysData = {
        keys: extractedKeys,
        totalKeys: extractedKeys.length,
        services: ['auth', 'profile'],
        generatedAt: new Date().toISOString()
      };

      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr'],
        template: true,
        verbose: false
      });

      expect(mockFs.ensureDir).toHaveBeenCalledWith('auth/src/translations');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('profile/src/translations');
      expect(mockFs.writeFile).toHaveBeenCalledTimes(6); // 2 services × 2 languages + 2 README files

      // Step 3: Replace hardcoded strings
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      expect(mockFs.readJson).toHaveBeenCalledWith('translation-keys.json');
      expect(mockFs.readFile).toHaveBeenCalledWith('auth/src/services/auth.service.ts', 'utf8');
      expect(mockFs.readFile).toHaveBeenCalledWith('profile/src/controllers/profile.controller.ts', 'utf8');
    });

    it('should handle multiple file types and patterns', async () => {
      // Step 1: Extract from multiple file types
      const mockFiles = [
        'auth/src/services/auth.service.ts',
        'profile/src/controllers/profile.controller.ts',
        'location/src/services/location.service.ts'
      ];
      const mockContent1 = `
        throw new BadRequestException('User already exists with this email');
        return { message: 'Validation failed' };
        errors.push(\`The field '\${fieldName}' is required\`);
      `;
      const mockContent2 = `
        throw new NotFoundException('Profile not found');
        errors.push(\`The field '\${fieldName}' is required\`);
      `;
      const mockContent3 = `
        throw new Exception('Cannot create location under parent \${createLocationDto.parentId}');
        return { message: 'Location created successfully' };
      `;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2)
        .mockResolvedValueOnce(mockContent3);

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(extractedKeys.length).toBeGreaterThan(0);

      // Step 2: Generate for multiple services
      const mockKeysData = {
        keys: extractedKeys,
        totalKeys: extractedKeys.length,
        services: ['auth', 'profile', 'location'],
        generatedAt: new Date().toISOString()
      };

      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'de'],
        template: true,
        verbose: false
      });

      expect(mockFs.ensureDir).toHaveBeenCalledWith('auth/src/translations');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('profile/src/translations');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('location/src/translations');

      // Step 3: Replace in all files
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any)
        .mockResolvedValueOnce(mockContent1)
        .mockResolvedValueOnce(mockContent2)
        .mockResolvedValueOnce(mockContent3);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      expect(mockFs.readFile).toHaveBeenCalledWith('auth/src/services/auth.service.ts', 'utf8');
      expect(mockFs.readFile).toHaveBeenCalledWith('profile/src/controllers/profile.controller.ts', 'utf8');
      expect(mockFs.readFile).toHaveBeenCalledWith('location/src/services/location.service.ts', 'utf8');
    });

    it('should handle errors gracefully in workflow', async () => {
      // Clear mocks to ensure clean state
      jest.clearAllMocks();
      
      // Step 1: Extract with file reading error
      const mockFiles = ['auth/src/services/auth.service.ts'];
      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockImplementation(() => {
        throw new Error('File not found');
      });

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false
      });

      expect(extractedKeys).toHaveLength(0);

      // Step 2: Generate with empty keys
      const mockKeysData = {
        keys: [],
        totalKeys: 0,
        services: [],
        generatedAt: new Date().toISOString()
      };

      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      // Should not create any files with empty keys
      expect(mockFs.writeFile).toHaveBeenCalledTimes(0);

      // Step 3: Replace with no files to process
      mockFs.readJson.mockResolvedValue(mockKeysData);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      // Should process files but handle errors gracefully
      expect(mockFs.readFile).toHaveBeenCalledWith('auth/src/services/auth.service.ts', 'utf8');
    });

    it('should handle dry run mode in workflow', async () => {
      // Clear mocks to ensure clean state
      jest.clearAllMocks();
      
      // Step 1: Extract normally
      const mockFiles = ['auth/src/services/auth.service.ts'];
      const mockContent = `throw new BadRequestException('User already exists with this email');`;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(extractedKeys).toHaveLength(1);

      // Step 2: Generate normally
      const mockKeysData = {
        keys: extractedKeys,
        totalKeys: extractedKeys.length,
        services: ['auth'],
        generatedAt: new Date().toISOString()
      };

      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // en.json + README.md

      // Step 3: Replace in dry run mode
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: true,
        verbose: false
      });

      // Should not write any files in dry run mode
      expect(mockFs.writeFile).not.toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.anything()
      );
    });

    it('should handle backup creation in workflow', async () => {
      // Step 1: Extract
      const mockFiles = ['auth/src/services/auth.service.ts'];
      const mockContent = `throw new BadRequestException('User already exists with this email');`;

      mockGlob.mockResolvedValue(mockFiles);
      (mockFs.readFile as any).mockResolvedValue(mockContent);

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false
      });

      // Step 2: Generate
      const mockKeysData = {
        keys: extractedKeys,
        totalKeys: extractedKeys.length,
        services: ['auth'],
        generatedAt: new Date().toISOString()
      };

      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      // Step 3: Replace with backup enabled
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any).mockResolvedValue(mockContent);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      // Should create backup file
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts.backup',
        mockContent
      );
    });

    it('should handle complex nested patterns in workflow', async () => {
      // Step 1: Extract complex patterns
      const mockFiles = ['auth/src/services/auth.service.ts'];
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

      const extractedKeys = await extractor.extract({
        path: '.',
        ignore: ['**/node_modules/**'],
        verbose: false,
        validate: false,
        maxFileSize: 100
      });

      expect(extractedKeys).toHaveLength(3); // Updated for new patterns
      expect(extractedKeys[0].text).toBe('User already exists with this email');
      expect(extractedKeys[1].text).toBe('Validation failed');
      expect(extractedKeys[2].text).toBe('Validation failed'); // MESSAGE_PROPERTY pattern

      // Step 2: Generate
      const mockKeysData = {
        keys: extractedKeys,
        totalKeys: extractedKeys.length,
        services: ['auth'],
        generatedAt: new Date().toISOString()
      };

      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      // Step 3: Replace complex patterns
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any).mockResolvedValue(mockContent);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      // Find the call that writes the replaced content (not backup or README)
      const writeFileCalls = (mockFs.writeFile as any).mock.calls;
      const replacedContentCall = writeFileCalls.find((call: any) => 
        call[0] === 'auth/src/services/auth.service.ts' && 
        call[1] !== mockContent
      );
      
      expect(replacedContentCall[1]).toContain('this.translate(');
    });
  });
}); 