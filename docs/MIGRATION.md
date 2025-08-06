# Migration Guide

> Complete migration guide for @logistically/i18n-cli

## 📖 Table of Contents

1. [Overview](#overview)
2. [Version History](#version-history)
3. [Breaking Changes](#breaking-changes)
4. [Migration Steps](#migration-steps)
5. [Configuration Migration](#configuration-migration)
6. [Command Migration](#command-migration)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Guide](#rollback-guide)

## 🚀 Overview

This guide helps you migrate from previous versions of the CLI to the latest enterprise-grade version. The migration process is designed to be smooth and backward-compatible where possible.

## 📋 Version History

### Version 1.0.0 (Current)

**Major Features:**
- Enterprise-grade security and validation
- Performance monitoring and optimization
- Advanced configuration management
- Comprehensive logging and metrics
- Concurrent processing capabilities
- Seamless integration with @logistically/i18n

**Initial Release:**
- CLI tool for extracting and managing translations
- Support for NestJS microservices
- Multi-language translation file generation
- String replacement capabilities

## 🚀 Initial Release

This is the initial release of the `@logistically/i18n-cli` tool. There are no breaking changes from previous versions as this is the first public release.

### CLI Commands

```bash
# Available commands
i18n extract
i18n generate
i18n replace
i18n config
```

### 2. Package Name Changes

**Before:**
```json
{
  "dependencies": {
    "@onwello/translation-cli": "^1.0.0"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "@logistically/i18n-cli": "^1.0.0"
  }
}
```

### 3. Configuration File Changes

**Before (v1.0.0):**
```json
{
  "patterns": ["*.ts", "*.js"],
  "ignore": ["node_modules/**"],
  "output": "translation-keys.json"
}
```

**After (v1.0.0):**
```json
{
  "version": "1.0.0",
  "environment": "production",
  "logging": {
    "level": "warn",
    "format": "json",
    "output": "both"
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
  }
}
```

### 4. Environment Variables

**New Environment Variables:**
```bash
# New security variables
export VALIDATE_INPUTS=true
export SANITIZE_OUTPUTS=true
export MAX_KEY_LENGTH=200

# New performance variables
export MAX_CONCURRENCY=8
export MAX_FILE_SIZE=50
export TIMEOUT=600

# New logging variables
export LOG_LEVEL=warn
export LOG_FORMAT=json
export LOG_OUTPUT=both
```

## 🔄 Migration Steps

### Step 1: Update Package

**Uninstall old package:**
```bash
npm uninstall @onwello/translation-cli
```

**Install new package:**
```bash
npm install @logistically/i18n-cli
```

**Or update globally:**
```bash
npm uninstall -g @onwello/translation-cli
npm install -g @logistically/i18n-cli
```

### Step 2: Update Scripts

**Update package.json scripts:**
```json
{
  "scripts": {
    "extract": "i18n extract",
    "generate": "i18n generate",
    "replace": "i18n replace",
    "config": "i18n config"
  }
}
```

### Step 3: Migrate Configuration

**Run configuration migration:**
```bash
# Migrate existing configuration
i18n config migrate

# Or manually create new configuration
i18n config show > .i18n-cli.json
```

### Step 4: Update CI/CD Pipelines

**Update GitHub Actions:**
```yaml
# Before
- name: Extract translations
  run: translation extract

# After
- name: Extract translations
  run: i18n extract
```

**Update Docker configurations:**
```dockerfile
# Before
RUN npm install -g @onwello/translation-cli

# After
RUN npm install -g @logistically/i18n-cli
```

### Step 5: Test Migration

**Run migration tests:**
```bash
# Test basic functionality
i18n extract --dry-run

# Test configuration
i18n config validate

# Test all commands
i18n --help
```

## ⚙️ Configuration Migration

### Automatic Migration

**Migrate configuration automatically:**
```bash
# Migrate from old configuration
i18n config migrate --from .translation-cli.json

# Migrate with validation
i18n config migrate --validate

# Migrate with backup
i18n config migrate --backup
```

### Manual Migration

**Create new configuration file:**
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

### Environment Variables Migration

**Update environment variables:**
```bash
# Old variables (remove)
export TRANSLATION_PATTERNS="*.ts,*.js"
export TRANSLATION_IGNORE="node_modules/**"

# New variables (add)
export NODE_ENV=production
export LOG_LEVEL=warn
export MAX_CONCURRENCY=8
export VALIDATE_INPUTS=true
```

## 🔧 Command Migration

### Extract Command

**Before:**
```bash
translation extract --patterns "*.ts,*.js" --ignore "node_modules/**"
```

**After:**
```bash
i18n extract --patterns "*.ts,*.js" --ignore "node_modules/**" --validate
```

### Generate Command

**Before:**
```bash
translation generate --languages en,fr,de
```

**After:**
```bash
i18n generate --languages en,fr,de --template --backup
```

### Replace Command

**Before:**
```bash
translation replace --dry-run
```

**After:**
```bash
i18n replace --dry-run --backup --preserve-formatting
```

### New Commands

**Configuration management:**
```bash
# Show configuration
i18n config show

# Validate configuration
i18n config validate

# Set configuration values
i18n config set logging.level debug

# Reset configuration
i18n config reset
```

## 🔍 Troubleshooting

### Common Migration Issues

#### 1. Command Not Found

**Problem:** `i18n` command not found after installation.

**Solution:**
```bash
# Reinstall globally
npm uninstall -g @logistically/i18n-cli
npm install -g @logistically/i18n-cli

# Check installation
which i18n
i18n --version
```

#### 2. Configuration Errors

**Problem:** Configuration validation fails.

**Solution:**
```bash
# Validate configuration
i18n config validate

# Show current configuration
i18n config show

# Reset to defaults
i18n config reset
```

#### 3. Permission Errors

**Problem:** Permission denied when running commands.

**Solution:**
```bash
# Fix permissions
sudo npm install -g @logistically/i18n-cli

# Or use npx
npx @logistically/i18n-cli extract
```

#### 4. Performance Issues

**Problem:** Slower performance after migration.

**Solution:**
```bash
# Optimize performance settings
i18n extract --concurrency 8 --max-file-size 50

# Monitor performance
i18n extract --monitor-performance

# Check system resources
i18n extract --performance-report
```

#### 5. Security Warnings

**Problem:** Security validation produces warnings.

**Solution:**
```bash
# Review security warnings
i18n extract --validate-security --verbose

# Fix security issues
i18n extract --fix-security

# Disable security temporarily
i18n extract --no-security-checks
```

### Migration Validation

**Validate migration success:**
```bash
# Test all functionality
i18n extract --dry-run --validate
i18n generate --dry-run
i18n replace --dry-run

# Check configuration
i18n config validate

# Test performance
i18n extract --performance-test
```

## 🔄 Rollback Guide

### Rollback to Previous Version

**If migration fails, rollback to previous version:**
```bash
# Uninstall new version
npm uninstall -g @logistically/i18n-cli

# Install previous version
npm install -g @onwello/translation-cli

# Restore old configuration
cp .i18n-cli.json.backup .translation-cli.json
```

### Rollback Configuration

**Restore old configuration:**
```bash
# Restore from backup
cp .i18n-cli.json.backup .i18n-cli.json

# Or recreate old configuration
cat > .translation-cli.json << EOF
{
  "patterns": ["*.ts", "*.js"],
  "ignore": ["node_modules/**"],
  "output": "translation-keys.json"
}
EOF
```

### Rollback Scripts

**Restore old scripts:**
```json
{
  "scripts": {
    "extract": "translation extract",
    "generate": "translation generate",
    "replace": "translation replace"
  }
}
```

## 📚 Migration Checklist

### Pre-Migration Checklist

- [ ] Backup current configuration
- [ ] Backup translation files
- [ ] Document current workflow
- [ ] Test in development environment
- [ ] Prepare rollback plan

### Migration Checklist

- [ ] Update package dependencies
- [ ] Update CLI commands
- [ ] Migrate configuration
- [ ] Update CI/CD pipelines
- [ ] Update documentation
- [ ] Test all functionality

### Post-Migration Checklist

- [ ] Verify all commands work
- [ ] Validate configuration
- [ ] Test performance
- [ ] Check security settings
- [ ] Update team documentation
- [ ] Monitor for issues

## 🆘 Support

### Migration Support

**Get help with migration:**
```bash
# Show migration help
i18n config migrate --help

# Validate migration
i18n config validate --migration

# Test migration
i18n config test-migration
```

### Documentation

- [User Guide](./USER_GUIDE.md) - Complete usage guide
- [Configuration Guide](./CONFIGURATION.md) - Configuration options
- [API Reference](./API_REFERENCE.md) - Technical documentation
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues

### Community Support

- **GitHub Issues**: [Report migration issues](https://github.com/logistically/i18n-cli/issues)
- **Discussions**: [Ask migration questions](https://github.com/logistically/i18n-cli/discussions)
- **Documentation**: [Complete documentation](https://docs.logistically.com/i18n-cli)

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [Configuration Guide](./CONFIGURATION.md).** 