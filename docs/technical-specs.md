# Technical Specs

## Command Interface
- Input: `--notes` (required), `--header` (optional), `--file` (optional)
- Output: Appends markdown to file.

## File Format
- Location: `change-notes/YYYY-MM-DD-change-log.md`
- Structure:
  ```markdown
  ## YYYY-MM-DD Change Log
  ### Header (if provided)
  - Note lines
  _Logged at HH:MM:SS_
  ```

## Dependencies
- `minimist`
- Node.js built-in: `fs`, `path`
