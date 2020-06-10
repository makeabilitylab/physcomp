---
layout: default
title: ESP32
nav_order: 4
has_toc: true # on by default
has_children: true
nav_exclude: false
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

These tutorials are interactive and designed to be completed **in order**. All ESP32 code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino/tree/master/ESP32).

<!-- TODO: add in link to Tinkercad circuits here... -->

## [Lesson 1: Introduction to the ESP32](esp32.md)

In [this lesson](esp32.md), you'll learn about the ESP32, how it differs from and relates to the Arduino platform, and how to program and use the Huzzah32 ESP32 board.

## [Lesson 1: Turning on an LED](led-on.md)

Introduces the Arduino power and ground pins, powering an initial LED circuit with a current limiting resistor, and plugging components into the Arduino.

## [Lesson 2: Blinking an LED](led-blink.md)

Introduces the Arduino IDE and the ability to programmatically control Arduino GPIO pins to turn an LED on and off via [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/).

## [Lesson 3: Fading an LED](led-fade.md)

Demonstrates how to gradually fade an LED on and off by using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)

## [Lesson 4: Blinking an LED Part 2](led-blink2.md)

Introduces the concept of using Arduino GPIO pins as either current **sources** or **sinks** by hooking up two LED circuit configurations: one circuit with the LED cathode towards GND and another with the LED anode towards GND.

## [Lesson 5: RGB LEDs](rgb-led.md)

Introduces RGB LEDs, using both common anode and cathode versions, and independently controlling brightness and hue.

## [Lesson 6: Crossfading RGB LEDs](rgb-led-fade.md)

Shows how to fade between RGB colors using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/), to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness, and to use and load local `C/C++` libraries