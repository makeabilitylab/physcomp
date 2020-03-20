---
layout: default
title: Fading an LED
nav_order: 1
parent: Basics
usemathjax: true
has_toc: true # (on by default)
---
# Fading an LED
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In the [previous lesson](led-blink.md), we learned how to turn on and off an LED using [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/)—which worked by alternating between setting Pin 3 to 5V (`HIGH`) and 0V (`LOW`). In this lesson, we'll learn how to programatically control the output voltage at finer gradations using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/). More specifically, we will gradually fade an LED on and off.

![Animation showing the LED on Pin 3 gradually fading on and off](assets/movies/Arduino_LEDFade_Pin3.gif)

## Materials
You will use the same materials as [before](led-blink.md), including the [Arduino IDE](https://www.arduino.cc/en/main/software) and a USB cable to upload your program from your computer to your Arduino.

| Arduino | LED | Resistor |
|:-----:|:-----:|:-----:|
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |
| ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |

## Fade Circuit

As noted in our previous lesson, the Arduino Uno has 14 digital I/O pins:

![Close-up image of the 14 digital I/O pins on the Arduino Uno](assets/images/ArduinoUno_CloseUp_DigitalIOPins.png)

However, **6** of the 14 I/O pins can also be used for analog output. These pins are indicated by the tilde (`~`) printed next to the pin on the Arduino (*i.e.,* silkscreened on the Arduino's PCB).

![Close up of the Arduino Uno highlighting the six analog output pins](assets/images/ArduinoUno_CloseUp_AnalogOutputPins.png)

So, we don't actually have to change our circuit at all! (Indeed, this is the reason why we selected Pin 3 in the first place).

![Wiring diagram showing LED cathode wired to GND and LED anode wired to a 220 Ohm resistor and then to Pin 3](assets/images/Arduino_LEDFade_Pin3Circuit.png)

---
**IMPORTANT NOTE:**

A common confusion amongst beginners is mixing up the analog **output** pins and the analog **input** pins. Whereas for digital I/O, the input and output pins are the same and configurable to `INPUT` or `OUTPUT` using the [`pinMode`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) command, the analog I/O pins are different!

![Annotated image of an Arduino Uno showing the difference between analog input and output pins](assets/images/ArduinoUno_AnalogInputAndOutputPinsAreDifferent.png)

We'll learn about analog output in this lesson (using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)). In a future lesson, we will learn about analog input (using [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/))

---

## Initial Fading Approach

### Step 1: Start a new sketch in the Arduino IDE

Start a new sketch in the Arduino IDE:

![Screenshot of the Arduino IDE showing a new empty sketch](assets/images/ArduinoIDE_FreshSketch.png)

## Improved Fading Approach

Outline:
1. Using a for loop: Fade LED on (then immediately go back to zero)
2. Using a for loop: Fade LED on and then off
3. Without a for loop: fade led on and off

For both, show graph of what happens either via Tinkercad serial plotter or the oscilloscope (oscilloscope would show PWM...)

<span class="fs-6">
[Previous](led-blink.md){: .btn .btn-outline }
[Next](led-blink2.md){: .btn .btn-outline }
</span>