#!/usr/bin/env node

/**
 * Git Hooks Installation Script
 * 
 * This script installs the git hooks to automatically log git activities
 * without requiring manual command approval each time.
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Get the repository root directory
let repoRoot;
try {
  repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch (error) {
  console.error(chalk.red('Error: Not a git repository. Please run this script from within a git repository.'));
  process.exit(1);
}

// Source and destination directories
const sourceDir = path.join(process.cwd(), 'hooks');
const destDir = path.join(repoRoot, '.git', 'hooks');

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(chalk.red(`Error: Hooks directory not found at ${sourceDir}`));
  process.exit(1);
}

// Ensure destination directory exists
fs.ensureDirSync(destDir);

// List of hooks to install
const hooks = [
  'post-commit',
  'post-merge',
  'post-checkout'
];

// Install each hook
hooks.forEach(hook => {
  const sourcePath = path.join(sourceDir, hook);
  const destPath = path.join(destDir, hook);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(chalk.yellow(`Warning: Hook ${hook} not found in source directory. Skipping.`));
    return;
  }
  console.log(chalk.blue(`Installing ${hook} hook...`));
  
  try {
    // Copy the hook file
    fs.copySync(sourcePath, destPath);
    
    // Make it executable
    fs.chmodSync(destPath, 0o755);
    
    console.log(chalk.green(`✅ Installed ${hook} hook`));
  } catch (error) {
    console.error(chalk.red(`Error installing ${hook} hook: ${error.message}`));
  }
});

// Create a symlink for the post-deploy hook in a more accessible location
const postDeploySource = path.join(sourceDir, 'post-deploy');
const postDeployDest = path.join(repoRoot, 'post-deploy.sh');

if (fs.existsSync(postDeploySource)) {
  try {
    // Copy instead of symlink for better compatibility
    fs.copySync(postDeploySource, postDeployDest);
    fs.chmodSync(postDeployDest, 0o755);
    console.log(chalk.green(`✅ Created post-deploy script at ${postDeployDest}`));
  } catch (error) {
    console.error(chalk.red(`Error creating post-deploy script: ${error.message}`));
  }
}

// Create a .gitignore entry to ignore the post-deploy script
const gitignorePath = path.join(repoRoot, '.gitignore');
try {
  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  if (!gitignoreContent.includes('post-deploy.sh')) {
    fs.appendFileSync(gitignorePath, '\n# Deployment script\npost-deploy.sh\n');
    console.log(chalk.green('✅ Added post-deploy.sh to .gitignore'));
  }
} catch (error) {
  console.error(chalk.yellow(`Warning: Could not update .gitignore: ${error.message}`));
}

// Update package.json to add the install-hooks script
const packageJsonPath = path.join(repoRoot, 'package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the install-hooks script if it doesn't exist
  if (!packageJson.scripts['install-hooks']) {
    packageJson.scripts['install-hooks'] = 'node install-hooks.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('✅ Added install-hooks script to package.json'));
  }
} catch (error) {
  console.error(chalk.yellow(`Warning: Could not update package.json: ${error.message}`));
}

console.log(chalk.blue('\n📌 Installation Complete!'));
console.log(chalk.blue('Git activities will now be automatically logged without requiring command approval.'));
console.log(chalk.blue('\nTo use the deployment hook in your CI/CD pipeline:'));
console.log(chalk.cyan('  ./post-deploy.sh <version> <environment> [previous_version]'));
console.log(chalk.blue('\nExample:'));
console.log(chalk.cyan('  ./post-deploy.sh v1.0.0 production v0.9.0'));
