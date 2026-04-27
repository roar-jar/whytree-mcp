import type { StructurePromptInput } from '../schema.js';
import { structurePrompt as buildStructuredPrompt } from '../logic/framing.js';

export function structurePromptTool(input: StructurePromptInput) {
  return buildStructuredPrompt(input);
}
