#!/usr/bin/env node

import { Command } from 'commander';
import { createExtractCommand } from './commands/extract';
import { createGenerateCommand } from './commands/generate';
import { createReplaceCommand } from './commands/replace';
import { createConfigCommand } from './commands/config';
import { Logger } from './utils/logger';
import { ConfigManager } from './utils/config';
import { PerformanceMonitor } from './utils/performance';

const logger = Logger.getInstance();

async function main() {
  // Initialize configuration
  const configManager = ConfigManager.getInstance();
  const config = await configManager.loadConfig();
  
  // Configure logger with environment settings
  logger.configure(config.logging);
  
  // Start performance monitoring
  const performanceMonitor = new PerformanceMonitor();
  performanceMonitor.startMonitoring();

  const program = new Command();

  program
    .name('i18n')
    .description('Enterprise-grade CLI tool for extracting and managing translations in Logistically microservices')
    .version('2.0.0')
    .option('--config <file>', 'Specify configuration file')
    .option('--log-level <level>', 'Set log level (debug, info, warn, error)', config.logging.level)
    .option('--log-format <format>', 'Set log format (text, json)', config.logging.format)
    .option('--log-output <output>', 'Set log output (console, file, both)', config.logging.output)
    .option('--log-file <file>', 'Set log file path')
    .option('--max-concurrency <number>', 'Set max concurrency', config.performance.maxConcurrency.toString())
    .option('--max-file-size <number>', 'Set max file size in MB', config.performance.maxFileSize.toString())
    .option('--timeout <number>', 'Set timeout in seconds', config.performance.timeout.toString())
    .option('--validate-inputs', 'Enable input validation', config.security.validateInputs)
    .option('--sanitize-outputs', 'Enable output sanitization', config.security.sanitizeOutputs)
    .option('--enable-validation', 'Enable validation features', config.features.enableValidation)
    .option('--enable-backup', 'Enable backup features', config.features.enableBackup)
    .option('--enable-dry-run', 'Enable dry run features', config.features.enableDryRun)
    .option('--enable-progress-bar', 'Enable progress bar', config.features.enableProgressBar)
    .hook('preAction', async (thisCommand) => {
      const options = thisCommand.opts();
      
      // Update configuration from command line options
      if (options.logLevel) config.logging.level = options.logLevel;
      if (options.logFormat) config.logging.format = options.logFormat;
      if (options.logOutput) config.logging.output = options.logOutput;
      if (options.logFile) config.logging.filePath = options.logFile;
      if (options.maxConcurrency) config.performance.maxConcurrency = parseInt(options.maxConcurrency);
      if (options.maxFileSize) config.performance.maxFileSize = parseInt(options.maxFileSize);
      if (options.timeout) config.performance.timeout = parseInt(options.timeout);
      if (options.validateInputs !== undefined) config.security.validateInputs = options.validateInputs;
      if (options.sanitizeOutputs !== undefined) config.security.sanitizeOutputs = options.sanitizeOutputs;
      if (options.enableValidation !== undefined) config.features.enableValidation = options.enableValidation;
      if (options.enableBackup !== undefined) config.features.enableBackup = options.enableBackup;
      if (options.enableDryRun !== undefined) config.features.enableDryRun = options.enableDryRun;
      if (options.enableProgressBar !== undefined) config.features.enableProgressBar = options.enableProgressBar;
      
      // Reconfigure logger with updated settings
      logger.configure(config.logging);
      
      // Log startup information
      logger.debug('CLI started', 'main', {
        environment: config.environment,
        version: config.version,
        logLevel: config.logging.level,
        maxConcurrency: config.performance.maxConcurrency
      });
    })
    .hook('postAction', async () => {
      // Log completion and performance metrics
      const metrics = performanceMonitor.endMonitoring();
      logger.debug('CLI completed', 'main', {
        duration: metrics.duration,
        memoryUsage: metrics.memoryUsage
      });
    })
    .addCommand(createExtractCommand())
    .addCommand(createGenerateCommand())
    .addCommand(createReplaceCommand())
    .addCommand(createConfigCommand())
    .addHelpText('after', `

Enterprise Features:
  • Configuration Management: translation config show/validate/set/reset
  • Performance Monitoring: Built-in metrics and progress tracking
  • Security Validation: Input/output sanitization and validation
  • Concurrent Processing: Parallel file processing with configurable limits
  • Advanced Logging: JSON/text formats, file/console output
  • Progress Tracking: Real-time progress bars and ETA
  • Error Handling: Comprehensive error reporting and recovery

Examples:
  $ i18n extract                    # Extract from current directory
  $ i18n extract -p ./src          # Extract from specific path
  $ i18n extract -o my-keys.json   # Save to custom file
  $ i18n extract -v                # Verbose output
  
  $ i18n generate                  # Generate from translation-keys.json
  $ i18n generate -i my-keys.json # Use custom input file
  $ i18n generate -l en,fr,es     # Generate specific languages
  $ i18n generate --no-template   # Skip template files
  
  $ i18n replace                   # Replace strings with translation keys
  $ i18n replace --dry-run        # Show what would be replaced
  $ i18n replace --no-backup      # Skip backup files
  
  $ i18n config show              # Show current configuration
  $ i18n config validate          # Validate configuration
  $ i18n config set logging.level debug  # Set config value
  $ i18n config reset             # Reset to defaults

Environment Variables:
  NODE_ENV              Environment (development/staging/production)
  LOG_LEVEL             Log level (debug/info/warn/error)
  MAX_CONCURRENCY       Max concurrent file processing
  MAX_FILE_SIZE         Max file size in MB
  TIMEOUT               Operation timeout in seconds
  VALIDATE_INPUTS       Enable input validation (true/false)
  SANITIZE_OUTPUTS      Enable output sanitization (true/false)

Workflow:
  1. Configure the CLI: i18n config show
  2. Extract translatable strings: i18n extract
  3. Generate translation files: i18n generate
  4. Replace hardcoded strings: i18n replace
  5. Translate the generated files manually
  6. Use @logistically/i18n library in your services

For more information, visit: https://github.com/logistically/i18n-cli
    `);

  try {
    await program.parseAsync();
  } catch (error) {
    logger.error(`CLI error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'main');
    process.exit(1);
  }
}

main(); 