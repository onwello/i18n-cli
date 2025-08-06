#!/usr/bin/env node

import { Command } from 'commander';
import { TranslationReplacer } from '../utils/replacer';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export async function replaceTranslationStrings(options: {
  path: string;
  keysFile: string;
  backup: boolean;
  dryRun: boolean;
  verbose: boolean;
}): Promise<void> {
  const replacer = new TranslationReplacer();
  
  await replacer.replace({
    path: options.path,
    keysFile: options.keysFile,
    backup: options.backup,
    dryRun: options.dryRun,
    verbose: options.verbose
  });
}

export function createReplaceCommand(): Command {
  const command = new Command('replace')
    .description('Replace hardcoded strings with translation keys in TypeScript files')
    .option('-p, --path <path>', 'Path to search for TypeScript files', '.')
    .option('-k, --keys-file <file>', 'Translation keys file', 'translation-keys.json')
    .option('--no-backup', 'Skip creating backup files')
    .option('--dry-run', 'Show what would be replaced without making changes')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
      try {
        await replaceTranslationStrings(options);
      } catch (error) {
        logger.error(`Replacement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Handle error gracefully without exiting
      }
    });

  return command;
} 