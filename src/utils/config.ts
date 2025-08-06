import fs from 'fs-extra';
import path from 'path';
import { CLIConfig } from '../types';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: CLIConfig;
  private configPath: string;

  private constructor() {
    this.configPath = this.findConfigFile();
    this.config = this.loadDefaultConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private findConfigFile(): string {
    const possiblePaths = [
      '.i18n-cli.json',
      '.i18n-cli.yaml',
      '.i18n-cli.yml',
      'i18n-cli.json',
      'i18n-cli.yaml',
      'i18n-cli.yml',
      path.join(process.env.HOME || '', '.i18n-cli.json'),
      path.join(process.env.HOME || '', '.i18n-cli.yaml'),
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    return '.i18n-cli.json'; // Default config file
  }

  private loadDefaultConfig(): CLIConfig {
    return {
      version: '1.0.0',
      environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
      logging: {
        level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
        format: 'text',
        output: 'console',
      },
      performance: {
        maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || '4'),
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10'), // 10MB
        timeout: parseInt(process.env.TIMEOUT || '300'), // 5 minutes
      },
      security: {
        validateInputs: process.env.VALIDATE_INPUTS !== 'false',
        sanitizeOutputs: process.env.SANITIZE_OUTPUTS !== 'false',
        maxKeyLength: parseInt(process.env.MAX_KEY_LENGTH || '200'),
      },
      features: {
        enableValidation: process.env.ENABLE_VALIDATION !== 'false',
        enableBackup: process.env.ENABLE_BACKUP !== 'false',
        enableDryRun: process.env.ENABLE_DRY_RUN !== 'false',
        enableProgressBar: process.env.ENABLE_PROGRESS_BAR !== 'false',
      },
    };
  }

  async loadConfig(): Promise<CLIConfig> {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = await fs.readJson(this.configPath);
        this.config = { ...this.config, ...configData };
      }
    } catch (error) {
      console.warn(`Warning: Could not load config from ${this.configPath}: ${error}`);
    }

    return this.config;
  }

  async saveConfig(config: Partial<CLIConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await fs.writeJson(this.configPath, this.config, { spaces: 2 });
  }

  getConfig(): CLIConfig {
    return this.config;
  }

  getConfigValue<T>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue as T;
      }
    }

    return value as T;
  }

  setConfigValue<T>(key: string, value: T): void {
    const keys = key.split('.');
    let current: any = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  async createDefaultConfig(): Promise<void> {
    if (!fs.existsSync(this.configPath)) {
      await this.saveConfig(this.config);
    }
  }

  validateConfig(config: CLIConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    if (!config.version) {
      errors.push('Version is required');
    }

    if (!['development', 'staging', 'production'].includes(config.environment)) {
      errors.push('Environment must be one of: development, staging, production');
    }

    // Validate performance settings
    if (config.performance.maxConcurrency < 1 || config.performance.maxConcurrency > 20) {
      errors.push('Max concurrency must be between 1 and 20');
    }

    if (config.performance.maxFileSize < 1 || config.performance.maxFileSize > 100) {
      errors.push('Max file size must be between 1 and 100 MB');
    }

    if (config.performance.timeout < 30 || config.performance.timeout > 3600) {
      errors.push('Timeout must be between 30 and 3600 seconds');
    }

    // Validate security settings
    if (config.security.maxKeyLength < 10 || config.security.maxKeyLength > 500) {
      errors.push('Max key length must be between 10 and 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getEnvironmentConfig(): CLIConfig {
    const env = this.config.environment;
    
    // Environment-specific overrides
    if (env === 'production') {
      return {
        ...this.config,
        logging: {
          ...this.config.logging,
          level: 'warn',
          format: 'json',
        },
        performance: {
          ...this.config.performance,
          maxConcurrency: Math.min(this.config.performance.maxConcurrency, 8),
        },
        security: {
          ...this.config.security,
          validateInputs: true,
          sanitizeOutputs: true,
        },
      };
    }

    if (env === 'staging') {
      return {
        ...this.config,
        logging: {
          ...this.config.logging,
          level: 'info',
        },
        security: {
          ...this.config.security,
          validateInputs: true,
        },
      };
    }

    return this.config;
  }
} 