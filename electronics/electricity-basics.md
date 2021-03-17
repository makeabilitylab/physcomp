---
layout: default
title: L1&#58; Voltage, Current, and Resistance
nav_order: 1
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

https://firstyearengineer.com/circuits/basic-electricity/current/

## What is current?

With digital circuits, we work with low amperages. For example, an LED requires ~20 milliamperes (milliamps or simply, mA) to light up and an individual pin on the Arduino might supply up to 40mA.

### What's the difference between AC and DC?

Digital circuits use *direct current* (DC), which is supplied by batteries or by AC adapters that you plug into your wall such as your phone or laptop chargers.

## What is voltage?

While common currents for digital circuits are often in the mA range (that is, less than 1 amp), operating voltages are commonly 3.3V or 5V. For example, the ESP32 chip operates on 3.3V while the Arduino Uno and Leonardo boards operate on 5V.

## What is electrical resistance?

Electrical *resistance* is the opposition to the flow of electric current. The SI unit of electrical resistance is the ohm (Ω). Conversely, the ease with which current passes through a material is called *conductance*. Metal materials like silver, copper, and gold have very low resistance and high conductivity—they have easily displaceable electrons ("high electron mobility"). In contrast, materials such as glass, rubber, and air have high resistance and poor conductivity ("low electron mobility")—these materials are called *insulators*.

The resistance $$R$$ of an object is defined as the ratio of voltage $$V$$ across it to current $$I$$ through it while conductance G is the reciprocal:

$$R = \frac{V}{I}$$, $$G = \frac{1}{R}$$

The higher the resistance (higher Ω value), the more opposition to current flow. Typically, circuit wires are made of copper (a good conductor) and we can place *resistors* in our circuits to resist current flow. Why would we want to resist current? We shall see in a future lesson!

### Lowering resistance

We can lower the resistance of a wire by *increasing* its diameter (a "bigger pipe" for current to flow). Drawing again on our water flow analogy: just as a larger diameter pipe can support larger quantities of water flow compared to a more narrow pipe so too can a thicker wire support more current flow.

TODO: insert figure

A wire with a diameter of 5.2mm (AWG 4) has a current capacity of 59.6A while standard circuit prototyping wire, which is 0.64mm (AWG 22), has a current capacity of 0.9A. AWG stands for [American Wire Gauge](https://en.wikipedia.org/wiki/American_wire_gauge), a standardized system used to describe the diameters of wires. Counterintuitively, increasing AWG numbers denote decreasing wire diameters (and strangely, AWG gauges are always integers but can be less than 1 with '0', '00', or even '000' for a very thick wire).

### Resistance increases with wire length

TODO?

Could have posille's law here?

## Notes
- Should I talk about short vs. open circuit here? I think so
- And then the activity can be with PHET?

## Resources

### Circuit Simulators
We recommend the following basic circuit simulators (these are not intended for advanced analysis):
- [Falstad's CircuitJS](https://www.falstad.com/circuit/circuitjs.html). A completely free, open-source web platform for circuit simulation with circuit animation.
- [EveryCircuit.com](https://everycircuit.com/). Similar to CircuitJS in supporting simulated animations of current but more powerful (and also not free, though there is a free trial). There is no 'wire' component; you need to click one node and then another node to make a connection.
- [Circuitlab.com](https://www.circuitlab.com/). A more traditional circuit simulator that is not as approachable for novices/makers. You can use a trial version but the number of circuits you can create is limited without a paid account.


### Online links
- [Voltage, Current, Resistance, and Ohm's Law](https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law/all), Sparkfun.com
- [Electrical Resistance and Conductance](https://en.wikipedia.org/wiki/Electrical_resistance_and_conductance), Wikipedia

### Video links
- [Voltage, Current, Resistance](https://youtu.be/OGa_b26eK2c), [mathandscience.com](http://mathandscience.com/)
- [What is Ohm's Law?](https://youtu.be/lf0lMDZVwTI), [mathandscience.com](http://mathandscience.com/)
- [Engineering Circuits, Volume 1](https://www.youtube.com/watch?v=OGa_b26eK2c&list=PLnVYEpTNGNtUSjEEYf01D-q4ExTO960sG), [mathandscience.com](http://mathandscience.com/)
- [What is Voltage?](https://youtu.be/OGa_b26eK2c), Sparkfun.com
- [What is Current?](https://youtu.be/kYwNj9uauJ4), Sparkfun.com