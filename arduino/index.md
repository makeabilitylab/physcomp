---
layout: default
title: Intro to Arduino
nav_order: 2
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

Welcome 👋 to the second module in your Physical Computing journey. Although you can begin your journey here, we strongly recommend that you complete the first module on [Intro to Electronics](../electronics/index.md) first. This will allow you to have a more deep understanding of the content. We will refer back to content from the first module.

These tutorials are interactive and designed to be completed **in order**. All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

<!-- Call this intro to Microcontrollers and then cast Arduino as an example? -->

<!-- Add an Intro to Microcontrollers, talk about Arduino vs. RaspPi -->

## Intro to Output

<!-- Consider adding a debugging with Serial Monitor lesson -- maybe after Lesson 3? -->

### [Lesson 1: Turning on an LED](led-on.md)

Introduces the Arduino power and ground pins, powering an initial LED circuit with a current limiting resistor, and plugging components into the Arduino.

### [Lesson 2: Blinking an LED](led-blink.md)

Introduces the Arduino IDE and the ability to programmatically control Arduino GPIO pins to turn an LED on and off via [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/).

### [Lesson 3: Serial debugging](serial-print.md)

Introduces some basic debugging approaches for Arduino, with a specific focus on [`Serial.print`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/).

### [Lesson 4: Fading an LED](led-fade.md)

Demonstrates how to gradually fade an LED on and off by using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)

### [Lesson 5: Blinking an LED Part 2](led-blink2.md)

Introduces the concept of using Arduino GPIO pins as either current **sources** or **sinks** by hooking up two LED circuit configurations: one circuit with the LED cathode towards GND and another with the LED anode towards GND.

### [Lesson 6: RGB LEDs](rgb-led.md)

Introduces RGB LEDs, using both common anode and cathode versions, and independently controlling brightness and hue.

### [Lesson 7: Crossfading RGB LEDs](rgb-led-fade.md)

Shows how to fade between RGB colors using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/), to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness, and to use and load local `C/C++` libraries

### [Lesson 8: Rate Blinking Multiple LEDs](led-blink3.md)

In this lesson, we will learn how to blink multiple LEDs at different rates and build our first [C/C++ class](http://www.cplusplus.com/doc/tutorial/classes/), which will greatly simplify our code and, as an added bonus, reduce its size by eliminating code redundancy.

## Intro to Input

### [Lesson 1: Using buttons](buttons.md)

Introduces buttons (aka momentary switches), digital input, using Arduino's [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) function, and pull-up and pull-down resistors.

### [Lesson 2: Button piano](piano.md)

In this lesson, we are going to make a simple five-key piano with tactile buttons wired with internal pull-up resistors and a [piezo buzzer](https://www.adafruit.com/product/160).

### [Lesson 3: Potentiometers](potentiometers.md)

Introduces potentiometers and rheostats, analog input, and using Arduino's [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) function. Also shows how to use Tinkercad to prototype and test circuits in an online simulator and how to use a multimeter to measure current.

### [Lesson 4: Force-sensitive resistors](force-sensitive-resistors.md)

Introduces force-sensitive resistors (FSRs), how to use two-legged variable resistors with microcontrollers (including FSRs), and how to make a force-piano. Very Jedi-like!

<!--
TODO: after Lesson 4, have them make their own lo-fi resistive sensor?
TODO: what is debouncing and why
TODO: how to use interrupts
TODO: how to use some startup sequence to calibrate sensors?
TODO: some basics on smoothing the signal? -->

<!-- ## Other possibilities
- Debugging
  - Using VS Code
- TODO: consider adding interrupts here? Like after Lesson 2?
  - Nick Gammon's blog is a nice resource for this: https://www.gammon.com.au/interrupts
- When to introduce -->
