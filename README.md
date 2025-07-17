# MCP Daily Change Log

A professional Model Context Protocol (MCP) server for managing daily change logs with automatic formatting, intelligent monitoring, and client-ready output. This tool helps developers document their work, track development activities, and generate professional reports.

## 🚀 Features

- **Professional Formatting**: Automatically converts casual language to professional client-ready format
- **Intelligent Monitoring**: Real-time tracking of development activities and conversations
- **Zero-Friction Entry**: Direct input processing without confirmation prompts
- **Multiple Input Methods**: MCP tools, direct-add script, and command-line interface
- **Report Generation**: Daily summaries and comprehensive reports
- **Git Integration**: Automatically generate changelog entries from git commits
- **Deployment Tracking**: Track deployments and generate release notes
- **Category Management**: Predefined professional categories for organization
- **Tag Support**: Flexible tagging system for better organization
- **Clean Architecture**: Optimized codebase with essential files only (recently cleaned up)

## 📋 Installation

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Claude Desktop** (for MCP integration)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-daily-change-log.git
cd mcp-daily-change-log

# Install dependencies
npm install
```

### Step 2: Configure MCP Client

Add this configuration to your MCP client configuration file:

**For Claude Desktop:**

- **Linux**: `~/.config/claude/claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-daily-change-log": {
      "command": "node",
      "args": ["enhanced-mcp-server.js"],
      "cwd": "/path/to/mcp-daily-change-log",
      "env": {}
    }
  }
}
```

**Important**: Replace `/path/to/mcp-daily-change-log` with the actual absolute path to your project directory.

### Step 3: Start MCP Server

```bash
# Start the MCP server
npm run mcp-server
```

### Step 4: Restart Claude Desktop

1. **Completely close** Claude Desktop
2. Wait 5 seconds
3. **Restart** Claude Desktop
4. Check the MCP Tools panel for "mcp-daily-change-log" with green status

## 🛠 Available Commands

### MCP Tools (Use in Claude Desktop)

#### 1. `log_my_work`
Automatically generate and log professional summary of recent development work.

```
Use: log_my_work
Optional: customHeader - Custom header for the work summary
```

#### 2. `generate_daily_summary`
Generate comprehensive end-of-day summary of all development activities.

```
Use: generate_daily_summary
Optional: finalize (true/false) - Whether to create final polished summary
```

#### 3. `analyze_conversation`
Analyze user prompts and AI responses to track development progress.

```
Use: analyze_conversation
Required: userPrompt - User prompt or command
Optional: aiResponse - AI response or output
Optional: codeChanges - Array of code changes made
```

#### 4. `get_monitoring_status`
Get current status of intelligent monitoring system.

```
Use: get_monitoring_status
Optional: detailed (true/false) - Include detailed activity breakdown
```

#### 5. `add_daily_log_entry`
Manually add a professional entry to the daily change log.

```
Use: add_daily_log_entry
Required: header - Header/title for the log entry
Required: notes - Notes content
Optional: category - Category from predefined list
Optional: tags - Array of tags for the entry
```

#### 6. `view_recent_entries`
View recent changelog entries.

```
Use: view_recent_entries
Optional: days - Number of days to look back (default: 7)
```

### Direct Commands (Terminal)

#### Direct-Add Script (Recommended Alternative)

```bash
# Add an entry with all parameters
node direct-add.js "Header" "Notes" "Category" "tag1,tag2"

# Examples:
node direct-add.js "Bug Fix" "Fixed login issue" "Bug Fixes" "auth,frontend"
node direct-add.js "Feature Implementation" "Added user dashboard" "Feature Implementation" "ui,backend"
```

#### Git Integration Commands

```bash
# Generate changelog from today's git commits
npm run git-log:today

# Generate changelog from the past week's git commits
npm run git-log:week

# Custom git log with specific parameters
npm run git-log -- "3 days ago" "/path/to/repo" "Custom Header" "Category" "tag1,tag2"
```

#### Deployment Tracking Commands

```bash
# Track a new deployment
npm run deploy -- "v1.0.0" "production"

# Track deployment with previous version and custom changes
npm run deploy -- "v1.0.1" "production" "v1.0.0" "." "Fixed login bug" "Added new dashboard"

# List recent deployments
npm run deploy:list

