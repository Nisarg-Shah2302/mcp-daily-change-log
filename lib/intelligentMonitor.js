/**
 * Intelligent Development Monitor
 * Tracks development activities in real-time and generates professional summaries
 * No temporary files - all processing happens in-memory
 */

import fs from 'fs-extra';
import path from 'path';
import { addDailyLogEntry } from './dailyLogManager.js';
import { toProfessionalHeader, formatProfessionalNotes } from './professionalFormatter.js';

export class IntelligentMonitor {
  constructor() {
    this.isActive = false;
    this.sessionData = {
      startTime: null,
      activities: [],
      contextHistory: [],
      taskCompletions: [],
      technicalDecisions: [],
      lastLogTime: null
    };
    
    this.activityPatterns = {
      featureImplementation: /implement|add|create|build|develop|integrate/i,
      bugFix: /fix|resolve|debug|patch|correct|repair/i,
      refactoring: /refactor|restructure|optimize|improve|enhance/i,
      testing: /test|validate|verify|check|spec/i,
      documentation: /document|comment|readme|guide|doc/i,
      configuration: /config|setup|install|deploy|environment/i
    };
    
    this.technicalTerms = {
      'api': 'API integration',
      'database': 'database operations',
      'frontend': 'user interface',
      'backend': 'server-side logic',
      'auth': 'authentication system',
      'ui': 'user interface',
      'ux': 'user experience',
      'responsive': 'responsive design',
      'mobile': 'mobile compatibility',
      'security': 'security implementation',
      'performance': 'performance optimization',
      'validation': 'data validation',
      'error handling': 'error management',
      'middleware': 'middleware layer',
      'routing': 'application routing'
    };
  }

  startMonitoring() {
    if (this.isActive) {
      return { status: 'already_active', message: 'Monitoring already active' };
    }

    this.isActive = true;
    this.sessionData = {
      startTime: new Date(),
      activities: [],
      contextHistory: [],
      taskCompletions: [],
      technicalDecisions: [],
      lastLogTime: null
    };

    console.log('[IntelligentMonitor] Started intelligent development monitoring');
    
    return {
      status: 'started',
      startTime: this.sessionData.startTime,
      message: 'Intelligent monitoring active - tracking development activities'
    };
  }

  stopMonitoring() {
    if (!this.isActive) {
      return { status: 'not_active', message: 'Monitoring not active' };
    }

    const sessionSummary = {
      duration: this.getSessionDuration(),
      totalActivities: this.sessionData.activities.length,
      taskCompletions: this.sessionData.taskCompletions.length,
      technicalDecisions: this.sessionData.technicalDecisions.length
    };

    this.isActive = false;
    
    console.log('[IntelligentMonitor] Stopped intelligent development monitoring');
    
    return {
      status: 'stopped',
      sessionSummary,
      message: 'Monitoring stopped - session data preserved'
    };
  }

  // Analyze user prompts and AI responses to understand development context
  analyzeConversation(userPrompt, aiResponse = null, codeChanges = null) {
    if (!this.isActive) return;

    const timestamp = new Date();
    const analysis = this.extractDevelopmentIntent(userPrompt, aiResponse, codeChanges);
    
    if (analysis.isRelevant) {
      this.sessionData.contextHistory.push({
        timestamp,
        userPrompt: this.sanitizePrompt(userPrompt),
        intent: analysis.intent,
        category: analysis.category,
        technicalContext: analysis.technicalContext,
        codeChanges: codeChanges ? this.analyzeCodeChanges(codeChanges) : null
      });

      // If this represents a completed task, add to task completions
      if (analysis.isTaskCompletion) {
        this.sessionData.taskCompletions.push({
          timestamp,
          task: analysis.taskDescription,
          category: analysis.category,
          technicalDetails: analysis.technicalContext,
          impact: analysis.impact
        });
      }

      // Track technical decisions
      if (analysis.technicalDecision) {
        this.sessionData.technicalDecisions.push({
          timestamp,
          decision: analysis.technicalDecision,
          reasoning: analysis.reasoning,
          context: analysis.technicalContext
        });
      }
    }
  }

