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

> In this new era, building stuff is easier and faster, that's awesome. As a builder, the main mantra: build fast, and iterate faster, it's possible.

## Idea

Sometimes, when I'm working on an entire software project, I can feel something boring 'cause it can't interact with the real world.
That is the greatest gap between software and hardware. Now, with some aid from LLMs ([OpenCode]), I can try to build something interesting.
I think to use my skills: _c, cpp, kicad, design schematics([KiCad])_ and so on.

## Stuff

My main goal is to build an _AR lens_ with the most common sparks at the market:

- ESP-WROOM-32
- OLED display 0.96"
- IMU-6050
- GLONASS/GPS module

I choose [FreeRTOS] as the primary program focused on real time telemetry.

For the glass frame I downloaded [Glasses frame] from [Thingiverse].

## Overview

> Hardware + Software layer abstraction

```mermaid
graph TB
    subgraph APP["Skylens"]
        MAIN["main.c\nboot + task creation"]
    end

    subgraph COMP["Components"]
        DISPLAY["display/\noled.c + oled.h"]
        BOARD["board/\nboard.h"]
        TASKS["tasks/\nfuture sensors"]
        UTILS["utils/\nserial helpers"]
    end

    subgraph IDF["ESP-IDF Libs"]
        ESP_LCD["esp_lcd\npanel abstraction"]
        I2C_DRV["esp_driver_i2c\nI2C master"]
        FREERTOS["FreeRTOS\nscheduler + tasks"]
        SOC["soc/\nperipheral access"]
    end

    subgraph HW2["Hardware"]
        GPIO["GPIO\npins"]
        SPI["SPI\nflash"]
    end

    MAIN --> DISPLAY
    MAIN --> BOARD
    MAIN --> TASKS
    DISPLAY --> BOARD
    DISPLAY --> ESP_LCD
    DISPLAY --> I2C_DRV
    MAIN --> FREERTOS
    ESP_LCD --> I2C_DRV
    I2C_DRV --> GPIO
    FREERTOS --> SOC
```

> Data flow

```mermaid
flowchart LR
    subgraph INPUT["Sensor Inputs"]
        GPS["GPS Module\nUART"]
        IMU["IMU / Compass\nI2C"]
        BARO["Barometer\nI2C"]
    end

    subgraph PROC["Firmware Processing"]
        PARSE["parse / convert\nraw → telemetry"]
        FB["Framebuffer\n1024 bytes\n128×64 px"]
        FONT["FONT8X8\nglyph lookup"]
    end

    subgraph OUTPUT["Outputs"]
        OLED_OUT["SSD1306 OLED\nALT / LAT / LONG"]
        SERIAL_OUT["Serial Monitor\n115200 baud"]
    end

    GPS --> PARSE
    IMU --> PARSE
    BARO --> PARSE
    PARSE --> FB
    FB --> FONT
    FONT --> OLED_OUT
    PARSE --> SERIAL_OUT
```

> Program logic

```mermaid
flowchart TD
Start([System Boot & Calibration]) --> Loop{Main Loop}

    Loop --> ReadData[Read GPS, IMU, Altimeter]
    ReadData --> CalcData[Calculate Telemetry]

    CalcData --> CheckGeo{Near Geo-Reference?}
    CheckGeo -- Yes --> DrawGeo[Overlay Geo-Reference]
    CheckGeo -- No --> DrawHUD[Draw Standard HUD]
    DrawGeo --> Render[Render to Display]
    DrawHUD --> Render
    Render --> Loop

    DimDisplay --> SavePower[Low Power Mode]
    SavePower --> Loop
```

## Next steps

- [ ] New transparent screen
- [ ] Android/iOS application (Kotlin)
- [ ] New glass frame (3D model)
- [ ] PCB ready to fit in frame

Also, I'm working on a MCP for KiCad that enhances the creation experience and brings a comfortable experience, reducing friction between coding plans and building time.

[OpenCode]: https://opencode.ai/
[FreeRTOS]: https://www.freertos.org/
[Thingiverse]: https://www.thingiverse.com/
[KiCad]: https://www.kicad.org/
[Glasses frame]: https://www.thingiverse.com/thing:6098101
