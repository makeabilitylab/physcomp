---
layout: default
title: Turn on LED
nav_order: 1
parent: Basics
usemathjax: true
has_toc: true # (on by default)
---
# Hook Up LED to Arduino (Always On)
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---
For our first activity, we are going to use Arduino to turn on an [LED](../../electronics/leds.md). We're *not* going to write any code. Instead, the goal here is to build some initial familiarity with Arduino hardware and connecting components to Arduino pins.

![Animation showing a USB cable plugging into an Arduino Uno to power an LED + resistor hooked up to 5V and GND](assets/movies/Arduino_LEDOn_5VFixed_USBPower.gif)



## Materials
You will need the following materials:

| Arduino | LED | Resistor |
|:-----:|:-----:|:-----:|
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |
| ![Arduino Uno](/assets/images/ArduinoUno_Fritzing.png)    | ![Red LED](/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor](/assets/images/Resistor220_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |

## Hook Up LED to Arduino 5V

### Step 1: Wrap Resistor Around LED Leg

Grab a 220Ω resistor (or any resistor 220Ω or greater) and twist one leg around an LED leg. If you want to follow my example, connect the resistor to the LED's anode (long leg) but either leg will work.

TODO: insert animated gif of twisting the resistor around LED.

### Step 2: Connect Components to Arduino

Insert the LED + resistor into the Arduino: the LED's cathode (short leg) to GND and the LED's anode (long leg) + resistor to 5V.

![Animation of LED + resistor being connected to Arduino's GND and 5V ports](assets/movies/InsertLEDAnimation.gif)

### Step 3: Connect your Arduino to Power

Now connect your Arduino to power and the LED should light up. You did it!

For power, you can use a USB cable or a 9V battery. Either way, the Arduino supplies 5V through the 5V pin.

| USB Power        | 9V Power          |
|:-------------|:------------------|
| ![Animation showing a USB cable plugging into an Arduino Uno to power an LED + resistor hooked up to 5V and GND](assets/movies/Arduino_LEDOn_5VFixed_USBPower-Cropped.gif) | ![Animation showing a 9V battery plugging into an Arduino Uno to power an LED + resistor hooked up to 5V and GND](assets/movies/Arduino_LEDOn_5VFixed_9VBattery-Cropped.gif) |

## How Can We Make the LED Less Bright?
LED brightness is controlled by **current**. So, to dim an LED, we could

LaTeX shows up in VS Code but not in browser?

$$\frac{\partial f(y)}{\partial x} = \frac{\partial f}{\partial y} \times \frac{\partial y}{\partial x}$$


<!-- <video width="640" controls="controls">
  <source src="images/Arduino_LEDOn_5VFixed.mp4" type="video/mp4">
</video> -->

## TODO
- add alt text 
- add caption
- add 3.3V version
- Try other resistors. What happens?
