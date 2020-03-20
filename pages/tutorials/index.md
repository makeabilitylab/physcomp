---
layout: default
title: Tutorials
nav_order: 5
has_children: true
has_toc: true # (on by default)
---
# Tutorials
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---


## TODO
Call this activities or tutorials or making?

## Lessons / Labs / Activities
Not sure what to call these yet...

### Intro to Arduino Lessons

#### Digital and Analog Output

1. **Lesson 1: Turning on an LED.** Introduces the Arduino power and ground pins, powering an initial LED circuit with a current limiting resistor, and plugging components into the Arduino.

2. **Lesson 2: Blinking an LED.** Introduces the Arduino IDE and the ability to programatically control Arduino GPIO pins to turn an LED on and off via [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/).

3. **Lesson 3: Fading an LED.** Demonstrates how to gradually fade an LED on and off by using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)

4. **Lesson 4: Blinking an LED Part 2.** Introduces the concept of using Arduino GPIO pins as either current sources or sinks by hooking up two LED circuit configurations.

5. **Lesson 5: RGB LEDs.** Introduces RGB LEDs, using both common anode and cathode versions, and independently controlling brightness and hue.

#### Digital and Analog Input
TODO: consider adding interrupts here? Like after Lesson 2?

1. **Lesson 1: Turn on an LED with a button.** Introduces buttons (aka momentary switches), working with digital input via [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/), and pull-up and pull-down resistors.

2. **Lesson 2: Debouncing digital input.** Introduces [debouncing](https://www.arduino.cc/en/Tutorial/Debounce) and solutions.

3. **Lesson 3: Controlling LED brightness via a potentiometer** Introduces analog input, the [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) function, and using a potentiometer. TODO: potentially add in Serial monitor + plotter here?

4. **Lesson 4: Using force-sensitive resistors** Introduces variable resistors, demonstrates how to hook up a variable resistor to a microcontroller using a voltage divider, and shows how to control LED brightness via a force-sensitive resistor.

5. **Lesson 5: Sensing light**. Adapts the previous force-sensitive resistor example to work with a photocell. Discusses calibration, etc.

6. **Lesson 6: Smoothing analog input**. Smooths analog input.

### Making and sensing sound

1. **Lesson 1: Playing tones**. Introduces tone(), piezo buzzer, square wave, etc.

2. **Lesson 2: Making a piano**. Synthesizes previous tutorials to create something fun

3. **Lesson 3: Making a theremin-like instrument**. Use distance sensor to generate tones kind of like a theremin. 

4. **Lesson 3: Playing music**. Requires a DAC (check Feather)
   - https://hackaday.com/2018/02/06/esp32-we-have-ways-to-make-you-talk/
   - https://www.arduino.cc/en/Tutorial/SimpleAudioPlayer
   - https://www.xtronical.com/basics/audio/dacs-on-esp32/
   - https://www.xtronical.com/dacaudio-hardware/
 
- Tone()
- Piezo buzzer
- Actual speaker + DAC (like Due?)
- Sensing sound
- Processing sound?

### Measuring distance
- IR
- Ultrasonic

#### Arduino as a mouse, keyboard, or joystick
TODO.

#### Motors
- Servos
- Step
- DC

### Debugging Arduino
The very thing that makes working with microcontrollers so exciting—combining the digital and physical worlds—is also a source of complexity and frustration. With Arduino, there are multiple points of failure from incorrectly wiring a circuit to writing flawed software code.

## Where to add?
- Debugging Arduino
  - Multimeter
  - Serial.println and serial console and plotter
  - Code debuggers?

## TODO
- Serial communication
- [Level shifting](https://itp.nyu.edu/physcomp/lessons/electronics/level-shifting/)