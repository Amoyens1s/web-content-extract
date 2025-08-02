import { ofetch } from 'ofetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

export interface SeoMetadata {
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

export interface ExtractedContent {
  content: string;
  title?: string;
  seo?: SeoMetadata;
}

/**
 * 从指定URL提取网页内容并转换为Markdown
 * @param url 目标网页URL
 * @param includeSeo 是否包含SEO信息
 * @returns 提取的内容和SEO信息
 */
export async function extractContent(url: string, includeSeo: boolean = false): Promise<ExtractedContent> {
  // 1. 网络请求获取HTML
  const html = await fetchHtml(url);
  
  // 2. 使用jsdom构建DOM
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;
  
  // 3. 提取SEO信息（如果需要）
  let seo: SeoMetadata | undefined;
  if (includeSeo) {
    seo = extractSeoMetadata(document);
  }
  
  // 4. 使用Readability提取核心内容
  const reader = new Readability(document);
  const article = reader.parse();
  
  // 5. 转换为Markdown（如果能提取到内容）
  let markdown = '';
  let title = seo?.title || '';
  
  if (article) {
    const turndownService = new TurndownService();
    markdown = turndownService.turndown(article.content);
    title = article.title;
  }
  
  return {
    content: markdown,
    title,
    seo
  };
}

/**
 * 提取页面的SEO元数据
 * @param document DOM文档
 * @returns SEO元数据对象
 */
function extractSeoMetadata(document: Document): SeoMetadata {
  const metadata: SeoMetadata = {};
  
  // 基本元数据 - 按优先级提取
  // Title: <title> > og:title > twitter:title
  metadata.title = document.querySelector('title')?.textContent?.trim() ||
                   document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || undefined;
  
  // Description: meta[name="description"] > og:description > twitter:description
  metadata.description = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || undefined;
  
  // Keywords: meta[name="keywords"]
  metadata.keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || undefined;
  
  // Author: Schema.org itemprop > meta[name="author"] > meta[property="article:author"] > rel="author"
  metadata.author = document.querySelector('[itemprop="author"] [itemprop="name"]')?.getAttribute('content') ||
                    document.querySelector('[itemprop="author"]')?.getAttribute('content') ||
                    document.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    document.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
                    document.querySelector('a[rel="author"]')?.textContent?.trim() || undefined;
  
  // Published Time: Schema.org itemprop > meta[property="article:published_time"] > meta[name="publish_date"] > meta[property="og:article:published_time"] > time[datetime]
  metadata.publishedTime = document.querySelector('[itemprop="datePublished"]')?.getAttribute('content') ||
                           document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                           document.querySelector('meta[name="publish_date"]')?.getAttribute('content') ||
                           document.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
                           document.querySelector('time')?.getAttribute('datetime') || undefined;
  
  // Site Name: og:site_name > Schema.org
  metadata.siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
                      document.querySelector('[itemprop="publisher"]')?.getAttribute('content') || undefined;
  
  // Language: html[lang] > og:locale
  metadata.language = document.documentElement.lang ||
                      document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || undefined;
  
  // Open Graph 信息
  metadata.openGraph = {
    title: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || undefined,
    type: document.querySelector('meta[property="og:type"]')?.getAttribute('content') || undefined,
    image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
           document.querySelector('[itemprop="thumbnailUrl"]')?.getAttribute('href') || undefined,
    url: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ||
         document.querySelector('[itemprop="url"]')?.getAttribute('href') || undefined,
    description: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || undefined,
    siteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || undefined,
    locale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || undefined
  };
  
  // 清理空值
  if (metadata.openGraph && Object.values(metadata.openGraph).every(value => !value)) {
    delete metadata.openGraph;
  }
  
  return metadata;
}

/**
 * 使用ofetch获取网页HTML内容
 * @param url 目标URL
 * @returns HTML字符串
 */
async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await ofetch(url, {
      timeout: 10000, // 10秒超时
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      // 添加重试机制
      retry: 3
    });
    
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Request timeout: Failed to fetch ${url} within 10 seconds.`);
    }
    throw new Error(`Failed to fetch ${url}: ${(error as Error).message}`);
  }
}