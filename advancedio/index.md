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

<video autoplay loop muted playsinline style="margin:0px" aria-label="Video montage showing OLED display games, addressable LED animations, servo motors moving, and vibromotor haptic feedback projects built with Arduino">
  <source src="assets/videos/Arduino_OLED_Games_Overview_720p_optimized.mp4" type="video/mp4" />
</video>
**Video.** In this lesson series, you will learn about OLED displays, addressable RGB LEDs, servo motors, vibration motors, and more! You can combine your learning to create interactive projects like [Flappy Bird](https://github.com/makeabilitylab/arduino/tree/master/OLED/FlappyBird), [Pong](https://github.com/makeabilitylab/arduino/tree/master/OLED/Pong), rainbow LED animations, sensor-driven gauges, and haptic feedback systems.
{: .fs-1 }

Welcome 👋 to the third module in your Physical Computing adventure: **Advanced I/O**. In this module, you'll move beyond basic LEDs and buttons to explore new output modalities—like OLED displays, addressable RGB LED strips, servo motors, and vibration motors for haptic feedback—as well as new input techniques like signal smoothing to tame noisy sensor data. Don't be intimidated by the **advanced** prefix. The content here isn't more complicated than the first two modules; it simply builds on them!

{: .note }
> **Prerequisites:** These lessons assume you've completed (or are comfortable with) the material in:
> 1. [Intro to Electronics](../electronics/index.md)
> 2. [Intro to Microcontrollers Using Arduino](../arduino/index.md)
>
> In particular, you should be familiar with `analogRead`, `analogWrite`, digital I/O, and basic circuit building before starting here.

As usual, these lessons are interactive—they assume you're following along and building **with us**. They are designed to be completed **in order** within each section; however, if you do not have a component (*e.g.,* like an OLED display), it's OK to skip ahead to the next lesson. You'll still be able to build and understand most things!

All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

## Output

In the Output lessons, you'll learn four new output modalities used in modern interactive devices—from smartwatches to game controllers to art installations. The first three lessons use components with **built-in driver circuits** (the OLED's display controller, addressable LEDs' WS2812B chips, and servos' internal feedback circuits), so the wiring is simple and libraries handle the complex signaling. The fourth lesson introduces a **raw DC motor** with no built-in intelligence, teaching you why transistors, flyback diodes, and resistor calculations become necessary.

### [Lesson 1: OLED Displays](oled.md)

In [this lesson](oled.md), you will learn about organic light-emitting diode (OLED) displays, basic graphics programming with the Adafruit GFX library, and a brief introduction to two serial communication protocols: [I<sup>2</sup>C](https://en.wikipedia.org/wiki/I%C2%B2C) (Inter-Integrated Circuit) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) (Serial Peripheral Interface). You'll draw shapes, render text, create animations, and build interactive visualizations driven by sensor input.

### [Lesson 2: Addressable LEDs](addressable-leds.md)

In [this lesson](addressable-leds.md), you will learn about addressable RGB LEDs (WS2812B/SK6812, commonly known as NeoPixels), how their built-in driver chips enable individual pixel control from a single data pin, and how to use the Adafruit NeoPixel library to create colorful animations and sensor-driven light displays. You'll also learn how to calculate power requirements and when to use an external power supply.

### [Lesson 3: Servo Motors](servo.md)

In [this lesson](servo.md), you will learn about servo motors, how their internal feedback loop enables precise angular positioning, and how servo PWM signals differ from `analogWrite()` PWM. You'll use the Arduino Servo library to build interactive projects including a potentiometer-controlled servo and a sensor-driven physical gauge.

### [Lesson 4: Vibromotors](vibromotor.md)

In [this lesson](vibromotor.md), you will learn about vibration motors (vibromotors), their role in haptic technology, and how to connect them with microcontrollers. Unlike the previous three output devices, vibromotors are raw DC motors with no built-in driver—so you'll learn why transistors, flyback diodes, and base resistor calculations are necessary, and how to use PWM through a transistor to control vibration intensity and create haptic patterns.

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