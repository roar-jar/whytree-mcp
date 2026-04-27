import type { StructuredBrief } from '../schema.js';

export function formatBriefMarkdown(brief: StructuredBrief): string {
  return [
    `# Structured Brief`,
    ``,
    `- Request: ${brief.request}`,
    `- Domain: ${brief.domain}`,
    `- Request type: ${brief.requestType}`,
    `- Task: ${brief.task}`,
    `- Purpose: ${brief.purpose}`,
    `- Why now: ${brief.whyNow}`,
    `- Problem framing: ${brief.problemFraming}`,
    ``,
    `## Constraints`,
    ...brief.constraints.map((item) => `- ${item}`),
    ``,
    `## Success signals`,
    ...brief.successSignals.map((item) => `- ${item}`),
    ``,
    `## Assumptions`,
    ...brief.assumptions.map((item) => `- ${item}`),
    ``,
    `## Open questions`,
    ...brief.openQuestions.map((item) => `- ${item}`),
    ``,
    `## Suggested prompt`,
    brief.suggestedPrompt,
    ``,
    `## Next step options`,
    ...brief.nextStepOptions.map((item) => `- ${item}`),
  ].join('\n');
}
