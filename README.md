# @logistically/i18n-cli

[![npm version](https://badge.fury.io/js/%40logistically%2Fi18n-cli.svg)](https://badge.fury.io/js/%40logistically%2Fi18n-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/logistically/i18n-cli/workflows/Tests/badge.svg)](https://github.com/logistically/i18n-cli/actions)

> Enterprise-grade CLI tool for extracting and managing translations in Logistically microservices

## 🚀 Overview

The `@logistically/i18n-cli` is a powerful, enterprise-ready command-line tool designed to streamline internationalization (i18n) workflows in microservice architectures. It works seamlessly with the **@logistically/i18n** library to provide a complete i18n solution for NestJS microservices.

### 🔗 Complementary to @logistically/i18n

This CLI tool is designed to work with the main **@logistically/i18n** library:

- **@logistically/i18n**: Runtime translation library for NestJS microservices
- **@logistically/i18n-cli**: Development tool for managing translations

**Complete Workflow:**
```bash
# 1. Extract translatable strings from your codebase
i18n extract --patterns "*.ts,*.js" --output translation-keys.json

# 2. Generate translation files for multiple languages
i18n generate --languages en,fr,es,ar --output src/translations

# 3. Replace hardcoded strings with translation keys
i18n replace --dry-run  # Preview changes
i18n replace            # Apply changes

# 4. Use @logistically/i18n in your NestJS services
```

## ✨ Key Features

- 🔍 **Smart Extraction**: Automatically extract translatable strings from TypeScript/JavaScript files
- 🏗️ **File Generation**: Generate translation files for multiple languages and services
- 🔄 **String Replacement**: Replace hardcoded strings with translation keys
- 🛡️ **Security First**: Input validation, output sanitization, and path security
- 📊 **Performance Monitoring**: Real-time metrics, progress tracking, and concurrent processing
- ⚙️ **Configuration Management**: Environment-based configs with validation
- 📝 **Advanced Logging**: Structured logging with context and metadata
- 🧪 **Comprehensive Testing**: Full test coverage with enterprise feature tests
- 🔗 **Seamless Integration**: Works perfectly with @logistically/i18n library

## 📦 Installation

### Global Installation

```bash
npm install -g @logistically/i18n-cli
```

### Local Installation

```bash
npm install --save-dev @logistically/i18n-cli
```

### Using npx

```bash
npx @logistically/i18n-cli --help
```

## 🎯 Quick Start

### 1. Extract Translation Keys

```bash
# Extract from current directory
i18n extract

# Extract from specific directory
i18n extract ./src

# Extract with custom patterns
i18n extract --patterns "*.ts,*.js" --ignore "node_modules/**"
```

### 2. Generate Translation Files

```bash
# Generate for all services
i18n generate

# Generate for specific languages
i18n generate --languages en,fr,de

# Generate with custom output
i18n generate --output ./translations
```

### 3. Replace Hardcoded Strings

```bash
# Replace strings with translation keys
i18n replace

# Dry run (preview changes)
i18n replace --dry-run

# Replace with backup
i18n replace --backup
```

### 4. Use with @logistically/i18n

```typescript
// In your NestJS service
import { TranslationService, T } from '@logistically/i18n';

@Injectable()
export class UserService {
  constructor(private translationService: TranslationService) {}

  async findUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new T('USER.NOT_FOUND', { userId: id });
    }
    return user;
  }
}
```

## 📋 Commands

### Extract Command

Extract translatable strings from your codebase.

```bash
i18n extract [options]
```

**Options:**
- `--patterns <patterns>` - File patterns to search (default: "*.ts,*.js")
- `--ignore <ignore>` - Patterns to ignore (default: "node_modules/**")
- `--output <file>` - Output file path (default: "translation-keys.json")
- `--verbose` - Enable verbose logging
- `--validate` - Enable validation
- `--max-file-size <size>` - Max file size in MB
- `--concurrency <number>` - Max concurrent processing

### Generate Command

Generate translation files for different languages and services.

```bash
i18n generate [options]
```

**Options:**
- `--input <file>` - Input translation keys file
- `--languages <languages>` - Languages to generate (default: "en,fr,de")
- `--output <dir>` - Output directory
- `--format <format>` - Output format (json/yaml)
- `--template` - Generate template files
- `--backup` - Create backup of existing files

### Replace Command

Replace hardcoded strings with translation keys.

```bash
i18n replace [options]
```

**Options:**
- `--input <file>` - Translation keys file
- `--patterns <patterns>` - File patterns to process
- `--dry-run` - Preview changes without applying
- `--backup` - Create backup before replacing
- `--preserve-formatting` - Preserve original code formatting

### Config Command

Manage CLI configuration.

```bash
i18n config <subcommand> [options]
```

**Subcommands:**
- `show` - Show current configuration
- `validate` - Validate configuration
- `set <key> <value>` - Set configuration value
- `reset` - Reset to default configuration

## ⚙️ Configuration

### Environment Variables

```bash
# Environment
NODE_ENV=production                    # development/staging/production
LOG_LEVEL=info                         # debug/info/warn/error
LOG_FORMAT=json                        # text/json
LOG_OUTPUT=both                        # console/file/both
LOG_FILE=/var/log/i18n-cli.log        # Log file path

# Performance
MAX_CONCURRENCY=8                      # Max concurrent file processing
MAX_FILE_SIZE=50                       # Max file size in MB
TIMEOUT=600                            # Operation timeout in seconds

# Security
VALIDATE_INPUTS=true                   # Enable input validation
SANITIZE_OUTPUTS=true                  # Enable output sanitization
MAX_KEY_LENGTH=200                     # Max translation key length

# Features
ENABLE_VALIDATION=true                 # Enable validation features
ENABLE_BACKUP=true                     # Enable backup features
ENABLE_DRY_RUN=true                    # Enable dry run features
ENABLE_PROGRESS_BAR=true               # Enable progress bar
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

## 🔧 Advanced Usage

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

## 🛡️ Security Features

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

## 📊 Performance Features

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

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Enterprise Tests

```bash
npm run test:enterprise
```

### Performance Tests

```bash
npm run performance:test
```

### Security Tests

```bash
npm run security:audit
npm run security:fix
```

## 📚 Documentation

- **[User Guide](./docs/USER_GUIDE.md)** - Complete usage guide
- **[Integration Guide](./docs/INTEGRATION_GUIDE.md)** - Integration with @logistically/i18n
- **[API Reference](./docs/API_REFERENCE.md)** - Detailed API documentation
- **[Configuration Guide](./docs/CONFIGURATION.md)** - Configuration options
- **[Security Guide](./docs/SECURITY.md)** - Security features and best practices
- **[Performance Guide](./docs/PERFORMANCE.md)** - Performance optimization
- **[Migration Guide](./docs/MIGRATION.md)** - Upgrading from previous versions
- **[Enterprise Features](./ENTERPRISE_FEATURES.md)** - Enterprise-grade features
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🔗 Integration with @logistically/i18n

### Complete Workflow Example

```bash
# 1. Extract translations from your NestJS services
i18n extract --patterns "*.ts" --ignore "node_modules/**,dist/**"

# 2. Generate translation files for your microservices
i18n generate --languages en,fr,es,ar --output src/translations

# 3. Replace hardcoded strings with translation keys
i18n replace --dry-run  # Preview changes
i18n replace            # Apply changes

# 4. Use in your NestJS services
```

### NestJS Service Example

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService, T } from '@logistically/i18n';

@Injectable()
export class UserService {
  constructor(private translationService: TranslationService) {}

  async findUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      // This will be extracted by the CLI
      throw new T('USER.NOT_FOUND', { userId: id });
    }
    return user;
  }

  async updateProfile(userId: string, data: any) {
    try {
      const result = await this.userRepository.update(userId, data);
      // This will be extracted by the CLI
      return this.translationService.translate('PROFILE.UPDATED', { userId });
    } catch (error) {
      // This will be extracted by the CLI
      throw new T('PROFILE.UPDATE_FAILED', { userId, error: error.message });
    }
  }
}
```

### Translation Files Generated

```json
// src/translations/en.json
{
  "USER.NOT_FOUND": "User not found: ${userId}",
  "PROFILE.UPDATED": "Profile updated successfully for user: ${userId}",
  "PROFILE.UPDATE_FAILED": "Failed to update profile for user ${userId}: ${error}"
}

// src/translations/fr.json
{
  "USER.NOT_FOUND": "Utilisateur introuvable: ${userId}",
  "PROFILE.UPDATED": "Profil mis à jour avec succès pour l'utilisateur: ${userId}",
  "PROFILE.UPDATE_FAILED": "Échec de la mise à jour du profil pour l'utilisateur ${userId}: ${error}"
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/logistically/i18n-cli.git
cd i18n-cli

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.logistically.com/i18n-cli](https://docs.logistically.com/i18n-cli)
- **Issues**: [GitHub Issues](https://github.com/logistically/i18n-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/logistically/i18n-cli/discussions)
- **Enterprise Support**: [enterprise@logistically.com](mailto:enterprise@logistically.com)

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js) for CLI framework
- Powered by [TypeScript](https://www.typescriptlang.org/) for type safety
- Tested with [Jest](https://jestjs.io/) for comprehensive testing
- Styled with [Chalk](https://github.com/chalk/chalk) for beautiful output
- Designed to work seamlessly with [@logistically/i18n](https://github.com/logistically/i18n)

---

**Enterprise-Grade i18n CLI v1.0.0** - Built for scale, security, and performance. 🚀 