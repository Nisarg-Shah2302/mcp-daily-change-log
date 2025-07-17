#!/usr/bin/env node

/**
 * Deployment Tracking Script
 * 
 * Tracks deployments and generates release notes.
 * Usage: node track-deployment.js <version> [environment] [previousVersion] [repoPath] [changes]
 */

import chalk from 'chalk';
import { trackDeployment, listDeployments } from './lib/deploymentTracker.js';

// Parse command line arguments
const args = process.argv.slice(2);

// Check if we're listing deployments
if (args[0] === 'list') {
  const environment = args[1] || null;
  const limit = parseInt(args[2]) || 10;
  
  console.log(chalk.blue(`Listing deployments${environment ? ` for ${environment}` : ''}...`));
  
  listDeployments({ environment, limit })
    .then(deployments => {
      if (deployments.length === 0) {
        console.log(chalk.yellow('No deployments found.'));
        process.exit(0);
      }
      
      console.log(chalk.green(`Found ${deployments.length} deployments:`));
      deployments.forEach(d => {
        const date = new Date(d.timestamp).toLocaleDateString();
        console.log(chalk.cyan(`- ${d.version} to ${d.environment} on ${date}`));
      });
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('Error listing deployments:', error.message));
      process.exit(1);
    });
} else {
  // We're tracking a new deployment
  const version = args[0];
  const environment = args[1] || 'production';
  const previousVersion = args[2] || null;
  const repoPath = args[3] || process.cwd();
  const changes = args.slice(4) || [];
  
  if (!version) {
    console.error(chalk.red('Error: Version is required'));
    console.log(chalk.yellow('Usage: node track-deployment.js <version> [environment] [previousVersion] [repoPath] [changes...]'));
    console.log(chalk.yellow('   or: node track-deployment.js list [environment] [limit]'));
    process.exit(1);
  }
  
  console.log(chalk.blue(`Tracking deployment of version ${version} to ${environment}...`));
  
  trackDeployment({
    version,
    environment,
    previousVersion,
    repoPath,
    changes
  })
    .then(result => {
      if (result.success) {
        console.log(chalk.green('✅ Deployment tracked successfully!'));
        console.log(chalk.cyan(`Release notes saved to: ${result.releaseNotes.path}`));
        console.log(chalk.cyan(`Changelog entry added to: ${result.logEntry.filepath}`));
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
