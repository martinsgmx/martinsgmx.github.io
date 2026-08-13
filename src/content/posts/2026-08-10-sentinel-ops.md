---
title: 'Sentinel Ops (MCP + ML)'
pubDate: 2026-08-10 00:15:00 -0600
head:
  - - meta
    - name: description
      content: Sentinel Ops (MCP + ML)
  - - meta
    - property: og:image
      content: ./_assets/2026-08-10-sentinel-ops-mcp/header.png
---

> You can access to full code from: [martinsgmx/sentinel-ops.git]

> For this PoC, the credit card transactions dataset are taken from: [kaggle.com/datasets/priyamchoksi/credit-card-transactions-dataset]

## Motivation

When AI starts to play an relevant role inside any organization, the main challenge is creating some really useful tools.
Also, an organization has a lot of information that must be well-structured and retrieve easily.

MCPs can be helpful in some scenarios.

Sentinel Ops (MCP + ML) it's a PoC that can handle business rules, send alerts and create profiles. It's a combination
between MCP, Machine Learning and visualization/actions (live monitoring).

In any business that involves money or valuable resources, critical decisions must based on as much relevant information as possible.
The goal is to minimized risk while making those decisions faster and more effectively.

## Architecture overview

> NOTE: As a first iteration, this version maybe contains some errors.

The architecture, at this time, it's a little simple: train with transactions -> creation model -> run model -> audit transactions -> trigger an alert -> MCP works

```mermaid
flowchart LR
    subgraph Producers
        MG[Marimo generator]
        CLI[pipeline publish / replay]
        API[POST /api/test/*]
    end

    subgraph Bus
        RMQ[(RabbitMQ\ntxn.raw)]
    end

    subgraph Radar["mcp_radar (Python)"]
        W[worker]
        MCP[MCP server / SSE]
        API2[REST API]
        WS[WebSocket hub]
    end

    subgraph Store
        PG[(PostgreSQL)]
        RD[(Redis pub/sub)]
    end

    subgraph Consumers
        DASH[sentinel dashboard\nNuxt 3 + D3.js]
        AGENT[AI agents\nMCP clients]
    end

    MG --> RMQ
    CLI --> RMQ
    API --> RMQ
    RMQ --> W
    W --> PG
    W --> RD
    RD --> WS
    WS --> DASH
    MCP --> PG
    API2 --> PG
    DASH --> API2
    AGENT <--> MCP
```

## How alert system works

This is a draft of how the alert system works. It will be complemented with MCP, AI agents, and other components.

```mermaid
flowchart TD
TX[Transaction] --> ML{ML score}
TX --> RULES{Rules engine}
ML -->|calibrated 0-1| C1{≥ 0.7?}
RULES -->|any flag?| C2{flagged?}
C1 -->|yes| ALERT[Create alert]
C2 -->|yes| ALERT
C1 -->|no| OK[Persist only]
C2 -->|no| OK
ALERT --> SEV[Severity from score + rule count]
SEV --> PG[(PostgreSQL)]
PG --> SENT[Sentinel Reviews]
```

In the remaining iterations, several issues need to be addressed. The dashboard should also integrate an AI chat interface capable of handling prompts, generating reports, and more.

[martinsgmx/sentinel-ops.git]: https://github.com/martinsgmx/sentinel-ops
[kaggle.com/datasets/priyamchoksi/credit-card-transactions-dataset]: https://www.kaggle.com/datasets/priyamchoksi/credit-card-transactions-dataset
