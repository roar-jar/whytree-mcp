import type { Domain, RequestType } from '../schema.js';

const domainKeywords: Array<{ domain: Domain; keywords: string[] }> = [
  { domain: 'research', keywords: ['논문', '연구', '학술', 'citation', 'paper', 'research', 'thesis', 'methodology'] },
  { domain: 'product', keywords: ['서비스', '제품', '기능', '고객', 'ux', 'pmf', 'landing', 'feature', 'product', '랜딩페이지', 'landing page'] },
  { domain: 'writing', keywords: ['글', '원고', '카피', '블로그', '에세이', 'write', 'draft', 'copy'] },
  { domain: 'strategy', keywords: ['전략', '방향', '포지셔닝', '피봇', '우선순위', 'strategy', 'positioning'] },
  { domain: 'operations', keywords: ['운영', '프로세스', '체크리스트', '반복', '관리', 'ops', 'operation', 'workflow'] },
];

const requestTypeKeywords: Array<{ type: RequestType; keywords: string[] }> = [
  { type: 'write', keywords: ['써', '작성', '초안', 'draft', 'write'] },
  { type: 'plan', keywords: ['계획', '플랜', '로드맵', 'plan', 'organize', '정리'] },
  { type: 'decide', keywords: ['결정', '선택', '비교', 'decide', 'choose'] },
  { type: 'analyze', keywords: ['분석', '해석', '검토', 'analyze', 'review'] },
  { type: 'execute', keywords: ['실행', '해줘', '만들어', 'do', 'execute', 'build'] },
];

export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

export function inferDomain(request: string): Domain {
  const normalized = normalizeText(request);
  for (const candidate of domainKeywords) {
    if (candidate.keywords.some((keyword) => normalized.includes(keyword))) {
      return candidate.domain;
    }
  }
  return 'general';
}

export function inferRequestType(request: string): RequestType {
  const normalized = normalizeText(request);
  for (const candidate of requestTypeKeywords) {
    if (candidate.keywords.some((keyword) => normalized.includes(keyword))) {
      return candidate.type;
    }
  }

  if (/(뭐|무엇|why|why now|어떻게|how)/.test(normalized)) {
    return 'explore';
  }

  return 'plan';
}

export function inferLanguage(request: string): 'ko' | 'en' {
  return /[가-힣]/.test(request) ? 'ko' : 'en';
}

export function likelyNeedsClarification(request: string): boolean {
  const normalized = normalizeText(request);
  const short = normalized.length <= 12;
  const vaguePatterns = ['할 거야', '해야 해', '정리해야', '도와줘', 'help me', 'need to'];
  return short || vaguePatterns.some((pattern) => normalized.includes(pattern));
}
