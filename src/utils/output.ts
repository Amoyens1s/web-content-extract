import { promises as fs } from 'fs';

/**
 * 将内容输出到指定位置
 * @param content 要输出的内容
 * @param outputPath 输出文件路径，如果未指定则输出到stdout
 */
export async function writeOutput(content: string, outputPath?: string): Promise<void> {
  if (outputPath) {
    try {
      await fs.writeFile(outputPath, content, 'utf-8');
      console.log(`Content successfully written to ${outputPath}`);
    } catch (error) {
      throw new Error(`Failed to write to file ${outputPath}: ${(error as Error).message}`);
    }
  } else {
    console.log(content);
  }
}