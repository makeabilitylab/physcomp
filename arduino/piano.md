---
layout: default
title: L2&#58; A simple piano
parent: Sound
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

Assumes that you have completed both the Intro to Input and Intro to Output tutorial series.

## Outline
- Show how to make a simple piano

## Materials

| Breadboard | Arduino | Buttons | Piezo Buzzer |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Image of a Tactile Switch Buttons (12mm square, 6mm tall) ordered from Adafruit]({{ site.baseurl }}/assets/images/Button_12mmX12mm_Adafruit_40w.png) | ![Piezo buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_100h.png)
| Breadboard | Arduino Uno, Leonardo, or similar  | [Tactile Buttons](https://www.adafruit.com/product/1119) | [Piezo Buzzer](https://www.mouser.com/ProductDetail/810-PS1240P02BT) |

## Should you use a series resistor?

- https://forum.arduino.cc/index.php?topic=16088.msg117474#msg117474
- https://forum.arduino.cc/index.php?topic=522576.msg3564043#msg3564043

## Playing multiple tones simultaneously

Brett Hagman, the author of the Arduino tone function, wrote a more advanced tone library to generate multiple simultaneous tones:
https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki. This is also described in the [Arduino Cookbook (Section 9.3 Generating More than One Simultaneous Tone)](https://learning.oreilly.com/library/view/arduino-cookbook-2nd/9781449321185/ch09.html). Another discussion [here](https://forum.arduino.cc/index.php?topic=77447.0).

## Exercises

- Try adding in LEDs for each key, which light up and then fade after each corresponding key press
- Try supporting chords—that is, multiple simultaneous tones—using [Brett Hagman's tone library](https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki)

## links

- [Lab 5: Tone Output Using An Arduino](https://itp.nyu.edu/physcomp/labs/labs-arduino-digital-and-analog/tone-output-using-an-arduino/)
- [Arduino sketch for high frequency precision sine wave tone sound synthesis](http://www.adrianfreed.com/content/arduino-sketch-high-frequency-precision-sine-wave-tone-sound-synthesis)