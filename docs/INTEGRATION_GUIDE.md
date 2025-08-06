# Integration Guide

> Complete guide for integrating @logistically/i18n-cli with @logistically/i18n

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Complete Workflow](#complete-workflow)
4. [NestJS Integration](#nestjs-integration)
5. [Microservices Setup](#microservices-setup)
6. [Translation Patterns](#translation-patterns)
7. [Best Practices](#best-practices)
8. [Advanced Integration](#advanced-integration)

## 🚀 Overview

The `@logistically/i18n-cli` is designed to work seamlessly with the `@logistically/i18n` library to provide a complete internationalization solution for NestJS microservices.

### 🔗 Library Relationship

- **@logistically/i18n**: Runtime translation library for NestJS microservices
- **@logistically/i18n-cli**: Development tool for managing translations

**Together they provide:**
- 🔍 **Extraction**: CLI extracts translatable strings from code
- 🏗️ **Generation**: CLI generates translation files
- 🔄 **Replacement**: CLI replaces hardcoded strings with keys
- 🌐 **Runtime**: Library handles translations at runtime
- 📊 **Monitoring**: Both tools provide monitoring and metrics

## 🏗️ Architecture

### Development Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Source Code   │───▶│  CLI Tool       │───▶│  Translation    │
│   (NestJS)      │    │  (Extract)      │    │  Files          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  CLI Tool       │    │  Runtime        │
                       │  (Generate)     │    │  Library        │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  CLI Tool       │    │  NestJS         │
                       │  (Replace)      │    │  Services       │
                       └─────────────────┘    └─────────────────┘
```

### Runtime Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Request  │───▶│  NestJS Module  │───▶│  Translation    │
│   (with locale) │    │  (with locale   │    │  Service        │
│                 │    │   detection)    │    │  (runtime)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Decorators     │    │  Translation    │
                       │  (Locale, T)    │    │  Files          │
                       └─────────────────┘    └─────────────────┘
```

## 🔄 Complete Workflow

### Step 1: Setup Project

```bash
# Install both libraries
npm install @logistically/i18n
npm install --save-dev @logistically/i18n-cli

# Or install CLI globally
npm install -g @logistically/i18n-cli
```

### Step 2: Configure NestJS Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      serviceName: 'user-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'ar', 'he'],
      translationsPath: 'src/translations',
      debug: false,
      fallbackStrategy: 'default',
      cache: { enabled: true, ttl: 3600 }
    })
  ]
})
export class AppModule {}
```

### Step 3: Write Services with Translation Keys

```typescript
// user.service.ts
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

  async createUser(data: CreateUserDto) {
    try {
      const user = await this.userRepository.create(data);
      // This will be extracted by the CLI
      return this.translationService.translate('USER.CREATED', { 
        userId: user.id,
        email: user.email 
      });
    } catch (error) {
      // This will be extracted by the CLI
      throw new T('USER.CREATION_FAILED', { 
        email: data.email, 
        error: error.message 
      });
    }
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new T('USER.NOT_FOUND', { userId });
    }

    try {
      const updatedUser = await this.userRepository.update(userId, data);
      return this.translationService.translate('PROFILE.UPDATED', { 
        userId,
        updatedFields: Object.keys(data).join(', ')
      });
    } catch (error) {
      throw new T('PROFILE.UPDATE_FAILED', { 
        userId, 
        error: error.message 
      });
    }
  }
}
```

### Step 4: Extract Translation Keys

```bash
# Extract from your NestJS services
i18n extract --patterns "*.ts" --ignore "node_modules/**,dist/**" --output translation-keys.json

# This will find and extract:
# - T('USER.NOT_FOUND', { userId: id })
# - this.translationService.translate('USER.CREATED', { userId: user.id, email: user.email })
# - T('USER.CREATION_FAILED', { email: data.email, error: error.message })
# - T('PROFILE.UPDATED', { userId, updatedFields: Object.keys(data).join(', ') })
# - T('PROFILE.UPDATE_FAILED', { userId, error: error.message })
```

### Step 5: Generate Translation Files

```bash
# Generate translation files for multiple languages
i18n generate --languages en,fr,es,ar --output src/translations --template
```

This creates:

```json
// src/translations/en.json
{
  "USER.NOT_FOUND": "User not found: ${userId}",
  "USER.CREATED": "User created successfully: ${userId} (${email})",
  "USER.CREATION_FAILED": "Failed to create user ${email}: ${error}",
  "PROFILE.UPDATED": "Profile updated for user ${userId}. Updated fields: ${updatedFields}",
  "PROFILE.UPDATE_FAILED": "Failed to update profile for user ${userId}: ${error}"
}

