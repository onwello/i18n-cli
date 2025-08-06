# Configuration Guide

> Complete configuration guide for @logistically/i18n-cli

## 📖 Table of Contents

1. [Overview](#overview)
2. [Configuration Sources](#configuration-sources)
3. [Environment Variables](#environment-variables)
4. [Configuration File](#configuration-file)
5. [Command Line Options](#command-line-options)
6. [Environment-Specific Configs](#environment-specific-configs)
7. [Best Practices](#best-practices)
8. [Validation](#validation)

## 🚀 Overview

The CLI supports multiple configuration sources with a hierarchical precedence system:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Configuration file** (`.i18n-cli.json`)
4. **Default values** (lowest priority)

## 📋 Configuration Sources

### 1. Command Line Arguments

Override any configuration via command-line options:

```bash
# Override log level
i18n extract --log-level debug

# Override concurrency
i18n extract --concurrency 8

# Override file size limit
i18n extract --max-file-size 100
```

### 2. Environment Variables

Set environment variables for persistent configuration:

```bash
# Set environment
export NODE_ENV=production

# Set logging
export LOG_LEVEL=warn
export LOG_FORMAT=json
export LOG_OUTPUT=both

# Set performance
export MAX_CONCURRENCY=8
export MAX_FILE_SIZE=50

# Set security
export VALIDATE_INPUTS=true
export SANITIZE_OUTPUTS=true
```

### 3. Configuration File

Create `.i18n-cli.json` in your project root:

```json
{
  "version": "1.0.0",
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

## 🔧 Environment Variables

### Environment Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment | `development` | `production` |
| `LOG_LEVEL` | Log level | `info` | `debug` |
| `LOG_FORMAT` | Log format | `text` | `json` |
| `LOG_OUTPUT` | Log output | `console` | `both` |
| `LOG_FILE` | Log file path | - | `/var/log/i18n-cli.log` |

### Performance Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MAX_CONCURRENCY` | Max concurrent processing | `4` | `8` |
| `MAX_FILE_SIZE` | Max file size in MB | `50` | `100` |
| `TIMEOUT` | Operation timeout in seconds | `300` | `600` |

### Security Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VALIDATE_INPUTS` | Enable input validation | `true` | `true` |
| `SANITIZE_OUTPUTS` | Enable output sanitization | `true` | `true` |
| `MAX_KEY_LENGTH` | Max translation key length | `200` | `100` |

### Feature Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ENABLE_VALIDATION` | Enable validation features | `true` | `true` |
| `ENABLE_BACKUP` | Enable backup features | `true` | `true` |
| `ENABLE_DRY_RUN` | Enable dry run features | `true` | `true` |
| `ENABLE_PROGRESS_BAR` | Enable progress bar | `true` | `true` |

## 📄 Configuration File

### Structure

The configuration file uses JSON format with the following structure:

```json
{
  "version": "1.0.0",
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

### Configuration Sections

#### Logging Configuration

```json
{
  "logging": {
    "level": "warn",                    // debug, info, warn, error
    "format": "json",                   // text, json
    "output": "both",                   // console, file, both
    "filePath": "/var/log/i18n-cli.log" // Log file path
  }
}
```

**Options:**
- `level`: Log level (`debug`, `info`, `warn`, `error`)
- `format`: Log format (`text`, `json`)
- `output`: Log output (`console`, `file`, `both`)
- `filePath`: Log file path (required when output is `file` or `both`)

#### Performance Configuration

```json
{
  "performance": {
    "maxConcurrency": 8,    // Max concurrent file processing
    "maxFileSize": 50,       // Max file size in MB
    "timeout": 600           // Operation timeout in seconds
  }
}
```

**Options:**
- `maxConcurrency`: Maximum number of files to process concurrently (1-20)
- `maxFileSize`: Maximum file size to process in MB (1-100)
- `timeout`: Operation timeout in seconds (60-3600)

#### Security Configuration

```json
{
  "security": {
    "validateInputs": true,   // Enable input validation
    "sanitizeOutputs": true,  // Enable output sanitization
    "maxKeyLength": 200       // Max translation key length
  }
}
```

**Options:**
- `validateInputs`: Enable comprehensive input validation
- `sanitizeOutputs`: Enable output sanitization for security
- `maxKeyLength`: Maximum allowed translation key length (50-500)

#### Features Configuration

```json
{
  "features": {
    "enableValidation": true,    // Enable validation features
    "enableBackup": true,        // Enable backup features
    "enableDryRun": true,        // Enable dry run features
    "enableProgressBar": true    // Enable progress bar
  }
}
```

**Options:**
- `enableValidation`: Enable all validation features
- `enableBackup`: Enable automatic backup creation
- `enableDryRun`: Enable dry run mode for testing
- `enableProgressBar`: Enable progress tracking

## 🎯 Command Line Options

### Global Options

All commands support these global options:

```bash
# Verbose logging
i18n extract --verbose

# Log level
i18n extract --log-level debug

# Configuration override
i18n extract --config ./custom-config.json

# Environment override
i18n extract --env production
```

### Extract Command Options

```bash
# File patterns
i18n extract --patterns "*.ts,*.js"

# Ignore patterns
i18n extract --ignore "node_modules/**,dist/**"

# Output file
i18n extract --output my-translations.json

# Performance settings
i18n extract --max-file-size 100 --concurrency 8

# Validation
i18n extract --validate --max-key-length 100

# Security
i18n extract --validate-inputs --sanitize-outputs
```

### Generate Command Options

```bash
# Input file
i18n generate --input translation-keys.json

# Languages
i18n generate --languages en,fr,de

# Output directory
i18n generate --output ./translations

# Format
i18n generate --format json

# Features
i18n generate --template --backup
```

### Replace Command Options

```bash
# Input file
i18n replace --input translation-keys.json

# File patterns
i18n replace --patterns "*.ts,*.js"

# Mode
i18n replace --dry-run --backup

# Formatting
i18n replace --preserve-formatting
```

## 🌍 Environment-Specific Configs

### Development Environment

```json
{
  "environment": "development",
  "logging": {
    "level": "debug",
    "format": "text",
    "output": "console"
  },
  "performance": {
    "maxConcurrency": 2,
    "maxFileSize": 10,
    "timeout": 300
  },
  "security": {
    "validateInputs": true,
    "sanitizeOutputs": false,
    "maxKeyLength": 200
  },
  "features": {
    "enableValidation": true,
    "enableBackup": false,
    "enableDryRun": true,
    "enableProgressBar": true
  }
}
```

### Staging Environment

```json
{
  "environment": "staging",
  "logging": {
    "level": "info",
    "format": "json",
    "output": "both",
    "filePath": "/var/log/i18n-cli-staging.log"
  },
  "performance": {
    "maxConcurrency": 4,
    "maxFileSize": 25,
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

### Production Environment

```json
{
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
    "enableDryRun": false,
    "enableProgressBar": true
  }
}
```

## 🏆 Best Practices

### 1. Environment-Specific Configuration

Use different configurations for different environments:

```bash
# Development
NODE_ENV=development i18n extract

# Staging
NODE_ENV=staging i18n extract

# Production
NODE_ENV=production i18n extract
```

### 2. Security-First Configuration

Always enable security features in production:

```json
{
  "security": {
    "validateInputs": true,
    "sanitizeOutputs": true,
    "maxKeyLength": 200
  }
}
```

### 3. Performance Optimization

Adjust performance settings based on your infrastructure:

```json
{
  "performance": {
    "maxConcurrency": 8,    // Adjust based on CPU cores
    "maxFileSize": 50,       // Adjust based on memory
    "timeout": 600           // Adjust based on network
  }
}
```

### 4. Comprehensive Logging

Use structured logging for better monitoring:

```json
{
  "logging": {
    "level": "warn",
    "format": "json",
    "output": "both",
    "filePath": "/var/log/i18n-cli.log"
  }
}
```

### 5. Validation and Backup

Enable validation and backup for data integrity:

```json
{
  "features": {
    "enableValidation": true,
    "enableBackup": true,
    "enableDryRun": true,
    "enableProgressBar": true
  }
}
```

## ✅ Validation

### Configuration Validation

Validate your configuration:

```bash
# Validate current configuration
i18n config validate

# Validate specific file
i18n config validate --config ./my-config.json

# Show validation details
i18n config validate --verbose
```

### Validation Rules

The CLI validates configuration according to these rules:

#### Logging Validation

- `level` must be one of: `debug`, `info`, `warn`, `error`
- `format` must be one of: `text`, `json`
- `output` must be one of: `console`, `file`, `both`
- `filePath` is required when `output` is `file` or `both`

#### Performance Validation

- `maxConcurrency` must be between 1 and 20
- `maxFileSize` must be between 1 and 100 MB
- `timeout` must be between 60 and 3600 seconds

#### Security Validation

- `maxKeyLength` must be between 50 and 500 characters
- `validateInputs` and `sanitizeOutputs` must be boolean values

### Validation Errors

Common validation errors and solutions:

#### Invalid Log Level

```bash
# Error
Invalid log level: 'invalid'

# Solution
i18n config set logging.level info
```

#### Invalid Concurrency

```bash
# Error
Max concurrency must be between 1 and 20

# Solution
i18n config set performance.maxConcurrency 8
```

#### Missing Log File

```bash
# Error
Log file path is required when output is 'file' or 'both'

# Solution
i18n config set logging.filePath /var/log/i18n-cli.log
```

## 🔧 Configuration Management

### Show Configuration

```bash
# Show current configuration
i18n config show

# Show detailed configuration
i18n config show --verbose

# Show specific section
i18n config show --section logging
```

### Set Configuration Values

```bash
# Set log level
i18n config set logging.level debug

# Set max concurrency
i18n config set performance.maxConcurrency 8

# Set security settings
i18n config set security.validateInputs true
```

### Reset Configuration

```bash
# Reset to default configuration
i18n config reset

# Reset specific section
i18n config reset --section logging
```

## 📚 Examples

### Complete Production Configuration

```json
{
  "version": "1.0.0",
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
    "enableDryRun": false,
    "enableProgressBar": true
  }
}
```

### Environment Variables Example

```bash
#!/bin/bash

# Production environment variables
export NODE_ENV=production
export LOG_LEVEL=warn
export LOG_FORMAT=json
export LOG_OUTPUT=both
export LOG_FILE=/var/log/i18n-cli.log

export MAX_CONCURRENCY=8
export MAX_FILE_SIZE=50
export TIMEOUT=600

export VALIDATE_INPUTS=true
export SANITIZE_OUTPUTS=true
export MAX_KEY_LENGTH=200

export ENABLE_VALIDATION=true
export ENABLE_BACKUP=true
export ENABLE_DRY_RUN=false
export ENABLE_PROGRESS_BAR=true

# Run CLI
i18n extract --validate
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

# Install CLI
RUN npm install -g @logistically/i18n-cli

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=warn
ENV LOG_FORMAT=json
ENV MAX_CONCURRENCY=8
ENV VALIDATE_INPUTS=true

# Create log directory
RUN mkdir -p /var/log

# Set working directory
WORKDIR /app

# Copy configuration
COPY .i18n-cli.json .

# Run CLI
CMD ["i18n", "extract"]
```

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [API Reference](./API_REFERENCE.md).** 