# Troubleshooting Guide

> Complete troubleshooting guide for @logistically/i18n-cli

## 📖 Table of Contents

1. [Overview](#overview)
2. [Common Issues](#common-issues)
3. [Error Messages](#error-messages)
4. [Performance Issues](#performance-issues)
5. [Security Issues](#security-issues)
6. [Configuration Issues](#configuration-issues)
7. [Debug Mode](#debug-mode)
8. [Getting Help](#getting-help)

## 🚀 Overview

This guide helps you troubleshoot common issues with the CLI. Each section provides detailed solutions and workarounds for specific problems.

## 🔍 Common Issues

### 1. Command Not Found

**Problem:** `i18n` command not found after installation.

**Solutions:**
```bash
# Reinstall globally
npm uninstall -g @logistically/i18n-cli
npm install -g @logistically/i18n-cli

# Check installation
which i18n
i18n --version

# Use npx instead
npx @logistically/i18n-cli extract

# Check PATH
echo $PATH
```

### 2. Permission Denied

**Problem:** Permission denied when running commands.

**Solutions:**
```bash
# Fix permissions
sudo npm install -g @logistically/i18n-cli

# Use npx (no global install needed)
npx @logistically/i18n-cli extract

# Check file permissions
ls -la $(which i18n)

# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
```

### 3. No Translation Keys Found

**Problem:** The extract command doesn't find any translatable strings.

**Solutions:**
```bash
# Check if files are being scanned
i18n extract --verbose

# Verify file patterns
i18n extract --patterns "*.ts,*.js,*.tsx,*.jsx"

# Check ignore patterns
i18n extract --ignore ""

# Test with specific file
i18n extract --patterns "test.ts" --verbose
```

### 4. File Not Found

**Problem:** Files are not found during processing.

**Solutions:**
```bash
# Check file existence
ls -la src/

# Verify file paths
i18n extract --patterns "src/**/*.ts" --verbose

# Check working directory
pwd
ls -la

# Use absolute paths
i18n extract --patterns "/absolute/path/*.ts"
```

### 5. Configuration Errors

**Problem:** Configuration validation fails.

**Solutions:**
```bash
# Validate configuration
i18n config validate

# Show current configuration
i18n config show

# Reset to defaults
i18n config reset

# Check configuration file
cat .i18n-cli.json
```

## ⚠️ Error Messages

### Validation Errors

**Error:** `Validation failed with X errors`

**Solutions:**
```bash
# Check validation details
i18n extract --validate --verbose

# Disable validation temporarily
i18n extract --no-validate

# Fix validation issues
i18n extract --fix-validation

# Show validation rules
i18n config show --section validation
```

### Security Errors

**Error:** `Security validation failed`

**Solutions:**
```bash
# Review security warnings
i18n extract --validate-security --verbose

# Disable security checks temporarily
i18n extract --no-security-checks

# Fix security issues
i18n extract --fix-security

# Show security settings
i18n config show --section security
```

### Performance Errors

**Error:** `Performance threshold exceeded`

**Solutions:**
```bash
# Reduce concurrency
i18n extract --concurrency 2

# Reduce file size limit
i18n extract --max-file-size 10

# Enable memory monitoring
i18n extract --monitor-memory

# Check system resources
i18n extract --performance-report
```

### File System Errors

**Error:** `Cannot access file`

**Solutions:**
```bash
# Check file permissions
ls -la file.ts

# Fix file permissions
chmod 644 file.ts

# Check disk space
df -h

# Verify file path
realpath file.ts
```

## 📊 Performance Issues

### 1. Slow Processing

**Problem:** Processing is very slow.

**Solutions:**
```bash
# Increase concurrency
i18n extract --concurrency 8

# Reduce file size limit
i18n extract --max-file-size 25

# Enable progress monitoring
i18n extract --progress-bar

# Monitor performance
i18n extract --monitor-performance
```

### 2. High Memory Usage

**Problem:** CLI uses too much memory.

**Solutions:**
```bash
# Reduce concurrency
i18n extract --concurrency 2

# Set memory limits
i18n extract --max-memory 256

# Enable memory monitoring
i18n extract --monitor-memory

# Use streaming for large files
i18n extract --stream-large-files
```

### 3. CPU Overload

**Problem:** CPU usage is too high.

**Solutions:**
```bash
# Reduce concurrency
i18n extract --concurrency 4

# Process smaller batches
i18n extract --batch-size 50

# Enable CPU monitoring
i18n extract --monitor-cpu

# Check system resources
i18n extract --system-report
```

### 4. I/O Bottlenecks

**Problem:** File I/O is slow.

**Solutions:**
```bash
# Use SSD storage
i18n extract --input-dir /ssd/project

# Reduce file size limit
i18n extract --max-file-size 10

# Enable I/O monitoring
i18n extract --monitor-io

# Use batch processing
i18n extract --batch-processing
```

## 🛡️ Security Issues

### 1. Path Traversal Warnings

**Problem:** Path traversal attempts detected.

**Solutions:**
```bash
# Review file paths
i18n extract --validate-paths --verbose

# Restrict to specific directories
i18n extract --allowed-paths "./src,./lib"

# Fix path issues
i18n extract --fix-paths

# Disable path validation temporarily
i18n extract --no-path-validation
```

### 2. Suspicious Content

**Problem:** Suspicious content detected.

**Solutions:**
```bash
# Review suspicious content
i18n extract --validate-content --verbose

# Enable content filtering
i18n extract --filter-content

# Custom filter rules
i18n extract --filter-rules "script,alert,confirm"

# Disable content validation temporarily
i18n extract --no-content-validation
```

### 3. Input Validation Errors

**Problem:** Input validation fails.

**Solutions:**
```bash
# Review validation errors
i18n extract --validate-inputs --verbose

# Fix validation issues
i18n extract --fix-validation

# Disable input validation temporarily
i18n extract --no-input-validation

# Show validation rules
i18n config show --section validation
```

### 4. Output Sanitization Issues

**Problem:** Output sanitization produces unexpected results.

**Solutions:**
```bash
# Review sanitization
i18n extract --sanitize-outputs --verbose

# Custom sanitization rules
i18n extract --sanitize-rules "script,alert"

# Disable sanitization temporarily
i18n extract --no-sanitization

# Test sanitization
i18n extract --test-sanitization
```

## ⚙️ Configuration Issues

### 1. Configuration Not Found

**Problem:** Configuration file not found.

**Solutions:**
```bash
# Create default configuration
i18n config show > .i18n-cli.json

# Check configuration locations
i18n config show --locations

# Use environment variables
export NODE_ENV=production
export LOG_LEVEL=warn

# Specify config file
i18n extract --config ./custom-config.json
```

### 2. Invalid Configuration

**Problem:** Configuration validation fails.

**Solutions:**
```bash
# Validate configuration
i18n config validate

# Show configuration errors
i18n config validate --verbose

# Reset to defaults
i18n config reset

# Fix configuration
i18n config fix
```

### 3. Environment Variables

**Problem:** Environment variables not working.

**Solutions:**
```bash
# Check environment variables
env | grep I18N

# Set environment variables
export NODE_ENV=production
export LOG_LEVEL=debug
export MAX_CONCURRENCY=8

# Use .env file
echo "NODE_ENV=production" > .env
echo "LOG_LEVEL=debug" >> .env

# Check variable precedence
i18n config show --sources
```

### 4. Configuration Conflicts

**Problem:** Multiple configuration sources conflict.

**Solutions:**
```bash
# Show configuration sources
i18n config show --sources

# Check precedence order
i18n config show --precedence

# Override with command line
i18n extract --log-level debug --concurrency 4

# Use specific config file
i18n extract --config ./production.json
```

## 🐛 Debug Mode

### Enable Debug Mode

**Enable comprehensive debugging:**
```bash
# Enable debug logging
LOG_LEVEL=debug i18n extract --verbose

# Show detailed configuration
i18n config show --verbose

# Validate with debug info
i18n config validate --debug

# Test with debug mode
i18n extract --debug --dry-run
```

### Debug Information

**Get detailed debug information:**
```bash
# Show system information
i18n extract --system-info

# Show performance metrics
i18n extract --performance-metrics

# Show security status
i18n extract --security-status

# Show configuration details
i18n config show --detailed
```

### Debug Logs

**Analyze debug logs:**
```bash
# Enable file logging
LOG_OUTPUT=both LOG_FILE=debug.log i18n extract

# View debug logs
tail -f debug.log

# Filter debug logs
grep "DEBUG" debug.log

# Export debug logs
i18n extract --export-logs debug-export.json
```

## 🆘 Getting Help

### Self-Help Resources

**Use built-in help:**
```bash
# Show general help
i18n --help

# Show command help
i18n extract --help
i18n generate --help
i18n replace --help
i18n config --help

# Show version
i18n --version

# Show configuration
i18n config show
```

### Diagnostic Commands

**Run diagnostics:**
```bash
# System diagnostics
i18n extract --diagnose

# Configuration diagnostics
i18n config diagnose

# Performance diagnostics
i18n extract --performance-diagnose

# Security diagnostics
i18n extract --security-diagnose
```

### Community Support

**Get community help:**
- **GitHub Issues**: [Report bugs](https://github.com/onwello/i18n-cli/issues)
- **Discussions**: [Ask questions](https://github.com/onwello/i18n-cli/discussions)
- **Documentation**: [Complete docs](https://docs.logistically.com/i18n-cli)

### Professional Support

**Enterprise support:**
- **Email**: [enterprise@logistically.com](mailto:enterprise@logistically.com)
- **Documentation**: [Enterprise docs](https://docs.logistically.com/i18n-cli/enterprise)
- **Support Portal**: [Support portal](https://support.logistically.com)

## 📋 Troubleshooting Checklist

### Pre-Troubleshooting

- [ ] Check CLI version (`i18n --version`)
- [ ] Verify installation (`which i18n`)
- [ ] Check configuration (`i18n config show`)
- [ ] Review error messages carefully
- [ ] Enable debug mode if needed

### Common Solutions

- [ ] Restart CLI process
- [ ] Clear cache and temporary files
- [ ] Update to latest version
- [ ] Check system resources
- [ ] Verify file permissions
- [ ] Review configuration settings

### Advanced Troubleshooting

- [ ] Enable debug logging
- [ ] Run diagnostics
- [ ] Check system logs
- [ ] Monitor performance
- [ ] Test with minimal configuration
- [ ] Compare with working setup

## 🔧 Quick Fixes

### Immediate Solutions

```bash
# Reset to defaults
i18n config reset

# Clear cache
rm -rf ~/.cache/i18n-cli

# Reinstall CLI
npm uninstall -g @logistically/i18n-cli
npm install -g @logistically/i18n-cli

# Test basic functionality
i18n extract --dry-run --verbose
```

### Emergency Mode

```bash
# Disable all validations
i18n extract --no-validation --no-security --no-performance

# Use minimal configuration
i18n extract --config minimal.json

# Force processing
i18n extract --force --ignore-errors
```

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [Configuration Guide](./CONFIGURATION.md).** 