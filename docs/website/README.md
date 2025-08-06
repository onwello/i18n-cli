# Website Documentation

This directory contains the website-ready documentation for **@logistically/i18n-cli**. The structure is designed to work with static site generators like Lovable, Docusaurus, or similar tools.

## 📁 File Structure

```
docs/website/
├── index.md              # Landing page
├── quick-start.md        # Quick start guide
├── features.md           # Features overview
├── _meta.json           # Navigation structure
└── README.md            # This file
```

## 🎨 Content Structure

### Landing Page (`index.md`)
- Hero section with key value proposition
- Feature highlights with visual cards
- Quick start code examples
- Comparison table with other tools
- Call-to-action sections

### Quick Start (`quick-start.md`)
- Installation instructions
- Step-by-step extraction guide
- Code examples showing what gets extracted
- Generated file structure
- NestJS integration example
- Next steps and help resources

### Features (`features.md`)
- Comprehensive feature overview
- Enterprise capabilities
- Security features
- Performance optimization
- Configuration options
- Production readiness

### Navigation (`_meta.json`)
- Structured navigation menu
- Links to existing documentation
- GitHub repository link
- Organized by user journey

## 🚀 Deployment Options

### Lovable
The content is structured with frontmatter that works well with Lovable:
- YAML frontmatter for metadata
- Markdown content with proper headings
- Navigation structure in `_meta.json`

### Docusaurus
The structure is compatible with Docusaurus:
- Frontmatter with `sidebar_position`
- Proper heading hierarchy
- Navigation metadata

### Other Static Site Generators
The content can be easily adapted for:
- Nextra
- VitePress
- GitBook
- Custom solutions

## 📝 Content Guidelines

### Frontmatter
Each page includes:
- `title`: Page title
- `description`: Meta description
- `sidebar_position`: Navigation order (where applicable)

### Markdown Features
- Code blocks with syntax highlighting
- Tables for comparisons
- Emojis for visual appeal
- Internal links to documentation
- External links to GitHub

### Branding
- Consistent use of "Enterprise-Grade i18n CLI"
- Emphasis on NestJS microservices
- Highlighting unique advantages
- Professional, trustworthy tone

## 🎯 Key Messages

1. **Unique Value**: Only enterprise-grade i18n CLI for NestJS
2. **Comprehensive**: 12+ extraction patterns, no configuration needed
3. **Production Ready**: Security, validation, performance monitoring
4. **Zero Dependencies**: No external APIs or translation services
5. **NestJS Native**: Built specifically for microservices

## 📊 SEO Optimization

- Descriptive page titles
- Meta descriptions
- Proper heading hierarchy
- Internal linking structure
- Keyword optimization for "i18n CLI", "NestJS", "translation extraction"

## 🔄 Maintenance

- Keep content in sync with CLI features
- Update version numbers and examples
- Add new features to appropriate sections
- Maintain consistent branding and messaging

The website content is ready for deployment with any static site generator! 🚀 