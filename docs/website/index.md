---
title: "@logistically/i18n - Complete i18n Solution for NestJS"
description: "Enterprise-grade i18n CLI tool and runtime library for NestJS microservices. Extract, generate, and manage translations with built-in security and performance."
hero:
  title: "Complete i18n Solution for NestJS"
  subtitle: "CLI Tool + Runtime Library"
  description: "Extract, generate, and manage translations with enterprise-grade security, validation, and performance monitoring."
  cta:
    text: "Get Started"
    link: "/docs/quick-start"
  secondary:
    text: "View on GitHub"
    link: "https://github.com/logistically/i18n-cli"
---

# Complete i18n Solution for NestJS Microservices

**@logistically/i18n** provides a complete internationalization solution for NestJS microservices, combining a powerful CLI tool for extraction and generation with a robust runtime library for seamless integration.

## 🚀 Two Powerful Tools, One Complete Solution

<div class="products-grid">
  <div class="product-card">
    <h3>🛠️ @logistically/i18n-cli</h3>
    <p><strong>Enterprise-Grade CLI Tool</strong></p>
    <ul>
      <li>Extract translatable strings automatically</li>
      <li>Generate translation files for multiple languages</li>
      <li>Replace hardcoded strings with translation keys</li>
      <li>Built-in security and performance monitoring</li>
    </ul>
    <div class="product-cta">
      <a href="/docs/cli/quick-start" class="btn-primary">CLI Documentation</a>
    </div>
  </div>
  
  <div class="product-card">
    <h3>📚 @logistically/i18n</h3>
    <p><strong>Runtime i18n Library</strong></p>
    <ul>
      <li>Seamless NestJS integration</li>
      <li>RTL support and tree shaking</li>
      <li>Performance optimizations</li>
      <li>Type-safe translation decorators</li>
    </ul>
    <div class="product-cta">
      <a href="/docs/runtime/quick-start" class="btn-primary">Runtime Documentation</a>
    </div>
  </div>
</div>

## 🎯 Complete Workflow

### 1. Extract with CLI
```bash
# Install CLI tool
npm install -g @logistically/i18n-cli

# Extract translatable strings (finds them automatically!)
i18n extract

# Generate translation files
i18n generate

# Replace hardcoded strings
i18n replace
```

### 2. Use with Runtime Library
```typescript
// Install runtime library
npm install @logistically/i18n

// Use in your NestJS service
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

## 🔍 What the CLI Extracts Automatically

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

## 🏗️ Runtime Library Features

### NestJS Integration
- **Module Integration**: Easy setup with `TranslationModule`
- **Service Injection**: `TranslationService` for dynamic translations
- **Decorator Support**: `@T()` decorator for type-safe translations
- **Exception Handling**: Translated exceptions with context

### Advanced Features
- **RTL Support**: Right-to-left language support
- **Tree Shaking**: Optimized bundle sizes
- **Performance**: Caching and lazy loading
- **Type Safety**: Full TypeScript support

## 🏆 Why Choose @logistically/i18n?

| Feature | Our Solution | Other Tools |
|---------|--------------|-------------|
| **Complete Workflow** | ✅ CLI + Runtime | ❌ Separate tools |
| **NestJS Native** | ✅ Built for microservices | ❌ Generic solutions |
| **Enterprise Features** | ✅ Security, validation, monitoring | ❌ Basic functionality |
| **Extraction Patterns** | ✅ 12+ comprehensive patterns | ❌ Limited patterns |
| **Production Ready** | ✅ Built for enterprise | ❌ Development tools |
| **Zero Dependencies** | ✅ No external APIs required | ❌ AI/translation services |

## 🏢 Enterprise Features

### CLI Tool
- **Security**: Input validation, output sanitization, path security
- **Performance**: Concurrent processing, file size filtering, progress tracking
- **Validation**: Comprehensive error checking and warning systems
- **Logging**: Structured logging with multiple output formats
- **Monitoring**: Real-time performance metrics and resource usage

### Runtime Library
- **Type Safety**: Full TypeScript support with decorators
- **Performance**: Optimized caching and lazy loading
- **RTL Support**: Right-to-left language support
- **Tree Shaking**: Minimal bundle impact
- **Error Handling**: Translated exceptions with context

## 📚 Documentation

### CLI Tool
- **[CLI Quick Start](/docs/cli/quick-start)** - Get started with the CLI tool
- **[CLI User Guide](/docs/cli/user-guide)** - Complete CLI usage instructions
- **[CLI API Reference](/docs/cli/api-reference)** - CLI API documentation
- **[CLI Configuration](/docs/cli/configuration)** - CLI configuration options

### Runtime Library
- **[Runtime Quick Start](/docs/runtime/quick-start)** - Get started with the runtime library
- **[Runtime Integration Guide](/docs/runtime/integration-guide)** - NestJS integration examples
- **[Runtime API Reference](/docs/runtime/api-reference)** - Runtime API documentation
- **[Runtime Configuration](/docs/runtime/configuration)** - Runtime configuration options

### Shared Documentation
- **[Performance](/docs/performance)** - Optimization and monitoring
- **[Troubleshooting](/docs/troubleshooting)** - Common issues and solutions

## 🎉 Get Started Today

### Install Both Tools

```bash
# Install CLI tool
npm install -g @logistically/i18n-cli

# Install runtime library
npm install @logistically/i18n
```

### Start Extracting and Using Translations

```bash
# Extract translations
i18n extract

# Use in your NestJS service
import { TranslationService, T } from '@logistically/i18n';
```

Join the growing community of developers using the most comprehensive i18n solution for NestJS microservices! 🚀 