import fs from 'fs-extra';
import path from 'path';
import { Logger } from './logger';
import { TranslationKey, GenerationOptions, ServiceTranslation } from '../types';

export class TranslationGenerator {
  private logger = Logger.getInstance();
  private defaultLanguages = ['en', 'fr', 'es', 'de', 'ar'];

  async generate(options: GenerationOptions): Promise<void> {
    const {
      input = 'translation-keys.json',
      languages = this.defaultLanguages,
      template = false,
      verbose = false
    } = options;

    this.logger.setVerbose(verbose);
    this.logger.header('Translation File Generation');

    // Load translation keys
    const translationData = await this.loadTranslationKeys(input);
    this.logger.info(`Loaded ${translationData.keys.length} translation keys`);

    // Group keys by service
    const serviceTranslations = this.groupByService(translationData.keys);
    this.logger.info(`Found ${serviceTranslations.length} services`);

    // Don't generate files if there are no keys
    if (translationData.keys.length === 0) {
      this.logger.info('No translation keys found, skipping file generation');
      return;
    }

    // Generate translation files for each service
    for (const serviceTranslation of serviceTranslations) {
      await this.generateServiceTranslations(serviceTranslation, languages, template);
    }

    this.logger.success('Translation files generated successfully!');
  }

  private async loadTranslationKeys(inputFile: string): Promise<{ keys: TranslationKey[] }> {
    try {
      const data = await fs.readJson(inputFile);
      return data;
    } catch (error) {
      this.logger.error(`Error loading translation keys from ${inputFile}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.logger.info('Run translation-extract first to generate translation keys');
      // Return empty data instead of throwing
      return { keys: [] };
    }
  }

  private groupByService(keys: TranslationKey[]): ServiceTranslation[] {
    const serviceMap = new Map<string, TranslationKey[]>();

    keys.forEach(key => {
      const serviceName = key.file.split(path.sep)[0];
      if (!serviceMap.has(serviceName)) {
        serviceMap.set(serviceName, []);
      }
      serviceMap.get(serviceName)!.push(key);
    });

    return Array.from(serviceMap.entries()).map(([serviceName, serviceKeys]) => ({
      serviceName,
      translations: this.createTranslationObject(serviceKeys),
      totalKeys: serviceKeys.length
    }));
  }

  private createTranslationObject(keys: TranslationKey[]): Record<string, string> {
    const translations: Record<string, string> = {};
    keys.forEach(key => {
      translations[key.key] = key.text;
    });
    return translations;
  }

  private async generateServiceTranslations(
    serviceTranslation: ServiceTranslation,
    languages: string[],
    template: boolean
  ): Promise<void> {
    const { serviceName, translations, totalKeys } = serviceTranslation;
    
    this.logger.section(`Generating translations for ${serviceName}`);
    this.logger.info(`Total keys: ${totalKeys}`);

    // Create translations directory
    const translationsDir = path.join(serviceName, 'src', 'translations');
    await fs.ensureDir(translationsDir);

    // Generate English translations (source)
    const enFile = path.join(translationsDir, 'en.json');
    await fs.writeFile(enFile, JSON.stringify(translations, null, 2));
    this.logger.success(`Generated ${enFile} with ${totalKeys} translations`);

    // Generate other language templates
    if (template) {
      for (const lang of languages) {
        if (lang === 'en') continue; // Skip English as it's already generated

        const langFile = path.join(translationsDir, `${lang}.json`);
        const templateTranslations = this.createTemplateTranslations(translations, lang);
        
        await fs.writeFile(langFile, JSON.stringify(templateTranslations, null, 2));
        this.logger.info(`Generated template ${langFile}`);
      }
    }

    // Generate README
    await this.generateReadme(serviceName, translationsDir, totalKeys, languages);
  }

  private createTemplateTranslations(translations: Record<string, string>, lang: string): Record<string, string> {
    const template: Record<string, string> = {};
    
    Object.entries(translations).forEach(([key, value]) => {
      template[key] = `TODO: Translate "${value}" to ${lang}`;
    });

    return template;
  }

  private async generateReadme(
    serviceName: string,
    translationsDir: string,
    totalKeys: number,
    languages: string[]
  ): Promise<void> {
    const readmeContent = `# ${serviceName} Translation Files

This directory contains translation files for the ${serviceName} service.

## Files

${languages.map(lang => `- \`${lang}.json\` - ${lang === 'en' ? `${lang} translations (${totalKeys} keys)` : `${lang} translations (template)`}`).join('\n')}

## Usage

\`\`\`typescript
import { TranslationService } from '@logistically/i18n';

const translationService = new TranslationService({
  serviceName: '${serviceName}',
  defaultLocale: 'en',
  supportedLocales: ${JSON.stringify(languages)},
  translationsPath: 'src/translations'
});

const message = translationService.translate(
  'EXAMPLE_KEY',
  'fr',
  { fieldName: 'email' }
);
\`\`\`

## Translation Status

${languages.map(lang => {
  const status = lang === 'en' ? `${totalKeys} translations (100%)` : '0 translations (0%)';
  return `- **${lang.toUpperCase()}**: ${status}`;
}).join('\n')}

## How to Translate

1. Open the language file you want to translate (e.g., \`fr.json\`)
2. Replace the TODO comments with actual translations
3. Keep the translation keys unchanged
4. Test your translations using the TranslationService

## Example

\`\`\`json
{
  "AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS": "TODO: Translate \"User already exists with this email or phone\" to fr"
}
\`\`\`

Should become:

\`\`\`json
{
  "AUTH.AUTH_SERVICE.EXCEPTION.USER_ALREADY_EXISTS": "Un utilisateur existe déjà avec cet email ou ce téléphone"
}
\`\`\`

## Generated by

This file was generated by @onwello/translation-cli on ${new Date().toISOString()}
`;

    const readmeFile = path.join(translationsDir, 'README.md');
    await fs.writeFile(readmeFile, readmeContent);
    this.logger.info(`Generated ${readmeFile}`);
  }
} 