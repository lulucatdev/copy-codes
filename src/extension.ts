import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface FileContent {
  relativePath: string;
  content: string;
}

interface IgnoreRule {
  pattern: RegExp;
  negated: boolean;
  directoryOnly: boolean;
}

// 已知的二进制文件扩展名（黑名单）
const BINARY_EXTENSIONS = new Set([
  // 图片
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp', '.tiff', '.tif',
  '.psd', '.ai', '.eps', '.raw', '.cr2', '.nef', '.heic', '.heif', '.avif',
  
  // 音频
  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.aiff',
  
  // 视频
  '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.mpeg', '.mpg',
  
  // 压缩/归档
  '.zip', '.tar', '.gz', '.bz2', '.xz', '.7z', '.rar', '.tgz', '.tbz2',
  
  // 可执行文件/库
  '.exe', '.dll', '.so', '.dylib', '.app', '.dmg', '.pkg', '.deb', '.rpm',
  '.msi', '.bin', '.com', '.class', '.pyc', '.pyo', '.o', '.obj', '.a', '.lib',
  
  // 字体
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.fon',
  
  // 文档（二进制格式）
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp',
  
  // 数据库
  '.db', '.sqlite', '.sqlite3', '.mdb', '.accdb',
  
  // 其他二进制
  '.iso', '.img', '.vmdk', '.vdi', '.qcow2',
  '.swf', '.fla',
  '.sketch', '.fig',
  '.blend', '.fbx', '.obj', '.3ds', '.dae',
  '.unity', '.unitypackage',
]);

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'copy-codes.copyToClipboard',
    async (uri: vscode.Uri, selectedUris: vscode.Uri[]) => {
      try {
        // 获取选中的文件/文件夹
        const uris = selectedUris && selectedUris.length > 0 ? selectedUris : uri ? [uri] : [];
        
        if (uris.length === 0) {
          vscode.window.showWarningMessage('No files or folders selected');
          return;
        }

        // 获取工作区根目录
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showErrorMessage('No workspace folder open');
          return;
        }
        const workspaceRoot = workspaceFolder.uri.fsPath;

        // 获取配置
        const config = vscode.workspace.getConfiguration('copy-codes');
        const excludePatterns = config.get<string[]>('excludePatterns') || [];
        const maxFileSize = config.get<number>('maxFileSize') || 1048576;

        // 读取 .copyignore 文件
        const ignoreRules = await loadCopyIgnore(workspaceRoot);

        // 收集所有文件内容
        const fileContents: FileContent[] = [];
        
        for (const selectedUri of uris) {
          await collectFileContents(
            selectedUri.fsPath,
            workspaceRoot,
            excludePatterns,
            ignoreRules,
            maxFileSize,
            fileContents
          );
        }

        if (fileContents.length === 0) {
          vscode.window.showWarningMessage('No text files found in selection');
          return;
        }

        // 按路径排序
        fileContents.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

        // 格式化输出
        const formattedContent = formatOutput(fileContents);

        // 复制到剪贴板
        await vscode.env.clipboard.writeText(formattedContent);

        // 打开新标签页显示内容
        const document = await vscode.workspace.openTextDocument({
          content: formattedContent,
          language: 'markdown'
        });
        await vscode.window.showTextDocument(document, { preview: false });

        vscode.window.showInformationMessage(
          `Copied ${fileContents.length} file(s) to clipboard`
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Error: ${errorMessage}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * 读取并解析 .copyignore 文件
 */
async function loadCopyIgnore(workspaceRoot: string): Promise<IgnoreRule[]> {
  const copyignorePath = path.join(workspaceRoot, '.copyignore');
  
  try {
    const content = await fs.promises.readFile(copyignorePath, 'utf-8');
    return parseGitignore(content);
  } catch {
    // 文件不存在或读取失败，返回空规则
    return [];
  }
}

/**
 * 解析 gitignore 语法
 */
function parseGitignore(content: string): IgnoreRule[] {
  const rules: IgnoreRule[] = [];
  const lines = content.split('\n');
  
  for (let line of lines) {
    // 去除行尾空白
    line = line.trimEnd();
    
    // 跳过空行和注释
    if (!line || line.startsWith('#')) {
      continue;
    }
    
    let negated = false;
    let directoryOnly = false;
    
    // 检查是否是取反规则
    if (line.startsWith('!')) {
      negated = true;
      line = line.slice(1);
    }
    
    // 检查是否只匹配目录
    if (line.endsWith('/')) {
      directoryOnly = true;
      line = line.slice(0, -1);
    }
    
    // 转换为正则表达式
    const pattern = gitignorePatternToRegex(line);
    
    rules.push({
      pattern,
      negated,
      directoryOnly
    });
  }
  
  return rules;
}

/**
 * 将 gitignore 模式转换为正则表达式
 */
function gitignorePatternToRegex(pattern: string): RegExp {
  let regexStr = '';
  
  // 如果模式以 / 开头，表示从根目录匹配
  const anchored = pattern.startsWith('/');
  if (anchored) {
    pattern = pattern.slice(1);
  }
  
  // 如果模式包含 /（除了开头），则从根目录匹配
  const hasSlash = pattern.includes('/');
  
  // 转换模式
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        // ** 匹配任意路径（包括空）
        if (pattern[i + 2] === '/') {
          // **/ 匹配任意目录前缀
          regexStr += '(?:.*/)?';
          i += 3;
        } else if (i + 2 === pattern.length) {
          // 结尾的 ** 匹配任意内容
          regexStr += '.*';
          i += 2;
        } else {
          regexStr += '.*';
          i += 2;
        }
      } else {
        // * 匹配除 / 外的任意字符
        regexStr += '[^/]*';
        i++;
      }
    } else if (char === '?') {
      // ? 匹配除 / 外的单个字符
      regexStr += '[^/]';
      i++;
    } else if (char === '[') {
      // 字符类
      let j = i + 1;
      let classContent = '';
      
      // 处理 [!...] 或 [^...]
      if (pattern[j] === '!' || pattern[j] === '^') {
        classContent += '^';
        j++;
      }
      
      while (j < pattern.length && pattern[j] !== ']') {
        if (pattern[j] === '\\' && j + 1 < pattern.length) {
          classContent += '\\' + pattern[j + 1];
          j += 2;
        } else {
          classContent += pattern[j];
          j++;
        }
      }
      
      regexStr += '[' + classContent + ']';
      i = j + 1;
    } else if (char === '\\' && i + 1 < pattern.length) {
      // 转义字符
      regexStr += '\\' + pattern[i + 1];
      i += 2;
    } else if ('.+^${}()|[]\\'.includes(char)) {
      // 转义正则特殊字符
      regexStr += '\\' + char;
      i++;
    } else {
      regexStr += char;
      i++;
    }
  }
  
  // 构建完整的正则表达式
  if (anchored || hasSlash) {
    // 从根目录匹配
    regexStr = '^' + regexStr;
  } else {
    // 可以匹配任意位置
    regexStr = '(?:^|/)' + regexStr;
  }
  
  // 匹配完整路径或路径前缀
  regexStr += '(?:$|/)';
  
  return new RegExp(regexStr);
}

