---
layout: default
title: L4&#58; Capacitive touch sensing
nav_order: 4
parent: ESP32
has_toc: true # (on by default)
usemathjax: true
comments: true
nav_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

The ESP32 has built-in circuitry and software for capacitive touch sensing ([docs](https://github.com/espressif/esp-iot-solution/blob/master/documents/touch_pad_solution/touch_sensor_design_en.md#1-introduction-to-touch-sensor-system)). In this lesson, we'll use the touch sensing functionality to X and Y.

<!-- TODO: write background on capacitive touch sensing -->

## Materials

You'll need the following materials:

| Breadboard | ESP32 | LED | Resistor |
| ---------- |:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Huzzah32]({{ site.baseurl }}/assets/images/ESP32Huzzah32_Adafruit_vertical_h200.png)    | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Breadboard | Huzzah32  | Red LED | 220Ω Resistor |

## ESP32's touch sensor system

The ESP32's touch sensor circuit measures the total capacitance on a touch channel. When the capacitance changes and the amount of change exceeds the threshold value, the system can detect finger contact or proximity.

The ESP32 has 10 capacitive touch pins; however, only **eight** are exposed on the Huzzah32:

![Huzzah32 pin diagram](assets/images/AdafruitHuzzah32PinDiagram.png)
See the Adafruit Huzzah32 [docs](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/pinouts) for details. Right-click and open image in a new tab to zoom in. For more details on the capacitive touch pins, see the Espressif [docs](https://github.com/espressif/esp-iot-solution/blob/master/documents/touch_pad_solution/touch_sensor_design_en.md).
{: .fs-1 } 

### Advantages of touch sensing vs. physical buttons

Capacitive touch sensing is now widely used in household appliances, consumer electronics, and in industrial contexts. As the ESP32 [docs](https://github.com/espressif/esp-iot-solution/blob/master/documents/touch_pad_solution/touch_sensor_design_en.md#1-introduction-to-touch-sensor-system) enumerate, compared with mechanical buttons, capacitive touch sensing offers:
- No mechanical parts that wear over time
- Completely sealed surfaces (that can be waterproofed)
- Fewer components
- A modern look

However, the lack of physical buttons can reduce accessibility, especially for blind or low-vision users.