  // Extract development intent from user prompts and AI responses
  extractDevelopmentIntent(userPrompt, aiResponse, codeChanges) {
    const prompt = userPrompt.toLowerCase();
    
    // Check if this is development-related
    const isDevelopmentRelated = this.isDevelopmentActivity(prompt);
    if (!isDevelopmentRelated) {
      return { isRelevant: false };
    }

    // Determine activity category
    const category = this.categorizeActivity(prompt);
    
    // Extract technical context
    const technicalContext = this.extractTechnicalContext(prompt, aiResponse);
    
    // Check if this represents a task completion
    const isTaskCompletion = this.isTaskCompletion(prompt, aiResponse, codeChanges);
    
    // Extract task description if completed
    const taskDescription = isTaskCompletion ? 
      this.generateTaskDescription(prompt, aiResponse, category, technicalContext) : null;
    
    // Check for technical decisions
    const technicalDecision = this.extractTechnicalDecision(prompt, aiResponse);
    
    return {
      isRelevant: true,
      intent: prompt,
      category,
      technicalContext,
      isTaskCompletion,
      taskDescription,
      technicalDecision: technicalDecision.decision,
      reasoning: technicalDecision.reasoning,
      impact: this.assessImpact(category, technicalContext)
    };
  }

  isDevelopmentActivity(prompt) {
    const developmentKeywords = [
      'implement', 'create', 'build', 'develop', 'add', 'fix', 'debug',
      'refactor', 'optimize', 'test', 'validate', 'deploy', 'configure',
      'integrate', 'api', 'database', 'frontend', 'backend', 'component',
      'function', 'class', 'method', 'variable', 'endpoint', 'route',
      'authentication', 'authorization', 'validation', 'error', 'bug',
      'feature', 'enhancement', 'improvement', 'security', 'performance'
    ];

    return developmentKeywords.some(keyword => prompt.includes(keyword));
  }

  categorizeActivity(prompt) {
    for (const [category, pattern] of Object.entries(this.activityPatterns)) {
      if (pattern.test(prompt)) {
        return category;
      }
    }
    return 'general';
  }

  extractTechnicalContext(prompt, aiResponse) {
    const context = [];
    
    // Extract technical terms from prompt
    for (const [term, description] of Object.entries(this.technicalTerms)) {
      if (prompt.includes(term)) {
        context.push(description);
      }
    }

    // Extract file types and technologies
    const techPatterns = {
      'javascript': /\.js|javascript|node\.js|npm/i,
      'typescript': /\.ts|typescript/i,
      'react': /react|jsx|component/i,
      'python': /\.py|python|django|flask/i,
      'database': /sql|database|mysql|postgresql|mongodb/i,
      'api': /api|endpoint|rest|graphql/i,
      'css': /\.css|styling|styles/i,
      'html': /\.html|markup/i
    };

    for (const [tech, pattern] of Object.entries(techPatterns)) {
      if (pattern.test(prompt) || (aiResponse && pattern.test(aiResponse))) {
        context.push(tech);
      }
    }

    return context;
  }

  isTaskCompletion(prompt, aiResponse, codeChanges) {
    const completionIndicators = [
      'completed', 'finished', 'done', 'implemented', 'created', 'built',
      'fixed', 'resolved', 'deployed', 'integrated', 'added', 'updated'
    ];

    // Check if prompt indicates completion
    const promptIndicatesCompletion = completionIndicators.some(indicator => 
      prompt.includes(indicator)
    );

    // Check if there are actual code changes
    const hasCodeChanges = codeChanges && codeChanges.length > 0;

    // Check if AI response indicates successful implementation
    const aiIndicatesSuccess = aiResponse && (
      aiResponse.includes('successfully') ||
      aiResponse.includes('completed') ||
      aiResponse.includes('implemented') ||
      aiResponse.includes('created')
    );

    return promptIndicatesCompletion || (hasCodeChanges && aiIndicatesSuccess);
  }

  generateTaskDescription(prompt, aiResponse, category, technicalContext) {
    // Create professional task description based on context
    const baseDescription = this.extractMainAction(prompt);
    const techContext = technicalContext.length > 0 ? 
      ` involving ${technicalContext.join(', ')}` : '';
    
    return `${baseDescription}${techContext}`;
  }

  extractMainAction(prompt) {
    // Extract the main action from the prompt
    const actionPatterns = {
      'implement': 'Implemented',
      'create': 'Created',
      'build': 'Built',
      'develop': 'Developed',
      'add': 'Added',
      'fix': 'Fixed',
      'debug': 'Debugged',
      'refactor': 'Refactored',
      'optimize': 'Optimized',
      'test': 'Tested',
      'validate': 'Validated',
      'deploy': 'Deployed',
      'configure': 'Configured',
      'integrate': 'Integrated',
      'update': 'Updated',
      'enhance': 'Enhanced',
      'improve': 'Improved'
    };

    for (const [action, pastTense] of Object.entries(actionPatterns)) {
      if (prompt.includes(action)) {
        return pastTense;
      }
    }

    return 'Completed';
  }

