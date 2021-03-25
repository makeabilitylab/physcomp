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

In this lesson, we are going to learn about three key electricity concepts, *current*, *voltage*, and *resistance*, which form the foundation of electronics and circuits. We will also use an online circuit simulator to play with basic components and advanced understanding.

---
**NOTE**

This material is important. Depending on your previous background in physics or engineering, some of these concepts may be brand new and confusing. Take your time to understand (and re-read) sections—this material will help you understand *how* circuits work and *how* and *why* we hook up and use electronic components the way we do. But this is also *not* a circuits course, so I will largely focus on what I *think* is most critical to physical computing.

---

## A brief overview
So, what is voltage, current, and resistance?

In short, **voltage** "pushes" **electrons** through a conductive material (*e.g.,* a wire) and the amount of *electron flow* is called **current** (measured in amps). Resistors are specially formulated materials that can be placed in a circuit to *resist* the flow of electrons (the **resistance** is measured in ohms). See image.

![A humorous depiction of the relationship between voltage, current, and resistance. Three cartoon characters are shown: the "volt" character is trying to push the "amp" character through a wire but the "ohm" character is resisting the "amp" character by restricting the girth of the wire with a tightening rope.](assets/images/OhmsLawCartoon_ShowingRelationshipBetweenVoltsAmpsAndResistance.png)
{: .mx-auto .align-center }

