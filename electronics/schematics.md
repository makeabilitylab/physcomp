---
layout: default
title: L2&#58; Circuit Schematics
nav_order: 2
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

Before going any further, it's useful to introduce [**circuit schematics**](https://en.wikipedia.org/wiki/Circuit_diagram), which are diagrammatic abstractions of circuits—this will allow us to "speak" about and describe circuits **visually**.

Unlike the more realistic pictorials that we have used thus far (*e.g.,* like [this](assets/videos/ElectronFlowVsConventionalCurrent_PhetSimulation_ByJonFroehlich.mp4) or [this](assets/videos/WaterCircuitAnalogy_Trimmed_ByJonFroehlich.mp4)), circuit schematics are the [*lingua franca*](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html) of electronics—they are compact, standardized, visual representations of circuits. You'll find them in electronic datasheets, CAD layout software, and circuit analysis.

But, like any "language", schematics take time and experience to learn and understand. For the most part, we will try to offer both pictorial representations and schematic representations in our tutorials but schematics are preferred for circuit analysis and you'll need to build up understanding in order to parse component datasheets—an important skill!

## Common electronic symbols

Below, we've included some common electronic symbols for basic circuits. We will begin using these symbols in our next lesson on Ohm's Law, so it's important to study them. What do you observe?

For the most part, the symbols are clean, distinguishable, and help capture the "essence" of the underlying component. Notice how a resistor and a resistive (incandescent) lamp are related—and, as resistive elements, they share a zig-zaggy line. Notice too how the diode and light-emitting diode (LED) are visually similar (they are both diodes!)—the latter includes two little arrows indicating light emission.

