---
title: "CLI Quick Start"
description: "Get started with @logistically/i18n-cli in minutes"
sidebar_position: 1
---

# CLI Quick Start Guide

Get up and running with **@logistically/i18n-cli** in minutes! This guide will walk you through installing the CLI and extracting your first translations.

## 🚀 Installation

### Global Installation (Recommended)

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

## 🎯 Your First Extraction

The CLI comes with comprehensive built-in patterns that automatically detect translatable text - no configuration needed!

### 1. Extract Translation Keys

```bash
# Extract from current directory (finds hardcoded strings automatically!)
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

## 🔍 What Gets Extracted Automatically

The CLI intelligently detects and extracts these patterns from your code:

### Exception Messages
```typescript
throw new Error("User not found"); // ✅ Extracted
throw new BadRequestException("Invalid input"); // ✅ Extracted
```

### Service Messages
```typescript
this.translationService.translate("USER.CREATED"); // ✅ Extracted
```

### String Literals
```typescript
const message = "User profile updated successfully"; // ✅ Extracted
```

### Template Literals
```typescript
const welcome = `Welcome ${user.name}!`; // ✅ Extracted
```

### Object Properties
```typescript
return { message: "User created successfully" }; // ✅ Extracted
```

### Error Arrays
```typescript
errors.push(`Validation failed`); // ✅ Extracted
```

## 📁 Generated Files

After running the extraction, you'll get:

```
translation-keys.json          # Extracted translation keys
src/translations/
├── en.json                   # English translations
├── fr.json                   # French translations
├── de.json                   # German translations
└── README.md                 # Translation documentation
```

## 🏗️ Integration with Runtime Library

Use the extracted translations with your NestJS service:

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

- **[CLI User Guide](/docs/cli/user-guide)** - Complete CLI usage instructions
- **[CLI Configuration](/docs/cli/configuration)** - Advanced configuration options
- **[CLI API Reference](/docs/cli/api-reference)** - Detailed CLI API documentation
- **[Runtime Integration](/docs/runtime/quick-start)** - Get started with the runtime library

## 🆘 Need Help?

- **[Troubleshooting](/docs/troubleshooting)** - Common issues and solutions
- **[GitHub Issues](https://github.com/onwello/i18n-cli/issues)** - Report bugs or request features
- **[Discussions](https://github.com/onwello/i18n-cli/discussions)** - Ask questions and share experiences

Ready to transform your i18n workflow? Start extracting translations now! 🚀 