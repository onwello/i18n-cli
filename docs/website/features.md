---
title: "Features"
description: "Comprehensive features of @logistically/i18n-cli"
sidebar_position: 2
---

# Features

**@logistically/i18n-cli** provides comprehensive i18n management capabilities with enterprise-grade features designed specifically for NestJS microservices.

## 🔍 Comprehensive Extraction

### Built-in Patterns

The CLI automatically detects and extracts translatable text using 12+ comprehensive patterns:

- **Exception Messages**: `throw new Error("User not found")`
- **Service Messages**: `this.translationService.translate("USER.CREATED")`
- **Decorator Messages**: `@T("USER.VALIDATION.REQUIRED")`
- **String Literals**: `"User profile updated successfully"`
- **Template Literals**: `` `Welcome ${user.name}!` ``
- **Concatenated Strings**: `"User " + userId + " not found"`
- **Object Properties**: `message: "User created successfully"`
- **Return Objects**: `return { message: "Operation successful" }`
- **Error Arrays**: `errors.push(\`Validation failed\`)`
- **NestJS Exceptions**: All built-in exception types

### Intelligent Filtering

The CLI intelligently excludes non-user-facing content:

- **Log messages**: `console.log("Debug info")`
- **API documentation**: JSDoc comments, Swagger descriptions
- **Code comments**: `// TODO:`, `/* Implementation notes */`
- **Configuration values**: Environment variables, config keys
- **Technical strings**: File paths, URLs, technical identifiers
- **Test data**: Mock data, test fixtures
- **Other decorators**: Non-translation decorators like `@Injectable()`

## 🛡️ Enterprise Security

### Input Validation
- Path traversal prevention
- File type validation
- Size limit enforcement
- Suspicious content detection

### Output Sanitization
- HTML/script tag removal
- JavaScript injection prevention
- XSS protection
- Dangerous protocol filtering

### Security Monitoring
- Real-time security alerts
- Suspicious activity detection
- Audit logging
- Configuration validation

## ⚡ Performance Optimization

### Concurrent Processing
- Parallel file processing
- Configurable concurrency limits
- Memory-efficient operations
- Progress tracking

### File Size Management
- Configurable file size limits
- Large file handling
- Memory usage optimization
- Performance monitoring

### Real-time Monitoring
- Execution time tracking
- Memory usage monitoring
- CPU utilization
- Progress bars

## 🔧 Advanced Configuration

### Environment-based Settings
```bash
# Environment variables
NODE_ENV=production
LOG_LEVEL=warn
MAX_CONCURRENCY=8
VALIDATE_INPUTS=true
```

### Configuration Files
```json
{
  "version": "1.0.1",
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

### Command-line Overrides
```bash
i18n extract --max-file-size 100 --concurrency 16 --validate
```

## 📊 Comprehensive Logging

### Multiple Output Formats
- **Text**: Human-readable console output
- **JSON**: Structured logging for automation
- **File**: Persistent log storage
- **Both**: Console and file output

### Log Levels
- **Debug**: Detailed debugging information
- **Info**: General information messages
- **Warn**: Warning messages
- **Error**: Error messages

### Structured Logging
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "Extraction completed",
  "context": "extraction",
  "metadata": {
    "filesProcessed": 150,
    "keysExtracted": 45,
    "duration": 2.3
  }
}
```

## 🔍 Validation & Error Handling

### Comprehensive Validation
- Input path validation
- File existence checks
- Configuration validation
- Translation key validation

### Error Recovery
- Graceful error handling
- Partial success reporting
- Rollback capabilities
- Error categorization

### Warning System
- Non-critical issues
- Performance warnings
- Security advisories
- Best practice suggestions

## 🏗️ NestJS Integration

### Native Support
- NestJS exception patterns
- Service method extraction
- Decorator recognition
- Module structure awareness

### Seamless Workflow
```typescript
// Extract translations
i18n extract

// Generate translation files
i18n generate

// Replace hardcoded strings
i18n replace

// Use in NestJS service
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

## 📈 Production Ready

### Enterprise Features
- **Security**: Built-in security measures
- **Performance**: Optimized for large codebases
- **Reliability**: Comprehensive error handling
- **Monitoring**: Real-time performance tracking
- **Logging**: Structured logging system
- **Configuration**: Flexible configuration management

### Scalability
- **Concurrent Processing**: Handle large codebases efficiently
- **Memory Management**: Optimized memory usage
- **File Size Limits**: Configurable file size handling
- **Progress Tracking**: Real-time progress monitoring
- **Resource Monitoring**: CPU and memory usage tracking

### Maintainability
- **TypeScript**: Full TypeScript support
- **Testing**: Comprehensive test coverage
- **Documentation**: Complete API documentation
- **Modular Design**: Clean, maintainable architecture
- **Extensible**: Easy to extend and customize

## 🎯 Zero Dependencies

Unlike other i18n tools that require external APIs or translation services, our CLI provides complete control over your translation workflow:

- **No AI APIs**: No dependency on OpenAI or other AI services
- **No Translation Services**: No dependency on Google Translate or similar
- **No External Costs**: No per-request charges or API limits
- **Complete Control**: Full control over translation quality and process
- **Offline Capable**: Works entirely offline
- **Privacy Focused**: No data sent to external services

## 🚀 Ready to Get Started?

Install the CLI and start extracting translations in minutes:

```bash
npm install -g @logistically/i18n-cli
i18n extract
```

Experience the most comprehensive i18n CLI for NestJS microservices! 🎉 