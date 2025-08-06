#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigManager } from '../utils/config';
import { Logger } from '../utils/logger';
import { Validator } from '../utils/validator';
import { SecurityContext } from '../types';

const logger = Logger.getInstance();

export async function showConfig(options: { verbose: boolean }): Promise<void> {
  const configManager = ConfigManager.getInstance();
  const config = await configManager.loadConfig();
  
  logger.header('Configuration');
  logger.info(`Config file: ${configManager.getConfigValue('configPath')}`);
  logger.info(`Environment: ${config.environment}`);
  logger.info(`Version: ${config.version}`);
  
  if (options.verbose) {
    logger.section('Logging Configuration');
    logger.info(`Level: ${config.logging.level}`);
    logger.info(`Format: ${config.logging.format}`);
    logger.info(`Output: ${config.logging.output}`);
    if (config.logging.filePath) {
      logger.info(`Log file: ${config.logging.filePath}`);
    }
    
    logger.section('Performance Configuration');
    logger.info(`Max concurrency: ${config.performance.maxConcurrency}`);
    logger.info(`Max file size: ${config.performance.maxFileSize}MB`);
    logger.info(`Timeout: ${config.performance.timeout}s`);
    
    logger.section('Security Configuration');
    logger.info(`Validate inputs: ${config.security.validateInputs}`);
    logger.info(`Sanitize outputs: ${config.security.sanitizeOutputs}`);
    logger.info(`Max key length: ${config.security.maxKeyLength}`);
    
    logger.section('Features Configuration');
    logger.info(`Enable validation: ${config.features.enableValidation}`);
    logger.info(`Enable backup: ${config.features.enableBackup}`);
    logger.info(`Enable dry run: ${config.features.enableDryRun}`);
    logger.info(`Enable progress bar: ${config.features.enableProgressBar}`);
  }
}

export async function validateConfig(): Promise<void> {
  const configManager = ConfigManager.getInstance();
  const config = await configManager.loadConfig();
  
  const securityContext: SecurityContext = {
    inputValidation: true,
    outputSanitization: true,
    sanitizeOutputs: true,
    fileAccessControl: true,
    maxFileSize: 100,
    maxKeyLength: 200,
    allowedFileTypes: ['.json', '.yaml', '.yml']
  };
  
  const validator = new Validator(securityContext);
  const validation = validator.validateConfiguration(config);
  
  if (validation.isValid) {
    logger.success('Configuration is valid');
  } else {
    logger.error('Configuration validation failed');
    logger.logValidationErrors(validation.errors, 'config');
  }
  
  if (validation.warnings.length > 0) {
    logger.logValidationWarnings(validation.warnings, 'config');
  }
}

export async function setConfigValue(key: string, value: string): Promise<void> {
  const configManager = ConfigManager.getInstance();
  
  // Parse value based on type
  let parsedValue: any = value;
  if (value === 'true' || value === 'false') {
    parsedValue = value === 'true';
  } else if (!isNaN(Number(value))) {
    parsedValue = Number(value);
  }
  
  configManager.setConfigValue(key, parsedValue);
  await configManager.saveConfig({});
  
  logger.success(`Set ${key} = ${value}`);
}

export async function resetConfig(): Promise<void> {
  const configManager = ConfigManager.getInstance();
  const defaultConfig = configManager.loadDefaultConfig();
  
  await configManager.saveConfig(defaultConfig);
  logger.success('Configuration reset to defaults');
}

export function createConfigCommand(): Command {
  const command = new Command('config')
    .description('Manage CLI configuration')
    .addCommand(
      new Command('show')
        .description('Show current configuration')
        .option('-v, --verbose', 'Show detailed configuration')
        .action(async (options) => {
          try {
            await showConfig(options);
          } catch (error) {
            logger.error(`Failed to show config: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
    )
    .addCommand(
      new Command('validate')
        .description('Validate current configuration')
        .action(async () => {
          try {
            await validateConfig();
          } catch (error) {
            logger.error(`Failed to validate config: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
    )
    .addCommand(
      new Command('set')
        .description('Set configuration value')
        .argument('<key>', 'Configuration key (e.g., logging.level)')
        .argument('<value>', 'Configuration value')
        .action(async (key, value) => {
          try {
            await setConfigValue(key, value);
          } catch (error) {
            logger.error(`Failed to set config: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
    )
    .addCommand(
      new Command('reset')
        .description('Reset configuration to defaults')
        .action(async () => {
          try {
            await resetConfig();
          } catch (error) {
            logger.error(`Failed to reset config: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
    );

  return command;
} 