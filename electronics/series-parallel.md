---
layout: default
title: L4&#58; Series and Parallel Resistors
nav_order: 4
parent: Intro to Electronics
has_toc: false # on by default
usemathjax: true
comments: true
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In our Ohm's Law lesson we analyzed relatively straightforward circuits with a single resistor. These circuits helped us build a foundation for and a conceptual understanding of Ohm's Law and how to apply it; however, most circuits are not so simple.

In this lesson, we we're going to extend Ohm's Law to more complicated circuits: resistors in **series** and resistors in **parallel**—perhaps you built some of these circuit configurations in your [CircuitJS](https://www.falstad.com/circuit/circuitjs.html) simulations. In short: 
* Resistors in series **divide voltage** and are one of the most common (and useful) circuit configurations when working with microcontrollers and resistive sensors like [potentiometers](../arduino/potentiometers.md), [force-sensitive resistors](../arduino/force-sensitive-resistors.md), and [photocells](../sensors/photoresistors.md).
* Resistors in parallel **divide current** (and more current travels down paths with less resistance). Parallel circuits are useful, for example, in powering multiple LEDs.

![Image shows two diagrams: on the left is a circuit with series resistors and on the right is a circuit with parallel resistors.](assets/images/OhmsLaw_IntroToSeriesVsParallelResistorCircuits_ByJonFroehlich.png)
**Figure.** An example of **series** resistors (left) and **parallel** resistors (right). Images made  PowerPoint.
{: .fs-1 }

Using [Kirchhoff's circuit laws](https://en.wikipedia.org/wiki/Kirchhoff%27s_circuit_laws), we can derive "equivalent" resistances for series and parallel circuits.

For series resistors, we sum resistances to find the aggregate resistance $$R_{equivalent}$$:

$$R_{equivalent} = R_{1} + R_{2} + ... + R_{N-1} + R_{N}$$

For parallel resistors, it's a bit more complicated:

$$R_{equivalent} = \frac{1}{\frac{1}{R_{1}} + \frac{1}{R_{2}} + ... + \frac{1}{R_{N-1}} + \frac{1}{R_{N}}}$$

Yes, the parallel resistance equation is a bit enigmatic but you can derive it yourself (or even forget it all together) if you know Ohm's Law and [Kirchhoff's Laws](https://www.khanacademy.org/science/physics/circuits-topic/circuits-resistance/v/ee-kirchhoffs-current-law).

For us, the most important and useful concept to understand is that **series resistors** divide voltage (we'll use this later in our microcontroller circuits) and that **parallel resistors** divide current (with *more* current flowing through branches with less resistance). The image below attempts to concisely explain this.

![Image shows two diagrams: on the left is a circuit with series resistors and on the right is a circuit with parallel resistors](assets/images/OhmsLaw_IntroToSeriesVsParallelResistorCircuits_PictorialDiagram_ByJonFroehlich.png)

And, while the ability to manually understand and analyze a circuit is important in physical computing, if you become confused, you can always use a circuit simulator like [CircuitJS](https://www.falstad.com/circuit/circuitjs.html).

### Series resistors

<!-- Electronics for beginners has some nice voltage divider examples: https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/html/488495_1_En_9_Chapter.xhtml -->



<!-- Voltage—like water pressure—can be measured without flow. For example, we can use a multimeter to measure the voltage between two ends of a battery. Notably, any wires we connect to those battery terminals will have the same electric potential.

- Single loop one resistor
- single loop one resistor but vary resistance
- Single loop two resistors in series
- Single loop two resistors in parallel -->

<!-- https://ccrma.stanford.edu/wiki/Introduction_to_Electronics_(condensed)
https://learning.oreilly.com/library/view/make-electronics-2nd/9781680450255/ch01.html
https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml#
https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/ch05.html
https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/html/488495_1_En_5_Chapter.xhtml -->

## Resources
- [Introduction to circuits and Ohm's Law](https://www.khanacademy.org/science/in-in-class10th-physics/in-in-electricity/in-in-circuits-ohms-law-resistance/v/circuits-part-1), Khan Academy
- [Section 2.12: Ohm's Law and Resistors](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml#), Practical Electronics for Inventors by Scherz and Monk.
- [Resistors in series and parallel](https://opentextbc.ca/universityphysicsv2openstax/chapter/resistors-in-series-and-parallel/), opentextbc.ca
- [Series and Parallel Resistors](https://www.khanacademy.org/science/ap-physics-1/ap-circuits-topic/series-circuits-ap/v/ee-series-resistors), Khan Academy

<!-- TODO: Engineering Mindset has a nice [animation](https://youtu.be/kcL2_D33k3o?t=858) of differences between series and parallel -->