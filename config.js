/**
 * Configuration for the MCP Daily Change Log
 */
export default {
  // Base directory for change logs
  changeLogDir: 'change-notes',
  
  // Default file format: YYYY-MM-DD-change-log.md
  fileFormat: '{date}-change-log.md',
  
  // Date format for file names
  dateFormat: 'YYYY-MM-DD',
  
  // Default header for new files
  defaultFileHeader: '# Daily Progress Report - {date}\n\n## Executive Summary\n\nThis document outlines the development activities and progress made on {date}.\n\n---\n\n',
  
  // Default categories for organizing notes
  categories: [
    'Feature Implementation',
    'Bug Fixes',
    'Documentation',
    'Refactoring',
    'Testing',
    'DevOps',
    'UI/UX',
    'Performance',
    'Security'
  ],
  
  // Template for new entries
  entryTemplate: '## {header}\n\n{notes}\n\n**Logged at:** {time}\n\n',
  
  // Template for PR descriptions
  prTemplate: '# {title}\n\n## Changes Made\n\n{changes}\n\n## Related Issues\n\n{issues}\n\n',
  
  // Auto-tagging rules (for future implementation)
  autoTagRules: {
    'bug': ['fix', 'issue', 'problem', 'error'],
    'feature': ['add', 'implement', 'create', 'new'],
    'docs': ['document', 'comment', 'readme'],
    'refactor': ['refactor', 'restructure', 'clean'],
    'test': ['test', 'spec', 'coverage'],
    'ui': ['design', 'layout', 'style', 'css', 'ui', 'ux'],
    'perf': ['performance', 'optimize', 'speed', 'fast'],
    'security': ['secure', 'auth', 'protect']
  }
};
