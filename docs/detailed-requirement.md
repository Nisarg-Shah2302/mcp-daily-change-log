# Detailed Requirement

## Purpose

The `mcp-daily-change-log` tool enables developers and AI tools (like Windsurf AI Editor) to automatically append task notes to a daily change log markdown file. This supports:

- Generating structured client updates
- Tracking daily development work
- Preparing content for PR descriptions (in Phase 2)
- Maintaining a consistent record of changes across any project

## User Stories

1. **Developer Working on Feature**

   - _"As a developer, I want to log my changes so that I can keep track of what I've accomplished each day."_
   - _"As a developer, I want to group related notes under a custom header so they're organized by feature."_

2. **Team Lead Managing Project**
   - _"As a team lead, I want my team to consistently document their changes so that I can generate progress reports."_
   - _"As a team lead, I want standardized change logs so that I can easily review progress across multiple projects."_
3. **AI Tool Integration**
   - _"As an AI tool, I want to automatically add notes to a change log after generating code so that developers have a record of AI-assisted changes."_

## Functional Requirements

### Phase 1: Change Log Generator

1. **Input Processing**

   - Accept `--notes` parameter with multi-line bullet point content (required)
   - Support `--header` parameter for logical grouping of notes (optional)
   - Support `--file` parameter to override default output file path (optional)

2. **File Management**
   - Automatically create `change-notes/` directory if it doesn't exist
   - Create date-based markdown file if it doesn't exist (`change-notes/YYYY-MM-DD-change-log.md`)
   - Append new content to existing file without disturbing previous entries
3. **Content Formatting**
   - Format date header (## YYYY-MM-DD Change Log)
   - Format custom header if provided (### Header Name)
   - Preserve multi-line bullet point formatting
   - Add timestamp of when notes were logged (_Logged at HH:MM:SS_)

### Phase 2: PR Description Generator

1. **Content Aggregation**
   - Parse daily change logs to extract relevant entries
   - Group related entries from multiple days
2. **Template Generation**
   - Generate PR description template
   - Support optional PR title parameter
   - Format output in markdown suitable for GitHub/GitLab PR descriptions

## Non-Functional Requirements

1. **Usability**

   - Command line interface must be simple and intuitive
   - Support npm/npx invocation pattern
   - Error messages must be clear and actionable
   - Tool should be fast, with response time under 1 second

2. **Dependencies**
   - Minimal external dependencies (only `minimist` for argument parsing)
   - Use Node.js built-in modules where possible (fs, path)
3. **Compatibility**
   - Compatible with Node.js 14.x and above
   - Cross-platform support (Windows, macOS, Linux)
   - No reliance on external services
4. **Integration**
   - Easy to integrate into editor workflows
   - Smithery/Windsurf MCP compatible

## Acceptance Criteria

### Change Log Generator

1. **Input Handling**

   - Tool accepts multi-line notes via `--notes` parameter
   - Tool accepts optional header via `--header` parameter
   - Tool accepts optional file path override via `--file` parameter
   - Tool rejects requests that don't include required `--notes` parameter

2. **File Operations**

   - Tool creates `change-notes/` directory if it doesn't exist
   - Tool creates date-based file if it doesn't exist
   - Tool preserves existing content when appending new notes
   - Date format in filename matches `YYYY-MM-DD` pattern

3. **Output Format**
   - Markdown content follows specified format exactly
   - Multi-line bullet points are preserved
   - Timestamp is added in format `_Logged at HH:MM:SS_`
   - When header is provided, notes are grouped under it

### PR Description Generator (Phase 2)

1. **Content Collection**
   - Successfully aggregates entries across multiple change logs
   - Correctly associates related entries by header
2. **Output Format**
   - Generated PR description follows markdown best practices
   - When PR title is provided, it's incorporated into the template
   - Content is properly formatted for GitHub/GitLab PR description field

## Integration Points

1. **Developer Workflow**
   - Manual CLI invocation after completion of tasks
   - Editor integration via command palette or keyboard shortcuts
2. **CI/CD Pipeline**
   - Integration with pre-commit hooks for automatic logging
   - Support for batch processing in automated scripts
3. **AI Tool Integration**
   - API for Windsurf AI Editor to auto-log generated code changes
   - Webhook support for external tools to add entries

## Future Enhancements (Beyond Phase 2)

1. **Advanced Aggregation**
   - Smart grouping of related entries based on content analysis
   - Support for tagging entries with categories
2. **Visualization**
   - Generate visual charts/graphs of activity over time
   - Export options for reports and presentations
3. **Multi-project Support**
   - Central repository for changes across multiple projects
   - Cross-project reporting capabilities
