import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import config from '../config.js';
import { 
  toProfessionalHeader, 
  formatProfessionalNotes, 
  generateProfessionalSummary 
} from './professionalFormatter.js';

/**
 * Format a date according to the configured format
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return config.dateFormat.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

/**
 * Get the file path for a specific date's change log
 * @param {Date} date - Date for the change log
 * @returns {string} - Path to the change log file
 */
export function getChangeLogPath(date = new Date()) {
  const dateStr = formatDate(date);
  const fileName = config.fileFormat.replace('{date}', dateStr);
  return path.join(config.changeLogDir, fileName);
}

/**
 * Add an entry to today's change log
 * @param {object} options - Options for the entry
 * @param {string} options.notes - Notes to add (multi-line bullet points)
 * @param {string} [options.header] - Optional header for grouping notes
 * @param {string} [options.category] - Optional category from predefined list
 * @param {string[]} [options.tags] - Optional tags for the entry
 * @param {Date} [options.date] - Optional date (defaults to today)
 * @returns {Promise<object>} - Result of the operation
 */
export async function addDailyLogEntry({ notes, header, category, tags = [], date = new Date() }) {
  try {
    // Use category as header if provided and no header is specified
    const rawHeader = header || category || 'General Updates';
    console.log("🚀 ~ addDailyLogEntry ~ rawHeader:", rawHeader)
    
    // Apply professional formatting
    const entryHeader = toProfessionalHeader(rawHeader);
    const professionalNotes = formatProfessionalNotes(notes);
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = formatDate(date);
    
    // Get file path
    const filepath = getChangeLogPath(date);
    
    // Create content
    let content = '';
    
    // Create directory if it doesn't exist
    await fs.ensureDir(path.dirname(filepath));
    
    // Check if file exists
    const fileExists = await fs.pathExists(filepath);
    
    if (!fileExists) {
      // Create new file with header
      content += config.defaultFileHeader.replace('{date}', dateStr);
    }
    
    // Add entry
    content += config.entryTemplate
      .replace('{header}', entryHeader)
      .replace('{notes}', professionalNotes)
      .replace('{time}', timeStr);
    
    // Add tags if provided
    if (tags && tags.length > 0) {
      content += `**Tags:** ${tags.map(tag => `#${tag}`).join(', ')}\n\n`;
    }
    
    // Append to file
    await fs.appendFile(filepath, content);
    console.log(chalk.green(`✅ Professional entry added to ${filepath}`));
    
    return {
      success: true,
      filepath,
      content,
      date: dateStr,
      header: entryHeader,
      tags,
      originalHeader: rawHeader,
      originalNotes: notes
    };
  } catch (error) {
    console.error(chalk.red(`Error adding entry: ${error.message}`));
    throw error;
  }
}

/**
 * Get entries from a date range
 * @param {object} options - Options for retrieving entries
 * @param {Date} options.startDate - Start date
 * @param {Date} [options.endDate] - End date (defaults to today)
 * @param {string} [options.category] - Optional category filter
 * @param {string[]} [options.tags] - Optional tags filter
 * @returns {Promise<Array>} - Array of entries
 */
