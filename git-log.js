#!/usr/bin/env node

/**
 * Git Log Script
 * 
 * Generates changelog entries from git commits.
 * Usage: node git-log.js [since] [repoPath] [header] [category] [tags]
 */

import chalk from 'chalk';
import { generateChangelogFromGit } from './lib/gitIntegration.js';

// Parse command line arguments
const args = process.argv.slice(2);
const since = args[0] || '1 day ago';
const repoPath = args[1] || process.cwd();
const header = args[2] || 'Git Commit Summary';
const category = args[3] || 'Development';
const tags = args[4] ? args[4].split(',') : ['git', 'automated'];

console.log(chalk.blue(`Generating changelog from git commits since ${since}...`));

generateChangelogFromGit({
  since,
  repoPath,
  header,
  category,
  tags
})
  .then(result => {
    if (result.success) {
      console.log(chalk.green('✅ Changelog generated and added to daily log!'));
      console.log(chalk.cyan(`File: ${result.filepath}`));
      console.log(chalk.cyan(`Header: ${result.header}`));
      process.exit(0);
    } else {
      console.error(chalk.red(`Error: ${result.error}`));
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(chalk.red('Unexpected error:', error.message));
    process.exit(1);
  });
