# Architecture Overview

## Overview
`mcp-daily-change-log` is a CLI-driven Node.js tool designed for easy integration with Smithery/Windsurf editors.

## Components
- **index.js**: Entry point. Parses args, coordinates logic.
- **lib/fileWriter.js**: Handles file/directory creation and appends notes.
- **docs/**: Project documentation.
- **package.json**: Dependency + metadata definition.

## Flow
1️⃣ User invokes MCP via CLI with `--notes`, optionally `--header` and `--file`.
2️⃣ `index.js` validates input, passes to `fileWriter`.
3️⃣ `fileWriter` ensures file exists and appends formatted notes.
4️⃣ Output is saved in `change-notes/YYYY-MM-DD-change-log.md`.
