import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = Logger.getInstance();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info message', () => {
      logger.info('Test info message');
      expect(consoleSpy).toHaveBeenCalledWith('ℹ', 'Test info message');
    });
  });

  describe('success', () => {
    it('should log success message', () => {
      logger.success('Test success message');
      expect(consoleSpy).toHaveBeenCalledWith('✅', 'Test success message');
    });
  });

  describe('warning', () => {
    it('should log warning message', () => {
      logger.warning('Test warning message');
      expect(consoleSpy).toHaveBeenCalledWith('⚠️', 'Test warning message');
    });
  });

  describe('error', () => {
    it('should log error message', () => {
      logger.error('Test error message');
      expect(consoleSpy).toHaveBeenCalledWith('❌', 'Test error message');
    });
  });

  describe('debug', () => {
    it('should log debug message when verbose is enabled', () => {
      logger.setVerbose(true);
      logger.debug('Test debug message');
      expect(consoleSpy).toHaveBeenCalledWith('🔍', 'Test debug message');
    });

    it('should not log debug message when verbose is disabled', () => {
      logger.setVerbose(false);
      logger.debug('Test debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('header', () => {
    it('should log header with cyan formatting', () => {
      logger.header('Test Header');
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\n' + '='.repeat(50));
      expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Test Header');
      expect(consoleSpy).toHaveBeenNthCalledWith(3, '='.repeat(50));
    });
  });

  describe('section', () => {
    it('should log section with blue formatting', () => {
      logger.section('Test Section');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenNthCalledWith(1, '\nTest Section');
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '-'.repeat('Test Section'.length));
    });
  });

  describe('table', () => {
    it('should display table with headers and data', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];

      logger.table(data);

      expect(consoleSpy).toHaveBeenCalledTimes(4);
      expect(consoleSpy).toHaveBeenNthCalledWith(1, 'name | age');
      expect(consoleSpy).toHaveBeenNthCalledWith(2, '----------');
      expect(consoleSpy).toHaveBeenNthCalledWith(3, 'John | 30 ');
      expect(consoleSpy).toHaveBeenNthCalledWith(4, 'Jane | 25 ');
    });

    it('should handle empty data', () => {
      logger.table([]);
      expect(consoleSpy).toHaveBeenCalledWith('ℹ', 'No data to display');
    });
  });
}); 