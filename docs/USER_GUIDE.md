# User Guide

> Complete guide to using the @logistically/i18n-cli

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Commands](#basic-commands)
3. [Advanced Features](#advanced-features)
4. [Configuration](#configuration)
5. [Security](#security)
6. [Performance](#performance)
7. [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### Installation

```bash
# Global installation
npm install -g @logistically/i18n-cli

# Local installation
npm install --save-dev @logistically/i18n-cli

# Using npx
npx @logistically/i18n-cli --help
```

### First Steps

1. **Navigate to your project directory**
   ```bash
   cd your-project
   ```

2. **Extract translation keys**
   ```bash
   i18n extract
   ```

3. **Generate translation files**
   ```bash
   i18n generate
   ```

4. **Replace hardcoded strings**
   ```bash
   i18n replace
   ```

## 📋 Basic Commands

### Extract Command

The `extract` command scans your codebase for translatable strings and creates a JSON file with all found keys.

#### Basic Usage

```bash
# Extract from current directory
i18n extract

# Extract from specific directory
i18n extract ./src

# Extract with custom output file
i18n extract --output my-translations.json
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--patterns` | File patterns to search | `"*.ts,*.js"` |
| `--ignore` | Patterns to ignore | `"node_modules/**"` |
| `--output` | Output file path | `"translation-keys.json"` |
| `--verbose` | Enable verbose logging | `false` |
| `--validate` | Enable validation | `false` |
| `--max-file-size` | Max file size in MB | `50` |
| `--concurrency` | Max concurrent processing | `4` |

#### Examples

```bash
# Extract only TypeScript files
i18n extract --patterns "*.ts"

# Extract with custom ignore patterns
i18n extract --ignore "node_modules/**,dist/**,build/**"

# Extract with validation
i18n extract --validate --verbose

# Extract with performance settings
i18n extract --max-file-size 10 --concurrency 8
```

### Generate Command

The `generate` command creates translation files for different languages and services based on extracted keys.

#### Basic Usage

```bash
# Generate for all services
i18n generate

# Generate for specific languages
i18n generate --languages en,fr,de

# Generate with custom input file
i18n generate --input my-translations.json
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--input` | Input translation keys file | `"translation-keys.json"` |
| `--languages` | Languages to generate | `"en,fr,de"` |
| `--output` | Output directory | `"./src/translations"` |
| `--format` | Output format | `"json"` |
| `--template` | Generate template files | `false` |
| `--backup` | Create backup of existing files | `false` |

#### Examples

```bash
# Generate for specific languages
i18n generate --languages en,es,fr,de

# Generate with custom output directory
i18n generate --output ./translations

# Generate template files
i18n generate --template

# Generate with backup
i18n generate --backup
```

### Replace Command

The `replace` command replaces hardcoded strings in your code with translation keys.

#### Basic Usage

```bash
# Replace strings with translation keys
i18n replace

# Dry run (preview changes)
i18n replace --dry-run

# Replace with backup
i18n replace --backup
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--input` | Translation keys file | `"translation-keys.json"` |
| `--patterns` | File patterns to process | `"*.ts,*.js"` |
| `--dry-run` | Preview changes without applying | `false` |
| `--backup` | Create backup before replacing | `false` |
| `--preserve-formatting` | Preserve original code formatting | `false` |

#### Examples

```bash
# Preview changes
i18n replace --dry-run

# Replace with backup
i18n replace --backup

# Replace specific file types
i18n replace --patterns "*.ts"

# Preserve formatting
i18n replace --preserve-formatting
```

### Config Command

The `config` command manages CLI configuration settings.

#### Subcommands

```bash
# Show current configuration
i18n config show

# Show detailed configuration
i18n config show --verbose

# Validate configuration
i18n config validate

# Set configuration value
i18n config set logging.level debug

# Reset to default configuration
i18n config reset
```

## 🔧 Advanced Features

### Custom Extraction Patterns

You can define custom patterns for extracting specific types of translatable strings.

```bash
# Extract only exception messages
i18n extract --custom-patterns "throw new Error"

# Extract template literals
i18n extract --custom-patterns "`${text}`"

# Extract specific function calls
i18n extract --custom-patterns "t('text')"
```

### Multi-Service Architecture

For microservice architectures, you can process multiple services simultaneously.

```bash
# Extract from multiple services
i18n extract ./auth-service ./user-service ./payment-service

# Generate for each service
i18n generate --services auth,user,payment

# Replace across all services
i18n replace --services auth,user,payment
```

### CI/CD Integration

Perfect for automated pipelines and continuous integration.

```bash
# Extract in CI pipeline
i18n extract --validate --max-file-size 10

# Generate with specific languages
i18n generate --languages en,fr --template

# Replace with dry run
i18n replace --dry-run --backup
```

### Environment-Specific Configuration

Configure different settings for different environments.

```bash
# Development environment
NODE_ENV=development i18n extract

# Production environment
NODE_ENV=production i18n extract --validate

# Staging environment
NODE_ENV=staging i18n extract --dry-run
```

## ⚙️ Configuration

### Environment Variables

Set environment variables to configure the CLI behavior:

```bash
# Environment
export NODE_ENV=production
export LOG_LEVEL=warn
export LOG_FORMAT=json
export LOG_OUTPUT=both
export LOG_FILE=/var/log/i18n-cli.log

# Performance
export MAX_CONCURRENCY=8
export MAX_FILE_SIZE=50
export TIMEOUT=600

# Security
export VALIDATE_INPUTS=true
export SANITIZE_OUTPUTS=true
export MAX_KEY_LENGTH=200

# Features
export ENABLE_VALIDATION=true
export ENABLE_BACKUP=true
export ENABLE_DRY_RUN=true
export ENABLE_PROGRESS_BAR=true
```

### Configuration File

Create `.i18n-cli.json` in your project root:

```json
{
  "version": "2.0.0",
  "environment": "production",
  "logging": {
    "level": "warn",
    "format": "json",
    "output": "both",
    "filePath": "/var/log/i18n-cli.log"
  },
  "performance": {
    "maxConcurrency": 8,
    "maxFileSize": 50,
    "timeout": 600
  },
  "security": {
    "validateInputs": true,
    "sanitizeOutputs": true,
    "maxKeyLength": 200
  },
  "features": {
    "enableValidation": true,
    "enableBackup": true,
    "enableDryRun": true,
    "enableProgressBar": true
  }
}
```

### Configuration Locations

The CLI looks for configuration in the following order:

1. Command-line arguments
2. Environment variables
3. `.i18n-cli.json` in current directory
4. `.i18n-cli.json` in parent directories
5. Default configuration

## 🛡️ Security

### Input Validation

All inputs are automatically validated for security and correctness:

```bash
# Enable strict validation
i18n extract --validate-inputs --max-key-length 100

# Validate file paths
i18n extract --validate-paths
```

### Output Sanitization

Automatically sanitize outputs to prevent security issues:

```bash
# Enable output sanitization
i18n extract --sanitize-outputs

# Custom sanitization rules
i18n extract --sanitize-rules "script,alert,confirm"
```

### Path Security

Security checks for file paths to prevent traversal attacks:

```bash
# Validate all file paths
i18n extract --validate-paths

# Restrict to specific directories
i18n extract --allowed-paths "./src,./lib"
```

## 📊 Performance

### Concurrent Processing

Process multiple files simultaneously for better performance:

```bash
# Process 8 files concurrently
i18n extract --concurrency 8

# Environment variable
MAX_CONCURRENCY=8 i18n extract
```

### File Size Filtering

Skip files that are too large to process efficiently:

```bash
# Skip files larger than 50MB
i18n extract --max-file-size 50

# Environment variable
MAX_FILE_SIZE=50 i18n extract
```

### Progress Tracking

Monitor progress with real-time updates:

```bash
# Enable progress bar
i18n extract --progress-bar

# Environment variable
ENABLE_PROGRESS_BAR=true i18n extract
```

### Performance Monitoring

Track detailed performance metrics:

```bash
# Enable performance monitoring
i18n extract --monitor-performance

# View performance report
i18n extract --performance-report
```

## 🔍 Troubleshooting

### Common Issues

#### 1. No translation keys found

**Problem**: The extract command doesn't find any translatable strings.

**Solutions**:
```bash
# Check if files are being scanned
i18n extract --verbose

# Verify file patterns
i18n extract --patterns "*.ts,*.js,*.tsx,*.jsx"

# Check ignore patterns
i18n extract --ignore ""
```

#### 2. Validation errors

**Problem**: Validation fails with errors.

**Solutions**:
```bash
# Check validation details
i18n extract --validate --verbose

# Disable validation temporarily
i18n extract --no-validate

# Fix validation issues
i18n extract --fix-validation
```

#### 3. Performance issues

**Problem**: Processing is slow or uses too much memory.

**Solutions**:
```bash
# Reduce concurrency
i18n extract --concurrency 2

# Reduce file size limit
i18n extract --max-file-size 10

# Enable progress monitoring
i18n extract --progress-bar
```

#### 4. Security warnings

**Problem**: Security validation produces warnings.

**Solutions**:
```bash
# Review security warnings
i18n extract --validate-security --verbose

# Disable security checks temporarily
i18n extract --no-security-checks

# Fix security issues
i18n extract --fix-security
```

### Debug Mode

Enable debug mode for detailed troubleshooting:

```bash
# Enable debug logging
LOG_LEVEL=debug i18n extract --verbose

# Show detailed configuration
i18n config show --verbose

# Validate configuration
i18n config validate
```

### Getting Help

```bash
# Show help for all commands
i18n --help

# Show help for specific command
i18n extract --help

# Show version
i18n --version
```

## 📚 Next Steps

- Read the [API Reference](./API_REFERENCE.md) for detailed technical information
- Check the [Configuration Guide](./CONFIGURATION.md) for advanced configuration options
- Review the [Security Guide](./SECURITY.md) for security best practices
- Explore the [Performance Guide](./PERFORMANCE.md) for optimization tips
- See the [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues and solutions

---

**Need help?** Check our [Troubleshooting Guide](./TROUBLESHOOTING.md) or [open an issue](https://github.com/logistically/i18n-cli/issues). 