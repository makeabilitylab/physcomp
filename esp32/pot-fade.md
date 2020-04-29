---
layout: default
title: L2&#58; Fading an LED
nav_order: 2
parent: ESP32
has_toc: true # (on by default)
usemathjax: true
comments: true
nav_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson, we'll learn how to use analog input on the ESP32 by building an potentiometer-based LED fader.

## Materials

You'll need the same materials as the [last lesson](led-fade.md) but also a 10kΩ trim potentiometer.

| Breadboard | ESP32 | LED | Resistor | Trimpot | 
| ---------- |:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Huzzah32]({{ site.baseurl }}/assets/images/ESP32Huzzah32_Adafruit_vertical_h200.png)    | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![Image of 10KOhm trimpot]({{ site.baseurl }}/assets/images/Trimpot_100h.png) | 
| Breadboard | Huzzah32  | Red LED | 220Ω Resistor | 10kΩ Trimpot |

## The ADC on the ESP32

The ATmega chips used by the Arduino Uno ([ATmega328](http://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf)) and the Arduino Leonardo ([ATmega32U4](http://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7766-8-bit-AVR-ATmega16U4-32U4_Datasheet.pdf)) both used 10-bit ADCs, which provided a resolution of $$2^10=1024$$. The ESP32 integrates two 12-bit ADCs (resolution: $$2^12=4096$$) supporting a total of 18 measurement channels (analog enabled pins). The official ESP32 docs are [here](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html).

![Huzzah32 pin diagram](assets/images/AdafruitHuzzah32PinDiagram.png)
The ADC pins are marked in teal. Right-click and open image in a new tab to zoom in.
{: .fs-1 } 

ADC1 has 8 channels (attached to GPIO pins 32-39) and ADC2 has 10 channels (attached to GPIOs 0, 2, 4, 12 - 15 and 25 - 27); however, the usage of ADC2 has some restrictions:
1. ADC2 is used by the Wi-Fi driver, so ADC2 is only usable when the Wi-Fi driver has **not** started.
2. Three of the ADC2 pins are strapping pins and thus should be used with caution. Strapping pins are used during power-on/reset to configure the device boot mode, the operating voltage, and other initial settings ([link](https://www.esp32.com/viewtopic.php?t=5970))

Importantly, the official Adafruit [docs](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/pinouts) for the Huzzah32 have an error: they state that "you can only read analog inputs on ADC #1 once WiFi has started". Through experimentation, we've found this to be untrue.

In the following video, I'm testing all 13 analog input pins (`A0` - `A12`) using a trim potentiometer for input and the Serial Plotter for output.

<iframe width="736" height="414" src="https://www.youtube.com/embed/8BBY-5n4e5A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Let's make something!

Let's make a potentiometer-based LED fader.

### The circuit

The circuit is almost the same as the [previous lessons](led-fade.md); however, we need to add and hook up a potentiometer. So, we'll build two simple circuits:
1. The **input** circuit using the potentiometer, which we'll hook to `A6`
2. The **output** circuit, which is the same as the [previous lessons](led-fade.md)

![Circuit diagram and schematic for potentiometer-based fader](assets/images/Huzzah32_PotFade_CircuitDiagramAndSchematic_Fritzing.png)

### The code

The code simply adapts our LED fade code from the previous lesson to use the potentiometer's analog input value on `A6` to control the PWM duty cycle (rather than looping up and down).

Here's our implementation on [github](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Basics/PotFade):

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/ESP32/Basics/PotFade/PotFade.ino?footer=minimal"></script>

### Workbench video

Here's a workbench video with serial plotter graphing the analog input value from the potentiometer and the converted duty cycle value used in the `ledcWrite` method.

<iframe width="736" height="414" src="https://www.youtube.com/embed/E5YFtm0CLFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Next Lesson

In the [next lesson](TODO), we will TODO

<span class="fs-6">
[Previous: Fading an LED with ESP32](led-fade.md){: .btn .btn-outline }
[Next: TODO](TODO){: .btn .btn-outline }
</span>