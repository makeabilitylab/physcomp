---
layout: default
title: Output
parent: Intro to Arduino
nav_order: 1
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# Intro to Output
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- TODO Add an awesome fun video extracted from one of the lessons as a hero teaser -->

In this lesson series, you will learn how to programmatically control Arduino's GPIO pins to drive LEDs, produce colors with RGB LEDs, generate tones with piezo buzzers, and build your first C++ class. We start with the basics—powering an LED from Arduino's supply pins—and progressively introduce digital output (`digitalWrite`), debugging with `Serial.print`, analog output (`analogWrite` and PWM), sound generation (`tone`), current sourcing *vs.* sinking, and multi-rate blinking without `delay()`.

The lessons are interactive and designed to be completed **in order**. All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

{: .note }
> Before starting, make sure you have the [Arduino IDE](arduino-ide.md) installed and have reviewed the [Arduino Uno vs. Leonardo](index.md#arduino-uno-r3-vs-arduino-leonardo) section. If you're new to electronics, we recommend completing [Intro to Electronics](../electronics/index.md) first.

<!-- TODO:
    * I'm tempted to put in a tone lesson after LED fading because we are just too LED heavy here imo.
        - Putting it after LED fading (analogWrite) lets us bring up difference between changing PWM duty cycle (with analogWrite) and changing square wave freq (with tone)
        - Could demonstrate the above by hooking up a potentiometer that changes the PWM wave using a pot; then switch to changing freq with pot
        - Could also demonstrate by hooking up piezo two one pin that is 490 for PWM and another that is 980Hz
        - Some great ideas in our https://makeabilitylab.github.io/physcomp/esp32/tone.html lesson too
    -->

## Lessons

### [Lesson 1: Turning on an LED](led-on.md)

You'll build your [first LED circuit](led-on.md) using Arduino's power and ground pins, learn about current-limiting resistors, and get hands-on experience plugging components into the Arduino.

### [Lesson 2: Blinking an LED with `digitalWrite()`](led-blink.md)

You'll write your [first Arduino program](led-blink.md) to programmatically control a GPIO pin, turning an LED on and off using [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/).

### [Lesson 3: Debugging with `Serial.println`](serial-print.md)

Introduces some basic [debugging approaches](serial-print.md) for Arduino, with a specific focus on [`Serial.print`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/).

### [Lesson 4: Fading an LED with `analogWrite()`](led-fade.md)

Introduces [analog output](led-fade.md), pulse-width modulation (PWM), and demonstrates how to gradually fade an LED on and off by using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/).

### [Lesson 5: Playing Sounds with `tone()`](tone.md)

Explores how to generate square waves of varying frequencies to [play sounds and melodies](tone.md) using a piezo buzzer and the [`tone()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) function.

### [Lesson 6: Blinking an LED Part 2](led-blink2.md)

Explores the difference between [current sourcing and current sinking](led-blink2.md) by hooking up two LED circuit configurations: one with the LED anode facing the I/O pin (current source) and another with the LED cathode facing the I/O pin (current sink).

### [Lesson 7: RGB LEDs](rgb-led.md)

Introduces [RGB LEDs](rgb-led.md), using both common anode and cathode versions, and controlling color output with `digitalWrite`.

### [Lesson 8: Crossfading RGB LEDs](rgb-led-fade.md)

Shows how to [fade between RGB colors](rgb-led-fade.md) using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/), to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness, and to use and load local `C/C++` libraries.

### [Lesson 9: Rate Blinking Multiple LEDs](led-blink3.md)

You'll learn how to [blink multiple LEDs at different rates](led-blink3.md) and build your first [C/C++ class](https://en.cppreference.com/w/cpp/language/classes), which will greatly simplify your code and reduce its size by eliminating redundancy.

## What's next?

Once you've completed the Output lessons, move on to [Intro to Input](intro-input.md) to learn about buttons, sensors, voltage dividers, and more!