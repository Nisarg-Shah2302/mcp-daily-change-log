/**
 * Professional Text Formatter for Client-Ready Output
 * Converts casual language to professional, client-appropriate language
 */
console.log("Testttt")
const professionalTerms = {
  // Casual to Professional verb mappings
  'fixed': 'resolved',
  'broke': 'identified issue with',
  'worked on': 'developed',
  'did': 'completed',
  'made': 'implemented',
  'added': 'integrated',
  'updated': 'enhanced',
  'changed': 'modified',
  'tested': 'validated',
  'checked': 'verified',
  'looked at': 'analyzed',
  'went through': 'reviewed',
  'tried': 'attempted',
  'got': 'obtained',
  'put': 'placed',
  'took': 'extracted',
  'found': 'identified',
  'saw': 'observed',
  'started': 'initiated',
  'finished': 'completed',
  'stopped': 'concluded',
  'kept': 'maintained',
  'let': 'allowed',
  'helped': 'assisted',
  'told': 'informed',
  'asked': 'requested',
  'said': 'stated',
  'thought': 'determined',
  'knew': 'recognized',
  'felt': 'assessed',
  'wanted': 'required',
  'liked': 'approved',
  'hated': 'identified concerns with',
  'loved': 'successfully implemented',
  'needed': 'required',
  'used': 'utilized',
  'had': 'possessed',
  'got': 'acquired',
  'gave': 'provided',
  'took': 'received',
  'came': 'arrived',
  'went': 'proceeded',
  'left': 'departed',
  'stayed': 'remained',
  'became': 'transformed into',
  'seemed': 'appeared',
  'looked': 'appeared',
  'sounded': 'indicated',
  'felt': 'demonstrated',
  'tasted': 'indicated',
  'smelled': 'suggested'
};

const professionalPhrases = {
  // Common casual phrases to professional equivalents
  'figured out': 'determined',
  'came up with': 'developed',
  'went ahead': 'proceeded',
  'ended up': 'resulted in',
  'turned out': 'demonstrated',
  'picked up': 'acquired',
  'set up': 'configured',
  'cleaned up': 'optimized',
  'messed up': 'encountered issue with',
  'screwed up': 'identified error in',
  'fucked up': 'encountered significant issue with',
  'kicked off': 'initiated',
  'wrapped up': 'completed',
  'knocked out': 'accomplished',
  'pulled off': 'successfully executed',
  'brought up': 'raised',
  'brought in': 'introduced',
  'brought out': 'highlighted',
  'brought down': 'reduced',
  'brought back': 'restored',
  'brought forward': 'advanced',
  'brought together': 'consolidated',
  'brought up to speed': 'updated',
  'brought to attention': 'highlighted',
  'brought to light': 'revealed',
  'sort of': 'somewhat',
  'kind of': 'somewhat',
  'pretty much': 'essentially',
  'basically': 'fundamentally',
  'actually': 'specifically',
  'really': 'significantly',
  'super': 'extremely',
  'awesome': 'excellent',
  'great': 'excellent',
  'good': 'satisfactory',
  'bad': 'suboptimal',
  'terrible': 'requiring improvement',
  'horrible': 'requiring significant improvement',
  'amazing': 'exceptional',
  'incredible': 'remarkable',
  'unbelievable': 'noteworthy',
  'crazy': 'unusual',
  'insane': 'remarkable',
  'wild': 'unexpected',
  'weird': 'unusual',
  'strange': 'atypical',
  'funny': 'interesting',
  'cool': 'innovative',
  'hot': 'current',
  'cold': 'inactive',
  'fast': 'efficient',
  'slow': 'requiring optimization',
  'big': 'substantial',
  'small': 'minor',
  'huge': 'significant',
  'tiny': 'minimal'
};

