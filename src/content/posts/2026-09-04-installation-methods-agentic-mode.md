---
title: 'Installation methods: Agentic mode'
pubDate: 2026-09-04 00:15:00 -0600
head:
  - - meta
    - name: description
      content: Installation methods Agentic mode
  - - meta
    - property: og:image
      content: ./_assets/2026-09-04-installation-methods-agentic-mode/header.png
---

> _Any installation with Agentic approach_ it's now a mandatory requirement, you can't ignore it.

Recently, with AI agent development, the things surrounding software development have changed, just like a (real) wave.

Now, if you're a developer whose main mission is to create and build tools/scripts for someone else, you must be seeing or discovering a new requirement: `Agent installation method`.

## Idea

When you're adding instructions to every repo that you build, you're thinking of them as a series of commands that can be chained and must be executed
by another programmer or user. Now, in the same way, another set of instructions must be added, and currently, it's missing.

The main idea is:

```bash
Go to https://github.com/<anyuser>/<anyrepo> and follow the instructions there for installation
```

This is something like `one shoot command`, because it ignores the entire repository at first glance and puts all its attention on the `README.md` file (it infers that it
starts there).

## New approach

Now, when you add some extra help that any agent can follow as part of a flow or approach, that can be considered more useful:

```bash
Download an explore the follow script, and tell me what can be archive: https://raw.githubusercontent.com/<user>/repo>/refs/heads/<branch>/agent-retrieve.sh
```

This approach changes the way the agent tries to interact with the repo, and the result is useful. It's a simple idea.

## Misc

[MattPocock] has some awesome skills for agents. There's even a skill called: [writing-for-agents] that works fine, but maybe you've encountered a situation where
you only require some code, scripts, or content inside the repository.
In that specific scenario, `agent-retrieve.sh` can be useful. It's simple: it must ne an entry point for any agnet before interacting with the entire repo, a simple mapping wrapper.

[MattPocock]: https://github.com/mattpocock/
[writing-for-agents]: https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md
