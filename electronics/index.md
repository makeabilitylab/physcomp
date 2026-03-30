---
layout: default
title: Intro to Electronics
nav_order: 1
has_children: true
has_toc: false # on by default
nav_exclude: false
---
# Electronics
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<video autoplay loop muted playsinline style="margin:0px" aria-label="A force-sensitive resistor dimming and brightening an LED as pressure is applied and released.">
  <source src="assets/videos/FSR-TopDown9VCircuit-IMG_5683_Trimmed-Optimized.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of a force-sensitive resistor (aka a "pressure sensor") that varies its resistance in proportion to an applied force. This is just one of the many things you will learn about and build in this "Intro to Electronics" tutorial series. See more in [L8: Variable Resistors](variable-resistors.md).
{: .fs-1 }

Welcome 👋 to the first "step" in your Physical Computing journey!

In this tutorial series, you will learn about the fundamentals of electricity—[voltage, current, and resistance](electricity-basics.md)—and how these elements can be used to build circuits that turn on lights, spin motors, and do other "work." You'll also learn about an empirically derived relationship, called [Ohm's Law](ohms-law.md), that relates voltage, current, and resistance together and methods to analyze circuits using Ohm's Law. Finally, you'll learn about three common circuit elements (resistors, LEDs, variable resistors), how they work, and how to use them in circuits.

Throughout, you'll use simulation tools like [CircuitJS](https://www.falstad.com/circuit/circuitjs.html) and [Tinkercad Circuits](https://www.tinkercad.com/) to design and evaluate circuits and then actually build them using physical components.

By the end of this module, you will be prepared to start our [Intro to Arduino series](../arduino/index.md), where you will begin making with electronics, microcontrollers, and programming!

{: .note }
If you have limited background in circuits and programming, you may also want to consider our series on [Making with the Circuit Playground Express (CPX)](../cpx/), which uses a wonderful prototyping platform called [CPX](https://www.adafruit.com/product/3333) along with a drag-and-drop visual programming language called [MakeCode](https://makecode.adafruit.com/) (that is similar to [Scratch](https://scratch.mit.edu/)).

## [Lesson 1: Voltage, current, and resistance](electricity-basics.md)

You'll learn three foundational electricity concepts—[current, voltage, and resistance](electricity-basics.md)—that underpin all electronics and circuits.

## [Lesson 2: Circuit Schematics](schematics.md)

You'll learn [circuit schematics](schematics.md)—the visual language used in datasheets, circuit simulators, and PCB layout software to describe circuits. Includes a hands-on activity using [Fritzing](https://fritzing.org/) to build your own schematics.

## [Lesson 3: Ohm's Law](ohms-law.md)

You'll learn [Ohm's Law](ohms-law.md), one of the most important relationships in electrical circuits, describing how current, voltage, and resistance relate. Includes an activity to build and explore resistive circuits in [CircuitJS](https://www.falstad.com/circuit/circuitjs.html).

## [Lesson 4: Series vs. Parallel Resistors](series-parallel.md)

You'll explore [series and parallel resistor circuits](series-parallel.md), learn how to analyze them, and understand why they matter. Includes an activity building these configurations in [CircuitJS](https://www.falstad.com/circuit/circuitjs.html).

## [Lesson 5: Resistors](resistors.md)

Building on Lessons 1–4, you'll dive more deeply into [resistors](resistors.md) and learn about how resistors work, how they're made, how they're characterized in terms of both resistance $$R$$ and power $$P$$, and how to "read" them.

## [Lesson 6: LEDs](leds.md)

You'll meet your first semiconductor device—the diode—and learn how it only allows current in one direction. Then you'll explore a special kind of diode, the [LED](leds.md), and learn how to select an appropriate current-limiting resistor. You'll also physically build your first LED circuit!

## [Lesson 7: Breadboards](breadboards.md)

You'll learn about a very useful circuit prototyping tool called [breadboards](breadboards.md), which makes it easy to rapidly build circuits (and plug/unplug components and wires).

## [Lesson 8: Variable resistors](variable-resistors.md)

You'll learn about [variable resistors](variable-resistors.md), a certain kind of variable resistor called a potentiometer, and then design, simulate, and build some LED circuits using variable resistors. At the end, you'll even make your own DIY variable resistor!

<!-- ## [Lesson 9: Using a multimeter](multimeter.md)

TODO: or could integrate this somewhere else?   -->

<!-- # TODO
- Should we add voltage regulator? https://youtu.be/howQ05z4v7Q?
- Switches?
- Capacitors?
- Transistors?
- Rotary Encoders
- Diode
- Voltage Regulator
- Power
  - Batteries? https://learning.oreilly.com/library/view/hacking-electronics-an/9780071802369/ch05.html#ch5
- [NYU ITP's Physical Computing list of common electronic components](https://itp.nyu.edu/physcomp/labs/labs-electronics/components/)

# Possible sections
- [What is Electricity?](https://learn.sparkfun.com/tutorials/what-is-electricity)
- [Voltage, Current, Resistance, and Ohm’s Law](http://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law)
- [What is a circuit?](http://learn.sparkfun.com/tutorials/what-is-a-circuit)
- [Metric Prefixes](https://learn.sparkfun.com/tutorials/metric-prefixes-and-si-units)
- [How to Use a Breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard)
- [How to Use a Multimeter](https://learn.sparkfun.com/tutorials/how-to-use-a-multimeter)
- [Connector Basics](https://learn.sparkfun.com/tutorials/connector-basics)
- [Polarity](https://learn.sparkfun.com/tutorials/polarity)
- [Series and Parallel Circuits](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits)
- [AC vs DC current](https://learn.sparkfun.com/tutorials/alternating-current-ac-vs-direct-current-dc) -->

<!-- ## Old lesson plan

- L1: What is electricity: current, voltage, and resistance + online simulation activities
- Circuit schematics?
- LX: Common electronic components: resistors and LEDs
- L2: Ohm's Law + example circuit equations/solving + online simulation activities
- L3: Measuring current, voltage, and resistance using multimeters
- L4: Series vs. parallel resistance

- L4: How to use a breadboard + moving your prev circuit to breadboards
- LX: What are LEDs and resistors?
- L5: Series vs. Parallel Resistance, Voltage Dividers, and Ohm's Law
- LX: Building your first circuit: lighting up an LED, swapping out different resistances (maybe paper-based version)

Should I have a small lesson on what is a resistor and what is an LED (or perhaps I fold that into Lesson 2).

See also notes on phone. -->