const professionalHeaders = {
  // Common header transformations
  'bug fix': 'Issue Resolution',
  'bug fixes': 'Issue Resolution',
  'feature': 'Feature Implementation',
  'feature work': 'Feature Development',
  'ui work': 'User Interface Enhancement',
  'ui': 'User Interface',
  'frontend': 'Frontend Development',
  'backend': 'Backend Development',
  'api': 'API Development',
  'database': 'Database Management',
  'testing': 'Quality Assurance',
  'deployment': 'Deployment Management',
  'docs': 'Documentation',
  'documentation': 'Documentation Enhancement',
  'meeting': 'Team Coordination',
  'meetings': 'Team Coordination',
  'review': 'Code Review',
  'reviews': 'Code Review',
  'planning': 'Project Planning',
  'research': 'Technical Research',
  'analysis': 'Technical Analysis',
  'optimization': 'Performance Optimization',
  'refactoring': 'Code Refactoring',
  'security': 'Security Implementation',
  'maintenance': 'System Maintenance',
  'setup': 'System Configuration',
  'configuration': 'System Configuration',
  'integration': 'System Integration',
  'migration': 'Data Migration',
  'update': 'System Update',
  'updates': 'System Updates',
  'upgrade': 'System Upgrade',
  'upgrades': 'System Upgrades',
  'client work': 'Client Deliverables',
  'client update': 'Client Communication',
  'client communication': 'Client Communication',
  'sprint work': 'Sprint Development',
  'sprint': 'Sprint Activities',
  'daily work': 'Daily Development',
  'misc': 'Miscellaneous Tasks',
  'miscellaneous': 'Miscellaneous Tasks',
  'general': 'General Development',
  'other': 'Additional Tasks'
};

/**
 * Convert casual text to professional format
 * @param {string} text - The text to convert
 * @returns {string} - Professionally formatted text
 */
export function toProfessionalText(text) {
  if (!text) return text;
  
  let professional = text;
  
  // Replace professional terms (case-insensitive)
  for (const [casual, formal] of Object.entries(professionalTerms)) {
    const regex = new RegExp(`\\b${casual}\\b`, 'gi');
    professional = professional.replace(regex, formal);
  }
  
  // Replace professional phrases (case-insensitive)
  for (const [casual, formal] of Object.entries(professionalPhrases)) {
    const regex = new RegExp(casual, 'gi');
    professional = professional.replace(regex, formal);
  }
  
  // Capitalize first letter of sentences
  professional = professional.replace(/^(.)/, (match) => match.toUpperCase());
  professional = professional.replace(/\. (.)/g, (match, letter) => '. ' + letter.toUpperCase());
  
  return professional;
}

/**
 * Convert casual header to professional format
 * @param {string} header - The header to convert
 * @returns {string} - Professionally formatted header
 */
export function toProfessionalHeader(header) {
  if (!header) return header;
  
  const lower = header.toLowerCase().trim();
  
  // Check for exact matches first
  if (professionalHeaders[lower]) {
    return professionalHeaders[lower];
  }
  
  // Apply text transformations
  let professional = toProfessionalText(header);
  
  // Capitalize each word for headers
  professional = professional.replace(/\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return professional;
}

/**
 * Format notes into professional bullet points
 * @param {string} notes - The notes to format
 * @returns {string} - Professionally formatted notes
 */
export function formatProfessionalNotes(notes) {
  if (!notes) return notes;
  
  const lines = notes.split('\n').map(line => line.trim()).filter(line => line);
  const formattedLines = [];
  
  for (let line of lines) {
    // Ensure line starts with bullet point
    if (!line.startsWith('- ')) {
      line = `- ${line}`;
    }
    
    // Remove the bullet point for processing
    const content = line.substring(2).trim();
    
    // Apply professional formatting
    const professional = toProfessionalText(content);
    
    // Ensure proper capitalization and punctuation
    const capitalized = professional.charAt(0).toUpperCase() + professional.slice(1);
    const withPeriod = capitalized.endsWith('.') ? capitalized : capitalized + '.';
    
    formattedLines.push(`- ${withPeriod}`);
  }
  
  return formattedLines.join('\n');
}

/**
 * Generate a professional summary from notes
 * @param {Array} entries - Array of log entries
 * @returns {string} - Professional summary
 */
export function generateProfessionalSummary(entries) {
  if (!entries || entries.length === 0) {
    return 'No activities recorded for this period.';
  }
  
  const categories = [...new Set(entries.map(entry => entry.header))];
  const totalTasks = entries.reduce((sum, entry) => {
    return sum + (entry.notes.split('\n').filter(line => line.trim().startsWith('- ')).length);
  }, 0);
  
  let summary = `During this period, ${totalTasks} development tasks were completed across ${categories.length} main areas:\n\n`;
  
  categories.forEach(category => {
    const categoryEntries = entries.filter(entry => entry.header === category);
    const taskCount = categoryEntries.reduce((sum, entry) => {
      return sum + (entry.notes.split('\n').filter(line => line.trim().startsWith('- ')).length);
    }, 0);
    
    summary += `**${category}**: ${taskCount} tasks completed\n`;
  });
  
  summary += `\nAll deliverables have been tested and are ready for client review.`;
  
  return summary;
}

export default {
  toProfessionalText,
  toProfessionalHeader,
  formatProfessionalNotes,
  generateProfessionalSummary
}; 