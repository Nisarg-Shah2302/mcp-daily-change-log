/**
 * Git Integration Module
 * 
 * Provides functionality to extract git commit information and generate
 * changelog entries automatically from git history.
 */

import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import { autoLogWork } from '../auto-log.js';

// Promisify exec for easier async/await usage
const execPromise = promisify(exec);

/**
 * Extract git commit information and auto-generate changelog entries
 * @param {string} since - Time range for commits (e.g., '1 day ago', '1 week ago')
 * @param {string} repoPath - Path to the git repository (defaults to current directory)
 * @returns {Promise<Array>} - Array of commit objects
 */
export async function generateFromGitCommits(since = '1 day ago', repoPath = process.cwd()) {
  try {
    // Change to the repository directory
    const originalDir = process.cwd();
    process.chdir(repoPath);
    
    // Get git commits
    const { stdout } = await execPromise(`git log --since="${since}" --pretty=format:"%h|%s|%an|%ad|%ae"`);
    
    // Change back to original directory
    process.chdir(originalDir);
    
    // If no commits, return empty array
    if (!stdout.trim()) {
      return [];
    }
    
    // Parse commits
    return stdout.split('\n').map(commit => {
      const [hash, subject, author, date, email] = commit.split('|');
      return { hash, subject, author, date, email };
    });
  } catch (error) {
    console.error(chalk.red(`Error generating from git commits: ${error.message}`));
    return [];
  }
}

/**
 * Group commits by type based on conventional commit format
 * @param {Array} commits - Array of commit objects
 * @returns {Object} - Grouped commits
 */
export function groupCommitsByType(commits) {
  const groups = {
    feat: [],
    fix: [],
    docs: [],
    style: [],
    refactor: [],
    perf: [],
    test: [],
    build: [],
    ci: [],
    chore: [],
    revert: [],
    other: []
  };
  
  const typeRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s(.+)$/;
  
  commits.forEach(commit => {
    const match = commit.subject.match(typeRegex);
    if (match) {
      const type = match[1];
      commit.parsedType = type;
      commit.parsedScope = match[2] ? match[2].replace(/[()]/g, '') : '';
      commit.parsedSubject = match[3];
      groups[type].push(commit);
    } else {
      groups.other.push(commit);
    }
  });
  
  return groups;
}

/**
 * Format commits into a changelog entry
 * @param {Object} groupedCommits - Commits grouped by type
 * @returns {string} - Formatted changelog entry
 */
export function formatCommitsAsChangelog(groupedCommits) {
  const typeLabels = {
    feat: 'New Features',
    fix: 'Bug Fixes',
    docs: 'Documentation',
    style: 'Code Style',
    refactor: 'Refactoring',
    perf: 'Performance',
    test: 'Testing',
    build: 'Build System',
    ci: 'CI/CD',
    chore: 'Chores',
    revert: 'Reverts',
    other: 'Other Changes'
  };
  
  let changelog = '';
  
  Object.entries(groupedCommits).forEach(([type, commits]) => {
    if (commits.length === 0) return;
    
    changelog += `### ${typeLabels[type]}\n\n`;
    
    commits.forEach(commit => {
      const scope = commit.parsedScope ? `**${commit.parsedScope}:** ` : '';
      const subject = commit.parsedSubject || commit.subject;
      changelog += `- ${scope}${subject} ([${commit.hash.substring(0, 7)}](commit/${commit.hash}))\n`;
    });
    
    changelog += '\n';
  });
  
  return changelog;
}

/**
 * Generate a changelog entry from git commits and add it to the daily log
 * @param {Object} options - Options for generating the changelog
 * @param {string} options.since - Time range for commits (e.g., '1 day ago')
 * @param {string} options.repoPath - Path to the git repository
 * @param {string} options.header - Header for the changelog entry
 * @param {string} options.category - Category for the changelog entry
 * @param {Array} options.tags - Tags for the changelog entry
 * @returns {Promise<Object>} - Result of adding the entry
 */
export async function generateChangelogFromGit({
  since = '1 day ago',
  repoPath = process.cwd(),
  header = 'Git Commit Summary',
  category = 'Development',
  tags = ['git', 'automated']
}) {
  try {
    // Get commits
    const commits = await generateFromGitCommits(since, repoPath);
    
    if (commits.length === 0) {
      console.log(chalk.yellow('No commits found in the specified time range.'));
      return { success: false, error: 'No commits found' };
    }
    
    // Group commits by type
    const groupedCommits = groupCommitsByType(commits);
    
    // Format commits as changelog
    let changelog = formatCommitsAsChangelog(groupedCommits);
    
    // Add summary line
    changelog = `Generated from ${commits.length} git commits since ${since}.\n\n${changelog}`;
    
    // Add to daily log
    return await autoLogWork(header, changelog, category, tags);
  } catch (error) {
    console.error(chalk.red(`Error generating changelog from git: ${error.message}`));
    return { success: false, error: error.message };
  }
}

/**
 * Get the current git branch
 * @param {string} repoPath - Path to the git repository
 * @returns {Promise<string>} - Current branch name
 */
export async function getCurrentBranch(repoPath = process.cwd()) {
  try {
    const originalDir = process.cwd();
    process.chdir(repoPath);
    
    const { stdout } = await execPromise('git rev-parse --abbrev-ref HEAD');
    
    process.chdir(originalDir);
    return stdout.trim();
  } catch (error) {
    console.error(chalk.red(`Error getting current branch: ${error.message}`));
    return 'unknown';
  }
}
