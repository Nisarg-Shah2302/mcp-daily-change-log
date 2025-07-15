#!/usr/bin/env node

/**
 * Auto-Log Script - No Approval Required
 * 
 * This script creates a custom MCP tool that doesn't require approval
 * and properly writes to the change log file.
 */

import { addDailyLogEntry } from './lib/dailyLogManager.js';
import chalk from 'chalk';

// Function to automatically log work
export async function autoLogWork(header, notes, category = 'General', tags = []) {
  try {
    // Clean up header - remove bullet points if present
    const cleanHeader = header.startsWith('- ') ? header.substring(2).trim() : header;
    
    // Handle escaped newlines in notes
    if (notes) {
      notes = notes.replace(/\\n/g, '\n');
    }
    
    // Parse tags if provided as string
    const tagArray = Array.isArray(tags) ? tags : 
                    (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
    
    const result = await addDailyLogEntry({
      header: cleanHeader,
      notes: notes,
      category: category || 'General',
      tags: tagArray,
      date: new Date()
    });
    
    console.log(chalk.green('✅ Entry automatically added to change log!'));
    console.log(chalk.cyan(`File: ${result.filepath}`));
    console.log(chalk.cyan(`Header: ${result.header}`));
    
    return {
      success: true,
      filepath: result.filepath,
      header: result.header,
      date: result.date,
      tags: result.tags
    };
  } catch (error) {
    console.error(chalk.red('Error:', error.message));
    return {
      success: false,
      error: error.message
    };
  }
}

// Allow direct execution from command line
if (process.argv[1].endsWith('auto-log.js')) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(chalk.yellow('Usage: node auto-log.js "header" "notes" [category] [tags]'));
    console.log(chalk.yellow('Example: node auto-log.js "My Header" "- Note 1\\n- Note 2" "Testing" "tag1,tag2"'));
    process.exit(1);
  }
  
  const [header, notes, category, tags] = args;
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
  
  autoLogWork(header, notes, category, tagArray)
    .then(result => {
      if (result.success) {
        console.log(chalk.green('✅ Success!'));
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
}
