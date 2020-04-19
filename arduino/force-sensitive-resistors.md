---
layout: default
title: L4&#58; Force-Sensitive Resistors
nav_order: 4
parent: Input
has_toc: true # (on by default)
comments: true
usemathjax: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson, you'll learn about force-sensitive resistors (FSRs) and how to use FSRs and two-legged variable resistors more generally with microcontrollers. We'll conclude with building a "force-sensitive" musical instrument—very Jedi-like!

This lesson directly builds on the prior one ([potentiometers](potentiometers.md)), so definitely complete that first.

## Materials

We'll need the following materials:

| Breadboard | Arduino | FSR | Resistor | Piezo Buzzer |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![FSR]({{ site.baseurl }}/assets/images/FSR_200h.png) | ![Image of 10KOhm resistor]({{ site.baseurl }}/assets/images/Resistor10K_Fritzing_100w.png) | ![Piezo buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_100h.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | [Force-Sensitive Resistor](https://www.adafruit.com/product/166) | 10kΩ Resistor | [Piezo Buzzer](https://www.mouser.com/ProductDetail/810-PS1240P02BT) |

## Force-sensitive resistors (FSRs)

Force-sensing (or force-sensitive) resistors (FSRs) are two-legged variable resistors that **decrease** in resistance with an **increase** in applied force. FSRs can differ in size, shape, and force sensing sensitivity. There are a variety of different form factors, including square and circular (which host the active sensor area). In our hardware kits, we typically purchase and provide the popular [Interlink FSR 402]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) (either from [Sparkfun](https://www.sparkfun.com/products/9375) or [Adafruit](https://www.adafruit.com/product/166)), which is the product in the upper-left below.

![Grid of example force sensitive resistors from Sparkfun's website](assets/images/ForceSensitiveResistors_Examples_Sparkfun.png)
Prices and products from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all)
{: .fs-1 }

While FSRs respond to force, they are not precision measurement instruments like [load cells](https://learn.sparkfun.com/tutorials/getting-started-with-load-cells) or [strain gauges](https://learn.sparkfun.com/tutorials/getting-started-with-load-cells/strain-gauge-basics), so use those if you want to precisely measure weight, load, or strain.

<!-- TODO: How do FSRs work actually work? Include figure from datasheet -->

### FSR applications

What can we do with FSRs?

The [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) describes a number of example applications, including:
- **Detecting human interaction.** Sense whether a touch is accidental or intentional by a reading force (or other signal processing)
- **Using force for UI feedback.** Detect user's touch force to make a more intuitive interface
- **Enhancing tool safety.** Differentiate a grip from a touch as a safety lock
- **Finding centroid of force.** Use multiple sensors to determine centroid of force
- **Detecting presence, position, or motion** Sense a person/patient in a bed, chair, or medical device
- **Detecting liquid blockage.** Detect tube or pump occlusion or blockage by measuring back pressure

<!-- TODO: in future, include papers from HCI and UbiComp with pressure sensors -->

### How do FSRs work?

How do FSRs actually work? Their construction is actually quite simple. There are three layers: the top and bottom layers are conductive and the middle layer provides a "thin air gap" that separates the two. When the two conductive layers are pressed together, electrical pathways are made. The harder you press, the more connections. See the FSR construction diagram from Interlink below:

![FSR construction diagram from interlink showing three layers: top and bottom layer are conductive and middle layer is an "air gap" that separates the two.](assets/images/FSR_ConstructionDiagram_Interlink.png)
Diagram from the Interlink FSR [Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf)
{: .fs-1 }

<!-- TODO: in future, consider adding in a second diagram that shows how the connections in the "active area" are made when the top layer comes down? -->

### FSR force-resistance graph

So, what exactly is the relationship between an FSR's resistance and an applied force?

A graph of the force (g) vs. resistance (kΩ) of the FSR 402 is shown below (plotted on a log-log scale). As can be observed from the graph, the FSR has two response phases: 

1. An initial "break force" or "turn on threshold" that dramatically swings the resistance from >10MΩ to roughly 10kΩ
2. After this threshold, the FSR resistance becomes inversely proportional to the applied force (following an inverse power-law characteristic).  

At the high-end of the force range (greater than 1000g), the FSR saturates and does not continue to drop resistance.

![Graph of the resistance vs. force curve for the Interlink FSR 402 showing that resistance drops with applied pressure](assets/images/ForceSensitiveResistor_ResistanceForceCurve_InterlinkFSR402.png)
A graph of the force (g) vs. resistance (kΩ) plotted on a log-log scale for the Interlink FSR 402. Graph from the [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf).
{: .fs-1 }

For more details, see the Interlink [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) and [Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf).

## Making an LED dimmer with an FSR

Let's make something!

To begin, just like we did with the [buttons](buttons.md) and [potentiometers](potentiometers.md) lessons, we'll make a simple LED circuit without a microcontroller. In fact, this circuit will be the exact same as the "rheostat" potentiometer circuit [here](potentiometers.md#build-the-potentiomer-based-led-dimmer) (but we'll replace the rheostat with an FSR).

Below, we show two possible wiring diagrams: the first (preferred) shows the FSR circuit powered by a 9V battery while the second shows power derived from the 5V and GND pins on the Arduino. (Again, we prefer the former just to further emphasize that at this point, we're not using microcontrollers!)

![Two wiring diagrams of an FSR connected to an LED](assets/images/FSR_WiringDiagram_NoArduino_Fritzing.png)
Two wiring options of an FSR using a breadboard. Like typical resistors, FSRs can be inserted into your circuits in either direction.
{: .fs-1 }

With the 9V wiring, we include a backup resistor; however, with the 5V wiring (with Arduino), we do not. This is because both the [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) and our own empirical use demonstrate that even with 1,000g of force, the FSR still has roughly 200Ω-500Ω of resistance. So, while the potentiometer drops to 0Ω at the lowest setting, the FSR does not. For the 9V wiring, if we assume the red LED's $$V_f=2V$$ and the lowest FSR resistance of 200Ω, then $$I=\frac{9V-2V}{200Ω}=35mA$$, which exceeds the max current of the LED. We thus added a 470Ω backup resistor to be safe. So, $$I=\frac{9V-2V}{200Ω + 470Ω}=10.4mA$$.

### Positioning FSR on breadboard

The two contact legs are 2.54mm apart (0.1"), so should fit snugly into your breadboard. Just like a traditional resistor, the FSR can be inserted in either direction.

![FSR close-up of the two contact legs](assets/images/FSR_ContactLegs_Zoom_FromSparkfun.png)
Image from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#res).
{: .fs-1 }

If you want a more permanent connection, see this [fantastic guide](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#hardware-assembly) from Sparkfun on soldering FSRs (difficult) or using Amphenol FCI Clinchers (recommended):

![Image showing Amphenol CFI clincher connectors installed on the FSR's legs](assets/images/FSR_Clinchers_Sparkfun.png)
Image from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#hardware-assembly) showing Amphenol CFI clincher connectors installed on the FSR's legs.
{: .fs-1 }

### Workbench video of completed circuit

Once you've made the circuit, have fun playing with the FSR. Get a sense of its responsiveness and how hard you have to press.

Here's a workbench video of our completed circuit (this is the same video as the one in the [potentiometers](potentiometers.md) lesson, so there is a backup resistor):

<iframe width="736" height="414" src="https://www.youtube.com/embed/YMCqDcnwMYo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
Workbench video of the FSR LED dimmer circuit
{: .fs-1 }

## Using FSRs with microcontrollers

First, like usual, we'll show you the wrong way to hook up an FSR to a microcontroller:

![Incorrect Arduino wiring diagram and schematic for FSR](assets/images/ArduinoUno_FSR_Incorrect_SchematicAndDiagram.png)

Why doesn't this work?

Recall from our [potentiometers](potentiometers.md) lesson, microcontrollers read voltages, not current. We have to setup a circuit that enables our microcontroller to "see" changes in voltages. 

<!-- make and show an animation of the pot splitting into two resistors and how this is the same thing that we have to do for our FSR -->

We had to do the same thing with the [potentiometer](potentiometers.md). The potentiometer would not work as analog input when only two legs were used. We had to connect all three potentiometer legs. 

To use an FSR—or any variable resistor—with a microcontroller, you must add a fixed resistor to form a voltage divider like this:

![Arduino wiring diagram and schematic for FSR](assets/images/ArduinoUno_FSR_SchematicAndDiagram.png)

That fixed resistor is like hooking up the third leg of a potentiometer. It's also similar to the pull-up or pull-down resistors for our switch circuits (and, indeed, when the FSR is **not** pressed, it acts like an open switch because its resistance is so high).

### How to select the fixed resistor

But how do we know what value to select for this fixed resistor? To the datasheets!

The [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf) suggests choosing the fixed resistor (which it calls $$R_M$$) based on your specific use context to maximize the desired force sensitivity range and to limit current.

The guide provides a useful force *vs.* $$V_{out}$$ graph with different fixed resistor values ($$R_M$$). As can be observed from the graph, selecting a 10kΩ resistor for $$R_M$$ provides the most dynamic $$V_{out}$$ range for the full sensing force range of the FSR. Note also the two-phase relationship with the initial steep slope followed by a software increase.

![FSR force vs. Vout graph for different fixed resistor values from the Interlink FSR data sheet](assets/images/Voltage-divider-circuit-Interlink-FSR-402-Makerguides.png)
Graph originally from [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf). Image above from [Makerguides](https://www.makerguides.com/fsr-arduino-tutorial).

## Exercises

- Write code to fade an LED based on the force applied to the FSR
- Write code to change the tone frequency to a piezo buzzer based on the force applied to the FSR

<!-- Remaining TODOs: writing code to fade LED, talking about map function, write musical code -->

<!-- ### Make your own lo-fi pressure sensor

TODO: show super simple lo-fi pressure sensor out of pencil. Show both alligator clip version and taped jumper wire version. -->

## References
- [Interlink FSR 402 Data Sheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf)
- [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf)
- [Force Sensing Resistor (FSR) with Arduino Tutorial](https://www.makerguides.com/fsr-arduino-tutorial/), Makerguides.com
- [Force Sensitive Resistors (FSRs)](http://www.openmusiclabs.com/learning/sensors/fsr/), Open Music Labs
- [Force Sensitive Resistor (FSR)](https://learn.adafruit.com/force-sensitive-resistor-fsr), Adafruit Learn
- [Force Sensitive Resistor Hookup Guide](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all), Sparkfun Tutorials