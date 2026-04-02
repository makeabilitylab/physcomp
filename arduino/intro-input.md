---
layout: default
title: Input
parent: Intro to Arduino
nav_order: 2
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# Intro to Input
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson series, you will learn how to read digital and analog input on the Arduino using buttons, potentiometers, and force-sensitive resistors. Along the way, you'll build musical instruments—from a button piano to a Jedi-force instrument—and learn about important concepts like pull-up resistors, debouncing, and voltage dividers.

The lessons are interactive and designed to be completed **in order**. All Arduino code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino).

{: .note }
> Before starting, we recommend completing the [Intro to Output](intro-output.md) lessons first. The Input lessons build on concepts like `digitalWrite`, `analogWrite`, and PWM covered there.

<!-- TODO:
    TODO: after Lesson 4, have them make their own lo-fi resistive sensor? and turn their arduino into a voltmeter?
    TODO: how to use interrupts
    TODO: how to use some startup sequence to calibrate sensors?
     -- https://www.arduino.cc/en/Tutorial/BuiltInExamples/Calibration
    TODO: some basics on smoothing the signal?
    -->

## Lessons

### [Lesson 1: Using buttons](buttons.md)

Introduces [buttons](buttons.md) (aka momentary switches), digital input, using Arduino's [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) function, and pull-up and pull-down resistors.

### [Lesson 2: Button piano](piano.md)

You'll make a simple [five-key piano](piano.md) with tactile buttons wired with internal pull-up resistors and a [piezo buzzer](https://www.adafruit.com/product/160).

### [Lesson 3: Debouncing switches](debouncing.md)

You'll learn about ["contact bouncing"](debouncing.md) and how to "debounce" to make your digital input more reliable.

### [Lesson 4: Potentiometers](potentiometers.md)

Introduces [potentiometers and rheostats](potentiometers.md), analog input, and using Arduino's [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) function. Also shows how to use Tinkercad to prototype and test circuits in an online simulator and how to use a multimeter to measure current.

### [Lesson 5: Force-sensitive resistors](force-sensitive-resistors.md)

Introduces [force-sensitive resistors (FSRs)](force-sensitive-resistors.md), how to use two-legged variable resistors with microcontrollers (including FSRs), and how to make a force-piano. Very Jedi-like!

## What's next?

Once you've completed the Input lessons, you're ready for more advanced topics! Check out [Communication](../communication/index.md) to learn about serial communication between Arduino and your computer, or explore [Advanced I/O](../advancedio/index.md) for OLED displays, vibromotors, and input smoothing techniques.