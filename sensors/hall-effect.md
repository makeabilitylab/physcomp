---
layout: default
title: Hall Effect Sensor
nav_order: 3
parent: Sensors
has_toc: true # (on by default)
comments: true
usemathjax: true
nav_exclude: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

A key benefit of a Hall Effect sensor is that magnets do not need to be powered and thus can be affixed to objects for position tracking—for example, a bicycle tachometer works by affixing a magnet to the bike wheel (which spins) while a Hall Effect sensor attached to a wheel fork.

Hall Effect sensors are transducers: they convert magnetic energy to electrical energy. 

According to this article by [Landuyt *et al.,* SPLC'14](https://doi.org/10.1145/2648511.2648546), modern automotive vehicles contain 10 or more Hall effect sensors, including to sense windshield wiper position and brake and gas pedals.

https://en.wikipedia.org/wiki/Hall_effect_sensor has a good intro too, some animations, and some application ideas.

## The Hall effect

How do electric fields and magnetic fields interact? You may remember that electric current produces a magnetic field. But does a magnetic field also affect current? Yes!

Electricity and magnetism have long captured human interest but were considered separate phenomena. It wasn't until the late 19th century when James Maxwell published [*A Treatise on Electricity and Magnetism*](https://en.wikipedia.org/wiki/A_Treatise_on_Electricity_and_Magnetism), which united electricity and magnetism into one interrelated force: electromagnetism. 

But key questions remained, including, most relevantly for us: how do magnets interact with electric current? Enter Edwin Hall. As a PhD student at Johns Hopkins, Hall discovered the "Hall effect", which is the production of a voltage difference across an electrical conductor **transverse** to the electric current when a magnetic field is applied. This [animation](https://youtu.be/wpAA3qeOYiI) by "How to Mechatronics" helps demonstrate the effect:

![Animation of Hall Effect](/assets/movies/HallEffectAnimation_HowToMechatronics-Optimized.gif)
 Animation from ["How to Mechatronics"](https://youtu.be/wpAA3qeOYiI)
 {: .fs-1 }

Note that though the animation appears to show the cessation of current through the conductor during the Hall effect, this is not the case. Current continues to flow even in the presence of a magnetic field. The animation also does not show that when the magnet is reversed, the Hall effect is also reversed: negative and positive charges would displace to opposite sides of the conductor.

To better understand the Hall effect, this 5-minute video from Professor Bowley at the University of Nottingham provides a wonderful set of visual experiments and explanations (the best we've seen):

<iframe width="736" height="414" src="https://www.youtube.com/embed/AcRCgyComEw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
In this [wonderful video](https://youtu.be/AcRCgyComEw) from the University of Notthingham, Professor Bowley explains the physics of the Hall Effect.
{: .fs-1 }

## Hall effect sensors

[Hall effect sensors](https://en.wikipedia.org/wiki/Hall_effect_sensor) use the "Hall effect" to measure the magnitude of a proximal magnetic field. More precisely, they measure "magnetic flux" ($$Φ$$), which is the total magnetic field $$\vec{B}$$ passing through a given area $$\vec{A}$$ (where $$\vec{A}$$ is the area of the sensing unit normal to the magnetic field): $$Φ = $$\vec{B}$$ \dot $$\vec{A}$$. While inductive sensors respond to *changing* magnetic fields, one benefit of Hall effect sensors is that they work with static (non-changing) fields. So, a Hall effect sensor can recognize a magnet even if it's not moving.

![Simulated magnetic flux of a NdFeB magnet from the DRV5055 datasheet](assets/images/HallEffectSensor_SimulatedMagneticFlux.png)
Simulated magnetic flux of a NdFeB magnet. Image from the [DRV5055](http://www.ti.com/lit/ds/symlink/drv5055.pdf) Hall effect sensor datasheet.
{: .fs-1 }

<!-- Great explanation of flux and magnetic flux on Khan Academy: https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields/magnetic-flux-faradays-law/v/flux-and-magnetic-flux -->

Because a magnetic field vectors flow from a magnet's north to south poles, magnetic flux will change based on a magnet's orientation to the Hall effect sensor. The amount of magnetic flux is maximized when the poles of the magnet are orthogonal to the sensor. If you want to learn more about magnetic flux, see this [Khan Academy lesson](https://www.khanacademy.org/science/physics/magnetic-forces-and-magnetic-fields/magnetic-flux-faradays-law/v/flux-and-magnetic-flux).

<!-- TODO insert graphic that shows orientation differences? Or at least a graphic of magnetic field around a magnet? -->

### Analog vs. binary output

Unlike resistive sensors, which change their **resistance** based on some external stimulus, an analog Hall effect sensor outputs a varying **voltage**. This voltage is directly proportional to the sensed magnetic flux density. 

Some Hall effect sensors act as switches: either on (in the presence of a sufficiently strong magnetic field) or off (if not). For example, the [US5881LUA](https://www.adafruit.com/product/158) sold by Adafruit is normally `HIGH` but switches to `LOW` in the presence of a **south** magnetic pole. Some Hall effect switches are **latching**, which remain in their activated state even when the magnet is removed. For example, the US1881 latching Hall effect sensor switches to `HIGH` in the presence of a **north** magnetic pole but remains in that state even after the magnet is removed and until a **south** magnetic pole is sensed.

<!-- TODO: talk about strength of magnetic field: size of magnet, proximity? Or maybe magnetic flux density -->

### Reed switches

![Reed switch with contact detail](https://en.wikipedia.org/wiki/Reed_switch#/media/File:Reed_switch_(aka).jpg)

While some Hall effect sensors produce binary output (`HIGH` or `LOW`) and thus, can function as switches, they are not to be confused with [reed switches](https://en.wikipedia.org/wiki/Reed_switch), which are **electromechanical** devices. With a reed switch, two ferromagnetic metal contacts close in the presence of a magnetic field (and are otherwise normally open). Because a reed switch is a mechanical device, the switch contacts can wear over time.

| Reed Switch Animation | Slow Motion Activation Video |
| ---------- | ----------- |
| ![Reed switch slow-mo video](/assets/movies/ReedSwitchAnimation-Optimized.gif) | ![Reed switch animation](/assets/movies/HowAReedSwitchWorks_Wikipedia.gif) | 

### The DRV5055 Hall effect sensor

In our hardware kits, we provide the Texas Instruments (TI) [DRV5055](http://www.ti.com/lit/ds/symlink/drv5055.pdf) ratiometric linear hall effect sensor, which varies its voltage output proportionally to magnetic flux density. Ratiometric means that the sensor's voltage output is proportional to the supply voltage ($$V_{CC}$$). 

The DRV5055 can operate with both 3.3V and 5V power supplies (with +/- 10% tolerance). The sensor can be sampled at 20kHz. To provide a reliable voltage output across a range of deployment conditions, the DRV5055 chip includes temperature compensation circuits, mechanical stress cancellation, signal conditioning, and amplification.

Two packages are available: a surface-mount package SOT-23 (left diagram below) and a through hole package TO-92 (right). We will be using the through-hole package. 

![Two DRV5055 packages are available: a surface-mount package (left diagram) and a through hole package (right)](assets/images/HallEffectSensor_Package_DRV5055.png)
The two DRV5055 packages with pin configurations and Hall element location is labeled in red (at center of the sensor)
{: .fs-1 }

#### Wiring the DRV5055

To use the sensor, hook up Leg 1 to $$V_{CC}$$*, Leg 2 to $$GND$$, and Leg 3 to an analog input pin on your Arduino (say, `A0`). *TI recommends connecting Leg 1 to a ceramic capacitor to ground with a value of at least 0.01 µF. This is called a **decoupling capacitor** (or bypass capacitor) and is a common addition to help smooth the voltage supply as the sensor is operating. See wiring diagram below. While not absolutely necessary—and some of you may not have access to ceramic capacitors—it's recommended (it will improve performance and reliability). To see the effect of adding a decoupling capacitor on a voltage supply to a chip, see this [video](https://youtu.be/UW_XFGGTh0I). Dave Jones at the EEVblog also provides a nice whiteboard lesson ([link](https://youtu.be/BcJ6UdDx1vg)). 

![Wiring diagram for DRV5055 with ceramic capacitor](assets/images/HallEffectSensor_RecommendedWiringWithSchematic_DRV5055.png)
We've included two equivalent Arduino wirings. The left diagram includes a breadboard, which we felt may be a bit confusing to those still becoming familiar with breadboards. The middle diagram is the same wiring but without a breadboard. The schematic on the right is copy/pasted directly from the [DRV5055](http://www.ti.com/lit/ds/symlink/drv5055.pdf) datasheet.
{: .fs-1 }

#### Sensor response to magnetic field

So, how does the DRV5055 output pin (Leg 3) respond to a magnetic field?

When no magnetic field is present, the analog output drives **half** of $$V_{cc}$$. So, on an Arduino Uno, `analogRead(A0)` would return 512 (1023/2) in the default state (with no magnet present). The sensor's output will then change linearly with the applied magnetic flux density. If the south pole of the magnet is facing the sensor, the analog output will increase between $$V_{cc}/2$$ - $$V_{cc}$$. If the north pole faces the sensor, the output will decrease from $$V_{cc}/2$$) to 0V. See the magnetic response graph below and Section 7.3.2 of the [DRV5055](http://www.ti.com/lit/ds/symlink/drv5055.pdf) datasheet.

![Magnetic response graph](assets/images/HallEffectSensor_MagneticResponse_DRV5055.png)
The magnetic response graph for the [DRV5055](http://www.ti.com/lit/ds/symlink/drv5055.pdf) Hall effect sensor. The diagram on the right shows a magnet's south pole orthogonal to the sensing surface, which would result in a positive $$\vec{B}$$ and an analog output voltage > $$V_{cc}/2$$. If the magnet's orientation is flipped such that the north pole is facing the sensor, then the $$\vec{B}$$ will be negative and the analog output voltage will range between 0 and $$V_{cc}/2$$.
{: .fs-1 }

## Let's make stuff!


<!-- ## Reed switches
My lecture CMSC838f_Lecture05_AllThingsResistance_v2 has a great reed switch video that we might be able to convert part of to animation: http://youtu.be/qje8LhZXwO0. Update: OK, I've m

- https://www.magnelinkinc.com/blog/reed-vs-hall-effect-switch/
From: "https://www.kjmagnetics.com/blog.asp?p=reed-switches-and-hall-effect-sensors":

The reed switch is an electrical switch operated by an applied magnetic field.  It consists of a pair of contacts on ferrous metal reeds in an airtight glass envelope.  The contacts are normally open, making no electrical contact.  The switch is actuated (closed) by bringing a magnet near the switch.  Once the magnet is pulled away, the reed switch will go back to its original position.

What is a Hall Effect Sensor?
A Hall effect sensor is a transducer that varies its output voltage in response to changes in magnetic field.  In some ways, Hall effect sensors can ultimately perform a similar function as a reed switch, but with no moving parts.  Think of it as a solid-state component, good for digital applications.

Which of these two sensors is right for your application depends on a number of things.  Factors include cost, magnet orientation, frequency range (reed switches typically aren't usable over 10 kHz), signal bounce and the design of the associated logic circuitry. -->

## References
- [TI DRV5055 datasheet](http://www.ti.com/lit/ds/symlink/drv5055.pdf), Texas Instruments
- [Hall Effect Sensing and Applications](https://sensing.honeywell.com/hallbook.pdf), Honeywell

## Videos
- [What is the Hall Effect and How do Hall Effect Sensors Work](https://youtu.be/wpAA3qeOYiI), How to Mechatronics
- [Hall Effect Sensors](https://youtu.be/jdgU49ne4gA), Ludic Science
- [Arduino Tutorial: Tachometer (RPM Counter)](https://youtu.be/u2uJMJWsfsg), InterlinkKnight
- [Bypass Capacitor Tutorial](https://youtu.be/BcJ6UdDx1vg), EEVblog

## Citations
Dimitri Van Landuyt, Steven Op de beeck, Aram Hovsepyan, Sam Michiels, Wouter Joosen, Sven Meynckens, Gjalt de Jong, Olivier Barais, and Mathieu Acher. 2014. Towards managing variability in the safety design of an automotive hall effect sensor. In Proceedings of the 18th International Software Product Line Conference - Volume 1 (SPLC ’14). Association for Computing Machinery, New York, NY, USA, 304–309. DOI:https://doi.org/10.1145/2648511.2648546