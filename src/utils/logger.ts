import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { CLIConfig } from '../types';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private verbose: boolean = false;
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';
  private logFormat: 'text' | 'json' = 'text';
  private logOutput: 'console' | 'file' | 'both' = 'console';
  private logFilePath?: string;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  configure(config: Partial<CLIConfig['logging']>): void {
    if (config.level) this.logLevel = config.level;
    if (config.format) this.logFormat = config.format;
    if (config.output) this.logOutput = config.output;
    if (config.filePath) this.logFilePath = config.filePath;
  }

  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
    if (verbose) {
      this.logLevel = 'debug';
    } else {
      this.logLevel = 'info';
    }
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  private createLogEntry(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: string, metadata?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
    };
  }

  private async writeLog(entry: LogEntry): Promise<void> {
    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Write to file if configured
    if ((this.logOutput === 'file' || this.logOutput === 'both') && this.logFilePath) {
      try {
        await fs.ensureDir(path.dirname(this.logFilePath));
        const logLine = this.logFormat === 'json' 
          ? JSON.stringify(entry) + '\n'
          : `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}\n`;
        
        await fs.appendFile(this.logFilePath, logLine);
      } catch (error) {
        // Fallback to console if file writing fails
        console.error(`Failed to write to log file: ${error}`);
      }
    }

    // Write to console if configured
    if (this.logOutput === 'console' || this.logOutput === 'both') {
      this.writeToConsole(entry);
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const { level, message, context } = entry;
    const contextStr = context ? ` [${context}]` : '';
    
    switch (level) {
      case 'debug':
        console.log(chalk.gray('🔍'), message + contextStr);
        break;
      case 'info':
        console.log(chalk.blue('ℹ'), message + contextStr);
        break;
      case 'warn':
        console.log(chalk.yellow('⚠️'), message + contextStr);
        break;
      case 'error':
        console.log(chalk.red('❌'), message + contextStr);
        break;
    }
  }

  info(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, context, metadata);
      this.writeLog(entry);
    }
  }

  success(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, context, metadata);
      this.writeLog(entry);
      console.log(chalk.green('✅'), message);
    }
  }

  warning(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, context, metadata);
      this.writeLog(entry);
    }
  }

  error(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, context, metadata);
      this.writeLog(entry);
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, context, metadata);
      this.writeLog(entry);
    }
  }

  progress(message: string, context?: string): void {
    if (this.shouldLog('info')) {
      console.log(chalk.cyan('🔄'), message);
    }
  }

  header(message: string): void {
    console.log(chalk.bold.cyan('\n' + '='.repeat(50)));
    console.log(chalk.bold.cyan(message));
    console.log(chalk.bold.cyan('='.repeat(50)));
  }

  section(message: string): void {
    console.log(chalk.bold.blue('\n' + message));
    console.log(chalk.blue('-'.repeat(message.length)));
  }

  table(data: Record<string, any>[]): void {
    if (data.length === 0) {
      this.info('No data to display');
      return;
    }

    const headers = Object.keys(data[0]);
    const maxLengths = headers.map(header => 
      Math.max(header.length, ...data.map(row => String(row[header]).length))
    );

    // Print header
    const headerRow = headers.map((header, i) => 
      chalk.bold(header.padEnd(maxLengths[i]))
    ).join(' | ');
    console.log(headerRow);
    console.log('-'.repeat(headerRow.length));

    // Print data
    data.forEach(row => {
      const dataRow = headers.map((header, i) => 
        String(row[header]).padEnd(maxLengths[i])
      ).join(' | ');
      console.log(dataRow);
    });
  }

  // Enterprise-grade logging methods
  logValidationErrors(errors: any[], context?: string): void {
    if (errors.length > 0) {
      this.error(`Validation failed with ${errors.length} errors`, context);
      errors.forEach((error, index) => {
        this.error(`${index + 1}. ${error.message}`, context, { 
          type: error.type, 
          file: error.file, 
          line: error.line 
        });
      });
    }
  }

  logValidationWarnings(warnings: any[], context?: string): void {
    if (warnings.length > 0) {
      this.warning(`Found ${warnings.length} warnings`, context);
      warnings.forEach((warning, index) => {
        this.warning(`${index + 1}. ${warning.message}`, context, {
          suggestion: warning.suggestion,
          file: warning.file,
          line: warning.line
        });
      });
    }
  }

  logPerformanceMetrics(metrics: any, context?: string): void {
    this.info('Performance metrics', context, {
      duration: `${metrics.duration}ms`,
      filesProcessed: metrics.filesProcessed,
      totalKeys: metrics.totalKeys,
      memoryUsage: `${metrics.memoryUsage.toFixed(2)}MB`,
      cpuUsage: `${metrics.cpuUsage.toFixed(2)}s`
    });
  }

  // Get log buffer for analysis
  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  // Clear log buffer
  clearLogBuffer(): void {
    this.logBuffer = [];
  }

  // Export logs to file
  async exportLogs(outputPath: string): Promise<void> {
    try {
      const logData = this.logBuffer.map(entry => 
        this.logFormat === 'json' ? JSON.stringify(entry) : `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`
      ).join('\n');
      
      await fs.writeFile(outputPath, logData);
      this.success(`Logs exported to ${outputPath}`);
    } catch (error) {
      this.error(`Failed to export logs: ${error}`);
    }
  }
} 