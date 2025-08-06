# API Reference

> Complete API documentation for @logistically/i18n-cli

## 📖 Table of Contents

1. [Core Classes](#core-classes)
2. [Interfaces](#interfaces)
3. [Commands](#commands)
4. [Configuration](#configuration)
5. [Utilities](#utilities)
6. [Types](#types)

## 🏗️ Core Classes

### TranslationExtractor

Main class responsible for extracting translatable strings from code files.

#### Constructor

```typescript
constructor(config?: Partial<ExtractionOptions>)
```

#### Methods

##### `extract(options: ExtractionOptions): Promise<TranslationKey[]>`

Extracts translation keys from files based on patterns.

**Parameters:**
- `options: ExtractionOptions` - Extraction configuration

**Returns:** `Promise<TranslationKey[]>` - Array of extracted translation keys

**Example:**
```typescript
import { TranslationExtractor } from '@logistically/i18n-cli';

const extractor = new TranslationExtractor();
const keys = await extractor.extract({
  patterns: ['*.ts', '*.js'],
  ignore: ['node_modules/**'],
  validate: true,
  maxFileSize: 50,
  concurrency: 4
});
```

### TranslationGenerator

Generates translation files for different languages and services.

#### Constructor

```typescript
constructor(config?: Partial<GenerationOptions>)
```

#### Methods

##### `generate(options: GenerationOptions): Promise<void>`

Generates translation files based on extracted keys.

**Parameters:**
- `options: GenerationOptions` - Generation configuration

**Returns:** `Promise<void>`

**Example:**
```typescript
import { TranslationGenerator } from '@logistically/i18n-cli';

const generator = new TranslationGenerator();
await generator.generate({
  input: 'translation-keys.json',
  languages: ['en', 'fr', 'de'],
  output: './src/translations',
  format: 'json',
  template: true,
  backup: true
});
```

### TranslationReplacer

Replaces hardcoded strings with translation keys in source files.

#### Constructor

```typescript
constructor(config?: Partial<ReplaceOptions>)
```

#### Methods

##### `replace(options: ReplaceOptions): Promise<ReplaceResult>`

Replaces hardcoded strings with translation keys.

**Parameters:**
- `options: ReplaceOptions` - Replacement configuration

**Returns:** `Promise<ReplaceResult>` - Replacement results

**Example:**
```typescript
import { TranslationReplacer } from '@logistically/i18n-cli';

const replacer = new TranslationReplacer();
const result = await replacer.replace({
  input: 'translation-keys.json',
  patterns: ['*.ts', '*.js'],
  dryRun: false,
  backup: true,
  preserveFormatting: false
});
```

### ConfigManager

Manages CLI configuration with environment-based settings.

#### Constructor

```typescript
constructor()
```

#### Methods

##### `loadConfig(): CLIConfig`

Loads configuration from multiple sources.

**Returns:** `CLIConfig` - Loaded configuration

**Example:**
```typescript
import { ConfigManager } from '@logistically/i18n-cli';

const configManager = new ConfigManager();
const config = configManager.loadConfig();
```

##### `saveConfig(config: CLIConfig): void`

Saves configuration to file.

**Parameters:**
- `config: CLIConfig` - Configuration to save

**Example:**
```typescript
const configManager = new ConfigManager();
configManager.saveConfig({
  version: '2.0.0',
  environment: 'production',
  logging: { level: 'warn' }
});
```

##### `validateConfig(config: CLIConfig): ValidationResult`

Validates configuration settings.

**Parameters:**
- `config: CLIConfig` - Configuration to validate

**Returns:** `ValidationResult` - Validation results

**Example:**
```typescript
const configManager = new ConfigManager();
const validation = configManager.validateConfig(config);
if (!validation.isValid) {
  console.error('Configuration validation failed:', validation.errors);
}
```

### Validator

Provides comprehensive validation and sanitization utilities.

#### Constructor

```typescript
constructor(securityContext: SecurityContext)
```

#### Methods

##### `validateFilePath(filePath: string): ValidationResult`

Validates file path for security and correctness.

**Parameters:**
- `filePath: string` - File path to validate

**Returns:** `ValidationResult` - Validation results

**Example:**
```typescript
import { Validator } from '@logistically/i18n-cli';

const validator = new Validator({ maxKeyLength: 200 });
const validation = validator.validateFilePath('/safe/path/file.ts');
```

##### `validateTranslationKey(key: TranslationKey): ValidationResult`

Validates a single translation key.

**Parameters:**
- `key: TranslationKey` - Translation key to validate

**Returns:** `ValidationResult` - Validation results

**Example:**
```typescript
const validation = validator.validateTranslationKey({
  key: 'AUTH.USER_EXISTS',
  text: 'User already exists',
  type: 'EXCEPTION',
  file: '/path/to/file.ts',
  line: 10
});
```

##### `validateTranslationKeys(keys: TranslationKey[]): ValidationResult`

Validates multiple translation keys.

**Parameters:**
- `keys: TranslationKey[]` - Array of translation keys

**Returns:** `ValidationResult` - Validation results

**Example:**
```typescript
const validation = validator.validateTranslationKeys(extractedKeys);
```

##### `sanitizeOutput(output: string): string`

Sanitizes output to prevent security issues.

**Parameters:**
- `output: string` - Output to sanitize

**Returns:** `string` - Sanitized output

**Example:**
```typescript
const sanitized = validator.sanitizeOutput('<script>alert("xss")</script>');
```

### PerformanceMonitor

Tracks performance metrics and provides real-time monitoring.

#### Constructor

```typescript
constructor()
```

#### Methods

##### `startMonitoring(): void`

Starts performance monitoring.

**Example:**
```typescript
import { PerformanceMonitor } from '@logistically/i18n-cli';

const monitor = new PerformanceMonitor();
monitor.startMonitoring();
```

##### `endMonitoring(): PerformanceMetrics`

Ends monitoring and returns metrics.

**Returns:** `PerformanceMetrics` - Performance metrics

**Example:**
```typescript
const metrics = monitor.endMonitoring();
console.log(`Duration: ${metrics.duration}ms`);
console.log(`Files Processed: ${metrics.filesProcessed}`);
```

##### `updateProgress(current: number, total: number): void`

Updates progress tracking.

**Parameters:**
- `current: number` - Current progress
- `total: number` - Total items

**Example:**
```typescript
monitor.updateProgress(5, 10); // 50% complete
```

##### `updateKeysProcessed(count: number): void`

Updates keys processed count.

**Parameters:**
- `count: number` - Number of keys processed

**Example:**
```typescript
monitor.updateKeysProcessed(25);
```

### Logger

Provides structured logging with context and metadata.

#### Constructor

```typescript
constructor()
```

#### Methods

##### `configure(config: Partial<CLIConfig['logging']>): void`

Configures logging settings.

**Parameters:**
- `config: Partial<CLIConfig['logging']>` - Logging configuration

**Example:**
```typescript
import { Logger } from '@logistically/i18n-cli';

const logger = Logger.getInstance();
logger.configure({
  level: 'warn',
  format: 'json',
  output: 'both',
  filePath: '/var/log/i18n-cli.log'
});
```

##### `info(message: string, context?: string, metadata?: Record<string, any>): void`

Logs info message.

**Parameters:**
- `message: string` - Message to log
- `context?: string` - Optional context
- `metadata?: Record<string, any>` - Optional metadata

**Example:**
```typescript
logger.info('Processing file', 'extraction', {
  file: 'auth/service.ts',
  size: '2.5MB',
  keys: 15
});
```

##### `success(message: string, context?: string, metadata?: Record<string, any>): void`

Logs success message.

**Parameters:**
- `message: string` - Message to log
- `context?: string` - Optional context
- `metadata?: Record<string, any>` - Optional metadata

**Example:**
```typescript
logger.success('Extraction completed', 'extraction', {
  totalKeys: 150,
  filesProcessed: 25
});
```

##### `warning(message: string, context?: string, metadata?: Record<string, any>): void`

Logs warning message.

**Parameters:**
- `message: string` - Message to log
- `context?: string` - Optional context
- `metadata?: Record<string, any>` - Optional metadata

**Example:**
```typescript
logger.warning('Large file detected', 'extraction', {
  file: 'large-file.ts',
  size: '75MB'
});
```

##### `error(message: string, context?: string, metadata?: Record<string, any>): void`

Logs error message.

**Parameters:**
- `message: string` - Message to log
- `context?: string` - Optional context
- `metadata?: Record<string, any>` - Optional metadata

**Example:**
```typescript
logger.error('File not found', 'extraction', {
  file: 'missing-file.ts',
  error: 'ENOENT'
});
```

##### `debug(message: string, context?: string, metadata?: Record<string, any>): void`

Logs debug message.

**Parameters:**
- `message: string` - Message to log
- `context?: string` - Optional context
- `metadata?: Record<string, any>` - Optional metadata

**Example:**
```typescript
logger.debug('Processing pattern', 'extraction', {
  pattern: '*.ts',
  matches: 15
});
```

## 🔧 Interfaces

### TranslationKey

Represents a single translation key.

```typescript
interface TranslationKey {
  key: string;                    // Unique translation key
  text: string;                   // Original text
  type: 'EXCEPTION' | 'TEMPLATE' | 'OTHER'; // Type of translation
  file: string;                   // Source file path
  line: number;                   // Line number in source file
  context?: string;               // Optional context
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'; // Priority level
  category?: string;              // Optional category
}
```

### TranslationData

Represents translation data for a service.

```typescript
interface TranslationData {
  service: string;                // Service name
  keys: TranslationKey[];         // Translation keys
  metadata?: Record<string, any>; // Optional metadata
}
```

### ExtractionOptions

Configuration for extraction process.

```typescript
interface ExtractionOptions {
  patterns: string[];             // File patterns to search
  ignore: string[];               // Patterns to ignore
  output: string;                 // Output file path
  validate: boolean;              // Enable validation
  maxFileSize: number;            // Max file size in MB
  concurrency: number;            // Max concurrent processing
  excludePatterns: string[];      // Patterns to exclude
  includeComments: boolean;       // Include comments
}
```

### GenerationOptions

Configuration for generation process.

```typescript
interface GenerationOptions {
  input: string;                  // Input translation keys file
  languages: string[];            // Languages to generate
  output: string;                 // Output directory
  format: 'json' | 'yaml';       // Output format
  template: boolean;              // Generate template files
  backup: boolean;                // Create backup
  validateTranslations: boolean;  // Validate translations
  dryRun: boolean;                // Dry run mode
  includeMetadata: boolean;       // Include metadata
}
```

### ReplaceOptions

Configuration for replacement process.

```typescript
interface ReplaceOptions {
  input: string;                  // Translation keys file
  patterns: string[];             // File patterns to process
  dryRun: boolean;                // Dry run mode
  backup: boolean;                // Create backup
  preserveFormatting: boolean;    // Preserve formatting
  validate: boolean;              // Enable validation
  maxReplacements: number;        // Max replacements per file
  excludeFiles: string[];         // Files to exclude
  includeFiles: string[];         // Files to include
}
```

### CLIConfig

Main CLI configuration interface.

```typescript
interface CLIConfig {
  version: string;                // CLI version
  environment: string;            // Environment (dev/staging/prod)
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'text' | 'json';
    output: 'console' | 'file' | 'both';
    filePath?: string;
  };
  performance: {
    maxConcurrency: number;
    maxFileSize: number;
    timeout: number;
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
```

### ValidationResult

Result of validation operations.

```typescript
interface ValidationResult {
  isValid: boolean;               // Whether validation passed
  errors: ValidationError[];      // Validation errors
  warnings: ValidationWarning[];  // Validation warnings
}
```

### ValidationError

Represents a validation error.

```typescript
interface ValidationError {
  type: 'error' | 'critical';     // Error type
  message: string;                // Error message
  file?: string;                  // Related file
  line?: number;                  // Line number
  code?: string;                  // Related code
}
```

### ValidationWarning

Represents a validation warning.

```typescript
interface ValidationWarning {
  message: string;                // Warning message
  suggestion?: string;            // Suggested fix
  file?: string;                  // Related file
  line?: number;                  // Line number
}
```

### PerformanceMetrics

Performance monitoring metrics.

```typescript
interface PerformanceMetrics {
  duration: number;               // Duration in milliseconds
  filesProcessed: number;         // Number of files processed
  totalKeys: number;              // Total keys extracted
  memoryUsage: number;            // Memory usage in MB
  cpuUsage: number;               // CPU usage in seconds
  speed: number;                  // Files per second
  eta: number;                    // Estimated time remaining
}
```

### SecurityContext

Security configuration context.

```typescript
interface SecurityContext {
  validateInputs: boolean;        // Enable input validation
  sanitizeOutputs: boolean;       // Enable output sanitization
  maxKeyLength: number;           // Max key length
}
```

### ProgressOptions

Progress tracking options.

```typescript
interface ProgressOptions {
  enabled: boolean;               // Enable progress tracking
  showSpeed: boolean;             // Show processing speed
  showEta: boolean;               // Show estimated time
  updateInterval: number;         // Update interval in ms
}
```

### ProgressUpdate

Progress update information.

```typescript
interface ProgressUpdate {
  current: number;                // Current progress
  total: number;                  // Total items
  percentage: number;             // Percentage complete
  speed?: number;                 // Processing speed
  eta?: number;                   // Estimated time remaining
}
```

## 📋 Commands

### Extract Command

```typescript
interface ExtractCommand {
  patterns: string[];             // File patterns
  ignore: string[];               // Ignore patterns
  output: string;                 // Output file
  verbose: boolean;               // Verbose logging
  validate: boolean;              // Enable validation
  maxFileSize: number;            // Max file size
  concurrency: number;            // Concurrency level
  customPatterns?: string[];      // Custom patterns
}
```

### Generate Command

```typescript
interface GenerateCommand {
  input: string;                  // Input file
  languages: string[];            // Languages
  output: string;                 // Output directory
  format: 'json' | 'yaml';       // Output format
  template: boolean;              // Generate templates
  backup: boolean;                // Create backup
  services?: string[];            // Services to process
}
```

### Replace Command

```typescript
interface ReplaceCommand {
  input: string;                  // Input file
  patterns: string[];             // File patterns
  dryRun: boolean;                // Dry run mode
  backup: boolean;                // Create backup
  preserveFormatting: boolean;    // Preserve formatting
  services?: string[];            // Services to process
}
```

### Config Command

```typescript
interface ConfigCommand {
  subcommand: 'show' | 'validate' | 'set' | 'reset';
  key?: string;                   // Configuration key
  value?: string;                 // Configuration value
  verbose?: boolean;              // Verbose output
}
```

## ⚙️ Configuration

### Environment Variables

```typescript
interface EnvironmentConfig {
  NODE_ENV: string;               // Environment
  LOG_LEVEL: string;              // Log level
  LOG_FORMAT: string;             // Log format
  LOG_OUTPUT: string;             // Log output
  LOG_FILE: string;               // Log file path
  MAX_CONCURRENCY: number;        // Max concurrency
  MAX_FILE_SIZE: number;          // Max file size
  TIMEOUT: number;                // Timeout
  VALIDATE_INPUTS: boolean;       // Validate inputs
  SANITIZE_OUTPUTS: boolean;      // Sanitize outputs
  MAX_KEY_LENGTH: number;         // Max key length
  ENABLE_VALIDATION: boolean;     // Enable validation
  ENABLE_BACKUP: boolean;         // Enable backup
  ENABLE_DRY_RUN: boolean;        // Enable dry run
  ENABLE_PROGRESS_BAR: boolean;   // Enable progress bar
}
```

### Configuration File

```typescript
interface ConfigFile {
  version: string;                // Version
  environment: string;            // Environment
  logging: LoggingConfig;         // Logging config
  performance: PerformanceConfig; // Performance config
  security: SecurityConfig;       // Security config
  features: FeaturesConfig;       // Features config
}
```

## 🛠️ Utilities

### File Utilities

```typescript
// Read file safely
function readFileSafely(path: string): Promise<string>;

// Write file safely
function writeFileSafely(path: string, content: string): Promise<void>;

// Check file exists
function fileExists(path: string): Promise<boolean>;

// Get file size
function getFileSize(path: string): Promise<number>;
```

### Path Utilities

```typescript
// Validate path
function validatePath(path: string): boolean;

// Resolve path
function resolvePath(path: string): string;

// Normalize path
function normalizePath(path: string): string;
```

### String Utilities

```typescript
// Sanitize string
function sanitizeString(input: string): string;

// Generate key
function generateKey(text: string, context?: string): string;

// Validate key
function validateKey(key: string): boolean;
```

## 📊 Types

### Log Levels

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
```

### Log Formats

```typescript
type LogFormat = 'text' | 'json';
```

### Log Outputs

```typescript
type LogOutput = 'console' | 'file' | 'both';
```

### Translation Types

```typescript
type TranslationType = 'EXCEPTION' | 'TEMPLATE' | 'OTHER';
```

### Priority Levels

```typescript
type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
```

### Output Formats

```typescript
type OutputFormat = 'json' | 'yaml';
```

### Error Types

```typescript
type ErrorType = 'error' | 'critical';
```

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [Configuration Guide](./CONFIGURATION.md).** 