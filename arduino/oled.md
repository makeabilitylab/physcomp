---
layout: default
title: L1&#58; Turning on an OLED
nav_order: 1
parent: Advanced Output
grand_parent: Intro to Arduino
usemathjax: true
has_toc: true # (on by default)
comments: true
nav_exclude: true
usetocbot: true
search_exclude: true
---

<!-- consider adding parent "Advanced Arduino" or Advanced I/O -->

These instructions are for the [Adafruit 128x64 OLED graphic display](https://www.adafruit.com/product/938). You can follow the official [Adafruit tutorial here](https://learn.adafruit.com/monochrome-oled-breakouts/arduino-library-and-examples).

## Install Arduino libraries

### Step 1: Open Manage Libraries in Arduino IDE file menu

![Screenshot of selecting Tools->Manage Libraries... from Arduino IDE file menu](assets/images/ArduinoIDE_InstallLibraries.png)

### Step 2: Search for and install Adafruit SSD1306

Search for and install the Adafruit SSD1306 library.

![Screenshot searching for Adafruit SSD1306 library in Arduino IDE Library Manager](assets/images/ArduinoIDE_InstallSSD1306Library.png)

### Step 3: Install all dependencies
When asked, install all SSD1306 library dependencies:

![](assets/images/ArduinoIDE_InstallAllSSD1306Dependencies.png)

## Load and run sample code

Once the SSD1306 library and dependencies have been installed, wire up and test out the display using the `ssd1306_128x64` example code.

![Screenshot of using Arduino IDE file menu to load the SSD1306 sample code](assets/images/ArduinoIDE_LoadingSSD1306SampleCode.png)

## Resources:
- https://learn.adafruit.com/monochrome-oled-breakouts/overview
- https://lastminuteengineers.com/oled-display-arduino-tutorial/
- https://learn.adafruit.com/adafruit-gfx-graphics-library/graphics-primitives

## SPI vs. I2C
- SPI is much faster: https://www.youtube.com/watch?v=SvOX-xs9v8M 