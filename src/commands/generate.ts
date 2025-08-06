#!/usr/bin/env node

import { Command } from 'commander';
import { TranslationGenerator } from '../utils/generator';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

// Extracted business logic for better testability
export async function generateTranslationFiles(options: {
  input: string;
  languages: string;
  template: boolean;
  verbose: boolean;
}): Promise<void> {
  const generator = new TranslationGenerator();
  
  const languages = options.languages.split(',').map((lang: string) => lang.trim());
  
  await generator.generate({
    input: options.input,
    languages,
    template: options.template,
    verbose: options.verbose
  });
}

export function createGenerateCommand(): Command {
  const command = new Command('generate')
    .description('Generate translation files for each service')
    .option('-i, --input <file>', 'Input translation keys file', 'translation-keys.json')
    .option('-l, --languages <languages>', 'Languages to generate (comma-separated)', 'en,fr,es,de,ar')
    .option('--no-template', 'Skip generating template files for other languages')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
      try {
        await generateTranslationFiles(options);
      } catch (error) {
        logger.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Handle error gracefully without exiting
      }
    });

  return command;
} 