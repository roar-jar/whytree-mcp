import test from 'node:test';
import assert from 'node:assert/strict';
import { structurePromptTool } from '../src/tools/structurePrompt.js';
import { generateQuestionsTool } from '../src/tools/generateQuestions.js';
import { classifyRequest } from '../src/tools/classifyRequest.js';
import { refineBriefTool } from '../src/tools/refineBrief.js';

test('structurePrompt creates a research brief for Korean paper request', () => {
  const result = structurePromptTool({ request: '논문 쓸 거야', language: 'ko' });

  assert.equal(result.domain, 'research');
  assert.match(result.task, /브리프|전환/);
  assert.ok(result.purpose.length > 0);
  assert.ok(result.whyNow.length > 0);
  assert.ok(result.successSignals.length >= 1);
  assert.ok(result.openQuestions.length >= 1);
  assert.match(result.suggestedPrompt, /Purpose:/);
});

test('generateQuestions returns bounded clarifying questions', () => {
  const result = generateQuestionsTool({ request: '서비스 방향 정리해야 해', maxQuestions: 2, language: 'ko' });

  assert.equal(result.questions.length, 2);
  assert.equal(result.domain, 'product');
});

test('classifyRequest detects product request and clarification need', () => {
  const result = classifyRequest('랜딩페이지 카피 써줘');

  assert.equal(result.domain, 'product');
  assert.equal(result.requestType, 'write');
  assert.equal(result.language, 'ko');
  assert.equal(typeof result.needsClarification, 'boolean');
});

test('refineBrief fills missing purpose and success signals', () => {
  const result = refineBriefTool({
    brief: { task: '논문 초안 작성', constraints: [] },
    focus: 'success',
    language: 'ko',
  });

  assert.ok(result.missing.includes('purpose'));
  assert.ok(result.missing.includes('successSignals'));
  assert.match(result.refinedPrompt, /Success signals:/);
});
