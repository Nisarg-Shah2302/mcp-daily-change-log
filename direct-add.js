#!/usr/bin/env node

/**
 * Direct Add Script - No Temporary Files
 * 
 * This script directly adds entries to the change log without creating any temporary files.
 * Usage: node direct-add.js "header" "notes" [category] [tags]
 */

import { addDailyLogEntry } from './lib/dailyLogManager.js';
import chalk from 'chalk';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(chalk.yellow('Usage: node direct-add.js "header" "notes" [category] [tags]'));
  console.log(chalk.yellow('Example: node direct-add.js "My Header" "- Note 1\\n- Note 2" "Testing" "tag1,tag2"'));
  process.exit(1);
}

// Better argument parsing to handle quotes and multi-line content
let [header, notes, category, tags] = args;

// Handle escaped newlines in notes
if (notes) {
  notes = notes.replace(/\\n/g, '\n');
}

// Clean up header - remove bullet points if present
const cleanHeader = header.startsWith('- ') ? header.substring(2).trim() : header;

// Parse tags if provided
const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

try {
  const result = await addDailyLogEntry({
    header: cleanHeader,
    notes: notes,
    category: category || 'General',
    tags: tagArray,
    date: new Date()
  });

  console.log(chalk.green('✅ Entry added directly to change log!'));
  console.log(chalk.cyan(`File: ${result.filepath}`));
  console.log(chalk.cyan(`Header: ${result.header}`));
  console.log(chalk.cyan(`Notes: ${result.content.split('\n').filter(line => line.trim().startsWith('- ')).length}`));
  console.log(chalk.blue('✅ No temporary files created'));
  console.log(chalk.blue('✅ Professional formatting applied'));
  
} catch (error) {
  console.error(chalk.red('Error:', error.message));
  process.exit(1);
} 