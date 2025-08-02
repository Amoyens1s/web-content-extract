#!/usr/bin/env tsx

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { extractContent } from './lib';
import { writeOutput } from './utils/output';

interface Arguments {
  url: string;
  output?: string;
  seo?: boolean;
  json?: boolean;
}

async function main() {
  const argv: any = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <url> [options]')
    .command('$0 <url>', 'Extract content from a web page', (yargs) => {
      return yargs
        .positional('url', {
          describe: 'URL of the web page to extract content from',
          type: 'string',
        })
        .option('output', {
          alias: 'o',
          describe: 'Output file path (default: stdout)',
          type: 'string',
        })
        .option('seo', {
          alias: 's',
          describe: 'Include SEO metadata in the output',
          type: 'boolean',
          default: false
        })
        .option('json', {
          alias: 'j',
          describe: 'Output in JSON format',
          type: 'boolean',
          default: false
        });
    })
    .help()
    .alias('help', 'h')
    .parse();

  const { url, output, seo, json } = argv as Arguments;

  try {
    const extractedContent = await extractContent(url, seo || false);
    
    if (json) {
      // JSON格式输出
      console.log(JSON.stringify(extractedContent, null, 2));
    } else {
      // 原有格式输出
      if (seo && extractedContent.seo) {
        let seoOutput = '---\n';
        if (extractedContent.title) {
          seoOutput += `title: "${extractedContent.title}"\n`;
        }
        
        // 添加SEO元数据
        const seoData = extractedContent.seo;
        if (seoData.description) seoOutput += `description: "${seoData.description}"\n`;
        if (seoData.keywords) seoOutput += `keywords: "${seoData.keywords}"\n`;
        if (seoData.author) seoOutput += `author: "${seoData.author}"\n`;
        if (seoData.publishedTime) seoOutput += `publishedTime: "${seoData.publishedTime}"\n`;
        if (seoData.siteName) seoOutput += `siteName: "${seoData.siteName}"\n`;
        if (seoData.language) seoOutput += `language: "${seoData.language}"\n`;
        
        // 添加Open Graph信息
        if (seoData.openGraph) {
          seoOutput += 'openGraph:\n';
          if (seoData.openGraph.title) seoOutput += `  title: "${seoData.openGraph.title}"\n`;
          if (seoData.openGraph.type) seoOutput += `  type: "${seoData.openGraph.type}"\n`;
          if (seoData.openGraph.image) seoOutput += `  image: "${seoData.openGraph.image}"\n`;
          if (seoData.openGraph.url) seoOutput += `  url: "${seoData.openGraph.url}"\n`;
          if (seoData.openGraph.description) seoOutput += `  description: "${seoData.openGraph.description}"\n`;
          if (seoData.openGraph.siteName) seoOutput += `  siteName: "${seoData.openGraph.siteName}"\n`;
          if (seoData.openGraph.locale) seoOutput += `  locale: "${seoData.openGraph.locale}"\n`;
        }
        
        seoOutput += '---\n\n';
        await writeOutput(seoOutput + extractedContent.content, output);
      } else {
        await writeOutput(extractedContent.content, output);
      }
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();