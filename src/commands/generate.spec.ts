// Mock dependencies before importing
jest.mock('../utils/generator');
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

import { createGenerateCommand, generateTranslationFiles } from './generate';
import { TranslationGenerator } from '../utils/generator';

const mockGenerator = TranslationGenerator as jest.MockedClass<typeof TranslationGenerator>;

describe('Generate Command', () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTranslationFiles function', () => {
    it('should generate translation files successfully', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      await generateTranslationFiles({
        input: 'translation-keys.json',
        languages: 'en,fr,es,de,ar',
        template: true,
        verbose: false
      });

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'es', 'de', 'ar'],
        template: true,
        verbose: false
      });
    });

    it('should handle generation errors', async () => {
      mockGenerator.prototype.generate.mockRejectedValue(new Error('Generation failed'));

      await expect(generateTranslationFiles({
        input: 'translation-keys.json',
        languages: 'en,fr',
        template: true,
        verbose: false
      })).rejects.toThrow('Generation failed');
    });
  });

  describe('generate command', () => {
    it('should generate translation files successfully', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate']);

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'es', 'de', 'ar'],
        template: true,
        verbose: undefined
      });
    });

    it('should handle custom input file', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate', '--input', 'custom-keys.json']);

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'custom-keys.json',
        languages: ['en', 'fr', 'es', 'de', 'ar'],
        template: true,
        verbose: undefined
      });
    });

    it('should handle custom languages', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate', '--languages', 'en,fr,de']);

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'de'],
        template: true,
        verbose: undefined
      });
    });

    it('should disable template generation when specified', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate', '--no-template']);

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'es', 'de', 'ar'],
        template: false,
        verbose: undefined
      });
    });

    it('should enable verbose mode when specified', async () => {
      mockGenerator.prototype.generate.mockResolvedValue(undefined);

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate', '--verbose']);

      expect(mockGenerator.prototype.generate).toHaveBeenCalledWith({
        input: 'translation-keys.json',
        languages: ['en', 'fr', 'es', 'de', 'ar'],
        template: true,
        verbose: true
      });
    });

    it('should handle generation errors gracefully', async () => {
      mockGenerator.prototype.generate.mockRejectedValue(new Error('Generation failed'));

      const command = createGenerateCommand();
      
      await command.parseAsync(['node', 'test', 'generate']);

      // Should handle the error gracefully without throwing
      expect(mockGenerator.prototype.generate).toHaveBeenCalled();
    });
  });
}); 