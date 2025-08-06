import path from 'path';
import fs from 'fs-extra';
import { ValidationResult, ValidationError, ValidationWarning, TranslationKey, SecurityContext } from '../types';

export class Validator {
  private securityContext: SecurityContext;

  constructor(securityContext: SecurityContext) {
    this.securityContext = securityContext;
  }

  validateFilePath(filePath: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      errors.push({
        type: 'error',
        message: `File does not exist: ${filePath}`,
        file: filePath,
      });
      return { isValid: false, errors, warnings };
    }

    // Check file size
    try {
      const stats = fs.statSync(filePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      
      if (fileSizeMB > this.securityContext.maxFileSize) {
        errors.push({
          type: 'error',
          message: `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${this.securityContext.maxFileSize}MB)`,
          file: filePath,
        });
      }
    } catch (error) {
      errors.push({
        type: 'error',
        message: `Cannot access file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        file: filePath,
      });
    }

    // Check file type
    const ext = path.extname(filePath).toLowerCase();
    if (!this.securityContext.allowedFileTypes.includes(ext)) {
      errors.push({
        type: 'error',
        message: `File type ${ext} is not allowed. Allowed types: ${this.securityContext.allowedFileTypes.join(', ')}`,
        file: filePath,
      });
    }

    // Check for suspicious patterns in file path
    if (filePath.includes('..') || filePath.includes('~')) {
      warnings.push({
        message: 'File path contains potentially unsafe patterns',
        suggestion: 'Use absolute paths or relative paths without parent directory references',
        file: filePath,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateTranslationKey(key: TranslationKey): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate key structure
    if (!key.key || key.key.trim().length === 0) {
      errors.push({
        type: 'critical',
        message: 'Translation key is empty',
        file: key.file,
        line: key.line,
      });
    }

    if (key.key && key.key.length > this.securityContext.maxKeyLength) {
      errors.push({
        type: 'error',
        message: `Translation key length (${key.key.length}) exceeds maximum allowed length (${this.securityContext.maxKeyLength})`,
        file: key.file,
        line: key.line,
        code: key.key,
      });
    }

    // Validate text content
    if (!key.text || key.text.trim().length === 0) {
      errors.push({
        type: 'critical',
        message: 'Translation text is empty',
        file: key.file,
        line: key.line,
      });
    }

    // Check for potentially dangerous content
    if (key.text && this.containsSuspiciousContent(key.text)) {
      warnings.push({
        message: 'Translation text contains potentially suspicious content',
        suggestion: 'Review the text for security implications',
        file: key.file,
        line: key.line,
      });
    }

    // Validate file path
    const fileValidation = this.validateFilePath(key.file);
    errors.push(...fileValidation.errors);
    warnings.push(...fileValidation.warnings);

    // Validate line number
    if (key.line < 1) {
      errors.push({
        type: 'error',
        message: 'Invalid line number',
        file: key.file,
        line: key.line,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateTranslationKeys(keys: TranslationKey[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const duplicateKeys = new Map<string, TranslationKey[]>();

    for (const key of keys) {
      const validation = this.validateTranslationKey(key);
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);

      // Check for duplicate keys
      if (key.key) {
        const existing = duplicateKeys.get(key.key) || [];
        existing.push(key);
        duplicateKeys.set(key.key, existing);
      }
    }

    // Report duplicate keys
    for (const [keyName, duplicates] of duplicateKeys.entries()) {
      if (duplicates.length > 1) {
        warnings.push({
          message: `Duplicate translation key found: ${keyName}`,
          suggestion: 'Consider consolidating duplicate keys or using different keys',
          file: duplicates[0].file,
          line: duplicates[0].line,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateInputString(input: string, context: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!input || input.trim().length === 0) {
      errors.push({
        type: 'error',
        message: `${context} cannot be empty`,
      });
    }

    if (input && input.length > 1000) {
      warnings.push({
        message: `${context} is very long (${input.length} characters)`,
        suggestion: 'Consider breaking it into smaller parts',
      });
    }

    if (input && this.containsSuspiciousContent(input)) {
      warnings.push({
        message: `${context} contains potentially suspicious content`,
        suggestion: 'Review the input for security implications',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validatePath(path: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!path || path.trim().length === 0) {
      errors.push({
        type: 'error',
        message: 'Path cannot be empty',
      });
    }

    // Check for path traversal attempts
    if (path.includes('..') || path.includes('~')) {
      warnings.push({
        message: 'Path contains potentially unsafe patterns',
        suggestion: 'Use absolute paths or relative paths without parent directory references',
      });
    }

    // Check for null bytes
    if (path.includes('\0')) {
      errors.push({
        type: 'critical',
        message: 'Path contains null bytes',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private containsSuspiciousContent(text: string): boolean {
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  sanitizeOutput(output: string): string {
    if (!this.securityContext.sanitizeOutputs) {
      return output;
    }

    // Remove or escape potentially dangerous characters
    return output
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove entire script tags
      .replace(/[<>]/g, '') // Remove remaining angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:text\/html/gi, '') // Remove data:text/html
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/eval\s*\(/gi, '') // Remove eval calls
      .replace(/alert\s*\(/gi, '') // Remove alert calls
      .replace(/confirm\s*\(/gi, '') // Remove confirm calls
      .replace(/prompt\s*\(/gi, '') // Remove prompt calls
      .trim();
  }

  validateConfiguration(config: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate required fields
    if (!config.version) {
      errors.push({
        type: 'error',
        message: 'Configuration version is required',
      });
    }

    if (!config.environment) {
      errors.push({
        type: 'error',
        message: 'Configuration environment is required',
      });
    }

    // Validate performance settings
    if (config.performance) {
      if (config.performance.maxConcurrency < 1 || config.performance.maxConcurrency > 20) {
        errors.push({
          type: 'error',
          message: 'Max concurrency must be between 1 and 20',
        });
      }

      if (config.performance.maxFileSize < 1 || config.performance.maxFileSize > 100) {
        errors.push({
          type: 'error',
          message: 'Max file size must be between 1 and 100 MB',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
} 