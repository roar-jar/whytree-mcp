import * as z from 'zod/v4';

export const domainSchema = z.enum(['research', 'writing', 'product', 'strategy', 'operations', 'general']);
export const depthSchema = z.enum(['light', 'standard', 'deep']);
export const focusSchema = z.enum(['purpose', 'constraints', 'success', 'execution', 'risks']);
export const requestTypeSchema = z.enum(['explore', 'decide', 'plan', 'write', 'analyze', 'execute']);

export const structurePromptInputSchema = z.object({
  request: z.string().min(1),
  domain: domainSchema.optional(),
  depth: depthSchema.optional().default('standard'),
  audience: z.string().optional(),
  deadline: z.string().optional(),
  constraints: z.array(z.string()).optional().default([]),
  language: z.enum(['ko', 'en']).optional().default('ko'),
});

export const classifyRequestInputSchema = z.object({
  request: z.string().min(1),
});

export const generateQuestionsInputSchema = z.object({
  request: z.string().min(1),
  domain: domainSchema.optional(),
  maxQuestions: z.number().int().min(1).max(10).optional().default(5),
  language: z.enum(['ko', 'en']).optional().default('ko'),
});

export const refineBriefInputSchema = z.object({
  brief: z.union([z.string(), z.record(z.string(), z.any())]),
  focus: focusSchema,
  language: z.enum(['ko', 'en']).optional().default('ko'),
});

export const structuredBriefSchema = z.object({
  request: z.string(),
  domain: domainSchema,
  requestType: requestTypeSchema,
  task: z.string(),
  purpose: z.string(),
  whyNow: z.string(),
  problemFraming: z.string(),
  constraints: z.array(z.string()),
  successSignals: z.array(z.string()),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  suggestedPrompt: z.string(),
  nextStepOptions: z.array(z.string()),
});

export type Domain = z.infer<typeof domainSchema>;
export type Depth = z.infer<typeof depthSchema>;
export type Focus = z.infer<typeof focusSchema>;
export type RequestType = z.infer<typeof requestTypeSchema>;
export type StructuredBrief = z.infer<typeof structuredBriefSchema>;
export type StructurePromptInput = z.infer<typeof structurePromptInputSchema>;
export type GenerateQuestionsInput = z.infer<typeof generateQuestionsInputSchema>;
export type RefineBriefInput = z.infer<typeof refineBriefInputSchema>;
