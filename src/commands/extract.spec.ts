// Mock dependencies before importing
jest.mock('../utils/extractor');
jest.mock('../utils/logger', () => {
  const mockLogger = {
    setVerbose: jest.fn(),
    header: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };
  
  return {
    Logger: {
      getInstance: jest.fn(() => mockLogger)
    }
  };
});
jest.mock('fs-extra');

import { createExtractCommand, extractTranslationKeys } from './extract';
import { TranslationExtractor } from '../utils/extractor';
import * as fs from 'fs-extra';

const mockExtractor = TranslationExtractor as jest.MockedClass<typeof TranslationExtractor>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Extract Command', () => {
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      setVerbose: jest.fn(),
      header: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      success: jest.fn(),
      warning: jest.fn(),
      error: jest.fn()
    };

    // Mock the logger instance
    const { Logger } = require('../utils/logger');
    Logger.getInstance.mockReturnValue(mockLogger);

    // Mock process.exit
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    // Properly type the mock functions
    (mockFs.writeFile as any).mockResolvedValue(undefined);
    (mockFs.writeJson as any).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractTranslationKeys function', () => {
    it('should extract translation keys successfully', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);

      await extractTranslationKeys({
        path: '.',
        output: 'test-keys.json',
        ignore: '**/node_modules/**,**/dist/**',
        verbose: false
      });

      expect(mockExtractor.prototype.extract).toHaveBeenCalledWith({
        path: '.',
        ignore: ['**/node_modules/**', '**/dist/**'],
        verbose: false
      });

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        'test-keys.json',
        expect.objectContaining({
          keys: mockKeys,
          totalKeys: 1,
          services: ['auth'],
          generatedAt: expect.any(String)
        }),
        { spaces: 2 }
      );
    });

    it('should handle extraction errors', async () => {
      mockExtractor.prototype.extract.mockRejectedValue(new Error('Extraction failed'));

      await expect(extractTranslationKeys({
        path: '.',
        output: 'test-keys.json',
        ignore: '**/node_modules/**',
        verbose: false
      })).rejects.toThrow('Extraction failed');
    });

    it('should handle file writing errors', async () => {
      const mockKeys = [
        {
          key: 'TEST.KEY',
          text: 'Test message',
          type: 'EXCEPTION',
          file: 'test.ts',
          line: 1
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);
      (mockFs.writeJson as any).mockRejectedValue(new Error('Write failed'));

      await expect(extractTranslationKeys({
        path: '.',
        output: 'test-keys.json',
        ignore: '**/node_modules/**',
        verbose: false
      })).rejects.toThrow('Write failed');
    });
  });

  describe('extract command', () => {
    it('should extract translation keys successfully', async () => {
      const mockKeys = [
        {
          key: 'AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS',
          text: 'User already exists with this email',
          type: 'EXCEPTION',
          file: 'auth/src/services/auth.service.ts',
          line: 10
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);

      const command = createExtractCommand();
      
      // Simulate command execution
      await command.parseAsync(['node', 'test', 'extract', '--path', '.', '--output', 'test-keys.json']);

      expect(mockExtractor.prototype.extract).toHaveBeenCalledWith({
        path: '.',
        ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.spec.ts', '**/*.test.ts'],
        verbose: undefined
      });

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        'test-keys.json',
        expect.objectContaining({
          keys: mockKeys,
          totalKeys: 1,
          services: ['auth'],
          generatedAt: expect.any(String)
        }),
        { spaces: 2 }
      );
    });

    it('should handle extraction errors gracefully', async () => {
      mockExtractor.prototype.extract.mockRejectedValue(new Error('Extraction failed'));

      const command = createExtractCommand();
      
      await command.parseAsync(['node', 'test', 'extract']);

      // Should handle the error gracefully without throwing
      expect(mockExtractor.prototype.extract).toHaveBeenCalled();
    });

    it('should handle file writing errors', async () => {
      const mockKeys = [
        {
          key: 'TEST.KEY',
          text: 'Test message',
          type: 'EXCEPTION',
          file: 'test.ts',
          line: 1
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);
      (mockFs.writeJson as any).mockRejectedValue(new Error('Write failed'));

      const command = createExtractCommand();
      
      await command.parseAsync(['node', 'test', 'extract']);

      // Should handle the error gracefully without throwing
      expect(mockExtractor.prototype.extract).toHaveBeenCalled();
    });

    it('should use default output file when not specified', async () => {
      const mockKeys = [
        {
          key: 'TEST.KEY',
          text: 'Test message',
          type: 'EXCEPTION',
          file: 'test.ts',
          line: 1
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);

      const command = createExtractCommand();
      
      await command.parseAsync(['node', 'test', 'extract']);

      expect(mockFs.writeJson).toHaveBeenCalledWith(
        'translation-keys.json',
        expect.any(Object),
        { spaces: 2 }
      );
    });

    it('should enable verbose mode when specified', async () => {
      const mockKeys = [
        {
          key: 'TEST.KEY',
          text: 'Test message',
          type: 'EXCEPTION',
          file: 'test.ts',
          line: 1
        }
      ];

      mockExtractor.prototype.extract.mockResolvedValue(mockKeys);

      const command = createExtractCommand();
      
      await command.parseAsync(['node', 'test', 'extract', '--verbose']);

      expect(mockExtractor.prototype.extract).toHaveBeenCalledWith({
        path: '.',
        ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.spec.ts', '**/*.test.ts'],
        verbose: true
      });
    });
  });
}); 