// src/translations/fr.json
{
  "USER.NOT_FOUND": "Utilisateur introuvable: ${userId}",
  "USER.CREATED": "Utilisateur créé avec succès: ${userId} (${email})",
  "USER.CREATION_FAILED": "Échec de la création de l'utilisateur ${email}: ${error}",
  "PROFILE.UPDATED": "Profil mis à jour pour l'utilisateur ${userId}. Champs mis à jour: ${updatedFields}",
  "PROFILE.UPDATE_FAILED": "Échec de la mise à jour du profil pour l'utilisateur ${userId}: ${error}"
}
```

### Step 6: Replace Hardcoded Strings (Optional)

```bash
# Preview changes
i18n replace --dry-run

# Apply changes
i18n replace --backup
```

### Step 7: Use in Runtime

```typescript
// The library automatically handles translations at runtime
// based on the locale detected from the request

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id') id: string) {
    // Locale is automatically detected from request headers/cookies
    // Translation is handled by the library
    return this.userService.findUser(id);
  }
}
```

## 🏗️ NestJS Integration

### Module Configuration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      serviceName: 'user-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'ar', 'he'],
      translationsPath: 'src/translations',
      debug: process.env.NODE_ENV === 'development',
      fallbackStrategy: 'default',
      cache: { 
        enabled: true, 
        ttl: 3600 
      },
      rtl: {
        enabled: true,
        locales: ['ar', 'he', 'fa', 'ur']
      }
    })
  ]
})
export class AppModule {}
```

### Service Integration

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
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

  async getUsers(filters: UserFilters) {
    const users = await this.userRepository.find(filters);
    const count = users.length;
    
    return {
      users,
      message: this.translationService.translate('USER.LIST_RETRIEVED', { 
        count,
        filters: Object.keys(filters).join(', ')
      })
    };
  }
}
```

### Controller Integration

```typescript
// user.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Locale } from '@logistically/i18n';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }
}
```

## 🏢 Microservices Setup

### Multi-Service Architecture

```bash
# Project structure
my-microservices/
├── auth-service/
│   ├── src/
│   │   ├── translations/
│   │   │   ├── en.json
│   │   │   ├── fr.json
│   │   │   └── ar.json
│   │   └── services/
│   │       └── auth.service.ts
│   └── package.json
├── user-service/
│   ├── src/
│   │   ├── translations/
│   │   │   ├── en.json
│   │   │   ├── fr.json
│   │   │   └── ar.json
│   │   └── services/
│   │       └── user.service.ts
│   └── package.json
└── payment-service/
    ├── src/
    │   ├── translations/
    │   │   ├── en.json
    │   │   ├── fr.json
    │   │   └── ar.json
    │   └── services/
    │       └── payment.service.ts
    └── package.json
```

### CLI Commands for Microservices

```bash
# Extract from all services
i18n extract ./auth-service ./user-service ./payment-service

# Generate for specific services
i18n generate --services auth,user,payment --languages en,fr,ar

# Replace across all services
i18n replace --services auth,user,payment --dry-run
```

### Service-Specific Configuration

```typescript
// auth-service/app.module.ts
TranslationModule.forRoot({
  serviceName: 'auth-service',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar'],
  translationsPath: 'src/translations',
  cache: { enabled: true, ttl: 1800 } // 30 minutes for auth
})

// user-service/app.module.ts
TranslationModule.forRoot({
  serviceName: 'user-service',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar', 'he'],
  translationsPath: 'src/translations',
  cache: { enabled: true, ttl: 3600 } // 1 hour for user data
})

// payment-service/app.module.ts
TranslationModule.forRoot({
  serviceName: 'payment-service',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar'],
  translationsPath: 'src/translations',
  cache: { enabled: true, ttl: 7200 } // 2 hours for payment data
})
```

## 🔍 Translation Patterns

### Exception Patterns

```typescript
// These patterns are automatically extracted by the CLI

// Basic exception
throw new T('USER.NOT_FOUND', { userId: id });

// Exception with complex parameters
throw new T('PAYMENT.PROCESSING_FAILED', { 
  orderId, 
  amount, 
  currency, 
  error: error.message 
});

// Exception with conditional parameters
throw new T('VALIDATION.INVALID_INPUT', { 
  field: fieldName,
  value: fieldValue,
  reason: validationError.message 
});
```

### Service Method Patterns

```typescript
// These patterns are automatically extracted by the CLI

// Basic translation
return this.translationService.translate('USER.CREATED', { userId: user.id });

// Translation with complex parameters
return this.translationService.translate('ORDER.CONFIRMED', {
  orderId,
  totalAmount,
  currency,
  estimatedDelivery: deliveryDate.toISOString()
});

// Translation with conditional logic
const message = this.translationService.translate('PROFILE.UPDATED', {
  userId,
  updatedFields: Object.keys(updates).join(', '),
  timestamp: new Date().toISOString()
});
```

### Decorator Patterns

```typescript
// These patterns are automatically extracted by the CLI

