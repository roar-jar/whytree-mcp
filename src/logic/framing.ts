import { domainTemplates, requestTypeHints } from './templates.js';
import { inferDomain, inferLanguage, inferRequestType, likelyNeedsClarification } from './heuristics.js';
import type { Domain, GenerateQuestionsInput, StructuredBrief, StructurePromptInput } from '../schema.js';

function mergeConstraints(constraints: string[], deadline?: string, audience?: string): string[] {
  const merged = [...constraints];
  if (deadline) merged.push(`Deadline: ${deadline}`);
  if (audience) merged.push(`Audience: ${audience}`);
  return merged;
}

function buildTask(request: string, domain: Domain, language: 'ko' | 'en'): string {
  if (language === 'en') {
    return `Turn the request into a concrete ${domain} brief and next action: ${request}`;
  }
  return `요청을 구체적인 ${domain} 브리프와 다음 실행으로 전환: ${request}`;
}

function buildPurpose(request: string, fallback: string, language: 'ko' | 'en'): string {
  if (language === 'en') {
    return `The immediate aim behind "${request}" is to clarify intent before jumping into execution. ${fallback}`;
  }
  return `"${request}"라는 요청 뒤의 실제 의도를 실행 전에 먼저 분명히 한다. ${fallback}`;
}

function buildWhyNow(domainWhyNow: string, deadline: string | undefined, language: 'ko' | 'en'): string {
  if (deadline) {
    return language === 'en'
      ? `${domainWhyNow} The stated timing constraint is ${deadline}.`
      : `${domainWhyNow} 현재 드러난 시간 제약은 ${deadline}이다.`;
  }
  return domainWhyNow;
}

function buildProblemFraming(templateFraming: string, requestTypeHint: string, language: 'ko' | 'en'): string {
  return language === 'en'
    ? `${templateFraming} Recommended mode: ${requestTypeHint}`
    : `${templateFraming} 권장 접근 모드: ${requestTypeHint}`;
}

function buildAssumptions(input: StructurePromptInput, inferredDomain: Domain, language: 'ko' | 'en'): string[] {
  const assumptions = [
    language === 'en'
      ? `The request belongs primarily to the ${inferredDomain} domain.`
      : `이 요청은 우선 ${inferredDomain} 도메인에 가깝다고 가정한다.`,
  ];

  if (!input.audience) {
    assumptions.push(language === 'en' ? 'The target audience is not yet specified.' : '대상 독자는 아직 명시되지 않았다.');
  }

  if (!input.deadline) {
    assumptions.push(language === 'en' ? 'No explicit deadline was provided.' : '명시적 마감은 아직 제공되지 않았다.');
  }

  return assumptions;
}

function buildOpenQuestions(templateQuestions: string[], language: 'ko' | 'en', needsClarification: boolean): string[] {
  if (!needsClarification) {
    return language === 'en'
      ? ['What evidence would make this brief feel complete enough to execute?']
      : ['이 브리프가 실행 가능하다고 느끼려면 어떤 정보가 더 필요할까?'];
  }
  return templateQuestions;
}

function buildSuggestedPrompt(brief: Omit<StructuredBrief, 'suggestedPrompt'>, language: 'ko' | 'en'): string {
  if (language === 'en') {
    return [
      `Task: ${brief.task}`,
      `Purpose: ${brief.purpose}`,
      `Why now: ${brief.whyNow}`,
      `Problem framing: ${brief.problemFraming}`,
      `Constraints: ${brief.constraints.join('; ') || 'None stated yet'}`,
      `Success signals: ${brief.successSignals.join('; ')}`,
      `Open questions: ${brief.openQuestions.join('; ')}`,
      'Please produce the next best concrete output, not just a generic summary.'
    ].join('\n');
  }

  return [
    `Task: ${brief.task}`,
    `Purpose: ${brief.purpose}`,
    `Why now: ${brief.whyNow}`,
    `Problem framing: ${brief.problemFraming}`,
    `Constraints: ${brief.constraints.join('; ') || '아직 명시된 제약 없음'}`,
    `Success signals: ${brief.successSignals.join('; ')}`,
    `Open questions: ${brief.openQuestions.join('; ')}`,
    '일반 요약이 아니라 다음 단계에서 바로 쓸 수 있는 구체적 산출물을 만들어줘.'
  ].join('\n');
}

function buildNextSteps(domain: Domain, language: 'ko' | 'en'): string[] {
  const byDomain: Record<Domain, string[]> = {
    research: ['연구 질문 1문장 확정', '목차 초안 5개 이하로 설계', '필요 참고문헌 수집 목록 만들기'],
    writing: ['독자 정의', '핵심 메시지 1줄 작성', '문서 개요 초안 만들기'],
    product: ['타깃 사용자 정의', '문제 진술문 작성', '핵심 가치 제안 3안 비교'],
    strategy: ['선택지 나열', '판단 기준 3개 정의', '우선순위 결정'],
    operations: ['업무 단계 분해', '완료 기준 작성', '반복 체크리스트 초안 작성'],
    general: ['요청을 한 문장으로 재정의', '왜 중요한지 설명', '다음 행동 1개 정하기'],
  };

  if (language === 'en') {
    return byDomain[domain].map((item) => `Next: ${item}`);
  }
  return byDomain[domain];
}

export function structurePrompt(input: StructurePromptInput): StructuredBrief {
  const domain = input.domain ?? inferDomain(input.request);
  const requestType = inferRequestType(input.request);
  const language = input.language ?? inferLanguage(input.request);
  const template = domainTemplates[domain];
  const needsClarification = likelyNeedsClarification(input.request);
  const constraints = mergeConstraints(input.constraints ?? [], input.deadline, input.audience);

  const partial = {
    request: input.request,
    domain,
    requestType,
    task: buildTask(input.request, domain, language),
    purpose: buildPurpose(input.request, template.purpose, language),
    whyNow: buildWhyNow(template.whyNow, input.deadline, language),
    problemFraming: buildProblemFraming(template.framing, requestTypeHints[requestType], language),
    constraints,
    successSignals: template.successSignals,
    assumptions: buildAssumptions(input, domain, language),
    openQuestions: buildOpenQuestions(template.questions, language, needsClarification),
    nextStepOptions: buildNextSteps(domain, language),
  };

  return {
    ...partial,
    suggestedPrompt: buildSuggestedPrompt(partial, language),
  };
}

export function generateClarifyingQuestions(input: GenerateQuestionsInput): { domain: Domain; questions: string[]; rationale: string } {
  const domain = input.domain ?? inferDomain(input.request);
  const language = input.language ?? inferLanguage(input.request);
  const questions = domainTemplates[domain].questions.slice(0, input.maxQuestions);

  return {
    domain,
    questions,
    rationale: language === 'en'
      ? 'These questions reduce ambiguity before execution.'
      : '이 질문들은 실행 전에 모호함을 줄이기 위해 우선 확인할 항목들이다.',
  };
}
