# MCP: `mcp-daily-change-log` — Detailed Requirement, Design & Deployment Plan

## 📌 Purpose

Create a Modular Command Plugin (MCP) that allows developers (or AI tools like Windsurf AI Editor) to automatically append task notes to a daily change log markdown file. This supports generating client updates, tracking daily work, and preparing for PR descriptions (phase 2). It is generic for *any* task in any project.

---

## ✨ Features

### Phase 1: Change Log Generator

- Accepts **notes** as input (multi-line bullet points)
- Supports an optional **custom header** to group notes logically (e.g., "Masking Feature")
- Appends to file: `change-notes/YYYY-MM-DD-change-log.md`
- Automatically creates the file if it does not exist
- Adds a timestamp of when the notes were logged
- Formats output in clean markdown

### Phase 2: PR Description Generator *(planned)*

- Aggregates notes from daily log
- Outputs PR-ready description template
- Supports optional PR title

---

## 🏗 File Structure

```plaintext
mcp-daily-change-log/
 ├── index.js              // Entry point: parses args, orchestrates
 ├── lib/
 │   ├── fileWriter.js     // Handles writing/appending notes
 │   └── prGenerator.js    // (Phase 2) PR description generator
 ├── package.json          // MCP metadata + dependencies
 ├── README.md             // Usage instructions
 ├── docs/
 │   ├── detailed-requirement.md
 │   ├── technical-specs.md
 │   ├── folder-structure-guidelines.md
 │   └── architecture-overview.md
```

---

## ⚙ Technical Behavior

### Command line usage

```bash
npx @smithery/cli run mcp-daily-change-log \
  --notes "- Integrated react-imask for masking\n- Applied dynamic prefix masking" \
  --header "Masking Feature"
```

### Arguments

- `--notes` (string) → Required, multi-line bullet points
- `--header` (string) → Optional, groups notes under markdown heading
- `--file` (string) → Optional, overrides default `change-notes/YYYY-MM-DD-change-log.md`

### Example output

```markdown
## 2025-06-14 Change Log

### Masking Feature
- Integrated react-imask for masking
- Applied dynamic prefix masking

_Logged at 14:05:12_
```

---

## 📝 Deployment

### Where to deploy?

- 💡 Recommended: Private NPM registry, GitHub repository, or internal artifact store (Smithery-compatible)
- For Windsurf, you can load it locally via MCP registration or publish in your company’s MCP catalog.

### How others can use

- Include in Smithery/Windsurf config or call via `npx`
- Documented in `README.md` with example commands and file locations

### How to configure

- Use `--file` to change the output file path if desired
- Use `--header` to group notes by task or feature
- Integrate into editor hooks (e.g., after code generation or refactoring)

---

## ✅ Action Items

👉 I will:

- Generate `index.js`, `fileWriter.js`, `package.json`
- Create `README.md` + the 4 documentation files (detailed-requirement.md, technical-specs.md, folder-structure-guidelines.md, architecture-overview\.md)
- Package everything as a downloadable ZIP

⚡ Ready to proceed with code + packaging.

