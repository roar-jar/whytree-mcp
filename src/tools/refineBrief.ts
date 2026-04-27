import type { RefineBriefInput, StructuredBrief } from '../schema.js';
import { inferLanguage } from '../logic/heuristics.js';

function parseBrief(brief: RefineBriefInput['brief']): Record<string, unknown> {
  if (typeof brief === 'string') {
    try {
      return JSON.parse(brief) as Record<string, unknown>;
    } catch {
      return { raw: brief };
    }
  }
  return brief;
}

function toList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function refineBriefTool(input: RefineBriefInput) {
  const parsed = parseBrief(input.brief);
  const language = input.language ?? inferLanguage(typeof input.brief === 'string' ? input.brief : JSON.stringify(input.brief));
  const missing: string[] = [];

  const base = {
    task: String(parsed.task ?? parsed.request ?? ''),
    purpose: String(parsed.purpose ?? ''),
    whyNow: String(parsed.whyNow ?? parsed.why_now ?? ''),
    constraints: toList(parsed.constraints),
    successSignals: toList(parsed.successSignals ?? parsed.success_signals),
    openQuestions: toList(parsed.openQuestions ?? parsed.open_questions),
  };

  if (!base.purpose) missing.push('purpose');
  if (!base.whyNow) missing.push('whyNow');
  if (base.constraints.length === 0) missing.push('constraints');
  if (base.successSignals.length === 0) missing.push('successSignals');

  const additions: Record<string, string | string[]> = {
    purpose: language === 'en'
      ? `Refine the core purpose so the work explains why it matters, not only what to do.`
      : '무엇을 할지뿐 아니라 왜 중요한지 설명하는 목적 문장으로 더 정교화한다.',
    constraints: language === 'en'
      ? ['Audience or stakeholder constraints', 'Deadline or cadence constraints', 'Tone, format, or scope constraints']
      : ['독자·이해관계자 제약', '마감·주기 제약', '톤·형식·범위 제약'],
    success: language === 'en'
      ? ['A concrete artifact exists', 'The output can be reviewed quickly', 'The next action becomes obvious']
      : ['구체적 산출물이 존재한다', '빠르게 검토 가능하다', '다음 행동이 분명해진다'],
    execution: language === 'en'
      ? 'Break the work into one immediate action, one validating action, and one follow-up action.'
      : '즉시 실행 1개, 검증용 실행 1개, 후속 실행 1개로 나눈다.',
    risks: language === 'en'
      ? ['The brief may still be too broad', 'Success criteria may be subjective', 'A missing deadline can blur priority']
      : ['브리프 범위가 여전히 넓을 수 있다', '성공조건이 주관적일 수 있다', '마감 부재로 우선순위가 흐려질 수 있다'],
  };

  const refinedPrompt = language === 'en'
    ? `Task: ${base.task || 'Clarify the task'}\nPurpose: ${base.purpose || additions.purpose}\nWhy now: ${base.whyNow || 'Make the timing or urgency explicit.'}\nConstraints: ${(base.constraints.length ? base.constraints : additions.constraints as string[]).join('; ')}\nSuccess signals: ${(base.successSignals.length ? base.successSignals : additions.success as string[]).join('; ')}`
    : `Task: ${base.task || '작업을 분명히 하기'}\nPurpose: ${base.purpose || additions.purpose}\nWhy now: ${base.whyNow || '왜 지금 해야 하는지 분명히 하기'}\nConstraints: ${(base.constraints.length ? base.constraints : additions.constraints as string[]).join('; ')}\nSuccess signals: ${(base.successSignals.length ? base.successSignals : additions.success as string[]).join('; ')}`;

  return {
    focus: input.focus,
    missing,
    additions: additions[input.focus],
    refinedPrompt,
  };
}
