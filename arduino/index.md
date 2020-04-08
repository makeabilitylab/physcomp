---
layout: default
title: Intro to Arduino
nav_order: 1
has_toc: false # on by default
has_children: false
comments: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

These tutorials are interactive and designed to be completed **in order**. All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

<!-- TODO: add in link to Tinkercad circuits here... -->

## Intro to Output

### [Lesson 1: Turning on an LED](led-on.md)

Introduces the Arduino power and ground pins, powering an initial LED circuit with a current limiting resistor, and plugging components into the Arduino.

### [Lesson 2: Blinking an LED](led-blink.md)

Introduces the Arduino IDE and the ability to programmatically control Arduino GPIO pins to turn an LED on and off via [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/).

### [Lesson 3: Fading an LED](led-fade.md)

Demonstrates how to gradually fade an LED on and off by using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)

### [Lesson 4: Blinking an LED Part 2](led-blink2.md)

Introduces the concept of using Arduino GPIO pins as either current **sources** or **sinks** by hooking up two LED circuit configurations: one circuit with the LED cathode towards GND and another with the LED anode towards GND.

### [Lesson 5: RGB LEDs](rgb-led.md)

Introduces RGB LEDs, using both common anode and cathode versions, and independently controlling brightness and hue.

### [Lesson 6: Crossfading RGB LEDs](rgb-led-fade.md)

Shows how to fade between RGB colors using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/), to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness, and to use and load local `C/C++` libraries

### [Lesson 7: Rate Blinking Multiple LEDs](led-blink3.md)

In this lesson, we will learn how to blink multiple LEDs at different rates and build our first [C/C++ class](http://www.cplusplus.com/doc/tutorial/classes/), which will greatly simplify our code and, as an added bonus, reduce its size by eliminating code redundancy.

## Intro to Input

This is a **draft** list of topics (and order may change).

### Lesson 1: Using buttons

Introduces buttons (aka momentary switches), working with digital input via [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/), and pull-up and pull-down resistors.

### Lesson 2: Limiting use of delays

Shows how to poll for input without delays and the reasons for this (show first example with delays and how button is not responsive). (Maybe also refer to interrupts here?)

### Lesson 3: Debouncing digital input

Introduces [debouncing](https://www.arduino.cc/en/Tutorial/Debounce) and solutions.

### Lesson 4: Controlling LED brightness via a potentiometer

Introduces analog input, the [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) function, and using a potentiometer. 
- TODO: potentially add in Serial monitor + plotter here?
- TODO: potentially add in independently controlling brightness and color with RGB LED here?

### Lesson 5: Using force-sensitive resistors

Introduces variable resistors, demonstrates how to hook up a variable resistor to a microcontroller using a voltage divider, and shows how to control LED brightness via a force-sensitive resistor.

### Lesson 6: Sensing light

Adapts the previous force-sensitive resistor example to work with a photocell. Discusses calibration, etc.

### Lesson 7: Smoothing analog input

Smooths analog input

<!-- ## Other possibilities
- Debugging
  - Using VS Code
- TODO: consider adding interrupts here? Like after Lesson 2?
  - Nick Gammon's blog is a nice resource for this: https://www.gammon.com.au/interrupts
- When to introduce -->