# List deployments for specific environment with limit
npm run deploy:list -- "staging" 5
node direct-add.js "Daily Summary" "Completed all sprint tasks" "Documentation" "summary,completion"
```

#### MCP Server Management

```bash
# Start MCP server
npm run mcp-server

# Alternative: Start server directly
node enhanced-mcp-server.js
```

## 📊 Available Categories

- **Feature Implementation** - New features and enhancements
- **Bug Fixes** - Issue resolution and fixes
- **Documentation** - Documentation updates and creation
- **Refactoring** - Code restructuring and optimization
- **Testing** - Test creation and validation
- **DevOps** - Deployment and infrastructure
- **UI/UX** - User interface and experience improvements
- **Performance** - Optimization and speed improvements
- **Security** - Security enhancements and fixes

## 🎯 User Activities

### Daily Development Workflow

1. **Start Your Day**
   ```bash
   npm run mcp-server
   ```

2. **Work Normally**
   - The system automatically tracks your development activities
   - Continue coding, testing, and development tasks

3. **Log Your Work** (Multiple Options)
   
   **Option A: Using MCP Tools in Claude Desktop**
   ```
   Use: log_my_work
   ```
   
   **Option B: Using Direct-Add Script**
   ```bash
   node direct-add.js "Task Header" "Task description" "Category" "tags"
   ```

4. **Generate Daily Summary**
   ```
   Use: generate_daily_summary
   ```

### Professional Entry Creation

#### Quick Entry
```bash
node direct-add.js "Client Meeting" "Discussed project requirements" "Documentation" "client,meeting"
```

#### Detailed Entry
```bash
node direct-add.js "Authentication System" "• Implemented JWT authentication\n• Added password reset functionality\n• Created user registration flow" "Feature Implementation" "auth,security,backend"
```

### Monitoring and Analysis

#### Check System Status
```
Use: get_monitoring_status with detailed=true
```

#### Analyze Conversations
```
Use: analyze_conversation with userPrompt="Implemented new feature" and aiResponse="Feature implemented successfully"
```

#### View Recent Work
```
Use: view_recent_entries with days=7
```

### Report Generation

#### Daily Reports
```
Use: generate_daily_summary with finalize=true
```

#### Weekly Reports
```
Use: view_recent_entries with days=7
```

## 📁 File Organization

The tool automatically creates and manages:

```
mcp-daily-change-log/
├── change-notes/                    # Daily changelog files
│   ├── 2025-07-15-change-log.md
│   ├── 2025-07-14-change-log.md
│   └── 2025-07-13-change-log.md
├── lib/                             # Core libraries
│   ├── dailyLogManager.js          # File management & entry creation
│   ├── intelligentMonitor.js       # Real-time activity monitoring
│   └── professionalFormatter.js    # Professional text formatting
├── enhanced-mcp-server.js          # Enhanced MCP server v3.0
├── direct-add.js                   # Direct entry script (reliable alternative)
├── config.js                       # Configuration settings
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Dependency lock file
└── README.md                       # Comprehensive documentation
```

## 🎨 Professional Transformations

The tool automatically converts casual language to professional format:

| Casual Input | Professional Output |
|-------------|-------------------|
| "fixed bug" | "Resolved functionality issue" |
| "worked on feature" | "Developed feature implementation" |
| "tested stuff" | "Validated system components" |
| "client meeting" | "Client Communication Session" |
| "code review" | "Code Quality Assessment" |

## 📝 Sample Output

```markdown
# Daily Progress Report - 2025-07-15

## Executive Summary
This document outlines the development activities and progress made on 2025-07-15.

---

## Feature Implementation

- Developed user authentication module with JWT integration.
- Implemented password reset functionality with email verification.
- Created comprehensive user registration flow with validation.

**Logged at:** 14:30:22
**Tags:** #auth, #security, #backend

## Bug Fixes

- Resolved login timeout issues affecting user sessions.
- Fixed responsive design problems on mobile devices.

**Logged at:** 16:45:10
**Tags:** #frontend, #mobile, #ui
```

## 🔧 Configuration

Edit `config.js` to customize:

```javascript
export default {
  // Base directory for change logs
  changeLogDir: 'change-notes',
  
  // File format
  fileFormat: '{date}-change-log.md',
  
  // Available categories
  categories: [
    'Feature Implementation',
    'Bug Fixes',
    'Documentation',
    // Add custom categories
  ],
  
  // Entry template
  entryTemplate: '## {header}\n\n{notes}\n\n**Logged at:** {time}\n\n'
};
```

## 🚨 Troubleshooting

### MCP Server Issues

**Problem**: "0 tools enabled" in Claude Desktop

**Solution**:
1. Verify configuration file location and content
2. Ensure absolute path is correct in configuration
3. Restart Claude Desktop completely
4. Check Node.js version (18+)

**Problem**: Server fails to start

**Solution**:
```bash
# Check Node.js version
node --version

