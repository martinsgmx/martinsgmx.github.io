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

## Motivation

When AI starts has a relevant participation inside any organization, the main issue it's create some really useful tools.
Also, a organization has a lot information that must be well structure and retrieve under easy ways.

MCP's can be helpful in some scenarios.

Sentinel Ops (MCP + ML) it's an PoC that can handle a some business rules, send alerts and create profiles. It's an combination
between MCP, Machine Learning and visualization actions (live monitoring).

In any business that involves money or resources the hard decisions must be taken with a lot of information, the risk must be minimum.

## Architecture overview

> NOTE: This is a first iteration, maybe contains some errors.

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

In the remain iterations, some issues must be covered, also, the dashboard must be integrate some AI chat that
can handle prompts, generate reports and so on.

You can access to full code from this repo: [martinsgmx/sentinel-ops.git]

[martinsgmx/sentinel-ops.git]: https://github.com/martinsgmx/sentinel-ops