export async function getEntriesInDateRange({ startDate, endDate = new Date(), category, tags = [] }) {
  try {
    const entries = [];
    const currentDate = new Date(startDate);
    
    // Loop through each day in the range
    while (currentDate <= endDate) {
      const filepath = getChangeLogPath(currentDate);
      
      // Check if file exists
      if (await fs.pathExists(filepath)) {
        const content = await fs.readFile(filepath, 'utf8');
        const dateStr = formatDate(currentDate);
        
        // Parse entries from content
        const parsedEntries = parseEntriesFromContent(content, dateStr);
        
        // Filter by category if specified
        const filteredEntries = category 
          ? parsedEntries.filter(entry => entry.header === category)
          : parsedEntries;
          
        // Filter by tags if specified
        const tagFilteredEntries = tags.length > 0
          ? filteredEntries.filter(entry => {
              if (!entry.tags) return false;
              return tags.some(tag => entry.tags.includes(tag));
            })
          : filteredEntries;
        
        entries.push(...tagFilteredEntries);
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return entries;
  } catch (error) {
    console.error(chalk.red(`Error getting entries: ${error.message}`));
    throw error;
  }
}

/**
 * Parse entries from content
 * @param {string} content - File content
 * @param {string} dateStr - Date string
 * @returns {Array} - Array of entries
 */
function parseEntriesFromContent(content, dateStr) {
  const entries = [];
  const lines = content.split('\n');
  
  let currentHeader = null;
  let currentNotes = [];
  let currentTags = [];
  let entryStartLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a header line (## or ###)
    if (line.startsWith('## ')) {
      // If we have a previous entry, add it
      if (currentHeader && currentNotes.length > 0) {
        entries.push({
          date: dateStr,
          header: currentHeader,
          notes: currentNotes.join('\n'),
          tags: currentTags,
          lineRange: [entryStartLine, i - 1]
        });
      }
      
      // Start a new entry
      currentHeader = line.replace(/^## /, '');
      currentNotes = [];
      currentTags = [];
      entryStartLine = i;
    } 
    // Check if this is a note line (starts with -)
    else if (line.startsWith('- ')) {
      currentNotes.push(line);
    }
    // Check if this is a tags line
    else if (line.startsWith('Tags: ')) {
      currentTags = line.replace('Tags: ', '')
        .split(',')
        .map(tag => tag.trim().replace(/^#/, ''));
    }
  }
  
  // Add the last entry if there is one
  if (currentHeader && currentNotes.length > 0) {
    entries.push({
      date: dateStr,
      header: currentHeader,
      notes: currentNotes.join('\n'),
      tags: currentTags,
      lineRange: [entryStartLine, lines.length - 1]
    });
  }
  
  return entries;
}

/**
 * Generate a summary of daily logs
 * @param {object} options - Options for the summary
 * @param {Date} [options.startDate] - Start date (defaults to 7 days ago)
 * @param {Date} [options.endDate] - End date (defaults to today)
 * @param {boolean} [options.groupByDate] - Whether to group by date
 * @param {boolean} [options.groupByCategory] - Whether to group by category
 * @returns {Promise<object>} - Summary object
 */
export async function generateDailySummary({ 
  startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
  endDate = new Date(),
  groupByDate = true,
  groupByCategory = false
}) {
  try {
    const entries = await getEntriesInDateRange({ startDate, endDate });
    
    // Group entries
    let groupedEntries;
    
    if (groupByDate && groupByCategory) {
      // Group by date then by category
      groupedEntries = entries.reduce((acc, entry) => {
        if (!acc[entry.date]) {
          acc[entry.date] = {};
        }
        
        if (!acc[entry.date][entry.header]) {
          acc[entry.date][entry.header] = [];
        }
        
        acc[entry.date][entry.header].push(entry);
        return acc;
      }, {});
    } else if (groupByDate) {
      // Group by date only
      groupedEntries = entries.reduce((acc, entry) => {
        if (!acc[entry.date]) {
          acc[entry.date] = [];
        }
        
        acc[entry.date].push(entry);
        return acc;
      }, {});
    } else if (groupByCategory) {
      // Group by category only
      groupedEntries = entries.reduce((acc, entry) => {
        if (!acc[entry.header]) {
          acc[entry.header] = [];
        }
        
        acc[entry.header].push(entry);
        return acc;
      }, {});
    } else {
      // No grouping
      groupedEntries = entries;
    }
    
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      totalEntries: entries.length,
      entries: groupedEntries
    };
  } catch (error) {
    console.error(chalk.red(`Error generating summary: ${error.message}`));
    throw error;
  }
}

/**
 * Generate a markdown report from daily logs
 * @param {object} options - Options for the report
 * @param {Date} [options.startDate] - Start date (defaults to 7 days ago)
 * @param {Date} [options.endDate] - End date (defaults to today)
 * @param {string} [options.title] - Report title
 * @param {boolean} [options.includeStats] - Whether to include statistics
 * @returns {Promise<string>} - Markdown report
 */
export async function generateMarkdownReport({
  startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate = new Date(),
  title = 'Weekly Change Log Report',
  includeStats = true
}) {
  try {
    const summary = await generateDailySummary({ 
      startDate, 
      endDate, 
      groupByDate: true,
      groupByCategory: true 
    });
    
    let markdown = `# ${title}\n\n`;
    markdown += `**Period**: ${summary.startDate} to ${summary.endDate}\n\n`;
    
    if (includeStats) {
      markdown += `**Total Entries**: ${summary.totalEntries}\n\n`;
      
      // Count entries by category
      const categoryCounts = {};
      Object.values(summary.entries).forEach(dateEntries => {
        Object.keys(dateEntries).forEach(category => {
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
          }
          categoryCounts[category] += dateEntries[category].length;
        });
      });
      
      markdown += '## Summary by Category\n\n';
      Object.entries(categoryCounts).forEach(([category, count]) => {
        markdown += `- **${category}**: ${count} entries\n`;
      });
      markdown += '\n';
    }
    
    // Add entries grouped by date
    Object.entries(summary.entries).forEach(([date, dateEntries]) => {
      markdown += `## ${date}\n\n`;
      
      Object.entries(dateEntries).forEach(([category, entries]) => {
        markdown += `### ${category}\n\n`;
        
        entries.forEach(entry => {
          markdown += `${entry.notes}\n\n`;
          
          if (entry.tags && entry.tags.length > 0) {
            markdown += `Tags: ${entry.tags.map(tag => `#${tag}`).join(', ')}\n\n`;
          }
        });
      });
    });
    
    return markdown;
  } catch (error) {
    console.error(chalk.red(`Error generating markdown report: ${error.message}`));
    throw error;
  }
}
