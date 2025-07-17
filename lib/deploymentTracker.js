/**
 * Deployment Tracker Module
 * 
 * Provides functionality to track deployments and generate release notes.
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { autoLogWork } from '../auto-log.js';
import { formatDate } from './dailyLogManager.js';
import { generateFromGitCommits, formatCommitsAsChangelog, groupCommitsByType } from './gitIntegration.js';

// Path to store deployment history
const DEPLOYMENTS_DIR = path.join(process.cwd(), 'deployments');

/**
 * Ensure deployments directory exists
 */
async function ensureDeploymentsDir() {
  await fs.ensureDir(DEPLOYMENTS_DIR);
}

/**
 * Get deployment history file path
 * @returns {string} - Path to deployment history file
 */
function getDeploymentHistoryPath() {
  return path.join(DEPLOYMENTS_DIR, 'deployment-history.json');
}

/**
 * Load deployment history
 * @returns {Promise<Array>} - Array of deployment objects
 */
export async function loadDeploymentHistory() {
  try {
    await ensureDeploymentsDir();
    const historyPath = getDeploymentHistoryPath();
    
    if (await fs.pathExists(historyPath)) {
      const data = await fs.readFile(historyPath, 'utf8');
      return JSON.parse(data);
    }
    
    return [];
  } catch (error) {
    console.error(chalk.red(`Error loading deployment history: ${error.message}`));
    return [];
  }
}

/**
 * Save deployment history
 * @param {Array} history - Array of deployment objects
 * @returns {Promise<boolean>} - Success status
 */
async function saveDeploymentHistory(history) {
  try {
    await ensureDeploymentsDir();
    const historyPath = getDeploymentHistoryPath();
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    return true;
  } catch (error) {
    console.error(chalk.red(`Error saving deployment history: ${error.message}`));
    return false;
  }
}

/**
 * Track a deployment and generate release notes
 * @param {Object} options - Deployment options
 * @param {string} options.environment - Deployment environment (e.g., 'production', 'staging')
 * @param {string} options.version - Version being deployed
 * @param {string} options.repoPath - Path to the git repository
 * @param {string} options.previousVersion - Previous version for comparison
 * @param {Array} options.changes - Manual list of changes
 * @returns {Promise<Object>} - Result object
 */
export async function trackDeployment({
  environment = 'production',
  version,
  repoPath = process.cwd(),
  previousVersion = null,
  changes = []
}) {
  try {
    // Validate required fields
    if (!version) {
      throw new Error('Version is required');
    }
    
    // Get current timestamp
    const timestamp = new Date();
    
    // Load existing deployment history
    const history = await loadDeploymentHistory();
    
    // Find previous deployment if not specified
    if (!previousVersion && history.length > 0) {
      const previousDeployments = history
        .filter(d => d.environment === environment)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      if (previousDeployments.length > 0) {
        previousVersion = previousDeployments[0].version;
      }
    }
    
    // Get git commits since previous deployment
    let commits = [];
    if (previousVersion) {
      try {
        const originalDir = process.cwd();
        process.chdir(repoPath);
        
        // Get commits between versions
        const { stdout } = await import('util').then(util => 
          util.promisify(require('child_process').exec)
          (`git log ${previousVersion}..HEAD --pretty=format:"%h|%s|%an|%ad|%ae"`)
        );
        
        process.chdir(originalDir);
        
        if (stdout.trim()) {
          commits = stdout.split('\n').map(commit => {
            const [hash, subject, author, date, email] = commit.split('|');
            return { hash, subject, author, date, email };
          });
        }
      } catch (error) {
        console.warn(chalk.yellow(`Could not get commits between versions: ${error.message}`));
        // Fall back to getting recent commits
        commits = await generateFromGitCommits('1 week ago', repoPath);
      }
    } else {
      // No previous version, get recent commits
      commits = await generateFromGitCommits('1 week ago', repoPath);
    }
    
    // Create deployment object
    const deployment = {
      environment,
      version,
      previousVersion,
      timestamp: timestamp.toISOString(),
      commits: commits.map(c => c.hash),
      manualChanges: changes
    };
    
    // Add to history
    history.push(deployment);
    await saveDeploymentHistory(history);
    
    // Generate release notes
    const releaseNotes = await generateReleaseNotes(version);
    
    // Add deployment entry to changelog
    const formattedDate = formatDate(timestamp);
    const header = `Deployment: ${version} to ${environment}`;
    
    let notes = `## Version ${version} deployed to ${environment}\n\n`;
    notes += `**Date:** ${formattedDate}\n`;
    notes += `**Previous Version:** ${previousVersion || 'None'}\n\n`;
    
    if (commits.length > 0) {
      const groupedCommits = groupCommitsByType(commits);
      notes += formatCommitsAsChangelog(groupedCommits);
    }
    
    if (changes.length > 0) {
      notes += '### Manual Changes\n\n';
      changes.forEach(change => {
        notes += `- ${change}\n`;
      });
    }
    
    // Add to daily log
    const result = await autoLogWork(
      header,
      notes,
      'Deployment',
      ['deployment', environment, `v${version}`, 'release']
    );
    
    return {
      success: true,
      deployment,
      releaseNotes,
      logEntry: result
    };
  } catch (error) {
    console.error(chalk.red(`Error tracking deployment: ${error.message}`));
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate release notes for a specific version
 * @param {string} version - Version to generate notes for
 * @returns {Promise<Object>} - Release notes object
 */
export async function generateReleaseNotes(version) {
  try {
    // Load deployment history
    const history = await loadDeploymentHistory();
    
    // Find deployment for this version
    const deployment = history.find(d => d.version === version);
    
    if (!deployment) {
      throw new Error(`Deployment for version ${version} not found`);
    }
    
    // Generate markdown content
    let markdown = `# Release Notes: Version ${version}\n\n`;
    markdown += `**Released:** ${new Date(deployment.timestamp).toLocaleDateString()}\n\n`;
    
    if (deployment.previousVersion) {
      markdown += `**Previous Version:** ${deployment.previousVersion}\n\n`;
    }
    
    // Add commit information if available
    if (deployment.commits && deployment.commits.length > 0) {
      // This would require fetching the full commit information again
      // For simplicity, we'll just list the commit hashes
      markdown += `## Changes\n\n`;
      markdown += `This release includes ${deployment.commits.length} commits.\n\n`;
    }
    
    // Add manual changes
    if (deployment.manualChanges && deployment.manualChanges.length > 0) {
      markdown += `## Highlighted Changes\n\n`;
      deployment.manualChanges.forEach(change => {
        markdown += `- ${change}\n`;
      });
    }
    
    // Save release notes to file
    await ensureDeploymentsDir();
    const releaseNotesPath = path.join(DEPLOYMENTS_DIR, `release-notes-${version}.md`);
    await fs.writeFile(releaseNotesPath, markdown);
    
    return {
      version,
      markdown,
      path: releaseNotesPath
    };
  } catch (error) {
    console.error(chalk.red(`Error generating release notes: ${error.message}`));
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List all deployments
 * @param {Object} options - Filter options
 * @param {string} options.environment - Filter by environment
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} - Array of deployment objects
 */
export async function listDeployments({ environment = null, limit = 10 } = {}) {
  try {
    const history = await loadDeploymentHistory();
    
    let filtered = history;
    
    if (environment) {
      filtered = filtered.filter(d => d.environment === environment);
    }
    
    return filtered
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error(chalk.red(`Error listing deployments: ${error.message}`));
    return [];
  }
}
