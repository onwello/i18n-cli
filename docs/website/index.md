---
title: "@logistically/i18n-cli - Enterprise-Grade i18n CLI for NestJS"
description: "The most comprehensive i18n CLI for NestJS microservices. Built for scale, security, and performance."
hero:
  title: "Enterprise-Grade i18n CLI"
  subtitle: "The most comprehensive i18n CLI for NestJS microservices"
  description: "Extract, generate, and manage translations with enterprise-grade security, validation, and performance monitoring."
  cta:
    text: "Get Started"
    link: "/docs/quick-start"
  secondary:
    text: "View on GitHub"
    link: "https://github.com/logistically/i18n-cli"
---

# The Most Comprehensive i18n CLI for NestJS Microservices

**@logistically/i18n-cli** is the only enterprise-grade internationalization CLI tool built specifically for NestJS microservices. Unlike other i18n tools that are React-specific or lack enterprise features, our CLI provides comprehensive extraction, generation, and management capabilities with built-in security, validation, and performance monitoring.

## 🚀 Why Choose @logistically/i18n-cli?

<div class="features-grid">
  <div class="feature-card">
    <h3>🔍 Comprehensive Extraction</h3>
    <p>12+ built-in patterns automatically detect translatable text in your codebase - no configuration needed!</p>
  </div>
  
  <div class="feature-card">
    <h3>🛡️ Enterprise Security</h3>
    <p>Built-in input validation, output sanitization, and security monitoring for production environments.</p>
  </div>
  
  <div class="feature-card">
    <h3>⚡ Performance Optimized</h3>
    <p>Concurrent processing, file size filtering, and real-time progress tracking for large codebases.</p>
  </div>
  
  <div class="feature-card">
    <h3>🏗️ NestJS Native</h3>
    <p>Designed specifically for NestJS microservices with seamless integration with @logistically/i18n.</p>
  </div>
  
  <div class="feature-card">
    <h3>🔧 Zero Dependencies</h3>
    <p>No external APIs or translation services required - complete control over your translation workflow.</p>
  </div>
  
  <div class="feature-card">
    <h3>📊 Production Ready</h3>
    <p>Comprehensive logging, error handling, and monitoring built for enterprise use.</p>
  </div>
</div>

## 🎯 Quick Start

```bash
# Install globally
npm install -g @logistically/i18n-cli

# Extract translatable strings (finds them automatically!)
i18n extract

# Generate translation files
i18n generate

# Replace hardcoded strings with translation keys
i18n replace
```

## 📊 Comparison with Other Tools

| Feature | @logistically/i18n-cli | FormatJS CLI | Lobe i18n | Tenado i18n |
|---------|------------------------|--------------|-----------|-------------|
| **Framework Support** | ✅ Any TS/JS + NestJS native | ❌ React-only | ❌ Generic | ❌ Chinese-focused |
| **Enterprise Features** | ✅ Security, validation, monitoring | ❌ Basic extraction | ❌ AI-powered only | ❌ Basic |
| **Extraction Patterns** | ✅ 12+ comprehensive patterns | ✅ Limited patterns | ❌ Basic | ✅ Chinese only |
| **Production Ready** | ✅ Built for enterprise | ✅ Mature | ❌ Development | ❌ Basic |
| **NestJS Integration** | ✅ Native support | ❌ No NestJS focus | ❌ No NestJS focus | ❌ No NestJS focus |
| **No Dependencies** | ✅ No external APIs | ✅ | ❌ Requires AI API | ❌ Requires translation API |

## 🔍 What Gets Extracted Automatically

The CLI intelligently detects and extracts:

- **Exception Messages**: `throw new Error("User not found")`
- **Service Messages**: `this.translationService.translate("USER.CREATED")`
- **Decorator Messages**: `@T("USER.VALIDATION.REQUIRED")`
- **String Literals**: `"User profile updated successfully"`
- **Template Literals**: `` `Welcome ${user.name}!` ``
- **Object Properties**: `message: "User created successfully"`
- **Return Objects**: `return { message: "Operation successful" }`
- **Error Arrays**: `errors.push(\`Validation failed\`)`
- **NestJS Exceptions**: All built-in exception types

## 🏢 Enterprise Features

- **Security**: Input validation, output sanitization, path security
- **Performance**: Concurrent processing, file size filtering, progress tracking
- **Validation**: Comprehensive error checking and warning systems
- **Logging**: Structured logging with multiple output formats
- **Monitoring**: Real-time performance metrics and resource usage
- **Configuration**: Environment-based and command-line configurable settings

## 📚 Documentation

- **[Quick Start Guide](/docs/quick-start)** - Get up and running in minutes
- **[User Guide](/docs/user-guide)** - Complete usage instructions
- **[API Reference](/docs/api-reference)** - Detailed API documentation
- **[Integration Guide](/docs/integration-guide)** - NestJS integration examples
- **[Configuration](/docs/configuration)** - Advanced configuration options
- **[Performance](/docs/performance)** - Optimization and monitoring
- **[Troubleshooting](/docs/troubleshooting)** - Common issues and solutions

## 🎉 Get Started Today

Ready to transform your i18n workflow? Install the CLI and start extracting translations in minutes:

```bash
npm install -g @logistically/i18n-cli
i18n extract
```

Join the growing community of developers using the most comprehensive i18n CLI for NestJS microservices! 🚀 