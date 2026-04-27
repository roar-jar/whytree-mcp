import { inferDomain, inferLanguage, inferRequestType, likelyNeedsClarification } from '../logic/heuristics.js';
import { domainTemplates } from '../logic/templates.js';

export function classifyRequest(request: string) {
  const domain = inferDomain(request);
  const requestType = inferRequestType(request);
  const language = inferLanguage(request);

  return {
    domain,
    requestType,
    language,
    needsClarification: likelyNeedsClarification(request),
    recommendedTemplate: domainTemplates[domain].framing,
  };
}
