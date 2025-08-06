# Contributing Guide

> Complete guide for contributing to @logistically/i18n-cli

## 📖 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Pull Request Process](#pull-request-process)
7. [Code Review](#code-review)
8. [Release Process](#release-process)

## 🚀 Overview

We welcome contributions to the CLI! This guide helps you get started with development and ensures your contributions meet our standards.

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: Latest version
- **TypeScript**: Version 5 or higher

### Quick Start

```bash
# Fork and clone the repository
git clone https://github.com/your-username/i18n-cli.git
cd i18n-cli

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 🔧 Development Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/logistically/i18n-cli.git
cd i18n-cli

# Create a new branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install
```

### 2. Development Environment

```bash
# Install development dependencies
npm install --save-dev

# Set up pre-commit hooks
npm run setup-hooks

# Configure IDE settings
cp .vscode/settings.example.json .vscode/settings.json
```

### 3. Environment Configuration

```bash
# Create development configuration
cp .i18n-cli.json.example .i18n-cli.json

# Set development environment variables
export NODE_ENV=development
export LOG_LEVEL=debug
export ENABLE_DEBUG=true
```

### 4. Database Setup (if needed)

```bash
# Set up test database
npm run db:setup

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

## 📝 Coding Standards

### TypeScript Standards

**File Structure:**
```typescript
// Import statements
import { something } from 'package';

// Type definitions
interface MyInterface {
  property: string;
}

// Class definition
export class MyClass {
  private property: string;

  constructor(property: string) {
    this.property = property;
  }

  public method(): string {
    return this.property;
  }
}
```

**Naming Conventions:**
- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Interfaces**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types**: `PascalCase`

**Code Style:**
```typescript
// Good
const result = await processFile(filePath);
if (result.isValid) {
  return result.data;
}

// Bad
const result=await processFile(filePath);
if(result.isValid){return result.data;}
```

### Documentation Standards

**JSDoc Comments:**
```typescript
/**
 * Processes a file and extracts translation keys.
 * 
 * @param filePath - The path to the file to process
 * @param options - Processing options
 * @returns Promise resolving to extracted translation keys
 * 
 * @example
 * ```typescript
 * const keys = await extractKeys('/path/to/file.ts', {
 *   validate: true,
 *   maxFileSize: 50
 * });
 * ```
 */
export async function extractKeys(
  filePath: string,
  options: ExtractionOptions
): Promise<TranslationKey[]> {
  // Implementation
}
```

**README Updates:**
- Update relevant documentation when adding features
- Include examples for new functionality
- Update API reference if needed

### Git Standards

**Commit Messages:**
```bash
# Format: type(scope): description

# Examples
feat(extractor): add support for template literals
fix(validator): resolve path traversal issue
docs(readme): update installation instructions
test(performance): add memory usage tests
refactor(cli): simplify command structure
```

**Branch Naming:**
```bash
# Format: type/description

# Examples
feature/new-extraction-pattern
bugfix/validation-error
hotfix/security-vulnerability
docs/api-reference-update
test/performance-benchmarks
```

## 🧪 Testing

### Test Structure

```typescript
// src/__tests__/feature.spec.ts
import { Feature } from '../utils/feature';

describe('Feature', () => {
  let feature: Feature;

  beforeEach(() => {
    feature = new Feature();
  });

  describe('method()', () => {
    it('should process input correctly', async () => {
      // Arrange
      const input = 'test input';

      // Act
      const result = await feature.method(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const invalidInput = '';

      // Act & Assert
      await expect(feature.method(invalidInput)).rejects.toThrow();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/__tests__/feature.spec.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run performance tests
npm run test:performance

# Run security tests
npm run test:security
```

### Test Coverage

**Minimum Coverage Requirements:**
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

**Coverage Reports:**
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
npm run test:coverage:html

# Check coverage thresholds
npm run test:coverage:check
```

## 🔄 Pull Request Process

### 1. Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Ensure branch is up to date
git pull origin main
```

### 2. Make Changes

```bash
# Make your changes
# Add tests for new functionality
# Update documentation

# Stage changes
git add .

# Commit changes
git commit -m "feat(scope): add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

### 3. Create Pull Request

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### 4. PR Review Process

**Automated Checks:**
- [ ] Tests pass
- [ ] Code coverage meets requirements
- [ ] Linting passes
- [ ] TypeScript compilation succeeds
- [ ] Security scan passes

**Manual Review:**
- [ ] Code review by maintainers
- [ ] Documentation review
- [ ] Performance impact assessment
- [ ] Security review

## 👀 Code Review

### Review Guidelines

**What to Look For:**
- Code quality and readability
- Performance implications
- Security considerations
- Test coverage
- Documentation updates

**Review Comments:**
```markdown
# Good review comment
This approach looks good, but consider adding error handling for edge cases.

# Better review comment
This approach looks good, but consider adding error handling for edge cases:
- Network timeouts
- Invalid file formats
- Memory constraints

Here's a suggested implementation:
```typescript
try {
  // existing code
} catch (error) {
  logger.error('Processing failed', error);
  throw new ProcessingError('Failed to process file');
}
```
```

### Review Process

**Review Checklist:**
- [ ] Code follows style guidelines
- [ ] Tests are comprehensive
- [ ] Documentation is updated
- [ ] Performance is acceptable
- [ ] Security is considered
- [ ] No breaking changes (or documented)

## 🚀 Release Process

### 1. Version Bumping

```bash
# Bump version (patch, minor, major)
npm version patch
npm version minor
npm version major

# Or use conventional commits
npm run release
```

### 2. Release Preparation

```bash
# Build project
npm run build

# Run full test suite
npm run test:all

# Generate documentation
npm run docs:generate

# Create release notes
npm run release:notes
```

### 3. Release Steps

```bash
# Create release branch
git checkout -b release/v2.1.0

# Update version and changelog
npm version minor

# Build and test
npm run build
npm run test:all

# Create release
git tag v2.1.0
git push origin v2.1.0

# Merge to main
git checkout main
git merge release/v2.1.0
git push origin main

# Delete release branch
git branch -d release/v2.1.0
```

### 4. Post-Release

```bash
# Publish to npm
npm publish

# Update documentation
npm run docs:deploy

# Announce release
npm run release:announce
```

## 📚 Development Resources

### Useful Commands

```bash
# Development commands
npm run dev          # Start development server
npm run build        # Build project
npm run clean        # Clean build artifacts
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
npm run format       # Format code
npm run type-check   # TypeScript type checking
```

### Debugging

```bash
# Enable debug mode
DEBUG=* npm run dev

# Run with verbose logging
LOG_LEVEL=debug npm run dev

# Profile performance
npm run profile

# Memory profiling
npm run profile:memory
```

### Documentation

```bash
# Generate documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve

# Deploy documentation
npm run docs:deploy
```

## 🤝 Community Guidelines

### Communication

**Be Respectful:**
- Use inclusive language
- Be patient with newcomers
- Provide constructive feedback
- Respect different viewpoints

**Be Helpful:**
- Answer questions when possible
- Share knowledge and resources
- Mentor new contributors
- Document your work

### Contribution Areas

**We Welcome Contributions In:**
- Bug fixes and improvements
- New features and enhancements
- Documentation updates
- Test coverage improvements
- Performance optimizations
- Security enhancements

**Before Contributing:**
- Check existing issues and PRs
- Discuss major changes in issues
- Follow the coding standards
- Write comprehensive tests
- Update documentation

## 🆘 Getting Help

### Development Support

**Resources:**
- **Documentation**: [Complete docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/logistically/i18n-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/logistically/i18n-cli/discussions)
- **Wiki**: [Development Wiki](https://github.com/logistically/i18n-cli/wiki)

**Contact:**
- **Email**: [dev@logistically.com](mailto:dev@logistically.com)
- **Slack**: [Development Channel](https://logistically.slack.com)

### Mentorship

**For New Contributors:**
- Start with "good first issue" labels
- Ask questions in discussions
- Request code reviews
- Join community calls

---

**Thank you for contributing to @logistically/i18n-cli! 🎉** 