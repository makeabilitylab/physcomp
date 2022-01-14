---
layout: default
title: ESP32
nav_order: 6
has_toc: false # on by default
has_children: true
nav_exclude: false
usetocbot: true
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

## [Lesson 2: Blinking an LED](led-blink.md)

Introduces how to program the ESP32 using the Arduino IDE and ESP32 Arduino library ([link](led-blink.md))

## [Lesson 3: Fading an LED with PWM](led-fade.md)

In this [lesson](led-fade.md), you'll learn how to use PWM output on the ESP32 to fade an LED on and off. The ESP32 Arduino library does not have an `analogWrite` method, so you'll learn how to use PWM via an alternative method.

## [Lesson 4: Analog Input](pot-fade.md)

In this [lesson](pot-fade.md), you'll learn how to use analog input on the ESP32 by building a potentiometer-based LED fader.

## [Lesson 5: Playing Tones](tone.md)

 Arduino's [`tone()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) method is not supported on the ESP32. In this [lesson](tone.md), you'll learn how to play tones using the `ledcWriteTone` and `ledcWriteNote` in [esp32-hal-ledc.c](https://github.com/espressif/arduino-esp32/blob/master/cores/esp32/esp32-hal-ledc.c).

## [Lesson 6: Capacitive Touch Sensing](capacitive-touch-sensing.md)

The ESP32 has built-in circuitry and software for capacitive touch sensing ([docs](https://github.com/espressif/esp-iot-solution/blob/master/documents/touch_pad_solution/touch_sensor_design_en.md#1-introduction-to-touch-sensor-system)). In [this lesson](capacitive-touch-sensing.md), we’ll use the touch sensing functionality to turn on an LED.

## [Lesson 7: Internet of Things](iot.md)

The ESP32 is exciting not just because of its speed, memory, and GPIO capabilities but also because it is truly a modern Internet of Things (IoT) board with Wi-Fi and Bluetooth support. In this lesson, we'll learn how to use WiFi and the IoT platform [Adafruit IO](https://learn.adafruit.com/welcome-to-adafruit-io) to upload sensor data in real-time.
