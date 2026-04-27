# Why Tree

Why Tree is a Claude Code skill for turning vague requests into purpose-driven briefs.

If a user starts with something fuzzy like:
- "논문 쓸 거야"
- "서비스 방향 정리해야 해"
- "발표자료 만들어야 해"
- "I need to figure out what this project is really trying to achieve"

Why Tree helps structure it into:
- task
- purpose
- why now
- problem framing
- constraints
- success signals
- open questions
- next-step options

The goal is simple: do not jump straight from a vague idea to shallow execution.

## Install as a Claude Code skill

### One-line install

```bash
git clone https://github.com/roar-jar/whytree-mcp.git ~/.claude/skills/whytree
```

### One-line install or update

```bash
if [ -d ~/.claude/skills/whytree ]; then
  git -C ~/.claude/skills/whytree pull
else
  git clone https://github.com/roar-jar/whytree-mcp.git ~/.claude/skills/whytree
fi
```

## Use

In Claude Code, run:

```text
/whytree
```

## What the skill does

Why Tree acts like a lightweight logic-tree / design-thinking layer before execution:

1. clarify what the user is actually trying to do
2. surface why it matters now
3. expose missing constraints or success criteria
4. turn that into a reusable prompt or brief

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

## Advanced: MCP package

This repository also includes an MCP package named `whytree-mcp` for advanced users who want to run Why Tree as an MCP server.

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

## Local development

```bash
npm install
npm test
npm pack --dry-run
```

## npm trusted publishing setup

For the MCP package release flow, configure npm trusted publishing for:

- repository: `roar-jar/whytree-mcp`
- workflow file: `.github/workflows/publish.yml`
- environment: none required

## License

MIT
