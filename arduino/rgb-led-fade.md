---
layout: default
title: L6&#58; Crossfade RGB LEDs
parent: Output
usemathjax: false
has_toc: true # (on by default)
comments: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson, you will learn how to fade between RGB colors and how to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness.

## Materials

You'll need the same materials as the previous [RGB LED lesson](rgb-led.md). Recall that there are **two types** of RGB LEDs: a **common cathode design** and a **common anode design**, so make sure you know which one you have as it will affect the circuit you make and the code you write.

| Breadboard | Arduino | RGB LED | Resistors |
|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![An RGB LED]({{ site.baseurl }}/assets/images/RgbLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | RGB LED (Either Common Cathode or Common Anode) | **Three** 220Ω Resistors |

## Making the circuit

The circuit is the same as the previous [RGB LED lesson](rgb-led.md). Make sure you follow the appropriate wiring based on wheter you are using a **common cathode** or **common anode** RGB LED.

| RGB Common Cathode Wiring | RGB Common Anode Wiring |
|:-----:|:-----:|
| ![Breadboard circuit wiring for an RGB LED Common Cathode design where the cathode is hooked to GND](assets/images/ArduinoUno_RgbLEDCommonCathode_WiringDiagramWithBreadboard.png) | ![Breadboard circuit wiring for an RGB LED Common Anode design where the anode is hooked to 5V](assets/images/ArduinoUno_RgbLEDCommonAnode_WiringDiagramWithBreadboard.png) |

## Writing the code

We are going to explore and implement two different RGB crossfade approaches.

1. First, we will use `for` loops to step through all possible dyadic combinations between red, green, and blue LED colors (note: we limit ourselves to powering **two** RGB LEDs simultaneously because powering all three would result in "white"). <!-- TODO: verify that this is correct -->
2. Second, we are going to use the HSL color space to manipulate the hue—what colloquially we refer to as *color*—and then convert this back to the RGB color space for our `analogWrite` calls. This second approach far cleaner and less convoluted but requires using a [separate library](https://github.com/ratkins/RGBConverter) for doing the HSL to RGB conversion.

## Crossfading in RGB color space

The code below is the most complex that we've covered thus far (and, if you don't have a coding background, it's OK if you don't fully understand it). In short, we have an array `int _rgbLedValues[3]` that stores our `{int red, int green, int blue}` values. We start with `{255, 0, 0}` and then use two `for` loops to simultaneously increase one of the color values while decreasing another. We start with increasing green as controlled by `enum RGB _curFadingUp = GREEN;`) while decreasing red (`enum RGB _curFadingDown = RED;`). Once we reach our maximum 

<!--TODO: add in a p5js that demonstrates how this work -->

## Crossfading in HSL color space

TODO

---
**NOTE:**

The downside of this implementation is that we must use `floats` with the [RGBConverter](https://github.com/ratkins/RGBConverter) library. TODO: expand on why floats can be costly for embedded programming with microcontrollers

---



## TODO: fade between colors
- First with simple for loops
- Then with HSL
- Probably want to move this to some advanced section, so students can move on to input

<!-- Could be fun to write a p5js sketch that shows how the initial RGB LED naive code works and then the HSL version -->