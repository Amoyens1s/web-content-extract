# Web Content Extractor

A library and command-line tool to extract clean content from web pages using Mozilla Readability, with enhanced SEO metadata extraction and JSON output support.

## Features

- Extracts main content from web pages, filtering out ads, navigation, and other non-essential elements
- Converts extracted content to clean Markdown format
- Enhanced SEO metadata extraction including:
  - Standard meta tags (title, description, keywords, author)
  - Open Graph metadata
  - Schema.org itemprop metadata
  - rel="author" links
  - time tags for publication dates
- Supports multiple output formats: Markdown, YAML Front Matter, and JSON
- Can be used as a library in other projects or as a standalone CLI tool
- Built with TypeScript and Node.js
- Uses `@mozilla/readability` for accurate content extraction
- Uses `ofetch` for robust HTTP requests with timeout handling

## Installation

```bash
npm install web-content-extract
```

## Usage as a Library

```typescript
import { extractContent } from "web-content-extract";

// Basic content extraction
const result = await extractContent("https://example.com");
console.log(result.content); // Markdown content

// Content extraction with SEO metadata
const resultWithSeo = await extractContent("https://example.com", true);
console.log(resultWithSeo.title); // Article title
console.log(resultWithSeo.seo); // SEO metadata
console.log(resultWithSeo.content); // Markdown content

// JSON output example
console.log(JSON.stringify(resultWithSeo, null, 2));
```

## Usage as a CLI Tool

Run the tool using `npx`:

```bash
npx web-content-extract <url> [options]
```

### Arguments

- `<url>`: The URL of the web page to extract content from (required)

### Options

- `-o, --output <file>`: Output file path (default: stdout)
- `-s, --seo`: Include SEO metadata in the output
- `-j, --json`: Output in JSON format

### Examples

Extract content and output to stdout:

```bash
npx web-content-extract https://example.com
```

Extract content and save to a file:

```bash
npx web-content-extract https://example.com -o output.md
```

Extract content with SEO metadata in YAML Front Matter format:

```bash
npx web-content-extract https://example.com --seo
```

Extract content with SEO metadata in JSON format:

```bash
npx web-content-extract https://example.com --seo --json
```

## API

### `extractContent(url: string, includeSeo?: boolean): Promise<ExtractedContent>`

Extracts content from a web page.

**Parameters:**

- `url`: The URL of the web page to extract content from
- `includeSeo`: Whether to include SEO metadata (default: false)

**Returns:**
An object with the following properties:

- `content`: The extracted content in Markdown format
- `title`: The title of the article
- `seo`: SEO metadata (only if `includeSeo` is true)

### `ExtractedContent` Interface

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

## How It Works

1. **Fetch**: Uses `ofetch` to retrieve the HTML content of the specified URL with a 10-second timeout
2. **Parse**: Uses `jsdom` to create a DOM environment from the HTML
3. **Extract**: Uses `@mozilla/readability` to identify and extract the main article content
4. **SEO Metadata**: Extracts comprehensive SEO metadata from various sources:
   - Standard meta tags
   - Open Graph tags
   - Schema.org itemprop attributes
   - rel="author" links
   - time tags
5. **Convert**: Uses `turndown` to convert the extracted HTML content to Markdown
6. **Output**: Outputs the content in the requested format (Markdown, YAML Front Matter, or JSON)

## Development

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Dependencies

- [@mozilla/readability](https://www.npmjs.com/package/@mozilla/readability): Content extraction engine
- [jsdom](https://www.npmjs.com/package/jsdom): DOM implementation for Node.js
- [ofetch](https://www.npmjs.com/package/ofetch): Modern fetch implementation
- [turndown](https://www.npmjs.com/package/turndown): HTML to Markdown converter
- [yargs](https://www.npmjs.com/package/yargs): CLI argument parser

## License

MIT
