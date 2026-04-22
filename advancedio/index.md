---
layout: default
title: Advanced I/O
nav_order: 3
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

Welcome 👋 to the third module in your Physical Computing adventure: **Advanced I/O**. In this module, you'll move beyond basic LEDs and buttons to explore new output modalities—like OLED displays and vibration motors for haptic feedback—and new input techniques like signal smoothing to tame noisy sensor data. Don't be intimidated by the **advanced** prefix. The content here isn't more complicated than the first two modules; it simply builds on them!

{: .note }
> **Prerequisites:** These lessons assume you've completed (or are comfortable with) the material in:
> 1. [Introduction to Electronics](../electronics/index.md)
> 2. [Introduction to Microcontrollers Using Arduino](../arduino/index.md)
>
> In particular, you should be familiar with `analogRead`, `analogWrite`, digital I/O, and basic circuit building before starting here.

As usual, these lessons are interactive—they assume you're following along and building **with us**. They are designed to be completed **in order** within each section. All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

## Output

In the Output lessons, you'll learn how to use OLED displays for graphics and data visualization and vibration motors (vibromotors) for haptic feedback. These are two of the most common output modalities in modern interactive devices—from smartwatches to game controllers.

### [Lesson 1: OLED Displays](oled.md)

In [this lesson](oled.md), you will learn about organic light-emitting diode (OLED) displays, basic graphics programming with the Adafruit GFX library, and a brief introduction to two serial communication protocols: [I<sup>2</sup>C](https://en.wikipedia.org/wiki/I%C2%B2C) (Inter-Integrated Circuit) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) (Serial Peripheral Interface). You'll draw shapes, render text, create animations, and build interactive visualizations driven by sensor input.

### [Lesson 2: Vibromotors](vibromotor.md)

In [this lesson](vibromotor.md), you will learn about vibration motors (vibromotors), their role in haptic technology, and how to connect them with microcontrollers. You'll also learn why transistors are necessary for driving higher-current loads and how to use PWM through a transistor to control vibration intensity.

## Input

In the Input lesson, you'll learn techniques for cleaning up noisy sensor data—an essential skill for building responsive, reliable physical computing projects.

### [Lesson 1: Smoothing Input](smoothing-input.md)

In [this lesson](smoothing-input.md), you will learn how to smooth incoming sensor data using basic digital signal processing. We'll cover a class of digital filters called smoothing algorithms (aka **signal filters**), including the moving average, exponentially weighted moving average, and moving median filters. You'll learn why smoothing is helpful, how to tune filter parameters, and the tradeoffs involved.

<!-- ## Output:
### L1: Vibro motors
### L3: OLED Displays
### L3: Servo motors
### L4: RGB LED Neopixels and beyond

## Input
### L1: Smoothing Input
### L2: Microphones
### L4: accelerometer?
### Joystick?
### L3: Hall effect sensors
### L4: Ultrasonic distance sensor
### L5: Interrupts -->

<!-- ## Computer Communication
L1: Using Arduino as a keyboard or mouse 
L2: Using Serial and parsing with Processing or Python
L3: Web Serial
L4: Node.js -->

## What's next?

Once you've completed the Advanced I/O lessons, you'll have a solid toolkit of output and input techniques. From here, you might explore topics like serial communication between Arduino and your computer, working with additional sensors (accelerometers, distance sensors), or diving deeper into [signal processing](../signals/signal-processing.md) for more sophisticated filtering and frequency analysis.