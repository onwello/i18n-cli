/// <reference types="jest" />

import { TranslationReplacer } from './replacer';
import * as fs from 'fs-extra';
import { glob } from 'glob';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('glob', () => ({
  glob: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockGlob = glob as jest.MockedFunction<typeof glob>;

describe('TranslationReplacer', () => {
  let replacer: TranslationReplacer;

  beforeEach(() => {
    replacer = new TranslationReplacer();
    jest.clearAllMocks();
    
    // Default mock implementations
    mockGlob.mockResolvedValue([]);
    mockFs.readJson.mockResolvedValue({ keys: [] });
    (mockFs.readFile as any).mockResolvedValue('');
    (mockFs.writeFile as any).mockResolvedValue(undefined);
  });

  describe('replace', () => {
    it('should replace hardcoded strings with translation keys', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `
        throw new BadRequestException('User already exists with this email');
        return { message: 'Validation failed' };
        errors.push(\`The field '\${fieldName}' is required\`);
      `;

      // Mock specific file discovery
      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.readJson).toHaveBeenCalledWith('translation-keys.json');
      expect(mockFs.readFile).toHaveBeenCalledWith('auth/src/services/auth.service.ts', 'utf8');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS\')')
      );
    });

    it('should handle simple exception replacement', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `throw new BadRequestException('User already exists with this email');`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS\')')
      );
    });

    it('should handle return object replacement', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED',
          text: 'Validation failed',
          type: 'RETURN_MESSAGE',
          file: 'auth/src/services/auth.service.ts',
          line: 15
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `return { message: 'Validation failed' };`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED\')')
      );
    });

    it('should handle template literal replacement', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.TEMPLATE_LITERAL.FIELD_REQUIRED',
          text: 'The field \'${fieldName}\' is required',
          type: 'TEMPLATE_LITERAL',
          file: 'auth/src/services/auth.service.ts',
          line: 20
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `errors.push(\`The field '\${fieldName}' is required\`);`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.TEMPLATE_LITERAL.FIELD_REQUIRED\')')
      );
    });

    it('should handle multiple replacements in same file', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        },
        {
          key: 'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED',
          text: 'Validation failed',
          type: 'RETURN_MESSAGE',
          file: 'auth/src/services/auth.service.ts',
          line: 15
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `
        throw new BadRequestException('User already exists with this email');
        return { message: 'Validation failed' };
      `;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      const writtenContent = (mockFs.writeFile as any).mock.calls[1][1]; // Check the actual file, not backup
      expect(writtenContent).toContain('this.translate(\'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS\')');
      expect(writtenContent).toContain('this.translate(\'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED\')');
    });

    it('should handle file reading errors gracefully', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
      mockFs.readJson.mockResolvedValue(mockKeysData);
      (mockFs.readFile as any).mockRejectedValue(new Error('Permission denied'));

      await replacer.replace({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      // Should handle the error gracefully without throwing
      expect(mockFs.readFile).toHaveBeenCalledWith('auth/src/services/auth.service.ts', 'utf8');
    });

    it('should handle backup creation', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `throw new BadRequestException('User already exists with this email');`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts.backup',
        mockContent
      );
    });

    it('should handle exception with object parameters', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `throw new BadRequestException('User already exists with this email', { userId: 123 });`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS\')')
      );
    });

    it('should handle return object with additional properties', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED',
          text: 'Validation failed',
          type: 'RETURN_MESSAGE',
          file: 'auth/src/services/auth.service.ts',
          line: 15
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `return { message: 'Validation failed', code: 'VALIDATION_ERROR' };`;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/services/auth.service.ts',
        expect.stringContaining('this.translate(\'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED\')')
      );
    });

    it('should handle complex nested structures', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        },
        {
          key: 'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED',
          text: 'Validation failed',
          type: 'RETURN_MESSAGE',
          file: 'auth/src/services/auth.service.ts',
          line: 15
        }
      ];

      const mockKeysData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      const mockContent = `
        if (error) {
          throw new BadRequestException('User already exists with this email');
        }
        return {
          success: true,
          message: 'Validation failed'
        };
      `;

      mockGlob.mockResolvedValue(['auth/src/services/auth.service.ts']);
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

      const writtenContent = (mockFs.writeFile as any).mock.calls[1][1]; // Check the actual file, not backup
      expect(writtenContent).toContain('this.translate(\'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS\')');
      expect(writtenContent).toContain('this.translate(\'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED\')');
    });
  });
}); 