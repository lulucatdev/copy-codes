# Copy Codes

A VS Code / Cursor extension that copies selected files and folders to clipboard in a format optimized for LLMs.

## Features

- 📁 **Multi-select support** - Select multiple files and folders at once
- 🔄 **Recursive copying** - Automatically includes all files in selected folders
- 🧠 **Smart file detection** - Automatically detects and skips binary files
- 📋 **Clipboard + Preview** - Copies to clipboard and opens a preview tab
- 🚫 **Customizable ignore** - Support for `.copyignore` file (gitignore syntax)

## Usage

### Right-click Menu

1. Select one or more files/folders in the Explorer
2. Right-click and select **"Copy Codes"**
3. Content is copied to clipboard and shown in a new tab

### Keyboard Shortcut

| Platform | Shortcut |
|----------|----------|
| **macOS** | `⇧ ⌃ ⌘ L` |
| **Windows/Linux** | `Ctrl + Shift + Alt + L` |

## Output Format

Files are formatted as markdown code blocks with relative paths:

````markdown
```src/index.ts
import { app } from './app';
app.listen(3000);
```

```src/app.ts
export const app = express();
```
````

## Configuration

### `.copyignore` File

Create a `.copyignore` file in your project root to exclude files/folders. Syntax is identical to `.gitignore`:

```gitignore
# Comments
*.log
node_modules/
dist/
**/*.test.ts
!important.log
```

### VS Code Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `copy-codes.excludePatterns` | `["node_modules", ".git", ...]` | Patterns to exclude |
| `copy-codes.maxFileSize` | `1048576` (1MB) | Maximum file size in bytes |

## Smart Binary Detection

The extension automatically detects and skips binary files by:

1. **Extension blacklist** - Known binary extensions (images, videos, executables, etc.)
2. **Content analysis** - Checks for null bytes and non-printable characters

## Supported File Types

All text files are supported, including:

- Source code (`.ts`, `.js`, `.py`, `.go`, `.rs`, etc.)
- Config files (`.json`, `.yaml`, `.toml`, etc.)
- Documentation (`.md`, `.txt`, `.rst`, etc.)
- And any other text-based files

## Installation

### From VSIX (Local)

```bash
code --install-extension copy-codes-0.1.0.vsix
```

### Build from Source

```bash
npm install
npm run compile
npx @vscode/vsce package
```

## License

MIT

# copy-codes
