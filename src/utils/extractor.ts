import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { Logger } from './logger';
import { Validator } from './validator';
import { PerformanceMonitor } from './performance';
import { ConfigManager } from './config';
import { TranslationKey, ExtractionOptions, ExtractionPattern, SecurityContext } from '../types';

export class TranslationExtractor {
  private logger = Logger.getInstance();
  private validator: Validator;
  private performanceMonitor: PerformanceMonitor;
  private configManager: ConfigManager;
  
  private defaultPatterns: ExtractionPattern[] = [
    {
      regex: /throw new \w+Exception\(['"`]([^'"`]+)['"`](?:,\s*\w+\.\w+)?\)/g,
      type: 'EXCEPTION',
      description: 'Exception messages',
      priority: 1
    },
    {
      regex: /return\s*\{[^}]*message\s*:\s*['"`]([^'"`]+)['"`][^}]*\}/g,
      type: 'RETURN_MESSAGE',
      description: 'Return object messages',
      priority: 2
    },
    {
      regex: /errors\.push\(`([^`]+)`\)/g,
      type: 'TEMPLATE_LITERAL',
      description: 'Template literals in error arrays',
      priority: 3
    },
    {
      regex: /message\s*:\s*['"`]([^'"`]+)['"`]/g,
      type: 'MESSAGE_PROPERTY',
      description: 'Message properties in objects',
      priority: 4
    },
    {
      regex: /['"`]([^'"`]{10,})['"`]\s*\+\s*['"`]([^'"`]+)['"`]/g,
      type: 'CONCATENATED_STRING',
      description: 'Concatenated strings',
      priority: 5
    }
  ];

  constructor() {
    this.configManager = ConfigManager.getInstance();
    const config = this.configManager.getConfig();
    
    const securityContext: SecurityContext = {
      inputValidation: config.security.validateInputs,
      outputSanitization: config.security.sanitizeOutputs,
      sanitizeOutputs: config.security.sanitizeOutputs,
      fileAccessControl: true,
      maxFileSize: config.performance.maxFileSize,
      maxKeyLength: config.security.maxKeyLength,
      allowedFileTypes: ['.ts', '.js', '.tsx', '.jsx']
    };
    
    this.validator = new Validator(securityContext);
    this.performanceMonitor = new PerformanceMonitor();
  }

  async extract(options: ExtractionOptions): Promise<TranslationKey[]> {
    const config = this.configManager.getEnvironmentConfig();
    const {
      path: searchPath = '.',
      ignore = ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.spec.ts', '**/*.test.ts'],
      patterns = this.defaultPatterns,
      verbose = false,
      validate = config.features.enableValidation,
      maxFileSize = config.performance.maxFileSize,
      concurrency = config.performance.maxConcurrency,
      includeComments = false,
      excludePatterns = []
    } = options;

    // Configure logger
    this.logger.configure(config.logging);
    this.logger.setVerbose(verbose);
    this.logger.header('Translation Extraction');
    this.logger.info(`Searching in: ${searchPath}`, 'extraction');
    this.logger.debug(`Ignore patterns: ${ignore.join(', ')}`, 'extraction');
    this.logger.debug(`Concurrency: ${concurrency}`, 'extraction');
    this.logger.debug(`Max file size: ${maxFileSize}MB`, 'extraction');

    // Start performance monitoring
    this.performanceMonitor.startMonitoring();

    // Validate search path
    if (validate) {
      const pathValidation = this.validator.validatePath(searchPath);
      if (!pathValidation.isValid) {
        this.logger.logValidationErrors(pathValidation.errors, 'extraction');
        throw new Error('Invalid search path');
      }
      this.logger.logValidationWarnings(pathValidation.warnings, 'extraction');
    }

    // Find TypeScript files
    const searchPattern = path.resolve(searchPath, '**/*.ts');
    const allIgnorePatterns = [...ignore, ...excludePatterns];
    const tsFiles = await glob(searchPattern, { ignore: allIgnorePatterns });

    this.logger.info(`Found ${tsFiles.length} TypeScript files`, 'extraction');

    // Filter files by size
    const validFiles = await this.filterFilesBySize(tsFiles, maxFileSize);
    this.logger.info(`Processing ${validFiles.length} files (${tsFiles.length - validFiles.length} skipped due to size)`, 'extraction');

    // Sort patterns by priority
    const sortedPatterns = [...patterns].sort((a, b) => (a.priority || 0) - (b.priority || 0));

    // Extract strings with concurrency control
    const allStrings: TranslationKey[] = [];
    const batchSize = concurrency;
    
    for (let i = 0; i < validFiles.length; i += batchSize) {
      const batch = validFiles.slice(i, i + batchSize);
      const batchPromises = batch.map((file: string) => this.extractFromFile(file, sortedPatterns, includeComments));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result: PromiseSettledResult<TranslationKey[]>, index: number) => {
        if (result.status === 'fulfilled') {
          allStrings.push(...result.value);
        } else {
          this.logger.warning(`Error processing ${batch[index]}: ${result.reason}`, 'extraction');
        }
      });

      // Update progress
      this.performanceMonitor.updateProgress(i + batch.length, validFiles.length);
    }

    // Remove duplicates
    const uniqueStrings = this.removeDuplicates(allStrings);
    
    // Validate extracted strings
    if (validate) {
      const validation = this.validator.validateTranslationKeys(uniqueStrings);
      this.logger.logValidationErrors(validation.errors, 'extraction');
      this.logger.logValidationWarnings(validation.warnings, 'extraction');
      
      if (!validation.isValid) {
        this.logger.error('Extraction completed with validation errors', 'extraction');
      }
    }

    // Update final metrics
    this.performanceMonitor.updateKeysProcessed(uniqueStrings.length);
    const metrics = this.performanceMonitor.endMonitoring();
    
    this.logger.success(`Extracted ${uniqueStrings.length} unique translation keys`, 'extraction');
    this.logger.logPerformanceMetrics(metrics, 'extraction');
    
    // Group by service for summary
    const serviceSummary = this.groupByService(uniqueStrings);
    this.logger.section('Extraction Summary');
    this.logger.table(serviceSummary);

    return uniqueStrings;
  }

  private async extractFromFile(filePath: string, patterns: ExtractionPattern[], includeComments: boolean = false): Promise<TranslationKey[]> {
    const content = await fs.readFile(filePath, 'utf8');
    const results: TranslationKey[] = [];

    // Extract comments if requested
    let comments: string[] = [];
    if (includeComments) {
      comments = this.extractComments(content);
    }

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        const text = match[1] || match[2] || match[0];
        
        // Validate text length
        if (text.length < 3 || text.length > 500) {
          continue; // Skip very short or very long strings
        }

        const key = this.generateKey(text, pattern.type, filePath);
        const line = content.substring(0, match.index).split('\n').length;
        
        // Find nearby comment for context
        const context = includeComments ? this.findNearbyComment(comments, line) : undefined;
        
        results.push({
          key,
          text: this.validator.sanitizeOutput(text),
          type: pattern.type,
          file: filePath,
          line,
          context,
          priority: this.determinePriority(text, pattern.type),
          category: this.determineCategory(filePath, pattern.type)
        });
      }
    });

    return results;
  }

  private extractComments(content: string): string[] {
    const comments: string[] = [];
    
    // Extract single-line comments
    const singleLineComments = content.match(/\/\/.*$/gm) || [];
    comments.push(...singleLineComments.map(c => c.trim()));
    
    // Extract multi-line comments
    const multiLineComments = content.match(/\/\*[\s\S]*?\*\//gm) || [];
    comments.push(...multiLineComments.map(c => c.trim()));
    
    return comments;
  }

  private findNearbyComment(comments: string[], line: number): string | undefined {
    // Find comment within 5 lines
    for (let i = Math.max(0, line - 5); i <= line + 5; i++) {
      const comment = comments.find(c => c.includes(`line ${i}`));
      if (comment) {
        return comment.replace(/\/\/\s*|\/\*\s*|\s*\*\//g, '').trim();
      }
    }
    return undefined;
  }

  private determinePriority(text: string, type: string): 'high' | 'medium' | 'low' {
    // High priority: error messages, exceptions
    if (type === 'EXCEPTION' || text.toLowerCase().includes('error')) {
      return 'high';
    }
    
    // Medium priority: return messages, validation messages
    if (type === 'RETURN_MESSAGE' || text.toLowerCase().includes('validation')) {
      return 'medium';
    }
    
    // Low priority: everything else
    return 'low';
  }

  private determineCategory(filePath: string, type: string): string {
    const pathParts = filePath.split(path.sep);
    
    // Extract service name
    const serviceIndex = pathParts.findIndex(part => 
      ['auth', 'profile', 'notification', 'location', 'bff'].includes(part)
    );
    
    if (serviceIndex !== -1) {
      return pathParts[serviceIndex];
    }
    
    // Extract directory structure
    const srcIndex = pathParts.findIndex(part => part === 'src');
    if (srcIndex > 0) {
      return pathParts[srcIndex - 1];
    }
    
    return 'unknown';
  }

  private async filterFilesBySize(files: string[], maxFileSizeMB: number): Promise<string[]> {
    const validFiles: string[] = [];
    
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        const fileSizeMB = stats.size / (1024 * 1024);
        
        if (fileSizeMB <= maxFileSizeMB) {
          validFiles.push(file);
        } else {
          this.logger.debug(`Skipping ${file} (${fileSizeMB.toFixed(2)}MB > ${maxFileSizeMB}MB)`, 'extraction');
        }
      } catch (error) {
        this.logger.warning(`Cannot access file ${file}: ${error}`, 'extraction');
      }
    }
    
    return validFiles;
  }

  private generateKey(text: string, type: string, filePath: string): string {
    // Clean the text
    let cleanText = text
      .replace(/[^\w\s]/g, '') // Remove special chars
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toUpperCase();
    
    // Extract service name from file path
    const pathParts = filePath.split(path.sep);
    // Find the service name by looking for the service directory in the path
    let serviceName = '';
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i] === 'notification' || pathParts[i] === 'auth' || pathParts[i] === 'profile' || pathParts[i] === 'location') {
        serviceName = pathParts[i];
        break;
      }
    }
    
    // If no service name found, use the directory before 'src'
    if (!serviceName) {
      const srcIndex = pathParts.findIndex(part => part === 'src');
      if (srcIndex > 0) {
        serviceName = pathParts[srcIndex - 1];
      } else {
        serviceName = 'UNKNOWN';
      }
    }
    
    const fileName = path.basename(filePath, '.ts').replace('.', '_');
    
    return `${serviceName.toUpperCase()}.${fileName.toUpperCase()}.${type}.${cleanText}`;
  }

  private removeDuplicates(strings: TranslationKey[]): TranslationKey[] {
    const uniqueStrings: TranslationKey[] = [];
    const seen = new Set();

    strings.forEach(item => {
      const key = `${item.key}:${item.text}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueStrings.push(item);
      }
    });

    return uniqueStrings;
  }

  private groupByService(strings: TranslationKey[]): Record<string, any>[] {
    const serviceMap = new Map<string, { total: number; types: Record<string, number> }>();

    strings.forEach(item => {
      const serviceName = item.file.split(path.sep)[0];
      if (!serviceMap.has(serviceName)) {
        serviceMap.set(serviceName, { total: 0, types: {} });
      }
      
      const service = serviceMap.get(serviceName)!;
      service.total++;
      service.types[item.type] = (service.types[item.type] || 0) + 1;
    });

    return Array.from(serviceMap.entries()).map(([service, data]) => ({
      Service: service,
      'Total Keys': data.total,
      'Exception Keys': data.types.EXCEPTION || 0,
      'Template Keys': data.types.TEMPLATE_LITERAL || 0,
      'Other Keys': data.total - (data.types.EXCEPTION || 0) - (data.types.TEMPLATE_LITERAL || 0)
    }));
  }
} 