# Copy Codes

[English](#english) | [简体中文](#简体中文) | [日本語](#日本語)

---

## English

A VS Code / Cursor extension that copies selected files and folders to clipboard in a format optimized for LLMs like ChatGPT, Claude, and Gemini.

### Features

- 📁 **Multi-select support** - Select multiple files and folders at once
- 🔄 **Recursive copying** - Automatically includes all files in selected folders
- 🧠 **Smart file detection** - Automatically detects and skips binary files
- 📋 **Clipboard + Preview** - Copies to clipboard and opens a preview tab
- 🚫 **Customizable ignore** - Support for `.copyignore` file (gitignore syntax)
- 🌍 **17 Languages** - Localized in 17 languages

### Installation

#### Option 1: Drag & Drop (Recommended)

1. Download `copy-codes-1.0.0.vsix` from [Releases](../../releases)
2. Open VS Code or Cursor
3. Go to Extensions panel (`Cmd+Shift+X` / `Ctrl+Shift+X`)
4. Drag the `.vsix` file into the Extensions panel
5. Reload window

#### Option 2: Command Line

```bash
code --install-extension copy-codes-1.0.0.vsix
```

For Cursor:
```bash
cursor --install-extension copy-codes-1.0.0.vsix
```

#### Option 3: Build from Source

```bash
git clone https://github.com/user/copy-codes.git
cd copy-codes
npm install
npm run compile
npx @vscode/vsce package
```

### Usage

#### Right-click Menu

1. Select one or more files/folders in the Explorer
2. Right-click and select **"Copy Codes"**
3. Content is copied to clipboard and shown in a new tab

#### Keyboard Shortcut

| Platform | Shortcut |
|----------|----------|
| **macOS** | `⇧ ⌃ ⌘ L` |
| **Windows/Linux** | `Ctrl + Shift + Alt + L` |

### Output Format

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

### Configuration

#### `.copyignore` File

Create a `.copyignore` file in your project root to exclude files/folders. Syntax is identical to `.gitignore`:

```gitignore
# Comments
*.log
node_modules/
dist/
**/*.test.ts
!important.log
```

#### VS Code Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `copy-codes.excludePatterns` | `["node_modules", ".git", ...]` | Patterns to exclude |
| `copy-codes.maxFileSize` | `1048576` (1MB) | Maximum file size in bytes |

### License

MIT

---

## 简体中文

一个 VS Code / Cursor 扩展，将选中的文件和文件夹内容复制到剪贴板，格式适合 ChatGPT、Claude、Gemini 等 LLM 使用。

### 功能特点

- 📁 **多选支持** - 同时选择多个文件和文件夹
- 🔄 **递归复制** - 自动包含文件夹中的所有文件
- 🧠 **智能检测** - 自动检测并跳过二进制文件
- 📋 **剪贴板 + 预览** - 复制到剪贴板并打开预览标签页
- 🚫 **自定义忽略** - 支持 `.copyignore` 文件（gitignore 语法）
- 🌍 **17 种语言** - 支持 17 种语言本地化

### 安装方法

#### 方式一：拖放安装（推荐）

1. 从 [Releases](../../releases) 下载 `copy-codes-1.0.0.vsix`
2. 打开 VS Code 或 Cursor
3. 进入扩展面板（`Cmd+Shift+X` / `Ctrl+Shift+X`）
4. 将 `.vsix` 文件拖入扩展面板
5. 重新加载窗口

#### 方式二：命令行安装

```bash
code --install-extension copy-codes-1.0.0.vsix
```

Cursor 用户：
```bash
cursor --install-extension copy-codes-1.0.0.vsix
```

#### 方式三：从源码构建

```bash
git clone https://github.com/user/copy-codes.git
cd copy-codes
npm install
npm run compile
npx @vscode/vsce package
```

### 使用方法

#### 右键菜单

1. 在资源管理器中选择一个或多个文件/文件夹
2. 右键点击，选择 **"Copy Codes"**
3. 内容会复制到剪贴板，并在新标签页中显示

#### 快捷键

| 平台 | 快捷键 |
|------|--------|
| **macOS** | `⇧ ⌃ ⌘ L` |
| **Windows/Linux** | `Ctrl + Shift + Alt + L` |

### 输出格式

文件以 Markdown 代码块格式输出，包含相对路径：

````markdown
```src/index.ts
import { app } from './app';
app.listen(3000);
```

```src/app.ts
export const app = express();
```
````

### 配置

#### `.copyignore` 文件

在项目根目录创建 `.copyignore` 文件来排除文件/文件夹，语法与 `.gitignore` 相同：

```gitignore
# 注释
*.log
node_modules/
dist/
**/*.test.ts
!important.log
```

#### VS Code 设置

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `copy-codes.excludePatterns` | `["node_modules", ".git", ...]` | 要排除的模式 |
| `copy-codes.maxFileSize` | `1048576` (1MB) | 最大文件大小（字节） |

### 许可证

MIT

---

## 日本語

VS Code / Cursor 用の拡張機能で、選択したファイルとフォルダの内容を ChatGPT、Claude、Gemini などの LLM 向けの形式でクリップボードにコピーします。

### 機能

- 📁 **複数選択対応** - 複数のファイルとフォルダを同時に選択
- 🔄 **再帰的コピー** - フォルダ内のすべてのファイルを自動的に含める
- 🧠 **スマート検出** - バイナリファイルを自動検出してスキップ
- 📋 **クリップボード + プレビュー** - クリップボードにコピーしてプレビュータブを開く
- 🚫 **カスタム除外** - `.copyignore` ファイル対応（gitignore 構文）
- 🌍 **17言語対応** - 17言語にローカライズ

### インストール

#### 方法1：ドラッグ＆ドロップ（推奨）

1. [Releases](../../releases) から `copy-codes-1.0.0.vsix` をダウンロード
2. VS Code または Cursor を開く
3. 拡張機能パネルを開く（`Cmd+Shift+X` / `Ctrl+Shift+X`）
4. `.vsix` ファイルを拡張機能パネルにドラッグ
5. ウィンドウをリロード

#### 方法2：コマンドライン

```bash
code --install-extension copy-codes-1.0.0.vsix
```

Cursor の場合：
```bash
cursor --install-extension copy-codes-1.0.0.vsix
```

#### 方法3：ソースからビルド

```bash
git clone https://github.com/user/copy-codes.git
cd copy-codes
npm install
npm run compile
npx @vscode/vsce package
```

### 使い方

#### 右クリックメニュー

1. エクスプローラーで1つ以上のファイル/フォルダを選択
2. 右クリックして **"Copy Codes"** を選択
3. 内容がクリップボードにコピーされ、新しいタブに表示されます

#### キーボードショートカット

| プラットフォーム | ショートカット |
|------------------|----------------|
| **macOS** | `⇧ ⌃ ⌘ L` |
| **Windows/Linux** | `Ctrl + Shift + Alt + L` |

### 出力形式

ファイルは相対パス付きの Markdown コードブロック形式で出力されます：

````markdown
```src/index.ts
import { app } from './app';
app.listen(3000);
```

```src/app.ts
export const app = express();
```
````

### 設定

#### `.copyignore` ファイル

プロジェクトルートに `.copyignore` ファイルを作成してファイル/フォルダを除外できます。構文は `.gitignore` と同じです：

```gitignore
# コメント
*.log
node_modules/
dist/
**/*.test.ts
!important.log
```

#### VS Code 設定

| 設定 | デフォルト | 説明 |
|------|------------|------|
| `copy-codes.excludePatterns` | `["node_modules", ".git", ...]` | 除外するパターン |
| `copy-codes.maxFileSize` | `1048576` (1MB) | 最大ファイルサイズ（バイト） |

### ライセンス

MIT