/**
 * 检查路径是否被 ignore 规则排除
 */
function isIgnored(relativePath: string, isDirectory: boolean, ignoreRules: IgnoreRule[]): boolean {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  let ignored = false;
  
  for (const rule of ignoreRules) {
    // 如果规则只针对目录，但当前是文件，跳过
    if (rule.directoryOnly && !isDirectory) {
      continue;
    }
    
    if (rule.pattern.test(normalizedPath)) {
      ignored = !rule.negated;
    }
  }
  
  return ignored;
}

async function collectFileContents(
  filePath: string,
  workspaceRoot: string,
  excludePatterns: string[],
  ignoreRules: IgnoreRule[],
  maxFileSize: number,
  results: FileContent[]
): Promise<void> {
  const relativePath = path.relative(workspaceRoot, filePath);
  
  // 检查是否应该排除（基于配置的模式）
  if (shouldExcludeByConfig(relativePath, filePath, excludePatterns)) {
    return;
  }

  const stat = await fs.promises.stat(filePath);
  const isDirectory = stat.isDirectory();
  
  // 检查是否被 .copyignore 排除
  if (isIgnored(relativePath, isDirectory, ignoreRules)) {
    return;
  }

  if (isDirectory) {
    // 递归处理目录
    const entries = await fs.promises.readdir(filePath);
    for (const entry of entries) {
      await collectFileContents(
        path.join(filePath, entry),
        workspaceRoot,
        excludePatterns,
        ignoreRules,
        maxFileSize,
        results
      );
    }
  } else if (stat.isFile()) {
    // 检查文件大小
    if (stat.size > maxFileSize) {
      console.log(`Skipping large file: ${relativePath} (${stat.size} bytes)`);
      return;
    }

    // 检查是否是已知的二进制扩展名
    const ext = path.extname(filePath).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) {
      return;
    }

    // 尝试读取文件并检测是否为文本
    try {
      const content = await readTextFile(filePath);
      if (content !== null) {
        results.push({
          relativePath: relativePath.replace(/\\/g, '/'),
          content
        });
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }
}

// 简单的 glob 模式匹配（支持 * 通配符）
function simpleMatch(str: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`, 'i');
  return regex.test(str);
}

function shouldExcludeByConfig(relativePath: string, absolutePath: string, excludePatterns: string[]): boolean {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const fileName = path.basename(absolutePath);
  
  for (const pattern of excludePatterns) {
    // 检查文件名是否匹配模式
    if (simpleMatch(fileName, pattern)) {
      return true;
    }
    
    // 检查路径的每个部分是否匹配模式
    const pathParts = normalizedPath.split('/');
    for (const part of pathParts) {
      if (simpleMatch(part, pattern)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * 尝试以文本形式读取文件
 * 返回文件内容（如果是文本文件）或 null（如果是二进制文件）
 */
async function readTextFile(filePath: string): Promise<string | null> {
  // 读取文件的前 8KB 来检测是否为二进制
  const SAMPLE_SIZE = 8192;
  
  const fd = await fs.promises.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(SAMPLE_SIZE);
    const { bytesRead } = await fd.read(buffer, 0, SAMPLE_SIZE, 0);
    
    if (bytesRead === 0) {
      // 空文件，视为文本文件
      await fd.close();
      return '';
    }
    
    const sample = buffer.subarray(0, bytesRead);
    
    // 检测是否为二进制文件
    if (isBinaryContent(sample)) {
      await fd.close();
      return null;
    }
    
    // 关闭文件描述符，重新读取完整内容
    await fd.close();
    
    // 读取完整文件内容
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    try { await fd.close(); } catch {}
    throw error;
  }
}

/**
 * 检测内容是否为二进制
 * 通过检查是否存在空字节或过多不可打印字符
 */
function isBinaryContent(buffer: Buffer): boolean {
  // 检查 BOM
  if (buffer.length >= 3) {
    // UTF-8 BOM
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      return false;
    }
  }
  if (buffer.length >= 2) {
    // UTF-16 LE BOM
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
      return false;
    }
    // UTF-16 BE BOM
    if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
      return false;
    }
  }
  
  let nullBytes = 0;
  let nonPrintable = 0;
  const totalBytes = buffer.length;
  
  for (let i = 0; i < totalBytes; i++) {
    const byte = buffer[i];
    
    // 空字节是二进制文件的强信号
    if (byte === 0x00) {
      nullBytes++;
      // 如果有多个空字节，很可能是二进制
      if (nullBytes > 1) {
        return true;
      }
    }
    
    // 检查不可打印字符（排除常见的控制字符）
    // 允许: tab(9), newline(10), carriage return(13), 以及可打印ASCII(32-126)
    // 也允许高字节（用于 UTF-8 多字节字符）
    if (byte < 0x09 || (byte > 0x0D && byte < 0x20 && byte !== 0x1B)) {
      nonPrintable++;
    }
  }
  
  // 如果不可打印字符超过 10%，认为是二进制
  const nonPrintableRatio = nonPrintable / totalBytes;
  if (nonPrintableRatio > 0.10) {
    return true;
  }
  
  return false;
}

function formatOutput(fileContents: FileContent[]): string {
  return fileContents
    .map(({ relativePath, content }) => {
      const trimmedContent = content.replace(/\n+$/, '');
      return `\`\`\`${relativePath}\n${trimmedContent}\n\`\`\``;
    })
    .join('\n\n');
}

export function deactivate() {}
