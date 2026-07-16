---
title: 'Building amidst AI tokens'
pubDate: 2026-07-12 00:15:00 -0600
head:
  - - meta
    - name: description
      content: Building amidst AI tokens
  - - meta
    - property: og:image
      content: ./_assets/2026-07-14-building-amidst-ai-tokens/header.png
---

In this new era, building stuff are more easily and fast, that's awesome. As builder, the main mantra: build fast, and iterate faster, it's possible.

## Stuff

My main goal is build an AR lens with the most common sparks at the market:

- ESP-WROOM-32
- OLED display 0.96"
- IMU-6050
- GLONASS/GPS module

This is is good for an started point, in the next iteration can be refined.

I thinks in freeRTOS for real time telemetry, this is an simple started project for another more complex: lens, AR, sky...

## Concepts

> AR concepts architecture

```mermaid
graph TD
subgraph "AR Lens"
MCU[Microcontroller: ESP32-S3 / STM32]

        subgraph "Input Sensors"
            GPS[High-Rate GPS 10Hz+]
            IMU[IMU + Barometer]
            Eye[IR Eye-Tracking Sensor]
        end

        subgraph "Output & Optics"
            Screen[Micro-OLED / LCoS Display]
            Optics[Waveguide / Optical Combiner]
        end

        subgraph "Power & Comms"
            Batt[Battery Management System]
            RF[Bluetooth / Wi-Fi Telemetry]
        end

        GPS --> MCU
        IMU --> MCU
        Eye --> MCU
        MCU --> Screen
        Screen --> Optics
        Batt --> MCU
        MCU --> RF
    end
```

## Next steps

I'm working on an MCP for KiCad that enhanced the creation experience and brings and comfortable experience between makers, reducing
fictions between coding plans and building time, and at the same time, building an bridge (another MCP) for Blender 3D for printer creations.

[OpenCode]: https://opencode.ai/
