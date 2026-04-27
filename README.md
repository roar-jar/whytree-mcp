# Why Tree

`whytree-mcp` is the MCP package for Why Tree, a server that turns vague requests into purpose-driven structured briefs.

Instead of stopping at "do X", it helps turn fuzzy intent into a reusable execution prompt with:

- task
- purpose
- why now
- problem framing
- constraints
- success signals
- assumptions
- open questions
- next-step options

This is useful when the user's thinking is still under-structured and needs a logic-tree / design-thinking style framing layer before execution.

## Good inputs

- "논문 쓸 거야"
- "서비스 방향 정리해야 해"
- "발표 자료 만들어야 해"
- "리서치부터 해야 할지 기획부터 해야 할지 모르겠어"
- "I need to figure out what this project is really trying to achieve"

## Tools

### `structure_prompt`
Turns a vague request into a structured brief and a reusable execution prompt.

### `generate_clarifying_questions`
Returns the most useful follow-up questions when the request is still too fuzzy.

### `refine_brief`
Strengthens an existing brief around purpose, constraints, success, execution, or risks.

### `classify_request`
Classifies the request by domain and request type so you can pick the right framing template.

## Install

### Run with npx

```bash
npx -y whytree-mcp
```

### Claude Code / Claude Desktop MCP config

```json
{
  "mcpServers": {
    "whytree": {
      "command": "npx",
      "args": ["-y", "whytree-mcp"]
    }
  }
}
```

## Example outcome

Input:

```text
논문 쓸 거야
```

Output shape:

```text
Task: 요청을 구체적인 research 브리프와 다음 실행으로 전환: 논문 쓸 거야
Purpose: "논문 쓸 거야"라는 요청 뒤의 실제 의도를 실행 전에 먼저 분명히 한다...
Why now: 연구를 시작하려면 주제·질문·자료 범위를 먼저 분명히 해야 한다.
Problem framing: 지금 막힌 지점이 연구질문 정의인지, 목차 설계인지, 선행연구 확보인지 나눠서 본다.
Success signals: 연구 질문이 한 문장으로 정리된다 ...
```

## Optional Claude Code skill

This package also includes a companion skill at `skills/structured-brief/SKILL.md` with the slash-command name `/whytree` for people who want a branded workflow inside Claude Code.

## Local development

```bash
npm install
npm test
npm pack --dry-run
```

## GitHub and npm release checklist

1. Create the public GitHub repository: `roar-jar/whytree-mcp`.
2. Push the package contents.
3. Enable npm trusted publishing for this repository in npm package settings.
4. Create a GitHub Release tag like `v0.1.0`.
5. Let `.github/workflows/publish.yml` publish the package to npm via OIDC, without a long-lived token.

## npm trusted publishing setup

In npm, open the `whytree-mcp` package settings and add a trusted publisher for this GitHub repository/workflow:

- repository: `roar-jar/whytree-mcp`
- workflow file: `.github/workflows/publish.yml`
- environment: none required

After that, GitHub Releases can publish to npm without storing an `NPM_TOKEN` secret in GitHub.

## License

MIT