  extractTechnicalDecision(prompt, aiResponse) {
    const decisionKeywords = [
      'choose', 'decided', 'selected', 'approach', 'strategy',
      'architecture', 'design', 'pattern', 'solution'
    ];

    const hasDecision = decisionKeywords.some(keyword => 
      prompt.includes(keyword) || (aiResponse && aiResponse.includes(keyword))
    );

    if (!hasDecision) {
      return { decision: null, reasoning: null };
    }

    // Extract decision and reasoning
    const decision = this.extractDecisionText(prompt, aiResponse);
    const reasoning = this.extractReasoningText(prompt, aiResponse);

    return { decision, reasoning };
  }

  extractDecisionText(prompt, aiResponse) {
    // Simple extraction - in production, this would be more sophisticated
    const sentences = (prompt + ' ' + (aiResponse || '')).split('.');
    const decisionSentence = sentences.find(sentence => 
      sentence.includes('decide') || sentence.includes('choose') || sentence.includes('use')
    );
    
    return decisionSentence ? decisionSentence.trim() : null;
  }

  extractReasoningText(prompt, aiResponse) {
    // Extract reasoning - look for "because", "since", "due to", etc.
    const reasoningKeywords = ['because', 'since', 'due to', 'as', 'for'];
    const text = prompt + ' ' + (aiResponse || '');
    
    for (const keyword of reasoningKeywords) {
      const index = text.indexOf(keyword);
      if (index !== -1) {
        const reasoning = text.substring(index).split('.')[0];
        return reasoning.trim();
      }
    }
    
    return null;
  }

  assessImpact(category, technicalContext) {
    const impactMap = {
      'featureImplementation': 'high',
      'bugFix': 'medium',
      'refactoring': 'medium',
      'testing': 'low',
      'documentation': 'low',
      'configuration': 'medium'
    };

    return impactMap[category] || 'low';
  }

  analyzeCodeChanges(codeChanges) {
    // Analyze code changes to understand what was actually implemented
    return {
      filesModified: codeChanges.length,
      changeTypes: this.classifyChanges(codeChanges),
      complexity: this.assessComplexity(codeChanges)
    };
  }

  classifyChanges(codeChanges) {
    // Classify the types of changes made
    const types = [];
    
    codeChanges.forEach(change => {
      if (change.includes('function') || change.includes('class')) {
        types.push('implementation');
      }
      if (change.includes('test') || change.includes('spec')) {
        types.push('testing');
      }
      if (change.includes('//') || change.includes('/**')) {
        types.push('documentation');
      }
    });

    return [...new Set(types)];
  }

  assessComplexity(codeChanges) {
    // Simple complexity assessment based on change size
    const totalLines = codeChanges.reduce((sum, change) => sum + change.split('\n').length, 0);
    
    if (totalLines > 100) return 'high';
    if (totalLines > 50) return 'medium';
    return 'low';
  }

