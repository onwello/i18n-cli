---
title: "Runtime Quick Start"
description: "Get started with @logistically/i18n runtime library"
sidebar_position: 1
---

# Runtime Library Quick Start

Get up and running with **@logistically/i18n** runtime library in minutes! This guide will walk you through setting up the library in your NestJS application.

## 🚀 Installation

```bash
npm install @logistically/i18n
```

## 🎯 Basic Setup

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      defaultLocale: 'en',
      locales: ['en', 'fr', 'de'],
      translationsPath: './src/translations'
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

### 2. Use in Your Service

```typescript
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

  async createUser(userData: CreateUserDto) {
    if (await this.userRepository.exists(userData.email)) {
      throw new T('USER.ALREADY_EXISTS', { email: userData.email });
    }
    
    const user = await this.userRepository.create(userData);
    return { message: this.translationService.translate('USER.CREATED') };
  }
}
```

## 🔧 Advanced Configuration

### Environment-based Configuration

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      defaultLocale: process.env.DEFAULT_LOCALE || 'en',
      locales: process.env.LOCALES?.split(',') || ['en', 'fr', 'de'],
      translationsPath: process.env.TRANSLATIONS_PATH || './src/translations',
      enableRTL: process.env.ENABLE_RTL === 'true',
      enableTreeShaking: process.env.ENABLE_TREE_SHAKING !== 'false'
    })
  ]
})
export class AppModule {}
```

### Async Configuration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TranslationModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultLocale: configService.get('DEFAULT_LOCALE', 'en'),
        locales: configService.get('LOCALES', 'en,fr,de').split(','),
        translationsPath: configService.get('TRANSLATIONS_PATH', './src/translations'),
        enableRTL: configService.get('ENABLE_RTL', false),
        enableTreeShaking: configService.get('ENABLE_TREE_SHAKING', true)
      }),
      inject: [ConfigService]
    })
  ]
})
export class AppModule {}
```

## 🎨 Translation Decorators

### Basic Translation

```typescript
import { T } from '@logistically/i18n';

@Injectable()
export class UserService {
  async findUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new T('USER.NOT_FOUND', { userId: id });
    }
    return user;
  }
}
```

### Service Method Translation

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService } from '@logistically/i18n';

@Injectable()
export class NotificationService {
  constructor(private translationService: TranslationService) {}

  async sendWelcomeEmail(user: User) {
    const subject = this.translationService.translate('EMAIL.WELCOME.SUBJECT');
    const body = this.translationService.translate('EMAIL.WELCOME.BODY', {
      name: user.name,
      activationLink: user.activationLink
    });
    
    await this.emailService.send(user.email, subject, body);
  }
}
```

## 🌐 RTL Support

### Enable RTL Languages

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      defaultLocale: 'en',
      locales: ['en', 'ar', 'he', 'fa'], // Arabic, Hebrew, Persian
      translationsPath: './src/translations',
      enableRTL: true
    })
  ]
})
export class AppModule {}
```

### RTL Utilities

```typescript
import { isRTL, getTextDirection } from '@logistically/i18n';

// Check if locale is RTL
const isArabicRTL = isRTL('ar'); // true

// Get text direction
const direction = getTextDirection('he'); // 'rtl'
```

## ⚡ Performance Features

### Tree Shaking

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      enableTreeShaking: true, // Only include used translations
      defaultLocale: 'en',
      locales: ['en', 'fr', 'de'],
      translationsPath: './src/translations'
    })
  ]
})
export class AppModule {}
```

### Caching

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      enableCaching: true,
      cacheTTL: 3600, // 1 hour
      defaultLocale: 'en',
      locales: ['en', 'fr', 'de'],
      translationsPath: './src/translations'
    })
  ]
})
export class AppModule {}
```

## 🏗️ Integration with CLI

### Complete Workflow

1. **Extract translations** with the CLI:
```bash
i18n extract
```

2. **Generate translation files**:
```bash
i18n generate
```

3. **Use in your NestJS service**:
```typescript
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

## ⚡ Next Steps

- **[Runtime Integration Guide](/docs/runtime/integration-guide)** - Advanced NestJS integration examples
- **[Runtime API Reference](/docs/runtime/api-reference)** - Complete API documentation
- **[Runtime Configuration](/docs/runtime/configuration)** - Advanced configuration options
- **[CLI Integration](/docs/cli/quick-start)** - Get started with the CLI tool

## 🆘 Need Help?

- **[Troubleshooting](/docs/troubleshooting)** - Common issues and solutions
- **[GitHub Issues](https://github.com/logistically/i18n/issues)** - Report bugs or request features
- **[Discussions](https://github.com/logistically/i18n/discussions)** - Ask questions and share experiences

Ready to add internationalization to your NestJS application? Start using the runtime library now! 🚀 