---
title: '3D Auto Fabrik (AI Skill)'
pubDate: 2026-11-23 00:15:00 -0600
aiAssisted: No
---

> The follow scenario are under Linux environment, and using [OpenCode] as main AI harness.

When you have an army of AI agents working on it, some tasks start hiding some complexity and the only traceability remains in agent feedback.
Currently I'm working on some PoCs to make some contexts or scenarios more reliable. I'm really think the complexity lives in abstraction of things, under this mindset, MCPs and AI Agent Skills are an powerful combo.

## Overview

The main `/goal` it's create a fully autonomous `end-to-end` 3d printing workflow.

The main idea behind [agent-skill-3d-auto-fabrik] is keep its behavior as an orchestrator with two main MCPs as executors:
[mcp-orca] or [mcp-cura], and [mcp-moonraker] as bridge.

## Motivation

Sometimes, when you want to print some stuff, only wants to copy or put a `.zip` or `.stl` file somewhere and forget about it.
That can be achieved by triggering a workflow with a watchdog monitoring a folder, or by executing some script (python or bash).

> At this time, handling webpages and downloading files directly from 3D printing hubs like
> Thingiverse, Printables, and so on are out of scope.

```mermaid
flowchart LR
    %% Global orchestrator
    SKILL["Agent Skill 3D> Auto <i>Fabrik</i><br/>"]

    %% MCP layer
    subgraph MCP["MCP Layer"]
        direction TB
        MOONRAKER["MCP-ORCA/CURA<br/><i>Slicing / G-code</i>"]
        ORCA["MCP-MOONRAKER<br/><i>Printer Control</i>"]
    end

    %% Printer layer
    subgraph PRINTER["3D Printer"]
        KLIPPER["KLIPPER<br/><i>Ender3</i>"]
    end

    %% Flows
    SKILL ==>|orchestrates| MCP
    MOONRAKER -->|slices to G-code| KLIPPER
    ORCA -->|controls| KLIPPER

    %% Styling
    classDef global fill:#5B6C8F,stroke:#3E4C6B,stroke-width:1.5px,color:#FFFFFF,rx:10,ry:10;
    classDef mcp fill:#7A9E9F,stroke:#567577,stroke-width:1.5px,color:#FFFFFF,rx:8,ry:8;
    classDef printer fill:#B08968,stroke:#8A6A4F,stroke-width:1.5px,color:#FFFFFF,rx:8,ry:8;

    class SKILL global;
    class MOONRAKER,ORCA mcp;
```

## Prerequisites

The skill and MCPs required a mandatory environment consisting of [klipper] and [moonraker], previously configured on the host machine.

> If you don't have a 3d printer with [klipper], I strongly recommended using [kiauh]: a simple and powerful script to manage and install
> any tools required by [klipper] environment. Check your 3D printer's compatibility.

## Wiring MCP's

> Note: you can use [mcp-cura] instead [mcp-orca] without any problems.

Now, in this guide, I'm setting up: [mcp-cura] and [mcp-moonraker] as the default environment.

> To avoid some problems, I recommended having profiles previously configured in the GUI versions of OrcaSlicer or CuraSlicer.

The [agent-skill-3d-auto-fabrik] offers a way to look for the required config files,
as well as `doctor` tools integrated into the MCPs. Any trouble or issue detected must be traceable, with tips or walkthroughs for solutions provided.

## Configuration

First of all, follow the installation instructions for [agent-skill-3d-auto-fabrik] in each repository.

### mcp-orca

Install [mcp-orca] by follwoing the instruction in the repo.

Copy the example config file provided in the [mcp-orca] repo to a custom path on your local machine:

```bash
# for linux environment
cp  /repos/mcp-orca/mcp-orca.toml ~/.config/3d-fabrik/mcp-orca.toml
```

Now, adjust the config file to match your current environment. I strongly recommend setting `binary = "orcaliscer"` to the binary's absolute path.

```toml
...
[engine]
runner = "binary"
preset = "orca"
binary = "/home/klipper/.bin/orcaslicer"
...
```

And in the agent's MCP configuration, specific the previously configured path:

```json
{
  "mcp": {
    "orca": {
      "type": "local",
      "command": ["mcp-orca", "--config", "/home/user/.config/3d-fabrik/mcp-orca.toml"]
    }
  }
}
```

Then, run the following prompt:

```text
Run mcp-orca doctor
```

The agent's response should look like this:

![Agent response](../posts/_assets/2026-11-22-3d-auto-fabrik/001_mcp_orca_slicer.png)

### mcp-moonraker

Install [mcp-moonraker] by following the instructions in the repo.

Use the following prompt:

```text
Run mcp-moonraker doctor
```

The agent's response should look like this:

![Agent response](../posts/_assets/2026-11-22-3d-auto-fabrik/002_mcp_moonraker.png)

## Triggering the workflow

Skill usage (main `prompt`):

```text
@3d-auto-fabrik Unzip the file located at: ~/Downloads/SpiralSphere.zip, slice it, and print it using ender3-klipper, with the PLA Generic and Serenity profiles.
```

The agent's response should look like this:

![Agent print prompt](../posts/_assets/2026-11-22-3d-auto-fabrik/003_prompt.png)

Now, at the latest step, you must be confirm the printing job:

![Agent print approved](../posts/_assets/2026-11-22-3d-auto-fabrik/004_approved.png)

At this point, the printing job is starting, and everything works fine!

Happy printing! >.<

> <center><i>“The most exciting phrase to hear in science, the one that heralds the most discoveries,
> is not "Eureka!", but That's funny...”</i> <br/>
> ~ <i>Isaac Asimov</i></center>

[OpenCode]: https://opencode.ai/
[agent-skill-3d-auto-fabrik]: https://github.com/martinsgmx/agent-skill-3d-auto-fabrik
[mcp-orca]: https://github.com/martinsgmx/mcp-orca
[mcp-cura]: https://github.com/martinsgmx/mcp-cura
[mcp-moonraker]: https://github.com/martinsgmx/mcp-moonraker
[moonraker]: https://moonraker.readthedocs.io/en/latest/
[kiauh]: https://github.com/dw-0/kiauh
[klipper]: https://www.klipper3d.org/
