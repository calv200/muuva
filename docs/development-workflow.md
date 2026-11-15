# MUUVA Multi-Agent Development Workflow

## Overview

This document describes the multi-agent development workflow for the MUUVA website, managed through Kilo Code.

## Agents

### 1. MUUVA Coordinator (Primary)
- **Model**: Qwen3-Coder-Next via OpenRouter
- **Permissions**: Read access, controlled delegation, edits require approval
- **Role**: Planning, delegation, dependencies, integration, human approval workflow

### 2. Implementation Agent (Subagent)
- **Model**: Qwen3-Coder-Next via OpenRouter
- **Permissions**: Read access, edits require approval, restricted shell access
- **Role**: Feature implementation and bug fixes under coordinator supervision

### 3. QA Reviewer (Subagent)
- **Model**: Qwen3-Coder-Next via OpenRouter
- **Permissions**: Read access only, edit denied, test commands require approval
- **Role**: Test validation, build verification, regression detection

## Agent Selection

### Coordinator
Available as a primary agent - can be selected directly in the Kilo TUI or CLI.

### Implementation/QA Agents
Launched only via the `task` tool with explicit delegation from the coordinator.

## Approval Workflow

The following actions require **explicit human approval**:

1. **All file edits** (via `edit` tool)
2. **All shell command execution** (via `bash` tool)
3. **Task agent delegation** (via `task` tool)
4. **Production deployment** (via `/deploy-production` command)
5. **Destructive operations** (file deletions, branch operations, remote pushes)

## Development Process

### Standard Task Flow
1. User submits request to Coordinator
2. Coordinator analyzes requirements
3. Coordinator delegates to Implementation or QA Reviewer as needed
4. Agent performs work with approval prompts
5. Coordinator reviews outputs
6. Coordinator applies or rejects changes

### Testing Flow
1. Coordinator or QA Reviewer runs `npm test`
2. QA Reviewer runs `npm run build`
3. QA Reviewer runs `npm run test:production`
4. All checks must pass before claiming completion

## Branch Strategy

- **main**: Production branch (protected by GitHub Actions)
- **staging**: Integration branch (default for development)
- **Feature branches**: Created per task when isolation is beneficial

## Configuration Files

- `.kilo/agent/*.md`: Agent definitions (Kilo config)
- `docs/development-workflow.md`: This file
- `AGENTS.md`: Project-specific development instructions

## Security Notes

- Agent instructions are NOT a security boundary - use Kilo permissions for enforcement
- Shell access is potentially powerful - all commands require approval
- Credentials and secrets must never be stored in configuration files
- Production deployments require explicit human approval

## Future Enhancements

- Optional Codex debugging specialist (requires ChatGPT Plus verified connection)
- Worktree isolation for parallel development
- Deployment automation with approval gates