For more examples, see [Wikipedia's entry](https://en.wikipedia.org/wiki/Electronic_symbol) or visit one of the [Resources](#resources) listed below.

<!-- TODO: consider adding ground to this diagram below? -->

![A reference chart of common electronic symbols including voltage source, current source, battery, resistive lamp, resistor, switch, diode, and LED. Each symbol is labeled with its name.](assets/images/BasicElectronicSymbols_ByJonFroehlich.png)

**Figure.** Common electronic symbols. For the battery, the long line is used to indicate the positive terminal and the short line is the negative terminal (which is typically used as ground). Image made in PowerPoint.
{: .fs-1 }

## Pictorial vs. circuit schematics

To demonstrate the difference and utility of pictorial *vs.* circuit schematics, we provide some examples below.

In the first example, we have a 1.5V battery with a 100Ω resistor. Unlike pictorial diagrams (on the left), circuit diagrams can be more visually compact as well as legible in black-and-white.

![A side-by-side comparison of a pictorial diagram and a circuit schematic for a basic switching circuit with a 1.5V battery, a switch, a resistor, and an LED.](assets/images/PictorialDiagramVsCircuitSchematic_ByJonFroehlich.png)

**Figure.** An example pictorial diagram and circuit schematic of a basic switching circuit with a 1.5V battery, a switch, a resistor, and an LED. Note: in a circuit schematic, the long line on the battery is used to indicate the positive terminal. Image made in [Fritzing](https://fritzing.org/) and PowerPoint.
{: .fs-1 }

Below, we have two additional examples. On the left, a 9V circuit with three components: a switch, a 470Ω resistor, and an LED. On the right, we have two 1.5V batteries in series (stacked together, which creates a 3V voltage source) and a resistive light bulb (lamp). Do the schematic representations make sense? Do they seem to match their pictorial counterparts? Why or why not?

![Two additional side-by-side comparisons of pictorial diagrams and their equivalent circuit schematics. Left: a 9V circuit with a switch, 470 ohm resistor, and LED. Right: two 1.5V batteries in series with a lamp.](assets/images/AdditionalPictorialDiagramVsCircuitSchematics_ByJonFroehlich.png)

**Figure.** Additional examples of pictorial diagrams vs. circuit schematics for two more circuits. Right-click on the image and open it in a "new tab" to zoom. Image made in [Fritzing](https://fritzing.org/) and PowerPoint.
{: .fs-1 }

## Schematics do not capture physical arrangement

While a circuit schematic captures the relative ordering of and connections between components, the spacing and overall layout is *not* captured. When followed, you can use circuit schematics to build a circuit—a bit like following Ikea instructions. But, in this case, the schematic only captures the electrical relationships between components. So, you can use whatever spatial layout you want—as long as it is functionally equivalent to the diagram.

For example, the following five schematics of a basic LED circuit are all functionally equivalent! Take your time reading them—do you agree that they are all equivalent? What stands out to you?

![Five different circuit schematics of the same basic LED circuit with a 9V source, a resistor, and an LED, drawn in different spatial layouts but all electrically equivalent.](assets/images/BasicLEDCircuitMultipleExamples_CircuitSchematic_ByJonFroehlich.png)

**Figure.** Though they *look* different, all five of these basic LED circuits are functionally equivalent. Each of them have the positive terminal of the battery connected to a resistor, then an LED, and the cathode of the LED is connected to the negative terminal of the battery. Image made in PowerPoint.
{: .fs-1 }

## Representing connected vs. unconnected wires

When reading a circuit schematic, it can be difficult to properly interpret crossing wires—*i.e.,* "*are those wires connected or not?*" Thankfully, there is a standard for this as well (though some deviations are possible).

A wire is shown as a solid line. When two or more wires **connect**, the junction is *typically* depicted by a black dot—we call this junction a **node**. For **crossing** (unconnected) wires, there is *no* black dot. As [Hughes notes](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html), schematics created before ~1980 used a *hump* or *arc* to indicate that one wire crossed another without connecting (far right in image below). While valuable, this practice is far less common today perhaps because of the greater complexity of modern circuits, which have more crossing wires (thus, those humps could be visually distracting).

![A reference diagram showing how to differentiate between connected and unconnected wires in a circuit schematic. Connected wires have a black dot at the junction (a node). Unconnected crossing wires have no dot. Older schematics used a hump or arc for unconnected crossings.](assets/images/ConnectedVsUnconnectedWires_CircuitSchematics_ByJonFroehlich.png)

**Figure.** When reading a circuit schematic, it's important to properly assess and understand which wires are connected and how—but determining whether a crossing wire is unconnected (*e.g.,* jumping over a wire) or connected (*i.e.,* forming a node) can be confusing. Above, we show various examples of how to interpret whether wires are connected in a circuit diagram. Image made in PowerPoint.
{: .fs-1 }

But this can quickly get confusing. For example, are the two circuits below equivalent or not? In fact, they are! When in doubt, redraw the circuit yourself on a piece of paper!

![Two circuit diagrams with four block elements connected in a certain arrangement. Despite looking different, the two diagrams are electrically equivalent.](assets/images/ExampleOfConfusingButEquivalentCircuit_CircuitSchematics_StanfordEngr40.png)

**Figure.** An example of how even simple circuits can start to get confusing. What's connected to what? Are these two circuits the same? In fact, yes! When in doubt, redraw the circuit on paper. Image from [Stanford's ENGR 40M course](https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture01.pdf).
{: .fs-1 }

<!-- - https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture01.pdf
- https://web.stanford.edu/class/archive/engr/engr40m.1178/slides/lecture02.pdf -->

## Voltage source and ground nodes

On many circuit diagrams, you'll see special symbols used to denote the voltage source and ground nodes. As introduced in [Lesson 1](electricity-basics.md#relative-voltages-and-ground), **ground** (GND) is the reference point we define as 0V. Positive voltage source nodes are usually indicated by an arrow pointing up while ground nodes are typically pointed down (with a flat line, downward pointing triangle, or three lines).

![Diagram showing examples of positive voltage source symbols (upward arrows labeled with voltage values) and ground node symbols (downward-pointing triangles and three horizontal lines).](assets/images/VoltageSourceAndGroundNodes_ByJonFroehlich.png)

**Figure.** Using these symbols has the advantage of more clearly marking what the reference or ground node of a circuit is but, more importantly, also allows the circuit designer to render more clean diagrams (by removing needless wires).
{: .fs-1 }

For example, all four versions of this simple LED-based circuit are functionally equivalent but the one on the right is far simpler.

![Four equivalent LED circuits drawn with increasing levels of abstraction. The leftmost uses full battery and wire representations, while the rightmost uses voltage source and ground node symbols for a minimalist look.](assets/images/RedrawingLEDCircuitWithVoltageSourceAndGroundNodes_ByJonFroehlich.png)

**Figure.** Four examples of the *same* circuit drawn differently. The circuit visuals become increasingly minimalist from left-to-right. Image made in PowerPoint (inspired by [Section 5.6](https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/html/488495_1_En_5_Chapter.xhtml) of Electronics for Beginners).
{: .fs-1 }

### A real example

In the schematic below, you can see how the circuit designer made use of the voltage source and ground node symbols. This declutters the diagram by reducing the need to have many lines (wires) drawn to a shared $$GND$$ node.

![A circuit schematic of the 5V voltage regulator section of the SparkFun RedBoard, showing an LM1117 linear regulator, capacitors, a zener diode, and voltage source and ground node symbols.](assets/images/CircuitSchematic_RedBoard5VRegulator_FromSparkfun.png)

**Figure.** This circuit schematic is of the 5V voltage regulator on the [SparkFun RedBoard](https://www.sparkfun.com/products/13975), SparkFun's open hardware version of the [Arduino Uno R3](https://store.arduino.cc/usa/arduino-uno-rev3) board. Notice how the schematic uses the voltage source and ground node symbols? A [voltage regulator](https://en.wikipedia.org/wiki/Voltage_regulator) is a system designed to maintain a constant voltage and is used here to step down 7–15V source inputs to a constant 5V. The full schematic is [here](http://cdn.sparkfun.com/datasheets/Dev/Arduino/Boards/RedBoard-v06.pdf).
{: .fs-1 }

The circuit schematic above also has a number of other symbols, including polarized and non-polarized [capacitors](https://en.wikipedia.org/wiki/Capacitor) (two parallel lines), a [zener diode](https://en.wikipedia.org/wiki/Zener_diode), and the [LM1117 linear regulator](https://www.ti.com/lit/ds/symlink/lm1117.pdf).

## Activity: Building circuit diagrams in Fritzing

For your learning activity, we would like you to build both a *pictorial* representation and a *schematic* representation of the same circuit in the open-source hardware layout tool [Fritzing](https://fritzing.org/).

### Download and install Fritzing

While the production version of Fritzing is now [€ 8 (version 1.0.6)](https://fritzing.org/download/), you can download free development versions on [GitHub](https://github.com/fritzing/fritzing-app/releases). The latest free development version is CD-548. Visit the GitHub Fritzing [releases page](https://github.com/fritzing/fritzing-app/releases) and scroll down to CD-548, then click on the 'Assets' link, which will expand a download menu for compiled versions of Fritzing for various OSes. See image below.

![Screenshot of the GitHub releases page for Fritzing, showing the CD-548 development build with the Assets dropdown expanded to reveal download links for Windows, macOS, and Linux.](assets/images/DownloadingFritizingFromGitHub_ScreenshotByJonFroehlich.png)

**Figure.** Go to the GitHub Fritzing [releases page](https://github.com/fritzing/fritzing-app/releases), scroll down to CD-548, then click on the 'Assets' link to download a free development version of Fritzing.
{: .fs-1 }

### Download and install Adafruit Fritzing library
Adafruit maintains an [open-source repository on GitHub](https://github.com/adafruit/Fritzing-Library) of all their custom electronic parts for Fritzing (cool!). If you're using Adafruit parts in your projects, we strongly recommend downloading and installing the Adafruit Fritzing Library—just follow the [installation instructions here](https://learn.adafruit.com/using-the-adafruit-library-with-fritzing)!

### Using Fritzing

Once you've downloaded and unzipped the Fritzing release, open it and follow this tutorial video. Together, we will make a simple LED-based circuit with a 9V battery, a switch, a resistor, and an LED. To complement the video, we also have this [simple Fritzing PDF guide](assets/pdfs/RapidIntroduction_HowToUseFritizing_ByJonFroehlich.pdf).

<iframe width="736" height="414" src="https://www.youtube.com/embed/x1aN9LwhIAQ" title="Fritzing tutorial: building a simple LED circuit with a 9V battery, switch, resistor, and LED" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**Figure.** A video tutorial of using [Fritzing](https://fritzing.org/) to build a simple LED-based circuit.
{: .fs-1 }

Unfortunately, while you can create nice pictorial and schematic diagrams of circuits in Fritzing, you cannot simulate them (ugh, I know!). So, you have to use another tool for this.

### For your prototyping journal

For your prototyping journal, take a screenshot of what you made following the tutorial video. Then save a new file, and make a simple modification to the circuit—it could be switching to a different color LED or adding in another part of the circuit. Take a screenshot of this new modified circuit and describe it, briefly, in your journal.

As usual, you should also report on any challenges or confusions you experienced!

Have fun!

## Schematic building tools

There are a number of schematic building tools aimed at makers, each with their own tradeoffs.

- [Fritzing](https://fritzing.org/). Provides both pictorial ("breadboard") plus schematic representations. Long a favorite in the maker and education communities, though the production version is now a paid download (€ 8). Free development builds are available on [GitHub](https://github.com/fritzing/fritzing-app/releases).

- [KiCad](https://www.kicad.org/). A free, open-source EDA tool used widely in both hobbyist and professional settings. KiCad offers powerful schematic capture and PCB layout, with a large parts library. More full-featured (and more complex) than Fritzing, but excellent once you're ready to go beyond breadboard prototyping.

- [Circuito.io](https://www.circuito.io/). Has some very interesting auto-completion features—you select components and it automatically generates a wiring diagram and test code. Purely a web app. No simulation support.

- [Tinkercad Circuits](https://www.tinkercad.com/learn/circuits). Allows you to design Arduino-based circuits, write code, and simulate. Does not provide schematic representations.

## Resources

- [How to Read a Schematic](https://learn.sparkfun.com/tutorials/how-to-read-a-schematic/all), sparkfun.com

- [From Schematic to Reality](http://beavisaudio.com/techpages/SchematicToReality/), beavisaudio.com

- [Appendix B: Schematics](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/app02.html), John M. Hughes, [Practical Electronics: Components and Techniques](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/), O'Reilly Media, 2015

- [Schematic Diagrams](https://itp.nyu.edu/physcomp/videos/videos-schematic-diagrams/), [ITP videos](https://vimeo.com/album/2801639) by [Jeff Feddersen](http://www.fddrsn.net/) on Vimeo

## Next Lesson

In the [next lesson](ohms-law.md), we will learn about [Ohm's Law](ohms-law.md), one of the most important and fundamental empirical laws in electrical circuits that relates voltage, current, and resistance together in a rather simple equation: $$I = \frac{V}{R}$$.

<span class="fs-6">
[Previous: Voltage, current, and resistance](electricity-basics.md){: .btn .btn-outline }
[Next: Ohm's Law](ohms-law.md){: .btn .btn-outline }
</span>