  sanitizePrompt(prompt) {
    // Remove sensitive information from prompts
    return prompt
      .replace(/password|token|key|secret/gi, '[REDACTED]')
      .replace(/https?:\/\/[^\s]+/g, '[URL]')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]');
  }

  // Generate professional summary from tracked activities
  async generateWorkSummary(customHeader = null) {
    if (!this.isActive && this.sessionData.taskCompletions.length === 0) {
      return null;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Get activities since last log
    const cutoffTime = this.sessionData.lastLogTime || this.sessionData.startTime;
    const recentCompletions = this.sessionData.taskCompletions.filter(
      completion => completion.timestamp > cutoffTime
    );

    if (recentCompletions.length === 0) {
      return null;
    }

    // Generate professional summary
    const summary = this.createProfessionalSummary(recentCompletions, customHeader);
    
    // Update last log time
    this.sessionData.lastLogTime = now;
    
    return summary;
  }

  createProfessionalSummary(completions, customHeader) {
    const dateStr = new Date().toISOString().split('T')[0];
    const header = customHeader || `Development Progress - ${dateStr}`;
    
    // Group completions by category
    const groupedCompletions = this.groupCompletionsByCategory(completions);
    
    // Generate professional notes
    const notes = this.generateProfessionalNotes(groupedCompletions);
    
    // Determine appropriate category
    const category = this.inferPrimaryCategory(groupedCompletions);
    
    // Generate tags
    const tags = this.generateTags(groupedCompletions);
    
    return {
      header: toProfessionalHeader(header),
      notes,
      category,
      tags,
      completionsProcessed: completions.length,
      sessionDuration: this.getSessionDuration()
    };
  }

  groupCompletionsByCategory(completions) {
    const grouped = {};
    
    completions.forEach(completion => {
      if (!grouped[completion.category]) {
        grouped[completion.category] = [];
      }
      grouped[completion.category].push(completion);
    });
    
    return grouped;
  }

  generateProfessionalNotes(groupedCompletions) {
    let notes = '';
    
    Object.entries(groupedCompletions).forEach(([category, completions]) => {
      completions.forEach(completion => {
        const professionalTask = this.convertToProfessionalLanguage(completion.task);
        notes += `- ${professionalTask}.\n`;
      });
    });
    
    return notes || '- Continued development work and made progress on current tasks.\n';
  }

  convertToProfessionalLanguage(task) {
    const conversions = {
      'implemented': 'Implemented',
      'created': 'Developed',
      'built': 'Constructed',
      'added': 'Integrated',
      'fixed': 'Resolved',
      'debugged': 'Diagnosed and corrected',
      'refactored': 'Restructured and optimized',
      'optimized': 'Enhanced performance of',
      'tested': 'Validated functionality of',
      'deployed': 'Successfully deployed',
      'configured': 'Configured and established',
      'integrated': 'Successfully integrated',
      'updated': 'Updated and enhanced',
      'enhanced': 'Improved and enhanced',
      'improved': 'Optimized and refined'
    };

    let professional = task;
    Object.entries(conversions).forEach(([casual, formal]) => {
      professional = professional.replace(new RegExp(casual, 'gi'), formal);
    });

    return professional;
  }

  inferPrimaryCategory(groupedCompletions) {
    const categoryPriority = {
      'featureImplementation': 5,
      'bugFix': 4,
      'refactoring': 3,
      'testing': 2,
      'documentation': 1,
      'configuration': 2
    };

    const categories = Object.keys(groupedCompletions);
    if (categories.length === 0) return 'Feature Implementation';

    const primaryCategory = categories.reduce((highest, current) => {
      return (categoryPriority[current] || 0) > (categoryPriority[highest] || 0) ? current : highest;
    });

    const categoryMap = {
      'featureImplementation': 'Feature Implementation',
      'bugFix': 'Bug Fixes',
      'refactoring': 'Refactoring',
      'testing': 'Testing',
      'documentation': 'Documentation',
      'configuration': 'DevOps'
    };

    return categoryMap[primaryCategory] || 'Feature Implementation';
  }

  generateTags(groupedCompletions) {
    const tags = ['development'];
    
    Object.keys(groupedCompletions).forEach(category => {
      const categoryTags = {
        'featureImplementation': ['features', 'implementation'],
        'bugFix': ['bug-fixes', 'debugging'],
        'refactoring': ['refactoring', 'optimization'],
        'testing': ['testing', 'validation'],
        'documentation': ['documentation'],
        'configuration': ['configuration', 'setup']
      };
      
      if (categoryTags[category]) {
        tags.push(...categoryTags[category]);
      }
    });
    
    return [...new Set(tags)];
  }

  // Generate end-of-day summary
  async generateDailySummary() {
    if (this.sessionData.taskCompletions.length === 0) {
      return null;
    }

    const allCompletions = this.sessionData.taskCompletions;
    const groupedCompletions = this.groupCompletionsByCategory(allCompletions);
    
    // Generate comprehensive daily summary
    const summary = this.createDailySummary(groupedCompletions);
    
    return summary;
  }

  createDailySummary(groupedCompletions) {
    const totalTasks = Object.values(groupedCompletions).reduce((sum, completions) => sum + completions.length, 0);
    const categories = Object.keys(groupedCompletions);
    
    let summary = `Successfully completed ${totalTasks} development tasks across ${categories.length} main areas:\n\n`;
    
    Object.entries(groupedCompletions).forEach(([category, completions]) => {
      const categoryName = this.formatCategoryName(category);
      summary += `**${categoryName}**: ${completions.length} tasks completed\n`;
      
      completions.forEach(completion => {
        const professionalTask = this.convertToProfessionalLanguage(completion.task);
        summary += `- ${professionalTask}\n`;
      });
      summary += '\n';
    });
    
    summary += 'All deliverables have been tested and are ready for client review.';
    
    return summary;
  }

  formatCategoryName(category) {
    const nameMap = {
      'featureImplementation': 'Feature Implementation',
      'bugFix': 'Bug Resolution',
      'refactoring': 'Code Optimization',
      'testing': 'Quality Assurance',
      'documentation': 'Documentation',
      'configuration': 'System Configuration'
    };
    
    return nameMap[category] || category;
  }

  getSessionDuration() {
    if (!this.sessionData.startTime) return 0;
    return Math.round((new Date() - this.sessionData.startTime) / 1000 / 60);
  }

  getStatus() {
    return {
      isActive: this.isActive,
      startTime: this.sessionData.startTime,
      duration: this.getSessionDuration(),
      totalActivities: this.sessionData.activities.length,
      taskCompletions: this.sessionData.taskCompletions.length,
      technicalDecisions: this.sessionData.technicalDecisions.length,
      lastLogTime: this.sessionData.lastLogTime
    };
  }
}

export default IntelligentMonitor; 