// Locale detection decorators
@Locale()
async findUser(@Param('id') id: string) { }

@LocaleFromJWT()
async updateProfile(@Param('id') id: string, @Body() data: any) { }

@LocaleFromHeaders()
async createUser(@Body() data: CreateUserDto) { }

@LocaleFromCookies()
async deleteUser(@Param('id') id: string) { }

@LocaleFromQuery()
async listUsers(@Query() filters: UserFilters) { }
```

## 🏆 Best Practices

### 1. Consistent Key Naming

```typescript
// Use consistent naming conventions
// Service.Action or Module.Action format

// Good
'USER.NOT_FOUND'
'PROFILE.UPDATED'
'PAYMENT.PROCESSING_FAILED'
'VALIDATION.INVALID_INPUT'

// Avoid
'user_not_found'
'profileUpdated'
'paymentProcessingFailed'
'validation.invalid.input'
```

### 2. Parameter Validation

```typescript
// Always validate parameters before using them in translations
async findUser(id: string) {
  if (!id || typeof id !== 'string') {
    throw new T('VALIDATION.INVALID_USER_ID', { id: String(id) });
  }

  const user = await this.userRepository.findById(id);
  if (!user) {
    throw new T('USER.NOT_FOUND', { userId: id });
  }
  return user;
}
```

### 3. Error Handling

```typescript
// Provide meaningful error messages with context
async processPayment(orderId: string, amount: number) {
  try {
    const result = await this.paymentProcessor.process(orderId, amount);
    return this.translationService.translate('PAYMENT.SUCCESS', {
      orderId,
      amount,
      transactionId: result.transactionId
    });
  } catch (error) {
    // Log the actual error for debugging
    this.logger.error('Payment processing failed', error);
    
    // Provide user-friendly error message
    throw new T('PAYMENT.FAILED', {
      orderId,
      amount,
      reason: this.getUserFriendlyError(error)
    });
  }
}
```

### 4. Caching Strategy

```typescript
// Configure appropriate cache TTL for different services
TranslationModule.forRoot({
  serviceName: 'auth-service',
  cache: { enabled: true, ttl: 1800 }, // 30 minutes
  // Auth data changes frequently
})

TranslationModule.forRoot({
  serviceName: 'user-service',
  cache: { enabled: true, ttl: 3600 }, // 1 hour
  // User data changes moderately
})

TranslationModule.forRoot({
  serviceName: 'payment-service',
  cache: { enabled: true, ttl: 7200 }, // 2 hours
  // Payment data is relatively static
})
```

### 5. RTL Support

```typescript
// Enable RTL support for appropriate languages
TranslationModule.forRoot({
  serviceName: 'user-service',
  supportedLocales: ['en', 'fr', 'es', 'ar', 'he', 'fa', 'ur'],
  rtl: {
    enabled: true,
    locales: ['ar', 'he', 'fa', 'ur']
  }
})
```

## 🔧 Advanced Integration

### Custom Extraction Patterns

```bash
# Extract specific patterns
i18n extract --custom-patterns "this.translate" --custom-patterns "T("

# Extract from specific decorators
i18n extract --custom-patterns "@Locale" --custom-patterns "@LocaleFromJWT"
```

### Environment-Specific Configuration

```typescript
// Development
TranslationModule.forRoot({
  serviceName: 'user-service',
  debug: true,
  cache: { enabled: false },
  fallbackStrategy: 'debug'
})

// Production
TranslationModule.forRoot({
  serviceName: 'user-service',
  debug: false,
  cache: { enabled: true, ttl: 3600 },
  fallbackStrategy: 'default'
})
```

### Monitoring and Metrics

```typescript
// Enable statistics tracking
TranslationModule.forRoot({
  serviceName: 'user-service',
  statistics: {
    enabled: true,
    trackMissingTranslations: true,
    trackUsage: true
  }
})

// Access statistics in your service
@Injectable()
export class UserService {
  constructor(private translationService: TranslationService) {}

  async getTranslationStats() {
    const stats = this.translationService.getStatistics();
    return {
      totalTranslations: stats.totalTranslations,
      missingTranslations: stats.missingTranslations,
      mostUsedKeys: stats.mostUsedKeys
    };
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/i18n.yml
name: Translation Management

on: [push, pull_request]

jobs:
  extract-translations:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install CLI
      run: npm install -g @logistically/i18n-cli
    
    - name: Extract translations
      run: i18n extract --validate --max-file-size 10
    
    - name: Generate translation files
      run: i18n generate --languages en,fr,es,ar --template
    
    - name: Commit translation files
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add src/translations/
        git commit -m "Update translation files" || exit 0
        git push
```

---

**For more information, see the [User Guide](./USER_GUIDE.md) or [API Reference](./API_REFERENCE.md).** 