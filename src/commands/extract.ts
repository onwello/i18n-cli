#!/usr/bin/env node

import { Command } from 'commander';
import { TranslationExtractor } from '../utils/extractor';
import { Logger } from '../utils/logger';
import fs from 'fs-extra';

const logger = Logger.getInstance();

// Extracted business logic for better testability
export async function extractTranslationKeys(options: {
  path: string;
  output: string;
  ignore: string;
  verbose: boolean;
}): Promise<void> {
  const extractor = new TranslationExtractor();
  
  const ignorePatterns = options.ignore.split(',').map((pattern: string) => pattern.trim());
  
  const strings = await extractor.extract({
    path: options.path,
    ignore: ignorePatterns,
    verbose: options.verbose
  });

  // Save to output file
  const outputData = {
    keys: strings,
    totalKeys: strings.length,
    services: [...new Set(strings.map(s => s.file.split('/')[0]))],
    generatedAt: new Date().toISOString()
  };

  await fs.writeJson(options.output, outputData, { spaces: 2 });
  logger.success(`Translation keys saved to ${options.output}`);

  // Also save as CSV for easy viewing
  const csvFile = options.output.replace('.json', '.csv');
  const csvContent = [
    'Key,Text,Type,File,Line',
    ...strings.map(s => `"${s.key}","${s.text}","${s.type}","${s.file}",${s.line}`)
  ].join('\n');
  
  await fs.writeFile(csvFile, csvContent);
  logger.info(`CSV file saved to ${csvFile}`);
}

export function createExtractCommand(): Command {
  const command = new Command('extract')
    .description('Extract translatable strings from TypeScript files')
    .option('-p, --path <path>', 'Path to search for TypeScript files', '.')
    .option('-o, --output <file>', 'Output file for translation keys', 'translation-keys.json')
    .option('-i, --ignore <patterns>', 'Ignore patterns (comma-separated)', '**/node_modules/**,**/dist/**,**/coverage/**,**/*.spec.ts,**/*.test.ts')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
      try {
        await extractTranslationKeys(options);
      } catch (error) {
        logger.error(`Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Handle error gracefully without exiting
      }
    });

  return command;
} 