import type { GenerateQuestionsInput } from '../schema.js';
import { generateClarifyingQuestions } from '../logic/framing.js';

export function generateQuestionsTool(input: GenerateQuestionsInput) {
  return generateClarifyingQuestions(input);
}
