export interface TranslationKey {
  key: string;
  text: string;
  type: string;
  file: string;
  line: number;
  context?: string; // Additional context for better translation
  priority?: 'high' | 'medium' | 'low'; // Priority for translation
  category?: string; // Category for organization
}

export interface TranslationData {
  keys: TranslationKey[];
  totalKeys: number;
  services: string[];
  generatedAt: string;
  metadata?: {
    version: string;
    environment: string;
    totalFiles: number;
    extractionTime: number;
  };
}

export interface ExtractionOptions {
  path?: string;
  output?: string;
  ignore?: string[];
  patterns?: ExtractionPattern[];
  verbose?: boolean;
  validate?: boolean; // Validate extracted strings
  maxFileSize?: number; // Max file size in MB
  concurrency?: number; // Number of concurrent file processing
  includeComments?: boolean; // Include comments in extraction
  excludePatterns?: string[]; // Additional exclude patterns
}

export interface ExtractionPattern {
  regex: RegExp;
  type: string;
  description: string;
  priority?: number; // Higher priority patterns are processed first
  validation?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
}

export interface GenerationOptions {
  input?: string;
  output?: string;
  languages?: string[];
  template?: boolean;
  verbose?: boolean;
  format?: 'json' | 'yaml' | 'csv'; // Output format
  includeMetadata?: boolean; // Include metadata in generated files
  validateTranslations?: boolean; // Validate translation keys
  backupExisting?: boolean; // Backup existing translation files
  dryRun?: boolean; // Show what would be generated
}

export interface ReplaceOptions {
  path?: string;
  keysFile?: string;
  backup?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  validate?: boolean; // Validate replacements
  maxReplacements?: number; // Max replacements per file
  excludeFiles?: string[]; // Files to exclude from replacement
  includeFiles?: string[]; // Only include specific files
  preserveFormatting?: boolean; // Preserve original code formatting
}

export interface ServiceTranslation {
  serviceName: string;
  translations: Record<string, string>;
  totalKeys: number;
  metadata?: {
    lastUpdated: string;
    version: string;
    translator?: string;
  };
}

export interface CLICommand {
  name: string;
  description: string;
  action: (options: any) => Promise<void>;
}

// New enterprise-grade interfaces
export interface CLIConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'text' | 'json';
    output: 'console' | 'file' | 'both';
    filePath?: string;
  };
  performance: {
    maxConcurrency: number;
    maxFileSize: number; // MB
    timeout: number; // seconds
  };
  security: {
    validateInputs: boolean;
    sanitizeOutputs: boolean;
    maxKeyLength: number;
  };
  features: {
    enableValidation: boolean;
    enableBackup: boolean;
    enableDryRun: boolean;
    enableProgressBar: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'critical' | 'error' | 'warning';
  message: string;
  file?: string;
  line?: number;
  code?: string;
}

export interface ValidationWarning {
  message: string;
  suggestion?: string;
  file?: string;
  line?: number;
}

export interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  filesProcessed: number;
  totalKeys: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface SecurityContext {
  inputValidation: boolean;
  outputSanitization: boolean;
  sanitizeOutputs: boolean;
  fileAccessControl: boolean;
  maxFileSize: number;
  maxKeyLength: number;
  allowedFileTypes: string[];
}

// Progress tracking
export interface ProgressOptions {
  total: number;
  title: string;
  description?: string;
  showPercentage?: boolean;
  showSpeed?: boolean;
  showETA?: boolean;
}

export interface ProgressUpdate {
  current: number;
  total: number;
  percentage: number;
  speed?: number;
  eta?: number;
  status: 'processing' | 'completed' | 'error';
} 