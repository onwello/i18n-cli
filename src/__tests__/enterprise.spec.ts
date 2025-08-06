import { ConfigManager } from '../utils/config';
import { Validator } from '../utils/validator';
import { PerformanceMonitor } from '../utils/performance';
import { Logger } from '../utils/logger';
import { TranslationExtractor } from '../utils/extractor';
import { SecurityContext, CLIConfig } from '../types';
import * as fs from 'fs-extra';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('glob', () => ({
  glob: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('Enterprise Features', () => {
  let configManager: ConfigManager;
  let validator: Validator;
  let performanceMonitor: PerformanceMonitor;
  let logger: Logger;

  beforeEach(() => {
    configManager = ConfigManager.getInstance();
    const securityContext: SecurityContext = {
      inputValidation: true,
      outputSanitization: true,
      sanitizeOutputs: true,
      fileAccessControl: true,
      maxFileSize: 10,
      maxKeyLength: 200,
      allowedFileTypes: ['.ts', '.js', '.json']
    };
    validator = new Validator(securityContext);
    performanceMonitor = new PerformanceMonitor();
    logger = Logger.getInstance();
    jest.clearAllMocks();
  });

  describe('Configuration Management', () => {
    it('should load default configuration', async () => {
      const config = await configManager.loadConfig();
      
      expect(config).toBeDefined();
      expect(config.version).toBe('1.0.0');
      expect(config.environment).toBe('test'); // Environment is set to 'test' in test environment
      expect(config.logging.level).toBe('info');
      expect(config.performance.maxConcurrency).toBe(4);
      expect(config.security.validateInputs).toBe(true);
    });

    it('should validate configuration', () => {
      const validConfig: CLIConfig = {
        version: '1.0.0',
        environment: 'development',
        logging: {
          level: 'info',
          format: 'text',
          output: 'console'
        },
        performance: {
          maxConcurrency: 4,
          maxFileSize: 10,
          timeout: 300
        },
        security: {
          validateInputs: true,
          sanitizeOutputs: true,
          maxKeyLength: 200
        },
        features: {
          enableValidation: true,
          enableBackup: true,
          enableDryRun: true,
          enableProgressBar: true
        }
      };

      const validation = configManager.validateConfig(validConfig);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid configuration', () => {
      const invalidConfig: CLIConfig = {
        version: '',
        environment: 'invalid' as any,
        logging: {
          level: 'info',
          format: 'text',
          output: 'console'
        },
        performance: {
          maxConcurrency: 25, // Invalid: > 20
          maxFileSize: 150, // Invalid: > 100
          timeout: 10 // Invalid: < 30
        },
        security: {
          validateInputs: true,
          sanitizeOutputs: true,
          maxKeyLength: 5 // Invalid: < 10
        },
        features: {
          enableValidation: true,
          enableBackup: true,
          enableDryRun: true,
          enableProgressBar: true
        }
      };

      const validation = configManager.validateConfig(invalidConfig);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should get environment-specific configuration', () => {
      const config = configManager.getEnvironmentConfig();
      
      if (config.environment === 'production') {
        expect(config.logging.level).toBe('warn');
        expect(config.logging.format).toBe('json');
        expect(config.performance.maxConcurrency).toBeLessThanOrEqual(8);
      }
    });
  });

  describe('Validation System', () => {
    it('should validate file paths', () => {
      // Mock fs.existsSync to return true for this test
      const mockFs = require('fs-extra');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ size: 1024 });
      
      const validation = validator.validateFilePath('/valid/path/file.ts');
      expect(validation.isValid).toBe(true);
    });

    it('should reject non-existent files', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const validation = validator.validateFilePath('/nonexistent/file.ts');
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0].message).toContain('File does not exist');
    });

    it('should validate translation keys', () => {
      // Mock fs.existsSync to return true for this test
      const mockFs = require('fs-extra');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ size: 1024 });
      
      const validKey = {
        key: 'VALID_KEY',
        text: 'Valid translation text',
        type: 'EXCEPTION',
        file: '/path/to/file.ts',
        line: 10
      };

      const validation = validator.validateTranslationKey(validKey);
      expect(validation.isValid).toBe(true);
    });

    it('should detect suspicious content', () => {
      const suspiciousKey = {
        key: 'SUSPICIOUS_KEY',
        text: '<script>alert("xss")</script>',
        type: 'EXCEPTION',
        file: '/path/to/file.ts',
        line: 10
      };

      const validation = validator.validateTranslationKey(suspiciousKey);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings[0].message).toContain('suspicious content');
    });

    it('should sanitize output', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = validator.sanitizeOutput(input);
      // Check that dangerous content is removed
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      // The sanitized output should be different from input
      expect(sanitized).not.toBe(input);
      // The sanitized output should be empty since all content was dangerous
      expect(sanitized).toBe('');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics', () => {
      performanceMonitor.startMonitoring();
      
      // Add a small delay to ensure duration > 0
      const startTime = Date.now();
      while (Date.now() - startTime < 1) {
        // Wait for at least 1ms
      }
      
      performanceMonitor.updateProgress(5, 10);
      performanceMonitor.updateKeysProcessed(25);
      
      const metrics = performanceMonitor.endMonitoring();
      
      expect(metrics.filesProcessed).toBe(5);
      expect(metrics.totalKeys).toBe(25);
      expect(metrics.duration).toBeGreaterThan(0);
    });

    it('should calculate speed and ETA', () => {
      performanceMonitor.startMonitoring();
      
      // Simulate processing
      performanceMonitor.updateProgress(10, 100);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should handle progress callbacks', () => {
      const callback = jest.fn();
      performanceMonitor.onProgress(callback);
      
      performanceMonitor.startMonitoring();
      performanceMonitor.updateProgress(5, 10);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        current: 5,
        total: 10,
        percentage: 50
      }));
    });
  });

  describe('Enhanced Logging', () => {
    it('should log with context and metadata', () => {
      const logSpy = jest.spyOn(logger, 'info');
      
      logger.info('Test message', 'test-context', { key: 'value' });
      
      expect(logSpy).toHaveBeenCalledWith('Test message', 'test-context', { key: 'value' });
    });

    it('should log validation errors', () => {
      const errorSpy = jest.spyOn(logger, 'error');
      
      const errors = [
        { type: 'error', message: 'Test error', file: 'test.ts', line: 10 }
      ];
      
      logger.logValidationErrors(errors, 'test');
      
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should log performance metrics', () => {
      const infoSpy = jest.spyOn(logger, 'info');
      
      const metrics = {
        duration: 1000,
        filesProcessed: 10,
        totalKeys: 50,
        memoryUsage: 25.5,
        cpuUsage: 2.3
      };
      
      logger.logPerformanceMetrics(metrics, 'test');
      
      expect(infoSpy).toHaveBeenCalledWith('Performance metrics', 'test', expect.any(Object));
    });
  });

  describe('Enhanced Extractor', () => {
    it('should extract with enterprise features', async () => {
      const extractor = new TranslationExtractor();
      
      // Mock file system
      const mockFs = require('fs-extra');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ size: 1024 });
      mockFs.stat.mockResolvedValue({ size: 1024 });
      
      (mockFs.readFile as any).mockResolvedValue(`
        throw new BadRequestException('User already exists');
        return { message: 'Validation failed' };
        errors.push(\`Field '\${fieldName}' is required\`);
      `);
      
      const mockFiles = ['auth/src/service.ts'];
      const mockGlob = require('glob');
      mockGlob.glob.mockResolvedValue(mockFiles);
      
      const result = await extractor.extract({
        path: '.',
        verbose: true,
        validate: false, // Disable validation for test
        concurrency: 2,
        maxFileSize: 5
      });
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('priority');
      expect(result[0]).toHaveProperty('category');
    });

    it('should handle concurrent processing', async () => {
      const extractor = new TranslationExtractor();
      
      // Mock multiple files
      const mockFiles = [
        'auth/src/service1.ts',
        'auth/src/service2.ts',
        'profile/src/service3.ts'
      ];
      
      // Mock file system
      const mockFs = require('fs-extra');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({ size: 1024 });
      mockFs.stat.mockResolvedValue({ size: 1024 });
      
      (mockFs.readFile as any).mockResolvedValue('throw new BadRequestException("User already exists");');
      const mockGlob = require('glob');
      mockGlob.glob.mockResolvedValue(mockFiles);
      
      const result = await extractor.extract({
        path: '.',
        concurrency: 2,
        verbose: true,
        validate: false, // Disable validation for test
        maxFileSize: 100 // Allow larger files
      });
      
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Security Features', () => {
    it('should validate input strings', () => {
      const validation = validator.validateInputString('normal text', 'test');
      expect(validation.isValid).toBe(true);
    });

    it('should detect suspicious input', () => {
      const validation = validator.validateInputString('<script>alert("xss")</script>', 'test');
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should validate paths for security', () => {
      const validation = validator.validatePath('/safe/path');
      expect(validation.isValid).toBe(true);
    });

    it('should detect path traversal attempts', () => {
      const validation = validator.validatePath('/path/../unsafe');
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });
}); 