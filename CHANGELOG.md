# Changelog

All notable changes to the "Copy Codes" extension will be documented in this file.

## [1.0.0] - 2024-11-26

### 🎉 Initial Release

#### Features
- **Right-click context menu** - Select files/folders in Explorer and copy with one click
- **Multi-selection support** - Copy multiple files and folders at once
- **Recursive folder copying** - Automatically includes all files in selected folders
- **Smart binary detection** - Automatically skips binary files using:
  - Extension blacklist (images, videos, executables, etc.)
  - Content analysis (null bytes, non-printable characters)
- **`.copyignore` support** - Full gitignore syntax for excluding files
- **Preview tab** - Opens a new tab showing copied content
- **Keyboard shortcuts**:
  - macOS: `⇧ ⌃ ⌘ L`
  - Windows/Linux: `Ctrl + Shift + Alt + L`

#### Configuration
- `copy-codes.excludePatterns` - Directory/file patterns to exclude
- `copy-codes.maxFileSize` - Maximum file size limit (default: 1MB)

#### Localization
Support for 17 languages:
- English, 简体中文, 繁體中文, 日本語, 한국어
- Deutsch, Français, Español, Português, Italiano
- Русский, Українська, العربية, Bahasa Indonesia
- हिन्दी, தமிழ், తెలుగు, বাংলা
