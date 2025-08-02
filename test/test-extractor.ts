import { extractContent } from '../src/core/extractor';

async function runTests() {
  console.log('Running extractor tests...\n');

  // 测试用例1: 简单网页
  try {
    console.log('Test 1: Extracting content from example.com');
    const result1 = await extractContent('https://example.com');
    console.log('Success: Extracted content length:', result1.content.length);
    console.log('Content preview:', result1.content.substring(0, 200) + '...\n');
  } catch (error) {
    console.error('Test 1 failed:', (error as Error).message, '\n');
  }

  // 测试用例2: MDN Web Docs
  try {
    console.log('Test 2: Extracting content from developer.mozilla.org');
    const result2 = await extractContent('https://developer.mozilla.org/en-US/docs/Web/JavaScript');
    console.log('Success: Extracted content length:', result2.content.length);
    console.log('Content preview:', result2.content.substring(0, 200) + '...\n');
  } catch (error) {
    console.error('Test 2 failed:', (error as Error).message, '\n');
  }

  // 测试用例3: 错误处理 - 无效URL
  try {
    console.log('Test 3: Handling invalid URL');
    await extractContent('https://this-is-an-invalid-url-that-should-not-exist-12345.com');
    console.log('Unexpected success - this should have failed\n');
  } catch (error) {
    console.log('Success: Correctly handled invalid URL with error:', (error as Error).message, '\n');
  }

  console.log('All tests completed.');
}

runTests();