---
layout: default
title: L6&#58; LEDs
nav_order: 6
parent: Intro to Electronics
has_toc: false # on by default
usemathjax: true
comments: true
usetocbot: true
nav_exclude: false
search_exclude: false
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

Second only to [resistors](resistors.md), light-emitting diodes (LEDs) are the most common electrical components used in physical computing. LEDs are power-efficient light sources *not* based on resistive properties (and thus, are non-ohmic devices). They come in a variety of shapes and sizes (see image below).

![](assets/images/Verschiedene_LEDs_FromWikipedia.jpg)
**Figure.**  LEDs range in color, size, and shape. Image from [Wikipedia](https://en.wikipedia.org/wiki/File:Verschiedene_LEDs.jpg).
{: .fs-1 }

## What are LEDs?

LEDs are a type of [diode](https://en.wikipedia.org/wiki/Diode), which is an electrical component that only allows current to flow in one direction like a one way street or a back flow valve in plumbing. In contrast to traditional lamps (incandescent light sources), LEDs have many advantages including: lower energy consumption, longer lifetimes, improved physical robustness, smaller size, and faster switching (you can turn them on and off very quickly). 

An incandescent bulb converts roughly 5% of its energy into visible light, the rest is lost to heat. More specifically, the typical incandescent bulb at 120V can output 16 lumens per watt *vs.* 60 lm/W for compact fluorescent bulbs and 150 lm/W for white LED lamps ([source](https://en.wikipedia.org/wiki/Incandescent_light_bulb)). Moreover, a typical incandescent bulb lasts for roughly 1,000 hours compared to 20,000-30,000 hours for LEDs.

While the basis for LED technology was discovered in 1927 ([Wikipedia](https://en.wikipedia.org/wiki/Light-emitting_diode#History)), it was not until the 1960s that the first visible-spectrum LEDs were demonstrated (red LEDs) and much later until they were commercially viable. Incredibly, the blue LED was not invented until the 1990s—earning co-inventors [Shuji Nakamura](https://en.wikipedia.org/wiki/Shuji_Nakamura), [Hiroshi Amano](https://en.wikipedia.org/wiki/Hiroshi_Amano), and [Isamu Akasaki](https://en.wikipedia.org/wiki/Isamu_Akasaki) the 2014 Nobel Prize in Physics—and there are still LED-based breakthroughs today (*e.g.,* high-efficiency, experimental white LEDs were demonstrated in the mid 2010s producing 303 lumens per watt of electricity).

## What are diodes?

To better understand light-emitting diodes, it's first useful to learn a bit about regular **diodes** and how to use them. As noted, diodes are a special type of [semiconductor device](https://en.wikipedia.org/wiki/Semiconductor_device) that, ideally, conduct current in only one direction. Unlike resistors, they are non-ohmic and thus, do not follow Ohm's Law.

Similar to a resistor, a diode has two leads (aka terminals or legs). Unlike a resistor, a diode is *polarized*—which means its orientation matters. The schematic symbol for a diode indicates its directional placement: the arrow faces the direction of current (and, similarly, the vertical cathode line, which is visible both on the symbol and on the device itself, should point towards `-`).

![](assets/images/DiodeSymbolAnd1N4002Picture_ByJonFroehlich.png)

**Figure.**  The diode schematic symbol and an image of a real diode, the popular [1N4001](https://www.adafruit.com/product/755). Image made in PowerPoint.
{: .fs-1 }

### A diode's "on" or "forward" voltage

To use a diode, you must apply a *minimum voltage*, which is typically called the "on voltage" ($$V_{on}$$) or "forward voltage" ($$V_{f}$$). To use another hydraulic analogy, think of a diode like a spring-triggered door in a water pipe (see image below). The door will only open when the water pressure exceeds a certain threshold (overcoming the strength of the spring). The door also prevents back flow as it can only open in one direction (thus, water can only travel in one direction in the pipe). A typical value for $$V_{f}$$ is 0.7V—so it "costs" only ~0.7V to install a "current" backflow preventer in your circuit (*e.g.,* to protect your circuit in case you stick a battery in the wrong way).

![](assets/images/DiodeWaterTrapdoorAnalogy.png)

**Figure.**  A hydraulic analogy for diodes. I cannot find the original source for this image. It originally came from [Berkeley's CS294 course](http://husk.eecs.berkeley.edu/courses/cs294-84-fall14/images/a/a3/Slides-02-electronics101.pdf) (but that webpage is long gone!).
{: .fs-1 }

### The I-V graph for diodes

With resistors, there is a linear relationship between voltage and current. With diodes, this current-voltage relationship is *non-linear*. When the applied voltage is less than $$V_f$$, the diode is similar to a open circuit (disconnected). When the applied voltage $$V_s$$ exceeds $$V_f$$, the "valve" opens causing a voltage drop of $$V_{D} = V_{f}$$ over the component, and current flows with very little resistance (like a closed switch).

![](assets/images/CurrentVoltageGraphsDiodes_ByJonFroehlich.png)

Typically, once $$V_f$$ is reached, we assume that the voltage drop $$V_D$$ across a diode remains relatively constant (at, say, 0.7V) regardless of the current through it. But this is not entirely true. In fact, $$V_D$$ continues to change slightly—however, this change is so small over a wide range of currents that we can model $$V_D$$ as constant.

![](assets/images/CurrentVoltageGraphDiodeSimplication2_JonFroehlichAndUIUCECE110.png)
**Figure.**  The current-voltage relationship of a diode is often simplified like the figure on the right, even though $$V_D$$ does indeed change slightly as current increases. Image on right from [UIUC ECE110](https://courses.engr.illinois.edu/ece110/sp2021/content/courseNotes/files/?diodes).
{: .fs-1 }

### Diode power dissipation

Just like resistors, which have [maximum power capacity ratings](resistors.md#calculating-the-power-dissipation-of-a-resistor), diodes do too! For a resistor $$R$$, we calculate power dissipation by the voltage drop across it $$V_{D}$$ multiplied by the current $$I$$ through it (so, $$P=V_{D} * I$$). It's the same thing for a diode!

### Breakdown voltage

Ideally, diodes would block any current flowing in the *reverse* direction; however, if a large enough "reverse" voltage is applied (*e.g.,* -50V to -100V), then the "trap door" is overpowered and current will begin flowing in the reverse direction (again, just like a closed switch). This is called the "breakdown voltage" or "peek inverse voltage" rating in a diode's datasheet. 

How would you get a "reverse voltage"? Well, the easiest way would be to hook up your voltage source backwards. For our purposes, you need not worry about this. See [more here](https://learn.sparkfun.com/tutorials/diodes/all#real-diode-characteristics).

### Analyzing a diode in a circuit

Let's analyze a [1N4001 general-purpose diode](https://www.mouser.com/datasheet/2/149/1N4001-81693.pdf) in a simple circuit with a 9V battery and a 100Ω resistor. The key here is in recognizing that once supplied voltage in our circuit exceeds the "on" voltage of our diode $$V_f$$, that we can model the diode as a wire. Though it's an imperfect simplification, it's sufficient for our purposes.

So, let's solve for current $$I$$ in the following circuit. Given that there are no branches, we know that current $$I$$ is shared throughout the circuit.

![](assets/images/SolveForCurrentI_ResistorDiodeCircuit_ByJonFroehlich.png)

#### Step 1: Identify nodes and voltage drops

![](assets/images/ResistorDiodeCircuit_SolveForCurrentI_Step1_ByJonFroehlich.png)

<!-- Diodes are a type of [semiconductor device](https://en.wikipedia.org/wiki/Semiconductor_device) -->

#### Step 2: Solve for $$V_R$$

![](assets/images/ResistorDiodeCircuit_SolveForCurrentI_Step2_ByJonFroehlich.png)

#### Step 3: Solve for current $$I$$

![](assets/images/ResistorDiodeCircuit_SolveForCurrentI_Step3_ByJonFroehlich.png)

#### Step 4: Solve for power at resistor and diode

![](assets/images/ResistorDiodeCircuit_SolveForCurrentI_Step4_ByJonFroehlich.png)


#### Reflecting on our solution

In our solution, we assumed that the voltage drop over the diode ($$V_D$$) is constant at $$0.7V$$ (once the diode "turns on"). This is generally a fine approximation for our course; however, the actual current-voltage relationship in a diode is far more complicated. And, indeed, $$V_D$$ will change slightly as the current $$I$$ increases. If you care for the details, read on. Otherwise skip forward!

In fact, the I-V equation for a diode is:
$$I_D = I_S(e^\frac{qV_D}{kT}-1)$$

Where $$I_S$$ is the *saturation current*, $$V_D$$ is the voltage across the diode, $$q$$ is the charge on an electron (in coulombs), $$k$$ is Boltzmann's constant, and $$T$$ is temperature (in kelvin). I have never had to use this equation but including it here for thoroughness. If you want to learn more, read this [Khan Academy article](https://www.khanacademy.org/science/electrical-engineering/ee-semiconductor-devices/ee-diode/a/ee-diode-circuit-element).

## How to use LEDs


## Constant current source

See video: [Constant current source / LED driver tutorial](https://youtu.be/iuMngik0GR8), Afrotechmods

See discussion of LM317 (constant current driver) here: [Chapter 3: LEDs](https://learning.oreilly.com/library/view/hacking-electronics-an/9780071802369/ch04.html#ch4)

## Addressable LED strips

Wiring up, powering, and controlling a large number of LEDs with a microcontroller is complicated and messy. Thus, in the last decade, we've seen the emergence of low-cost "smart" RGB LED strips like [Adafruit's Neopixel](https://www.adafruit.com/product/1376?length=1) (aka, the WS2812B LED from WorldSemi), which contain strips of RGB LEDs—each with a small embedded microcontroller—that can be addressed and controlled individually. They are truly awesome!

The NeoPixel has quickly become a prototyping standard because of Adafruit's [Arduino](https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library-installation), [CircuitPython](https://learn.adafruit.com/adafruit-neopixel-uberguide/python-circuitpython), and [MakeCode](https://learn.adafruit.com/adafruit-neopixel-uberguide/makecode) libraries and their production of [widely read tutorials](https://learn.adafruit.com/adafruit-neopixel-uberguide).

There are many tutorials and comparisons of LED strips online, including:
- [How to use WS2812B NeoPixels with FastLED on Arduino](https://youtu.be/YgII4UYW5hU), Gadget Reboot
- [LED Strips, What's the Difference?](https://www.youtube.com/watch?v=QnvircC22hU), The Hook Up
- [DotStars vs NeoPixels](https://learn.adafruit.com/adafruit-dotstar-leds/overview), Adafruit

## Notes

https://courses.engr.illinois.edu/ece110/sp2021/content/courseNotes/files/?diodes

Outline:

* What are LEDs
* Using LEDs and current limiting resistors
* Wiring up multiple LEDs

## Resources

### Videos

* [How to select resistor values for LEDs](https://youtu.be/hduuUDiku80), JohnAudioTech

* [LED Basics](https://youtu.be/Yo6JI_bzUzo), Afrotechmods

* [Constant current source / LED driver tutorial](https://youtu.be/iuMngik0GR8), Afrotechmods

### Text

* [Adafruit's LED tutorial](https://learn.adafruit.com/all-about-leds)

* [Sparkfun's LED Tutorial](https://learn.sparkfun.com/tutorials/light-emitting-diodes-leds/all)

* [Chapter 3: LEDs](https://learning.oreilly.com/library/view/hacking-electronics-an/9780071802369/ch04.html#ch4) in Monk, *Hacking Electronics: An Illustrated DIY Guide for Makers and Hobbyists*, McGraw-Hill, 2013.

* [Chapter 22: LEDs](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334178/ch22.html#SECTION_LED_INDICATOR) in Platt, *Make: Encyclopedia of Electronic Components Volume 2: LEDs, LCDs, audio, thyristors, digital logic, and amplification*, O'Reilly, 2015.

* [Diodes and How to Use Them](https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/html/488495_1_En_8_Chapter.xhtml) in Bartlett, *Electronics for Beginners*, Apress, 2020 

* [Diodes](https://courses.engr.illinois.edu/ece110/sp2021/content/courseNotes/files/?diodes), UIUC ECE 110
