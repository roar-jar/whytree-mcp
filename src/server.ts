import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { classifyRequest } from './tools/classifyRequest.js';
import { generateQuestionsTool } from './tools/generateQuestions.js';
import { refineBriefTool } from './tools/refineBrief.js';
import { structurePromptTool } from './tools/structurePrompt.js';
import { formatBriefMarkdown } from './format/markdown.js';
import {
  classifyRequestInputSchema,
  generateQuestionsInputSchema,
  refineBriefInputSchema,
  structuredBriefSchema,
  structurePromptInputSchema,
} from './schema.js';

export function createServer() {
  const server = new McpServer(
    { name: 'prompt-structurer-mcp', version: '0.1.0' },
    {
      instructions:
        'Turn vague requests into purpose-driven briefs with task, purpose, why-now, constraints, success signals, and next-step prompts.',
    },
  );

  server.registerTool(
    'structure_prompt',
    {
      description: 'Turn a vague request into a structured brief and reusable prompt.',
      inputSchema: structurePromptInputSchema,
      outputSchema: structuredBriefSchema,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async (input) => {
      const brief = structurePromptTool(input);
      return {
        content: [{ type: 'text', text: formatBriefMarkdown(brief) }],
        structuredContent: brief,
      };
    },
  );

  server.registerTool(
    'generate_clarifying_questions',
    {
      description: 'Generate the most useful clarifying questions when a request is still fuzzy.',
      inputSchema: generateQuestionsInputSchema,
      outputSchema: z.object({
        domain: z.string(),
        questions: z.array(z.string()),
        rationale: z.string(),
      }),
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async (input) => {
      const result = generateQuestionsTool(input);
      const text = [`# Clarifying questions`, '', ...result.questions.map((q, index) => `${index + 1}. ${q}`), '', `Rationale: ${result.rationale}`].join('\n');
      return {
        content: [{ type: 'text', text }],
        structuredContent: result,
      };
    },
  );

  server.registerTool(
    'refine_brief',
    {
      description: 'Strengthen an existing brief around purpose, constraints, success, execution, or risks.',
      inputSchema: refineBriefInputSchema,
      outputSchema: z.object({
        focus: z.string(),
        missing: z.array(z.string()),
        additions: z.union([z.string(), z.array(z.string())]),
        refinedPrompt: z.string(),
      }),
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async (input) => {
      const result = refineBriefTool(input);
      const additions = Array.isArray(result.additions) ? result.additions.join('\n- ') : result.additions;
      const text = [
        '# Refined brief guidance',
        '',
        `Focus: ${result.focus}`,
        `Missing: ${result.missing.join(', ') || 'None'}`,
        '',
        `Additions:`,
        Array.isArray(result.additions) ? `- ${additions}` : additions,
        '',
        'Refined prompt:',
        result.refinedPrompt,
      ].join('\n');
      return {
        content: [{ type: 'text', text }],
        structuredContent: result,
      };
    },
  );

  server.registerTool(
    'classify_request',
    {
      description: 'Classify a request by domain and request type to pick the right framing template.',
      inputSchema: classifyRequestInputSchema,
      outputSchema: z.object({
        domain: z.string(),
        requestType: z.string(),
        language: z.string(),
        needsClarification: z.boolean(),
        recommendedTemplate: z.string(),
      }),
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async ({ request }) => {
      const result = classifyRequest(request);
      const text = [
        '# Request classification',
        '',
        `- Domain: ${result.domain}`,
        `- Request type: ${result.requestType}`,
        `- Language: ${result.language}`,
        `- Needs clarification: ${result.needsClarification}`,
        `- Recommended template: ${result.recommendedTemplate}`,
      ].join('\n');
      return {
        content: [{ type: 'text', text }],
        structuredContent: result,
      };
    },
  );

  return server;
}

export async function startServer() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('prompt-structurer-mcp running on stdio');
}
