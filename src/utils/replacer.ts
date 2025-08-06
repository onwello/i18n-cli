import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { Logger } from './logger';
import { TranslationKey, ReplaceOptions } from '../types';

export class TranslationReplacer {
  private logger = Logger.getInstance();

  async replace(options: ReplaceOptions): Promise<void> {
    const {
      path: searchPath = '.',
      keysFile = 'translation-keys.json',
      backup = true,
      dryRun = false,
      verbose = false
    } = options;

    this.logger.setVerbose(verbose);
    this.logger.header('Translation String Replacement');
    this.logger.info(`Searching in: ${searchPath}`);
    this.logger.info(`Using keys from: ${keysFile}`);

    // Load translation keys
    const translationKeys = await this.loadTranslationKeys(keysFile);
    this.logger.info(`Loaded ${translationKeys.length} translation keys`);

    // Find TypeScript files
    const searchPattern = path.resolve(searchPath, '**/*.ts');
    const ignorePatterns = ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/*.spec.ts', '**/*.test.ts'];
    const tsFiles = await glob(searchPattern, { ignore: ignorePatterns });

    this.logger.info(`Found ${tsFiles.length} TypeScript files`);

    let totalReplacements = 0;
    const replacementSummary: Array<{ file: string; replacements: number }> = [];

    for (const file of tsFiles) {
      try {
        const replacements = await this.replaceInFile(file, translationKeys, { backup, dryRun });
        if (replacements > 0) {
          replacementSummary.push({ file, replacements });
          totalReplacements += replacements;
        }
      } catch (error) {
        this.logger.warning(`Error processing ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Continue processing other files instead of re-throwing
      }
    }

    this.logger.success(`Replacement completed! Total replacements: ${totalReplacements}`);
    
    if (replacementSummary.length > 0) {
      this.logger.section('Replacement Summary');
      this.logger.table(replacementSummary.map(item => ({
        File: item.file,
        'Replacements': item.replacements
      })));
    }
  }

  private async loadTranslationKeys(keysFile: string): Promise<TranslationKey[]> {
    try {
      const data = await fs.readJson(keysFile);
      return data.keys || [];
    } catch (error) {
      this.logger.error(`Error loading translation keys from ${keysFile}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.logger.info('Run translation extract first to generate translation keys');
      process.exit(1);
    }
  }

  private async replaceInFile(
    filePath: string, 
    translationKeys: TranslationKey[], 
    options: { backup: boolean; dryRun: boolean }
  ): Promise<number> {
    const { backup, dryRun } = options;
    const content = await fs.readFile(filePath, 'utf8');
    let newContent = content;
    let replacements = 0;

    // Create a map of text to translation key for efficient lookup
    const textToKeyMap = new Map<string, string>();
    translationKeys.forEach(key => {
      textToKeyMap.set(key.text, key.key);
    });

    // Replace patterns in order of specificity (most specific first)
    const patterns = [
      // Exception messages with object parameters
      {
        regex: /throw new (\w+Exception)\(['"`]([^'"`]+)['"`](?:,\s*\{[^}]+\})?\)/g,
        replacement: (match: string, exceptionType: string, text: string) => {
          const key = textToKeyMap.get(text);
          if (key) {
            return `throw new ${exceptionType}(this.translate('${key}'))`;
          }
          return match;
        }
      },
      // Simple exception messages
      {
        regex: /throw new (\w+Exception)\(['"`]([^'"`]+)['"`]\)/g,
        replacement: (match: string, exceptionType: string, text: string) => {
          const key = textToKeyMap.get(text);
          if (key) {
            return `throw new ${exceptionType}(this.translate('${key}'))`;
          }
          return match;
        }
      },
      // Return object messages - improved regex to handle multiline and complex structures
      {
        regex: /return\s*\{[^}]*message\s*:\s*['"`]([^'"`]+)['"`][^}]*\}/g,
        replacement: (match: string, text: string) => {
          const key = textToKeyMap.get(text);
          if (key) {
            return match.replace(/message\s*:\s*['"`][^'"`]+['"`]/, `message: this.translate('${key}')`);
          }
          return match;
        }
      },
      // Exception object messages
      {
        regex: /message\s*:\s*['"`]([^'"`]+)['"`]/g,
        replacement: (match: string, text: string) => {
          const key = textToKeyMap.get(text);
          if (key) {
            return `message: this.translate('${key}')`;
          }
          return match;
        }
      },
      // Template literals
      {
        regex: /errors\.push\(`([^`]+)`\)/g,
        replacement: (match: string, text: string) => {
          const key = textToKeyMap.get(text);
          if (key) {
            return `errors.push(this.translate('${key}'))`;
          }
          return match;
        }
      }
    ];

    // Apply each pattern
    patterns.forEach(pattern => {
      newContent = newContent.replace(pattern.regex, (match, ...args) => {
        const result = pattern.replacement(match, args[0], args[1]);
        if (result !== match) {
          replacements++;
          this.logger.debug(`Replaced in ${filePath}: "${args[0]}" -> "${result}"`);
        }
        return result;
      });
    });

    // Write the file if there were changes
    if (replacements > 0 && !dryRun) {
      if (backup) {
        const backupPath = `${filePath}.backup`;
        await fs.writeFile(backupPath, content);
        this.logger.debug(`Created backup: ${backupPath}`);
      }
      
      await fs.writeFile(filePath, newContent);
      this.logger.info(`Updated ${filePath} with ${replacements} replacements`);
    } else if (replacements > 0 && dryRun) {
      this.logger.info(`[DRY RUN] Would update ${filePath} with ${replacements} replacements`);
    } else if (replacements === 0) {
      this.logger.debug(`No replacements needed for ${filePath}`);
    }

    return replacements;
  }
} 