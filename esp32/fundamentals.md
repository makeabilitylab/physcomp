---
layout: default
title: Fundamentals
description: "The ESP32 Fundamentals series: set up the board, blink and fade LEDs with the LEDC PWM peripheral, read the 12-bit ADC, play tones, and use built-in capacitive touch before going wireless."
parent: ESP32
nav_order: 1
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# ESP32 Fundamentals
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- TODO Add an awesome fun video extracted from one of the lessons as a hero teaser -->

In this lesson series, you will learn the foundations of programming the ESP32: how it differs from the Arduino Uno and Leonardo you've used before, how to set up your development environment, and how to use the ESP32's hardware features—from GPIO and PWM to its 12-bit ADC and built-in capacitive touch sensing. By the end of this series, you'll be comfortable enough with the board to dive into [the Wireless series](wireless.md), where the ESP32 really shines.

The lessons are interactive and designed to be completed **in order**. All ESP32 code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino/tree/master/ESP32).

{: .note }
> Before starting, we recommend completing both [Intro to Electronics](../electronics/index.md) and [Intro to Arduino](../arduino/index.md). We build on concepts from those modules—like voltage dividers, `digitalWrite`, `analogWrite`, and PWM—without re-explaining them in detail here.

## Lessons

### [Lesson 1: Introduction to the ESP32](esp32.md)

Learn about the ESP32 platform, how it compares to the Arduino Uno and Leonardo, and how to set up your development environment. You'll get familiar with the pin diagram and important hardware differences like the 3.3V operating voltage.

### [Lesson 2: Blinking an LED](led-blink.md)

Write your first ESP32 program! The code is the same as the Arduino [Blink lesson](../arduino/led-blink.md)—the challenge here is getting comfortable with the new board and its pin layout.

### [Lesson 3: Fading an LED with PWM](led-fade.md)

Learn how to use PWM output on the ESP32 to fade an LED. This is where things start to diverge from Arduino: instead of `analogWrite`, the ESP32 uses the LEDC (LED Control) library, which gives you more control over PWM channels, frequencies, and resolutions.

### [Lesson 4: Analog Input](analog-input.md)

Use the ESP32's 12-bit ADC to read a potentiometer and control an LED's brightness—combining analog input with PWM output.

### [Lesson 5: Playing Tones](tone.md)

Learn how to play tones and melodies on the ESP32 using the `tone()` function (now supported in ESP32 Arduino core v3.x!) and the LEDC PWM library.

### [Lesson 6: Capacitive Touch Sensing](capacitive-touch-sensing.md)

The ESP32 has built-in capacitive touch sensing hardware—no external components needed! In this lesson, you'll use a bare wire (or aluminum foil) as a touch sensor to control an LED.

## What's next?

Once you've completed the Fundamentals lessons, move on to [Wireless](wireless.md) to learn about WiFi, Bluetooth Classic, and Bluetooth Low Energy (BLE)—the features that make the ESP32 truly powerful for IoT and physical computing projects!

<!-- TODO: FUTURE FUNDAMENTALS LESSONS TO ADD
============================================================

## Reference page: Inside ESP32 (inside-esp32.md) [MEDIUM PRIORITY]
Similar to inside-arduino.md, a "deep dives for the curious" page covering:
- How LEDC PWM works under the hood (timer groups, channels, hardware)
- FreeRTOS and dual-core task scheduling (why loop() only runs on core 1)
- ESP32 ADC nonlinearity and calibration (the ADC is notoriously noisy/nonlinear;
  ESP-IDF has calibration APIs but the Arduino core doesn't fully expose them)
- The WiFi/ADC2 hardware conflict: why it happens at the silicon level
- How native USB works on the S3 vs. the CP2104 UART bridge on the Huzzah32
- ESP32 boot process: ROM bootloader → 2nd stage bootloader → application
- Memory architecture: IRAM, DRAM, PSRAM, RTC memory, flash cache
- Power domains and why deep sleep current is so low
Only create this page when there are at least 3-4 solid sections to fill it.
Thin reference pages feel incomplete and unmaintained.

## Lesson: Using STEMMA QT / Qwiic I2C Devices
- The ESP32-S3 Feather has a STEMMA QT connector for plug-and-play I2C
- Connecting sensors (BME280, accelerometer, etc.) without soldering
- Using Adafruit sensor libraries
- Could combine with IoT lesson for a complete sensor-to-cloud pipeline

## Lesson: I2S Audio
- Using the I2S peripheral for higher-quality audio input/output
- Connecting an I2S microphone (e.g., INMP441) or amplifier (e.g., MAX98357A)
- Recording and playing back audio
- More advanced than the tone lesson; real audio, not just square waves

## Note on DAC lessons:
- The original ESP32 has two 8-bit DAC channels (GPIO25, GPIO26) for true analog output
- The ESP32-S3 does NOT have a DAC, so a DAC-specific lesson would only
  apply to students with an original ESP32 or Huzzah32
- If we add a DAC lesson, clearly mark it as original-ESP32-only
- For analog output on the S3, use PWM with an RC filter, or an external DAC (MCP4725)
-->