---
title: "Features"
description: "Comprehensive features of @logistically/i18n CLI tool and runtime library"
sidebar_position: 2
---

# Features

**@logistically/i18n** provides a complete internationalization solution for NestJS microservices, combining a powerful CLI tool for extraction and generation with a robust runtime library for seamless integration.

## 🛠️ CLI Tool Features

### 🔍 Comprehensive Extraction

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

### 🛡️ Enterprise Security

- **Input Validation**: Path traversal prevention, file type validation
- **Output Sanitization**: HTML/script tag removal, XSS protection
- **Security Monitoring**: Real-time security alerts, audit logging
- **Configuration Validation**: Comprehensive security checks

### ⚡ Performance Optimization

- **Concurrent Processing**: Parallel file processing with configurable limits
- **File Size Management**: Configurable file size limits and memory optimization
- **Real-time Monitoring**: Execution time tracking, progress bars
- **Resource Monitoring**: CPU and memory usage tracking

### 🔧 Advanced Configuration

- **Environment-based Settings**: Flexible configuration via environment variables
- **Configuration Files**: JSON-based configuration with validation
- **Command-line Overrides**: Runtime configuration overrides
- **Multiple Output Formats**: Text, JSON, file, and combined logging

## 📚 Runtime Library Features

### 🏗️ NestJS Integration

- **Module Integration**: Easy setup with `TranslationModule.forRoot()`
- **Service Injection**: `TranslationService` for dynamic translations
- **Decorator Support**: `@T()` decorator for type-safe translations
- **Exception Handling**: Translated exceptions with context

### 🌐 Advanced Language Support

- **RTL Support**: Right-to-left language support (Arabic, Hebrew, Persian)
- **Multiple Locales**: Support for unlimited languages
- **Locale Detection**: Automatic locale detection and fallback
- **Text Direction**: Utilities for RTL/LTR text direction

### ⚡ Performance Features

- **Tree Shaking**: Only include used translations in bundle
- **Caching**: Configurable caching with TTL
- **Lazy Loading**: Load translations on demand
- **Memory Optimization**: Efficient memory usage for large translation sets

### 🎨 Developer Experience

- **Type Safety**: Full TypeScript support with decorators
- **IntelliSense**: Complete IDE support and autocomplete
- **Error Handling**: Comprehensive error handling and recovery
- **Debugging**: Built-in debugging utilities

## 🏆 Complete Solution Advantages

### Unified Workflow

Unlike other i18n solutions that require separate tools, our solution provides:

1. **Extract** with CLI: `i18n extract`
2. **Generate** translation files: `i18n generate`
3. **Replace** hardcoded strings: `i18n replace`
4. **Use** in NestJS: `import { TranslationService, T } from '@logistically/i18n'`

### Enterprise Ready

Both tools are built for enterprise use:

- **Security**: Built-in security measures and validation
- **Performance**: Optimized for large codebases and high traffic
- **Reliability**: Comprehensive error handling and recovery
- **Monitoring**: Real-time performance tracking and logging
- **Scalability**: Handle growing applications and teams

### Zero Dependencies

Unlike other i18n tools that require external APIs:

- **No AI APIs**: No dependency on OpenAI or other AI services
- **No Translation Services**: No dependency on Google Translate or similar
- **No External Costs**: No per-request charges or API limits
- **Complete Control**: Full control over translation quality and process
- **Offline Capable**: Works entirely offline
- **Privacy Focused**: No data sent to external services

## 📊 Comparison with Other Solutions

| Feature | @logistically/i18n | FormatJS | React-i18next | vue-i18n |
|---------|-------------------|----------|---------------|----------|
| **Complete Workflow** | ✅ CLI + Runtime | ❌ CLI only | ❌ Runtime only | ❌ Runtime only |
| **NestJS Native** | ✅ Built for microservices | ❌ React-specific | ❌ React-specific | ❌ Vue-specific |
| **Enterprise Features** | ✅ Security, validation, monitoring | ❌ Basic functionality | ❌ Basic functionality | ❌ Basic functionality |
| **Extraction Patterns** | ✅ 12+ comprehensive patterns | ✅ Limited patterns | ❌ Manual extraction | ❌ Manual extraction |
| **Production Ready** | ✅ Built for enterprise | ✅ Mature | ✅ Mature | ✅ Mature |
| **Zero Dependencies** | ✅ No external APIs | ✅ | ✅ | ✅ |
| **RTL Support** | ✅ Built-in | ✅ | ✅ | ✅ |
| **Tree Shaking** | ✅ Optimized | ✅ | ❌ | ❌ |

## 🎯 Use Cases

### Microservices Architecture

Perfect for NestJS microservices that need:
- Consistent translation management across services
- Automated extraction and generation
- Type-safe translation usage
- Performance optimization

### Enterprise Applications

Built for enterprise applications requiring:
- Security and validation
- Performance monitoring
- Comprehensive logging
- Scalable architecture

### Multi-language Applications

Ideal for applications supporting:
- Multiple languages and locales
- RTL languages (Arabic, Hebrew, Persian)
- Dynamic language switching
- Context-aware translations

### Development Teams

Great for teams that need:
- Automated translation workflow
- Type-safe development
- Comprehensive documentation
- Easy onboarding

## 🚀 Ready to Get Started?

Install both tools and start building internationalized NestJS applications:

```bash
# Install CLI tool
npm install -g @logistically/i18n-cli

# Install runtime library
npm install @logistically/i18n

# Extract translations
i18n extract

# Use in your NestJS service
import { TranslationService, T } from '@logistically/i18n';
```

Experience the most comprehensive i18n solution for NestJS microservices! 🎉 