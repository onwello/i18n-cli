import { TranslationGenerator } from './generator';
import * as fs from 'fs-extra';

// Mock dependencies
jest.mock('fs-extra');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('TranslationGenerator', () => {
  let generator: TranslationGenerator;

  beforeEach(() => {
    generator = new TranslationGenerator();
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate translation files for each service', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        },
        {
          key: 'PROFILE.PROFILE_CONTROLLER.EXCEPTION.PROFILE_NOT_FOUND',
          text: 'Profile not found',
          type: 'EXCEPTION',
          file: 'profile/src/controllers/profile.controller.ts',
          line: 20
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth', 'profile'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'es'],
        template: true,
        verbose: false
      });

      expect(mockFs.readJson).toHaveBeenCalledWith('translation-keys.json');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('auth/src/translations');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('profile/src/translations');
      expect(mockFs.writeFile).toHaveBeenCalledTimes(8); // 2 services × 3 languages + 2 README files
    });

    it('should handle custom languages', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'de'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(3); // 1 service × 2 languages + 1 README file
    });

    it('should skip template generation when disabled', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr'],
        template: false,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // Only en.json + 1 README file
    });

    it('should handle single language', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // 1 service × 1 language + 1 README file
    });

    it('should handle empty translation keys', async () => {
      const mockInputData = {
        keys: [],
        totalKeys: 0,
        services: [],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(0); // No services to process
      expect(mockFs.writeFile).toHaveBeenCalledTimes(0); // No README files
    });

    it('should generate correct translation file structure', async () => {
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

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/translations/en.json',
        JSON.stringify({
          'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS': 'User already exists with this email',
          'AUTH.AUTH_SERVICE.RETURN_MESSAGE.VALIDATION_FAILED': 'Validation failed'
        }, null, 2)
      );
    });

    it('should handle file system errors gracefully', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockRejectedValue(new Error('Permission denied'));

      await expect(generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      })).rejects.toThrow('Permission denied');
    });

    it('should handle input file not found', async () => {
      mockFs.readJson.mockRejectedValue(new Error('File not found'));

      await generator.generate({
        input: 'nonexistent.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      // Should handle the error gracefully without throwing
      expect(mockFs.writeFile).toHaveBeenCalledTimes(0); // No files generated due to error
    });

    it('should handle verbose mode', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: true
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // 1 language file + 1 README file
    });

    it('should generate template files for other languages', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 1,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en', 'fr'],
        template: true,
        verbose: false
      });

      // Should generate 3 files: en.json, fr.json, and README.md
      expect(mockFs.writeFile).toHaveBeenCalledTimes(3);
      
      // Check that both language files were created
      const writeFileCalls = (mockFs.writeFile as any).mock.calls;
      expect(writeFileCalls[0][0]).toBe('auth/src/translations/en.json');
      expect(writeFileCalls[1][0]).toBe('auth/src/translations/fr.json');
    });

    it('should handle multiple services correctly', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        },
        {
          key: 'PROFILE.PROFILE_CONTROLLER.EXCEPTION.PROFILE_NOT_FOUND',
          text: 'Profile not found',
          type: 'EXCEPTION',
          file: 'profile/src/controllers/profile.controller.ts',
          line: 20
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth', 'profile'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      // Should create directories for both services
      expect(mockFs.ensureDir).toHaveBeenCalledWith('auth/src/translations');
      expect(mockFs.ensureDir).toHaveBeenCalledWith('profile/src/translations');
      
      // Should generate 4 files: 2 language files + 2 README files
      expect(mockFs.writeFile).toHaveBeenCalledTimes(4);
    });

    it('should handle special characters in translation keys', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        },
        {
          key: 'AUTH.AUTH_SERVICE.TEMPLATE_LITERAL.FIELD_REQUIRED',
          text: "The field '${fieldName}' is required",
          type: 'TEMPLATE_LITERAL',
          file: 'auth/src/services/auth.service.ts',
          line: 15
        }
      ];

      const mockInputData = {
        keys: mockKeys,
        totalKeys: 2,
        services: ['auth'],
        generatedAt: '2024-01-01T00:00:00.000Z'
      };

      mockFs.readJson.mockResolvedValue(mockInputData);
      (mockFs.ensureDir as any).mockResolvedValue(undefined);
      (mockFs.writeJson as any).mockResolvedValue(undefined);
      (mockFs.writeFile as any).mockResolvedValue(undefined);

      await generator.generate({
        input: 'translation-keys.json',
        languages: ['en'],
        template: true,
        verbose: false
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'auth/src/translations/en.json',
        JSON.stringify({
          'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS': 'User already exists with this email',
          'AUTH.AUTH_SERVICE.TEMPLATE_LITERAL.FIELD_REQUIRED': "The field '${fieldName}' is required"
        }, null, 2)
      );
    });
  });
}); 