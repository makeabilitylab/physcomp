---
layout: default
title: L2&#58; A simple piano
parent: Input
usemathjax: true
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

OK, we made it through the introduction to digital input. Now, let's do something fun with this newfound knowledge!

In this lesson, we are going to make a simple five-key piano with tactile buttons and a [piezo buzzer](https://www.adafruit.com/product/160). 

## Outline
- Show how to make a simple piano

## Materials

We are going to build input circuits using the microcontroller's own internal pull-up resistors, so our material list includes only four things:

| Breadboard | Arduino | Buttons | Piezo Buzzer |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Image of a Tactile Switch Buttons (12mm square, 6mm tall) ordered from Adafruit]({{ site.baseurl }}/assets/images/Button_12mmX12mm_Adafruit_40w.png) | ![Piezo buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_100h.png)
| Breadboard | Arduino Uno, Leonardo, or similar  | **5** [Tactile Buttons](https://www.adafruit.com/product/1119) | [Piezo Buzzer](https://www.mouser.com/ProductDetail/810-PS1240P02BT) |

## Piezo buzzers

TODO: brief background on the buzzer

There is some debate about whether you should use a small in-series resistor with a passive piezo buzzer ([link1](https://forum.arduino.cc/index.php?topic=16088.msg117474#msg117474), [link2](https://forum.arduino.cc/index.php?topic=522576.msg3564043#msg3564043)). I never have.

## Making the circuit

![Tinkercad wiring diagram showing how to hook up the buttons and piezo speaker](assets/images/ArduinoUno_SimplePiano_TinkercadWiringDiagram.png)
You can play with this circuit and the underlying Arduino program on [Tinkercad](https://www.tinkercad.com/things/dunwYl8U0Uq-simple-piano)
{: .fs-1 }

## Writing the code

To play ear-pleasing, high-frequency waveforms with a microcontroller, you need a [digital-to-analog converter (DAC)](https://en.wikipedia.org/wiki/Digital-to-analog_converter). Some microcontrollers, like the Arduino Due, have DACs built in. The Arduino Uno and Leonardo does not.

Instead, these microcontrollers produce [square waves](https://en.wikipedia.org/wiki/Square_wave). When we use `analogWrite`, the Arduino produces a square wave of a fixed frequency—490Hz on most PWM pins but the Uno can produce double that (980Hz) on Pins 5 and 6 (see [docs](https://www.arduino.cc/en/Reference/AnalogWrite)). While the 8-bit `analogWrite` value (0-255) changes the duty cycle of the waveform, the frequency is unchanged. And this fixed frequency waveform is not helpful for generating tones because we need to control frequency to produce sounds (TODO: link to tone generator).

Brett Hagman created the built-in tone library to address this problem. While tone cannot generate sinusoidal waves like a DAC, it does produce square waves at specific frequencies, which can be used to actuate speakers and piezo buzzers.

## Playing multiple tones simultaneously

Brett Hagman, the author of the Arduino tone function, wrote a more advanced tone library to generate multiple simultaneous tones:
https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki. This is also described in the [Arduino Cookbook (Section 9.3 Generating More than One Simultaneous Tone)](https://learning.oreilly.com/library/view/arduino-cookbook-2nd/9781449321185/ch09.html). Another discussion [here](https://forum.arduino.cc/index.php?topic=77447.0).

## Exercises

- Try adding in LEDs for each key, which light up and then fade after each corresponding key press
- Try supporting chords—that is, multiple simultaneous tones—using [Brett Hagman's tone library](https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki)

## links

- [Lab 5: Tone Output Using An Arduino](https://itp.nyu.edu/physcomp/labs/labs-arduino-digital-and-analog/tone-output-using-an-arduino/)
- [Arduino sketch for high frequency precision sine wave tone sound synthesis](http://www.adrianfreed.com/content/arduino-sketch-high-frequency-precision-sine-wave-tone-sound-synthesis)