# Reinstall dependencies
npm install

# Test server directly
node enhanced-mcp-server.js
```

### File Writing Issues

**Problem**: Entries not appearing in files

**Solution**:
```bash
# Use direct-add as reliable alternative
node direct-add.js "Test Entry" "Testing file writing" "Testing" "test"

# Check file permissions
ls -la change-notes/
```

## 🤝 Integration Examples

### With Development Workflow

```bash
# After completing a feature
node direct-add.js "User Dashboard" "Completed user dashboard with analytics" "Feature Implementation" "ui,analytics"

# After fixing bugs
node direct-add.js "Bug Resolution" "Fixed authentication timeout issues" "Bug Fixes" "auth,security"

# Generate changelog from git commits
npm run git-log:today

# Track a deployment
npm run deploy -- "v1.0.0" "production" "" "." "Initial release"

# End of day summary
Use: generate_daily_summary
```

### With Team Collaboration

```bash
# Before standup meeting
Use: view_recent_entries with days=1

# For client updates
Use: generate_daily_summary with finalize=true

# For sprint reviews
Use: view_recent_entries with days=7
```

## 📈 Best Practices

1. **Regular Logging**: Log work as you complete tasks
2. **Descriptive Headers**: Use clear, professional headers
3. **Proper Categorization**: Use appropriate categories for organization
4. **Meaningful Tags**: Add relevant tags for better filtering
5. **Git Integration**: Use git-log to automatically track code changes
6. **Deployment Tracking**: Record all deployments with version information
7. **Daily Summaries**: Generate end-of-day summaries for reporting

## 🔒 Security & Privacy

- **Local Processing**: All data processed locally
- **No External Requests**: No data sent to external services
- **Sensitive Data Protection**: Automatic sanitization of passwords/tokens
- **Client-Safe Output**: Professional format suitable for client presentation

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your installation follows all steps
3. Ensure all dependencies are properly installed
4. Test with direct-add script as alternative

## 🔄 Git Integration

The Git Integration feature automatically generates changelog entries from your git commits.

### Features

- Extract commits from any time range (e.g., "1 day ago", "1 week ago")
- Group commits by type based on conventional commit format
- Format commits into professional changelog entries
- Automatically add entries to your daily change log

### Usage

```bash
# Generate changelog from git commits in the last day
npm run git-log:today

# Generate changelog from git commits in the last week
npm run git-log:week

# Custom git log with specific parameters
npm run git-log -- "3 days ago" "/path/to/repo" "Custom Header" "Category" "tag1,tag2"
```

## 🚀 Deployment Tracking

The Deployment Tracking feature helps you track deployments and generate release notes.

### Features

- Track deployments to different environments (production, staging, etc.)
- Store version information and changes
- Generate release notes for each version
- Compare changes between versions
- List deployment history

### Usage

```bash
# Track a new deployment
npm run deploy -- "v1.0.0" "production"

# Track deployment with previous version and custom changes
npm run deploy -- "v1.0.1" "production" "v1.0.0" "." "Fixed login bug" "Added new dashboard"

# List recent deployments
npm run deploy:list

# List deployments for specific environment with limit
npm run deploy:list -- "staging" 5
```

### Release Notes

Release notes are automatically generated and saved to the `deployments` directory. You can find them at:

```
deployments/release-notes-{version}.md
```

## 🧹 Recent Cleanup (2025-07-15)

The codebase has been recently optimized for better maintainability:

- **Removed 5 redundant documentation files** from `docs/` directory
- **Eliminated duplicate README files** (MCP-README.md merged into main README.md)
- **Removed sample configuration files** (claude-desktop-config.json)
- **Streamlined file structure** with only essential files
- **Maintained 100% functionality** while reducing complexity
- **All core features tested and verified** after cleanup

The system now has a cleaner, more focused architecture with comprehensive documentation in a single README.md file.

## 📄 License

MIT License - Feel free to use and modify as needed.

---

**Ready to start professional development logging!** 🚀
