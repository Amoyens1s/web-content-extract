# Web Content Extract

一个使用 Mozilla Readability 提取网页内容的库和命令行工具，支持增强的 SEO 元数据提取和 JSON 输出。

[English Version](README.md)

## 功能

- 从网页中提取主要内容，过滤广告、导航和其他非必要元素
- 将提取的内容转换为干净的 Markdown 格式
- 增强的 SEO 元数据提取，包括：
  - 标准 meta 标签（标题、描述、关键词、作者）
  - Open Graph 元数据
  - Schema.org itemprop 元数据
  - rel="author" 链接
  - 时间标签用于发布日期
- 支持多种输出格式：Markdown、YAML Front Matter 和 JSON
- 可以作为库在其他项目中使用，或作为独立的 CLI 工具
- 使用 TypeScript 和 Node.js 构建
- 使用 `@mozilla/readability` 进行准确的内容提取
- 使用 `ofetch` 进行具有超时处理的健壮 HTTP 请求

## 安装

```bash
npm install web-content-extract
```

## 作为库使用

```typescript
import { extractContent } from "web-content-extract";

// 基本内容提取
const result = await extractContent("https://example.com");
console.log(result.content); // Markdown 内容

// 带 SEO 元数据的内容提取
const resultWithSeo = await extractContent("https://example.com", true);
console.log(resultWithSeo.title); // 文章标题
console.log(resultWithSeo.seo); // SEO 元数据
console.log(resultWithSeo.content); // Markdown 内容

// JSON 输出示例
console.log(JSON.stringify(resultWithSeo, null, 2));
```

## 作为 CLI 工具使用

使用 `npx` 运行工具：

```bash
npx web-content-extract <url> [options]
```

### 参数

- `<url>`: 要提取内容的网页 URL（必需）

### 选项

- `-o, --output <file>`: 输出文件路径（默认: stdout）
- `-s, --seo`: 在输出中包含 SEO 元数据
- `-j, --json`: 以 JSON 格式输出

### 示例

提取内容并输出到 stdout：

```bash
npx web-content-extract https://example.com
```

提取内容并保存到文件：

```bash
npx web-content-extract https://example.com -o output.md
```

提取带 SEO 元数据的内容（YAML Front Matter 格式）：

```bash
npx web-content-extract https://example.com --seo
```

提取带 SEO 元数据的内容（JSON 格式）：

```bash
npx web-content-extract https://example.com --seo --json
```

## API

### `extractContent(url: string, includeSeo?: boolean): Promise<ExtractedContent>`

从网页中提取内容。

**参数:**

- `url`: 要提取内容的网页 URL
- `includeSeo`: 是否包含 SEO 元数据（默认: false）

**返回:**
一个包含以下属性的对象：

- `content`: 以 Markdown 格式提取的内容
- `title`: 文章标题
- `seo`: SEO 元数据（仅在 `includeSeo` 为 true 时存在）

### `ExtractedContent` 接口

```typescript
interface ExtractedContent {
  content: string;
  title?: string;
  seo?: SeoMetadata;
}

interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  siteName?: string;
  language?: string;
  openGraph?: {
    title?: string;
    type?: string;
    image?: string;
    url?: string;
    description?: string;
    siteName?: string;
    locale?: string;
  };
}
```

## 工作原理

1. **获取**: 使用 `ofetch` 检索指定 URL 的 HTML 内容，超时时间为 10 秒
2. **解析**: 使用 `jsdom` 从 HTML 创建 DOM 环境
3. **提取**: 使用 `@mozilla/readability` 识别和提取主要文章内容
4. **SEO 元数据**: 从各种来源提取全面的 SEO 元数据：
   - 标准 meta 标签
   - Open Graph 标签
   - Schema.org itemprop 属性
   - rel="author" 链接
   - 时间标签
5. **转换**: 使用 `turndown` 将提取的 HTML 内容转换为 Markdown
6. **输出**: 以请求的格式输出内容（Markdown、YAML Front Matter 或 JSON）

## 开发

1. 克隆或下载此仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建项目：
   ```bash
   npm run build
   ```

## 依赖

- [@mozilla/readability](https://www.npmjs.com/package/@mozilla/readability): 内容提取引擎
- [jsdom](https://www.npmjs.com/package/jsdom): Node.js 的 DOM 实现
- [ofetch](https://www.npmjs.com/package/ofetch): 现代 fetch 实现
- [turndown](https://www.npmjs.com/package/turndown): HTML 到 Markdown 转换器
- [yargs](https://www.npmjs.com/package/yargs): CLI 参数解析器

## 许可证

MIT