**Figure.** A humorous but helpful depiction of the relationship between voltage (measured in volts), current (measured in amps), and resistance (measured in ohms). The yellow "volt" character is trying to push the green "amp" character through a tube (*i.e.,* a wire) but the red "ohm" character is impeding this by restricting the size of the tube (by tightening a rope, reducing its girth). The image source is unknown but there are many examples and alternatives [online](https://www.google.com/search?q=ohm%27s+law+cartoon&tbm=isch&sxsrf=ALeKk01Bq3GWclp6ij6yQ6Kn3yWKh1GXxA%3A1616617564907&source=hp&biw=1280&bih=1248&ei=XKBbYMb0NLXV9APPhL3ABA&oq=ohm%27s+law+cartoon&gs_lcp=CgNpbWcQAzICCAAyAggAOgQIIxAnOgUIABCxAzoGCAAQCBAeUMMBWPoVYNkXaABwAHgAgAHAA4gBrBKSAQk3LjguMC4xLjGYAQCgAQGqAQtnd3Mtd2l6LWltZw&sclient=img&ved=0ahUKEwjGksTd4cnvAhW1Kn0KHU9CD0gQ4dUDCAc&uact=5).
{: .fs-1 }

In circuits, we often use hydraulic (and other) analogies to aid understanding. For example, think of *voltage* as analogous to *water pressure* in a water plumbing system. An increase in water pressure provides more force to propel water molecules through the pipes (from high pressure to low pressure). Similarly, an increase in voltage provides more force to "push" electrons (from high electric potential to low electric potential) through a circuit. And, just as a wider water pipe can carry more water, so too can a thicker conductive wire carry more current. Obstructions in the pipe—such as sand or, worse, clay—can slow the flow of water. Similarly, in circuits, we can insert resistors to impede the flow of current.

|            | Electric                       | Hydraulic                                |
|------------|--------------------------------|------------------------------------------|
| Flow rate  | Current, *amps (coloumbs/sec)* | Flow rate, *GPM (gallons/minute)*        |
| Potential  | Voltage, *volts*               | Pressure, *psi (pound per square inch)*  |
| Resistance | Resistance, *ohm (volts/amp)*  | Resistance, *psi/gpm*                    |

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/WaterCircuitAnalogy_Trimmed_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Figure.** Here's a slightly different hydraulic analogy than the water plumbing system one described above. Here, we have a water tank filled with water with a hole at the bottom: as the water level increases, the pressure (voltage) on the water at the bottom of the tank also increases, which commensurately increases the amount of water flowing out of the hole. If we increase the hole size (decreasing resistance), more water (current) will flow. The water diagram based on an illustration in [Platt's *Make: Electronics* book](https://learning.oreilly.com/library/view/make-electronics-2nd/9781680450255/).
{: .fs-1 }

## What is current?

![An animated gif showing current flowing in a simple circuit out of the positive terminal of a 9V battery through an LED and resistor and then back to the negative terminal of the 9V battery](assets/gifs/CurrentFlow_EngineeringMindset.gif)
**Figure.** *Current* is the flow of charged particles—in this case, electrons—through a conductor. In the animation above, we are illustrating "electron flow" as a dotted green line, which flows from the negative terminal of the 9V battery, through an LED and resistor, and then back to the 9V battery to its positive terminal. Note that this is actually opposite from *conventional current* flow, but we'll get to that below. Animation from [The Engineering Mindset](https://youtu.be/kcL2_D33k3o).
{: .fs-1 }

*Current* is the flow of charged particles through a conductor. In digital circuits, these charged particles are *electrons* (negatively charged particles) propelled by an electromotive force (voltage) to move from "high pressure" to "low pressure" in a circuit.

Electric current is similar to water current moving through a pipe. To measure the flow of water, we could count the number of water molecules flowing past a given cross-section of pipe in time $$t$$. Similarly, we can measure electric current by "counting" the number of charges flowing through a wire. Indeed, electric current $$I$$ is defined as the amount of charge $$Q$$ moving through a point in time $$t$$:

$$I = \frac{\Delta{Q}}{\Delta{t}}$$

A [couloumb (C)](https://en.wikipedia.org/wiki/Coulomb) is the SI unit for *electric charge* and is approximately $$6.24 × 10^{18}$$ electrons. Rather than constantly describe current as the number of coloumbs/second (or electrons/second) flowing through a wire—*i.e.,* "hey there, that wire is carrying $$1.872 × 10^{19}$$ electrons per second"—we, instead, use the SI unit of electric current called *amperes* or *amps* (A), which is the flow of electric charge in coloumbs per second $$C/s$$.

$$1 A = 1 C / s$$

You can use these formulations to calculate the number of electrons passing through a cross-section of wire over time $$t$$. For example, in the image below, we calculate how many electrons pass a given point in 3s if a conductor is carrying 2A of current.

![An illustrative diagram showing how electrons flow through a conductor and how to calculate how many electrons pass through a point using I = change in Q divided by change in t](assets/images/ElectricCurrentDefinitionAndDiagram_ScherzAndMonk4thEditionpng.png)
Using the formulas above, we can calculate the amount of electrons that pass through a cross-section of wire in three seconds if the wire is carrying 2A of current. Image from [Chapter 2](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml) of Scherz and Monk's *Practical Electronics for Inventors* .
{: .fs-1 }

With digital circuits, we work with low amperages. For example, an LED may require 2V and ~20 milliamperes (milliamps or simply, mA) to light up—that's $$(6.24 × 10^{18}) * 0.02 = 1.3 × 10^{17}$$ electrons/second. Similarly, an individual pin on the Arduino might be able to supply up to 40mA or $$(6.24 × 10^{18}) * 0.04 = 2.5 × 10^{17}$$ electrons/second.

### Building intuition for current

Importantly, just like your home plumbing system, where water flows instantly out of your tap when you open the valve (propelled by water pressure from a water tower, for example), so too does current flow instantly when a voltage is applied (propelled, for example, by a battery). And, critically, the water molecules that touch your hand did not flow all the way through your plumbing system in an instant. Instead, your pipes are completely filled with pressurized water—just as a conductive wire is filled with atoms. When you open the tap, the water molecules that touch your hands were the molecules pushing against that tap's valve (sort of like a first-in, first-out queue). This is similar to current in a circuit—atoms are tightly packed in a material with orbiting electrons. When a voltage is applied, these electrons start to "hop" from one atom to another through a conductor but do not instantly travel from A to B.

![An image showing a tightly packed tube of single-file marbles. When a marble is inserted into the left side of the tube, a marble on the right side instantly exits.](assets/images/ElectronFlowMarbleTube_FromAllAboutCircuits.png)
{: .mx-auto .align-center }

**Figure.** You can think of electrons flowing through a circuit like marbles tightly packed in a tube. A marble does not need to traverse the entire tube to create motion. Instead, when a marble is inserted into the left side of the tube, a marble on the right side instantly exits. Image from [All About Circuits](https://www.allaboutcircuits.com/textbook/direct-current/chpt-1/conductors-insulators-electron-flow/). See also, [this video](https://youtu.be/8gvJzrjwjds?t=74) by Afrotechmods.
{: .fs-1 }

Another way to think about current flow is like that of a tube filled end-to-end with marbles. If a marble is inserted on the left, another marble will immediately exit the tube on the right. Even though each marble travels only a short distance, the transfer of motion is nearly instantaneous. With electricity, the overall effect from one end of a conductor to the other is at the speed of light; however, each individual electron travels through the conductor at a much slower pace. Indeed, the average speed at which electrons move through a wire due to an applied electric field (such as from a battery) is on the order of centimeters per hour (called the [drift velocity](https://en.wikipedia.org/wiki/Speed_of_electricity#Electric_drift))!

<!-- Another nice description of this marble analogy is from https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/ch01.html -->

### What's conventional current vs. electron flow?

<!-- ![An animated gif showing the true direction of negative charges (electrons) in a circuit from the negative terminal of a battery to the positive vs. the conventional current direction which is just the opposite. Here, charge flow is modeled as going from positive to negative.](assets/gifs/ConventionalCurrentVsElectronFlow_EngineeringMindset-Optimized.gif)
**Figure.** In electric circuits, we model the flow of charges (electrons) as if they move from positive to negative terminals in a battery (or voltage source)—this is called "*conventional current*"—see right side of image. However, it is a historic artifact (blame Benjamin Franklin). Instead, because electrons are negatively charged, they actually flow from negative to positive (called "*electron flow*")—see left side of figure. Animation from [The Engineering Mindset](https://youtu.be/kcL2_D33k3o).
{: .fs-1 } -->

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/ElectronFlowVsConventionalCurrent_PhetSimulation_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Figure.** In electric circuits, negatively charged particles (electrons) move from the negative terminals of a battery (or voltage source) to the positive—this is called *electron flow*; however, when we model circuits (and use circuit formulas), we use *conventional current*, which moves in the opposite direction.
{: .fs-1 }

In circuits, we use *conventional current* to model the flow of electrons from the positive terminal of the voltage source to the negative; however, electrons actually move in the *opposite* direction (called *electron flow*). This causes great confusion!

Why? Blame [Benjamin Franklin](https://hackaday.com/2017/07/17/conventional-current-vs-electron-current/). In early experiments (mid 1740s), Franklin determined that electricity appears to "flow" as if a liquid in solid material. He assumed that the flowing charges had positive signs and moved from positive to negative. It was not until 1897, however, that Sir Joseph Thomson determined that the real charge carrier in a wire was the electron and that electrons move from cathode (negative) to anode (positive).

![An image of Thomson and Franklin thinking about how charge move in a conductor with Thomson actually getting it right: electrons are negatively charged and move from the negative source to the positive source.](assets/images/ConventionalCurrentVsElectronFlow_SherzAndMonk4thEdition.png)

**Figure.** Franklin thought that positive charge carriers moved in a conductor from positive to negative. This is called the *conventional current* direction, which is still used today. Instead, as Thomson discovered, it's electrons that move in a conductor (which are negatively charged) and they move from negative to positive. This is called *electron flow*. Image from [Chapter 2](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml) of Scherz and Monk's *Practical Electronics for Inventors* .
{: .fs-1 }

Despite this confusion, it turns out that as long as you're consistent, it does not matter: negative electrons flowing one way is equivalent to modeling positive charges going the other direction. So, we tend to use *conventional current* (modeling flow of charge from positive to negative) in electronics (*e.g.,* in diagrams, formulas, *etc.*). The math will still work out and even mnemonics like the [right-hand rule](https://en.wikipedia.org/wiki/Right-hand_rule) are based on conventional current (point thumb in direction of current $$I$$, see direction of electric field $$B$$).

For more, see [Chapter 2](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml) of Scherz and Monk's *Practical Electronics for Inventors* and this lovely [video](https://youtu.be/kcL2_D33k3o?t=224) by The Engineering Mindset.

## What is voltage?
<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/VoltageElectromotiveForce_EngineeringMindset.mp4" type="video/mp4" />
</video>
**Figure.** *Voltage* is what "pushes" electrons around a circuit. Animation from the [Voltage Explained](https://youtu.be/w82aSjLuD_8) video by The Engineering Mindset.
{: .fs-1 }

**TODO: UPDATE THIS DESCRIPTION**
Some potential references:
- https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/ch01.html
- https://learning.oreilly.com/library/view/learn-electronics-with/9781680454420/#toc
- https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/12_Chapter_01.xhtml#ch01

**[Voltage](https://en.wikipedia.org/wiki/Voltage)** is the "electric pressure" or "electric tension" that moves charge (electrons) in a circuit. Voltage is like pressure in a water pipe: the more pressure, the more water is being forced through a pipe. Similarly, by increasing voltage, we can "push" more electrons through a wire.

Voltage is the electric potential difference between two points caused by an electric charge build-up or imbalance (*e.g.,* induced by a battery). We measure voltage with the SI unit *volt* (V), which is expressed as:

$$1\ V = 1\ joule\ (of\ work) / 1\ coulomb\ (of\ charge)$$

That is, two points with a voltage of $$1\ V$$ between them will have enough "pressure" to perform $$1\ J$$ of work while moving $$1 C$$ worth of charge (or $$6.24 × 10^{18}$$ electrons) between the two points.

In a battery-powered circuit, electrons are repelled by the negative battery terminal (which has an imbalance of negative charges) and attracted to the positive battery terminal (which has an imbalance of positive charges)—thereby creating this electromotive force that moves charge through the circuit. We call this movement *current*. This is similar to water flow in a pipe (hydraulics) or air flow in a tube (pneumatics)—all which flow from "high pressure" to "low pressure."

<!-- Another nice analogy is a tube with water and angling the tube upright, which increases pressure and then increases flow -->

And just like we can use "energy" of flowing water to do work—*e.g.,* to spin a turbine—so too can we use flowing current to do work. And as work is performed, the pressure drops.

In digital circuits, common operating voltages are relatively small—like 3.3V or 5V—compared to the voltage supplied by your wall outlet (which, in the US, is 120V!). The popular [ESP32](https://www.espressif.com/en/products/socs/esp32) microcontroller operates at 3.3V while the [Arduino Uno](https://store.arduino.cc/usa/arduino-uno-rev3) and [Arduino Leonardo](https://www.arduino.cc/en/Main/Arduino_BoardLeonardo) boards operate on 5V. My Apple iPhone charger outputs 5V and can supply up to 2A. Importantly, you do not want so supply a voltage beyond an electric component's specified input voltage or you risk damaging things. So, it's essential that you read a component's data sheet before using it (which we will learn how to do in a future lesson).

### Relative voltages and ground

By definition, voltage is the difference in electric potential between **two points**. When we actually start measuring voltages in a circuit (using the voltmeter on a multimeter), you'll observe that we can't just place a single probe on the circuit. Instead, we have to place two probes on the circuit in different places to measure the voltage difference between them (also called the **voltage drop**).

To simplify calculations, we select some point on the circuit—typically the point with the least electric potential (*e.g.,* wires connected to the negative terminal of a battery)—as 0 volts. As [Bartlett](https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/) notes (Chapter 4.3), "This 'zero point' goes by several names, the most popular of which is **ground** (often abbreviated as **GND**). It is called the ground because, historically, the physical ground has often been used as a reference voltage for circuits."

Returning to the [water tank analogy](assets/videos/WaterCircuitAnalogy_Trimmed_ByJonFroehlich.mp4) from the Introduction, how much potential to do work does water have once it's flowed out of the hole and onto the ground? None! It's lost all of its energy. Likewise, when an electric charge reaches ground, it no longer has electric potential for work.

### What provides the pressure?


### How can we increase pressure?

As [Scherz and Monk](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml) state, "a voltage placed across a conductor gives rise to an *electromotive force (EMF)* that is responsible for giving all free electrons within the conductor a push." <--- Really need to improve this description of voltage.

As electrons move through as a circuit, they begin to lose their "electric potential"

A battery has an imbalanced electric charge built up between its positive and negative leads. When a circuit is connected, electric charges (electrons) flow to "correct" this imbalance. The larger the imbalance (*i.e.,* the higher voltage), the greater the "push" and the more electrons that flow (higher current).

If you connect two batteries in series (i.e., stack them), you increase their ability to "push" electrons—indeed, you sum the battery voltages together. So, two standard alkaline 1.5V AA batteries in series will have a 3V potential difference, which can "push" more electrons around a circuit—see the animation below. 

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/VoltageBatteriesInSeries_CroppedAndTrimmed2_EngineeringMindset.mp4" type="video/mp4" />
</video>
**Figure.** When you connect batteries in series, you increase the "pushing" force—indeed, you sum the battery voltages together (so, 1.5V + 1.5V = 3V in total). More voltage, more pressure. More pressure, more electrons are "pushed" through the circuit. Animation from the [Voltage Explained](https://youtu.be/w82aSjLuD_8?t=183) video by The Engineering Mindset.
{: .fs-1 }

<!-- See https://www.physicsclassroom.com/class/circuits/Lesson-1/Electric-Potential-Difference -->

See also: http://andnowforelectronics.com/notes/voltage-and-current/

---

**NOTE: BASE UNITS**

As you learn and begin analyzing electrical circuits, it's important to pay attention to *units*. The base unit of voltage is volts (V), the base unit of current is amperes or amps (A), and the base unit of resistance is ohms (Ω). As noted, with digital circuits, we often work with voltages between 0-5V (and sometimes 9V or 12V) but amperages are often in the milliamp range—like 0.02A or 0.1A—and common resistances include 220Ω, 1,000Ω, 2,200Ω, and even 10,000Ω. Typically, however, you'll see these written as 20mA and 100mA and 1kΩ, 2.2kΩ, and 10kΩ respectively. Thus, it's important to carefully track units and convert values to base units for analysis.

---

## What is electrical resistance?

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/CopperVsIronWireResistanceElectronFlow_EngineeringMindset.mp4" type="video/mp4" />
</video>
**Figure.** As electrons move through a material, they may collide with some atoms or other electrons. These collisions create a resistance. In the animation above, notice how the iron wire has more collisions than the copper wire. Iron is ~17% as conductive as copper. At 20° C, Iron has an electrical resistivity of 96.1 nanoohm-meters while Copper has a resitivity of 16.8 nanoohm-meters. Notice the halo around the Iron wire: this is to illustrate how some of the "kinetic"  or movement energy of electrons gets converted into heat or light through those collisions. Indeed, this is how incandescent lightbulbs, toaster ovens, and electric spaceheaters work! Animation from the [How Electricity Works](https://youtu.be/mc979OhitAg?t=322) video by The Engineering Mindset.
{: .fs-1 }

As electrons move through a material, they may collide with some atoms or other electrons. These collisions create a *resistance* to the electrical current. Depending on their atomic composition, some materials have lower resistance than others. Metals like silver, copper, and gold are *good* conductors—they offer *low* resistance—because they have loosely bound electrons in the outer shells of their atoms. These electrons are easily displaceable and, with an externally applied force (voltage), can be pushed from atom-to-atom within the material to form a current.

The SI unit of electrical resistance is the ohm (Ω). The direct inverse of resistance is *conductance*. Materials with low resistance are called *conductors*. In contrast, materials such as glass, rubber, and air have high resistance and poor conductivity ("low electron mobility")—these materials are called *insulators*.

![This image shows PVC insulated wire with two annotations: the annotation on the left points to the internal part of the wire, which is highly conductive and made of copper. The annotation on the right points to the insulation around the wire, which has low conductivity and is made of PVC](assets/images/PVCWrappedWire-ConductorVsInsulator.png)
**Figure.** The image shows PVC-insulated copper wire.
{: .fs-1 }

The resistance $$R$$ of an object is defined as the ratio of voltage $$V$$ across it to current $$I$$ through it while conductance $$G$$ is the reciprocal:

$$R = \frac{V}{I}$$, $$G = \frac{1}{R}$$

With enough voltage (pressure), almost any material can conduct electrical current (even air, as evident by lightning). The resistance (or conductance) of a wire is not just a function of material type but also its temperature and its size (both length and thickness). In short, for metal wires, resistance drops with increases to wire diameter or temperature. And resistance increases as wire length increases.

[Wikipedia](https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity) provides a nice water-based analogy: 

> "passing current through a highly resistive material is like pushing water through a pipe full of sand. In contrast, passing current through a low-resistivity material is like pushing water through an empty pipe. If the pipes are the same size and shape, the pipe full of sand has higher resistance to flow. Resistance, however, is not solely determined by the presence or absence of sand. It also depends on the length and width of the pipe: short or wide pipes have lower resistance than narrow or long pipes."
{: .fs-4 }

To help illustrate this idea visually, [Professor Squier](http://people.cs.georgetown.edu/~squier/Teaching/ComputerSystemsArchitecture/520-2013-CourseDocuments/Lec-1-electricityPrimer.pdf) created some helpful sketches—see the caption for more details:

![Image shows a water analogy for electricity. There are two pipes visible: one filled with gravel (less resistance) and one filled with clay (more resistance). There is an equal amount of water pressure (voltage) "pushing" water through both pipes. The pipe with less resistance (gravel) will have more water flow (current).](assets/images/ElectricityPrimer_WaterAnalogy_SquierGeorgetown.png)
**Figure.** Continuing our water analogies: imagine two pipes filled with resistive materials, one with gravel (less resistance) and one filled with clay (more resistance). Both pipes have an equal amount of water pressure (voltage) "pushing" water through them. The pipe with less resistance (gravel) will have more water flow (current). Image from Professor Richard Squier's [Electricity Primer](http://people.cs.georgetown.edu/~squier/Teaching/ComputerSystemsArchitecture/520-2013-CourseDocuments/Lec-1-electricityPrimer.pdf).
{: .fs-1 }

### Electrical resitivity

Because resistance is not just an intrinsic property of a material (*e.g.,* based on its atomic makeup) but also because of its shape and size, we use [*electrical resistivity*](https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity) $$\rho$$, which is independent of the dimensions of a material (assuming temperature is constant).

More specifically, at a constant temperature, the electrical resistivity $$\rho$$ of a wire can be calculated by:

$$\rho =R{\frac {A}{\ell }}$$,

where $$R$$ is the electrical resistance of a uniform specimen of the material, $$ℓ$$ is the length of the specimen, and $$A$$ is the cross-sectional area of the specimen. The SI unit for resistivity are ohm-meters (Ωm).

Some prefer to describe materials not in terms of their *resistivity* but, instead, in terms of their *conductivity* $$\sigma$$ (which is the direct inverse): 

$$\sigma = \frac {1}{\rho }$$

The SI units of conductivity are in siemens per meter (S/m).

[Scherz and Monk](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml) report some common resitivities (and conductivities) of materials, which is drawn from the *Handbook of Chemistry and Physics*.

| Material | Classification | Resitivity $$\rho$$ (Ωm) | Conductivity $$\sigma$$ (S/m) |
|----------|----------------|--------------------------|-------------------------------|
|Aluminunum| Conductor      | $$2.82 × 10^{-8}$$       | 3.55 × 10^7                   |
|Gold      | Conductor      | $$2.44 × 10^{-8}$$       | 4.10 × 10^7                   |
|Silver    | Conductor      | $$1.59 × 10^{-8}$$       | 6.29 × 10^7                   |
|Copper    | Conductor      | $$1.72 × 10^{-8}$$       | 5.81 × 10^7                   |
|Brass     | Conductor      | $$7 × 10^{-8}$$          | 1.4 × 10^7                   |
|Carbon    | Semi-Conductor | $$3.5 × 10^{-5}$$        | 2.9 × 10^4                   |
|Silicon   | Semi-Conductor | $$640$$                  | 3.5 × 10^{-3}                   |
|Glass     | Insulator      | $$~10^{10}$$             | 10^{-10}                      |
|Rubber    | Insulator      | $$10^{9}$$               | 10^{-9}                   |
|Teflon    | Insulator      | $$10^{14}$$              | 10^{-14}                   |

<!-- See also http://spiff.rit.edu/classes/phys213/lectures/resist/resist_long.html -->

### Increasing conductance by increasing wire girth

As noted above, we can *increase* the conductance of a wire by *increasing* its diameter (a "bigger pipe" for current to flow). Drawing again on our water analogy: just as a larger diameter pipe can support larger quantities of water flow so too can a thicker wire support more current flow.

<!-- TODO: possibly insert figure (maybe from that PDF?) -->

Because wire diameter is so important to current capacity, there is a standardized system for measurement. In the US, we use the [American Wire Gauge](https://en.wikipedia.org/wiki/American_wire_gauge) or AWG system. A wire with a diameter of 5.2mm (AWG 4) has a current capacity of 59.6A. In comparison, a standard circuit prototyping wire (0.64mm or AWG 22)—see Figure below—has a current capacity of 0.9A. 

![A picture of a box of AWG circuit prototyping wire and a complementary image showing that wire being used in a breadboard](assets/images/StandardSolidCorePrototypingWireOf22AWG.png)
**Figure.** Example AWG solid-core wire commonly used in circuit prototyping. The box of wire on the left is $29.95 for ten 25ft spools from [Adafruit](https://www.adafruit.com/product/3174). 
{: .fs-1 }

Counterintuitively, *increasing* AWG numbers denote *decreasing* wire diameters (and strangely, AWG gauges are always integers but can be less than 1 with '0', '00', or even '000' for a very thick wire).

If we pass more current through a wire than its capacity, it will start to heat up and eventually burn. Indeed, this is how fuses are *designed* to work! Fuses contain thin wires that protect your circuit from damagingly high current and "burn up" to instantly disconnect your circuit (creating an "open circuit") if a high current is applied. You can then replace the fuse, which is far cheaper and easier than replacing your electrical device or appliance. There are lots of great videos of this online, including [here](https://youtu.be/V-lhVTDWjwY?t=120) and [here](https://youtu.be/qgz1lskyYDU?t=70).

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/BlowingFuses_RobinsonsAuto.mp4" type="video/mp4" />
</video>
**Figure.** If we attempt to push large amounts of current through a wire and exceed its carrying capacity (by hooking up a large voltage supply, for example), then the wire will heat up and could start a fire. This can happen almost instantly, which is the operating principle behind a fuse (shown above). A fuse is *designed* to burn up thereby disconnecting your circuit when a damagingly large current is supplied. Animation from the [How Electricity Works](https://youtu.be/mc979OhitAg?t=322) video by The Engineering Mindset.
{: .fs-1 }

### Resistance increases with wire length

TODO?

Could have posille's law here?

### What are resistors?
<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/ResistorAndCurrentFlow_WaterHoseAnalogy_TrimmedAndCropped_EngineeringMindset.mp4" type="video/mp4" />
</video>
**Figure.** Resistors are specially electronic components to reduce current flow. Just as a kink in a water hose will provide increased resistance and reduce water flow, so too will a resistor placed between two wires in a circuit. Animation from the [What is Current?](https://youtu.be/8Posj4WMo0o?t=521) video by The Engineering Mindset.
{: .fs-1 }

![An animated gif showing how resistors can be placed in a circuit to resist current flow.](assets/gifs/ResistorCurrentFlow_EngineeringMindset-Optimized.gif)
**Figure.** This animation shows how a resistor can be placed between two wires to reduce current flow. Notice how electrons flow freely through the copper wire. With the resistor, these electrons "collide" with other atoms and themselves, which restricts electron flow (and also transforms some energy as heat). Animation from [The Engineering Mindset](https://youtu.be/kcL2_D33k3o?t=891).
{: .fs-1 }

Resistors are specially formulated electrical components that restrict current at a certain rate based on their material composition and construction. In circuits, we place resistors between components to lower current. Why would we want to restrict current? In short, to protect components in our circuit that require lower current.

When current flows through a resistor, some of the electrical pressure (voltage) is converted to heat, which results in a *voltage drop*. 

**TODO: We'll talk more about this in Lesson X.**

## Misc section

### What's the difference between AC and DC?

Digital circuits use *direct current* (DC), which is supplied by batteries or by AC adapters that convert the *alternating current* from your wall socket into DC current used by your phone or laptop chargers.

### What is an open circuit?

TODO: add in how water plumbing analogy breaks down with pipe breakage (Water would spill out of hole); with circuits, an open circuit, no current flow.

### What is an open circuit?

TODO: add in how water plumbing analogy breaks down with pipe breakage (Water would spill out of hole); with circuits, an open circuit, no current flow.

## Notes
- Should I talk about short vs. open circuit here? I think so
- And then the activity can be with PHET?

- https://firstyearengineer.com/circuits/basic-electricity/current/
- https://www.allaboutcircuits.com/textbook/direct-current/chpt-1/conductors-insulators-electron-flow/
- http://people.cs.georgetown.edu/~squier/Teaching/ComputerSystemsArchitecture/520-2013-CourseDocuments

## ACTIVITY Idea:
- Have them work with an online circuit simulator like Tinkercad or [Falstad](https://www.falstad.com/circuit/circuitjs.html)

- Introduce the multimeter and how to measure voltage, current, and resistance
  - Engineering Mindset has a good animation of [ammeter here](https://youtu.be/kcL2_D33k3o?t=718) 

## Lesson plan
- L1: What is electricity: current, voltage, and resistance + online simulation activities
- Circuit schematics?
- LX: Common electronic components: resistors and LEDs
- L2: Ohm's Law + example circuit equations/solving + online simulation activities
- L3: Measuring current, voltage, and resistance using multimeters
- L4: Series vs. parallel resistance

- L4: How to use a breadboard + moving your prev circuit to breadboards
- L5: Series vs. Parallel Resistance, Voltage Dividers, and Ohm's Law
- LX: Building your first circuit: lighting up an LED, swapping out different resistances (maybe paper-based version)

Should I have a small lesson on what is a resistor and what is an LED (or perhaps I fold that into Lesson 2).

See also notes on phone.

## Notes:
Things to consider adding:
- What is an open vs. a closed circuit? (Perhaps add to Ohm's Law or maybe third lesson?)
- What is a short circuit?

## Resources

### Circuit Simulators
We recommend the following basic circuit simulators (these are not intended for advanced analysis):
- [Falstad's CircuitJS](https://www.falstad.com/circuit/circuitjs.html). A completely free, open-source web platform for circuit simulation with circuit animation.
- [EveryCircuit.com](https://everycircuit.com/). Similar to CircuitJS in supporting simulated animations of current but more powerful (and also not free, though there is a free trial). There is no 'wire' component; you need to click one node and then another node to make a connection.
- [Circuitlab.com](https://www.circuitlab.com/). A more traditional circuit simulator that is not as approachable for novices/makers. You can use a trial version but the number of circuits you can create is limited without a paid account.


### Online links
- [Chapter 2: Circuit Thoery](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/13_Chapter_02.xhtml), Scherz & Monk, Practical Electronics for Inventors, 4th Edition
- [Voltage, Current, Resistance, and Ohm's Law](https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law/all), Sparkfun.com
- [Electrical Resistance and Conductance](https://en.wikipedia.org/wiki/Electrical_resistance_and_conductance), Wikipedia

<!-- https://www.physicsclassroom.com/class/circuits/Lesson-1/Electric-Potential -->
<!-- https://www.physicsclassroom.com/class/circuits/Lesson-1/Electric-Potential-Difference -->

### Video links
- [Electronics for Beginners](https://www.youtube.com/watch?v=8gvJzrjwjds&list=PLzqS33DOPhJkRn6e9_OTdQwRojO8qlusI), [afrotechmods.com](http://afrotechmods.com/tutorials/)
- [Voltage, Current, Resistance](https://youtu.be/OGa_b26eK2c), [mathandscience.com](http://mathandscience.com/)
- [What is Ohm's Law?](https://youtu.be/lf0lMDZVwTI), [mathandscience.com](http://mathandscience.com/)
- [Engineering Circuits, Volume 1](https://www.youtube.com/watch?v=OGa_b26eK2c&list=PLnVYEpTNGNtUSjEEYf01D-q4ExTO960sG), [mathandscience.com](http://mathandscience.com/)
- [What is Voltage?](https://youtu.be/OGa_b26eK2c), Sparkfun.com
- [What is Current?](https://youtu.be/kYwNj9uauJ4), Sparkfun.com