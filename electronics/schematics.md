---
layout: default
title: L2&#58; Circuit Schematics
nav_order: 2
parent: Electronics
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

Before going any further, it's useful to introduce [**circuit schematics**](https://en.wikipedia.org/wiki/Circuit_diagram), which are diagrammatic abstractions of circuits. Unlike the more realistic pictorials that we have used thus far (*e.g.,* like [this](assets/videos/ElectronFlowVsConventionalCurrent_PhetSimulation_ByJonFroehlich.mp4) or [this](assets/videos/WaterCircuitAnalogy_Trimmed_ByJonFroehlich.mp4), circuit schematics are the [*lingua franca*](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html) of electronics—they are a compact, standardized, and visual representations of circuits. You'll find them in electronic datasheets, CAD layout software, and circuit analysis.

But, like any "language", schematics take time and experience to learn and understand. For the most part, we will try to offer both pictorial representations and schematic representations in our tutorials but schematics are preferred for circuit analysis and you'll need to build up understanding in order to parse component datasheets—an important skill!

## Common electronic symbols

Below, we've included some common electronic symbols for basic circuits. We will begin using these symbols in our next lesson on Ohm's Law, so it's important to study them. What do you observe? For the most part, the symbols are clean, distinguishable, and help capture the "essence" of the underlying component. Notice how a resistor and a resistive (incandescent) lamp are related and the diode and light-emitting diode (LED)—the latter which includes two little arrows indicating light emission. 

For more examples, see [Wikipedia's entry](https://en.wikipedia.org/wiki/Electronic_symbol) or visit one of the [Resources](#resources) listed below. 

![An image showing the electronic symbol for voltage source, current source, battery, resistive light (lamp), resistor, switch, diode, and LED](assets/images/BasicElectronicSymbols_ByJonFroehlich.png)

**Figure.** Common electronic symbols. For the battery, the long line is used to indicate the positive terminal and the short line is the negative terminal (which is typically used as ground). Image made in PowerPoint.
{: .fs-1 }

## Pictorial vs. circuit schematics

To demonstrate the difference and utility of pictorial *vs.* circuit schematics, we provide some examples below. In the first example, we simply have a 1.5V battery with a 100Ω resistor. One benefit of circuit diagrams is that they can be more visually compact and understandable in black-and-white.

![Image shows a pictorial representation of a basic circuit with a 1.5V battery, a switch, a resistor, and an LED along with a circuit schematic reprentation](assets/images/PictorialDiagramVsCircuitSchematic_ByJonFroehlich.png)

**Figure.** An example pictorial diagram and circuit schematic of a basic switching circuit with a 1.5V battery, a switch, a resistor, and an LED. Note: in a circuit schematic, the long line on the battery is used to indicate the positive terminal. Image made in [Fritzing](https://fritzing.org/) and PowerPoint.
{: .fs-1 }

Below, we have two additional examples. On the left, we have a 9V circuit with a switch, a 470Ω, and an LED. On the right, we have two 1.5V batteries in series (stacked together, which creates a 3V voltage source) and a resistive light bulb (lamp). Do the schematic representations make sense? Why or why not?

![Two additional pictorial diagrams. vs. circuit schematics](assets/images/AdditionalPictorialDiagramVsCircuitSchematics_ByJonFroehlich.png)

**Figure.** Additional examples of pictorial diagrams vs. circuit schematics for two more circuits. Right-click on the image and open it in a "new tab" to zoom. Image made in [Fritzing](https://fritzing.org/) and PowerPoint.
{: .fs-1 }

## Schematics do not capture physical arrangement

While a circuit schematic captures the relative ordering of and connections between components, the spacing and overall layout is *not* captured. That is, a circuit schematic captures the electrical relationships between components. When followed, you can use them to create a circuit (in whatever spatial layout you want—as long as it is functionally equivalent to the diagram).

Thus, the following five schematics of a basic LED circuit are all functionally equivalent! Take your time reading them—do you agree that they are all equivalent? What stands out to you?

![This image shows five different equivalent examples of a basic LED circuit with a 9V source, a resistor, and an LED](assets/images/BasicLEDCircuitMultipleExamples_CircuitSchematic_ByJonFroehlich.png)

**Figure.** Though they *look* different, all five of these basic LED circuits are functionally equivalent. Each of them have the positive terminal of the battery connected to a resistor, then an LED, and the cathode of the LED is connected to the negative terminal of the battery. Image made in PowerPoint.
{: .fs-1 }

## Representing connected vs. unconnected wires

When reading a circuit schematic, it can be difficult to properly interpret crossing wires—*i.e.,* "*are those wires connected or not?*" Thankfully, there is a standard for this as well (though some deviations are possible).

A wire is shown as a solid line. When two or more wires **connect**, the junction is *typically* depicted by a black dot—we call this junction a **node**. For **crossing** (unconnected) wires, there is *no* black dot. As [Hughes notes](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html), schematics created before ~1980 used a *hump* or *arc* to indicate that one wire cross another without connecting (far right in image below). While valuable, this practice is far less common today perhaps because of the greater complexity of modern circuits.

![Examples of how to differentiate between connected and unconnected wires in a circuit schematic](assets/images/ConnectedVsUnconnectedWires_CircuitSchematics_ByJonFroehlich.png)

**Figure.** When reading a circuit schematic, it's important to properly assess and understand which wires are connected and how—but determining whether a crossing wire is unconnected (*e.g.,* jumping over a wire) or connected (*i.e.,* forming a node) can be confusing. Above, we show various examples of how to interpret whether wires are connected in a circuit diagram. Image made in PowerPoint.
{: .fs-1 }

But this can quickly get confusing. For example, are the two circuits below equivalent or not? In fact, they are! When in doubt, redraw the circuit yourself on a piece of paper!

![An image of four block elements connected together in a certain arrangement and two equivalent circuit diagrams](assets/images/ExampleOfConfusingButEquivalentCircuit_CircuitSchematics_StanfordEngr40.png)
An example of how even simple circuits can start to get confusing. What's connected to what? Are these two circuits the same? In fact, yes! When in doubt, redraw the circuit on paper. Image from [Stanford's ENGR 40M course](https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture01.pdf).
{: .fs-1 }

<!-- - https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture01.pdf
- https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture02.pdf -->

**TODO: Add in ground discussion**

## Resources

- [From Schematic to Reality](http://beavisaudio.com/techpages/SchematicToReality/), beavisaudio.com

- [Appendix B: Schematics](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html), John M. Hughes, [Practical Electronics: Components and Techniques](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/), O'Reilly Media, 2015

- [Schematic Diagrams](https://itp.nyu.edu/physcomp/videos/videos-schematic-diagrams/), [ITP videos](https://vimeo.com/album/2801639) by [Jeff Feddersen](http://www.fddrsn.net/) on Vimeo

## Next Lesson

In the [next lesson](ohms-law.md), we will learn about [Ohm's Law](ohms-law.md), one of the most important and fundamental empirical laws in electrical circuits that relates voltage, current, and resistance together in a rather simple equation: $$I = \frac{V}{R}$$.

<span class="fs-6">
[Previous: Voltage, current, and resistance](electricity-basics.md){: .btn .btn-outline }
[Next: Ohm's Law](ohms-law.md){: .btn .btn-outline }
</span>