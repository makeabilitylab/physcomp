---
layout: default
title: L5&#58; LEDs
nav_order: 5
parent: Intro to Electronics
has_toc: false # on by default
usemathjax: true
comments: true
usetocbot: true
nav_exclude: true
search_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---
This is the LED page

https://courses.engr.illinois.edu/ece110/sp2021/content/courseNotes/files/?diodes

## Constant current source

See video: [Constant current source / LED driver tutorial](https://youtu.be/iuMngik0GR8), Afrotechmods

See discussion of LM317 (constant current driver) here: [Chapter 3: LEDs](https://learning.oreilly.com/library/view/hacking-electronics-an/9780071802369/ch04.html#ch4)

## Addressable LED strips

Wiring up, powering, and controlling a large number of LEDs with a microcontroller is complicated and messy. Thus, in the last decade, we've seen the emergence of low-cost "smart" RGB LED strips like [Adafruit's Neopixel](https://www.adafruit.com/product/1376?length=1) (aka, the WS2812B LED from WorldSemi), which contain strips of RGB LEDs (red, green, blue) with a small embedded microcontroller that can be addressed and controlled individually. They are truly awesome!

The NeoPixel has quickly become a prototyping standard because of Adafruit's [Arduino](https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library-installation), [CircuitPython](https://learn.adafruit.com/adafruit-neopixel-uberguide/python-circuitpython), and [MakeCode](https://learn.adafruit.com/adafruit-neopixel-uberguide/makecode) libraries and Adafruit's production of [widely read tutorials](https://learn.adafruit.com/adafruit-neopixel-uberguide).

There are many tutorials and comparisons of LED strips online, including:
- [How to use WS2812B NeoPixels with FastLED on Arduino](https://youtu.be/YgII4UYW5hU), Gadget Reboot
- [LED Strips, What's the Difference?](https://www.youtube.com/watch?v=QnvircC22hU), The Hook Up
- [DotStars vs NeoPixels](https://learn.adafruit.com/adafruit-dotstar-leds/overview), Adafruit

## Resources

### Videos
- [LED Basics](https://youtu.be/Yo6JI_bzUzo), Afrotechmods
- [Constant current source / LED driver tutorial](https://youtu.be/iuMngik0GR8), Afrotechmods

### Text

- [Adafruit's LED tutorial](https://learn.adafruit.com/all-about-leds)
- [Sparkfun's LED Tutorial](https://learn.sparkfun.com/tutorials/light-emitting-diodes-leds/all)
- [Chapter 3: LEDs](https://learning.oreilly.com/library/view/hacking-electronics-an/9780071802369/ch04.html#ch4) in Monk, *Hacking Electronics: An Illustrated DIY Guide for Makers and Hobbyists*, McGraw-Hill, 2013.
- [Chapter 22: LEDs](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334178/ch22.html#SECTION_LED_INDICATOR) in Platt, *Make: Encyclopedia of Electronic Components Volume 2: LEDs, LCDs, audio, thyristors, digital logic, and amplification*, O'Reilly, 2015.
