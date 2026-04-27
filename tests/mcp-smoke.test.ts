import test from 'node:test';
import assert from 'node:assert/strict';
import { Client, StdioClientTransport } from '@modelcontextprotocol/client';

const serverEntry = new URL('../dist/index.js', import.meta.url);

test('MCP server exposes expected tools', async () => {
  const client = new Client({ name: 'prompt-structurer-test-client', version: '0.1.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: [serverEntry.pathname] });

  await client.connect(transport);
  const tools = await client.listTools();
  const names = tools.tools.map((tool) => tool.name);

  assert.ok(names.includes('structure_prompt'));
  assert.ok(names.includes('generate_clarifying_questions'));
  assert.ok(names.includes('refine_brief'));
  assert.ok(names.includes('classify_request'));

  const result = await client.callTool({
    name: 'structure_prompt',
    arguments: { request: '논문 쓸 거야', language: 'ko' },
  });

  assert.ok(result.structuredContent);
  const structured = result.structuredContent as Record<string, unknown>;
  assert.equal(structured.domain, 'research');
  assert.equal(typeof structured.suggestedPrompt, 'string');

  await client.close();
});
