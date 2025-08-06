/// <reference types="jest" />

// Mock dependencies before importing
jest.mock('../utils/replacer');
jest.mock('glob', () => ({
  glob: jest.fn()
}));
jest.mock('../utils/logger', () => {
  const mockLogger = {
    setVerbose: jest.fn(),
    header: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    section: jest.fn(),
    table: jest.fn()
  };
  
  return {
    Logger: {
      getInstance: jest.fn(() => mockLogger)
    }
  };
});

import { createReplaceCommand, replaceTranslationStrings } from './replace';
import { TranslationReplacer } from '../utils/replacer';

const mockReplacer = TranslationReplacer as jest.MockedClass<typeof TranslationReplacer>;

describe('Replace Command', () => {
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      setVerbose: jest.fn(),
      header: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      success: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
      section: jest.fn(),
      table: jest.fn()
    };

    // Mock the logger instance
    const { Logger } = require('../utils/logger');
    Logger.getInstance.mockReturnValue(mockLogger);

    // Mock process.exit
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    // Reset the mock constructor
    mockReplacer.mockClear();
    mockReplacer.prototype.replace = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('replaceTranslationStrings function', () => {
    it('should replace strings successfully', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      await replaceTranslationStrings({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      });
    });

    it('should handle replacement errors', async () => {
      mockReplacer.prototype.replace.mockRejectedValue(new Error('Replacement failed'));

      await expect(replaceTranslationStrings({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: false,
        verbose: false
      })).rejects.toThrow('Replacement failed');
    });
  });

  describe('replace command', () => {
    it('should replace strings successfully with default options', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace']);

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: undefined,
        verbose: undefined
      });
    });

    it('should handle custom path and keys file', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace', '--path', './src', '--keys-file', 'custom-keys.json']);

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: './src',
        keysFile: 'custom-keys.json',
        backup: true,
        dryRun: undefined,
        verbose: undefined
      });
    });

    it('should handle dry run mode', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace', '--dry-run']);

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: true,
        verbose: undefined
      });
    });

    it('should disable backup when specified', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace', '--no-backup']);

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: false,
        dryRun: undefined,
        verbose: undefined
      });
    });

    it('should enable verbose mode when specified', async () => {
      mockReplacer.prototype.replace.mockResolvedValue(undefined);

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace', '--verbose']);

      expect(mockReplacer.prototype.replace).toHaveBeenCalledWith({
        path: '.',
        keysFile: 'translation-keys.json',
        backup: true,
        dryRun: undefined,
        verbose: true
      });
    });

    it('should handle replacement errors gracefully', async () => {
      mockReplacer.prototype.replace.mockRejectedValue(new Error('Replacement failed'));

      const command = createReplaceCommand();
      
      await command.parseAsync(['node', 'test', 'replace']);

      // Should handle the error gracefully without throwing
      expect(mockReplacer.prototype.replace).toHaveBeenCalled();
    });
  });
}); 