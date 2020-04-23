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

Wikipedia has an interesting, lengthy article on the history of electromagnetic theory. Electricity and magnetism have long captured human interest but were considered separate forces. It wasn't until the late 19th century when James Maxwell published [*A Treatise on Electricity and Magnetism*](https://en.wikipedia.org/wiki/A_Treatise_on_Electricity_and_Magnetism), which theorized united electricity and magnetism into one interrelated force: electromagnetism. 

But key questions remained, including, most relevantly for us: how do magnets interact with electric current? Enter Edwin Hall. As a PhD student at Johns Hopkins, Hall discovered the "Hall effect", which is the production of a voltage difference across an electrical conductor **transverse** to the electric current when a magnetic field is applied. This [animation](https://youtu.be/wpAA3qeOYiI) by "How to Mechatronics" helps demonstrate the effect:

![Animation of Hall Effect](/assets/movies/HallEffectAnimation_HowToMechatronics-Optimized.gif)

Note that though the animation appears to show the cessation of current through the conductor during the Hall effect, this is not the case. Current continues to flow through the conductor even in the presence of a magnetic field. The animation also does not show that when the magnet is reversed, the Hall effect is also reversed: negative and positive charges are displaced to opposite sides of the conductor.

To better understand the Hall effect, this 5-minute video from Professor Bowley at the University of Nottingham provides a wonderful set of visual experiments and explanations (the best we've seen):

<iframe width="736" height="414" src="https://www.youtube.com/embed/AcRCgyComEw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
In this [wonderful video](https://youtu.be/AcRCgyComEw) from the University of Notthingham, Professor Bowley explains the physics of the Hall Effect.
{: .fs-1 }

## Hall effect sensors

[Hall effect sensors](https://en.wikipedia.org/wiki/Hall_effect_sensor) use the "Hall effect" to measure the magnitude of a magnetic field. Unlike resistive sensors, which change their resistance based on some external stimulus, a Hall effect sensor outputs a varying voltage directly proportional to the sensed magnetic field. In contrast to inductive sensors, which respond to *changing* magnetic fields, Hall effect sensors work with static (non-changing) fields.



## Reed switches
My lecture CMSC838f_Lecture05_AllThingsResistance_v2 has a great reed switch video that we might be able to convert part of to animation: http://youtu.be/qje8LhZXwO0


- https://www.magnelinkinc.com/blog/reed-vs-hall-effect-switch/
From: "https://www.kjmagnetics.com/blog.asp?p=reed-switches-and-hall-effect-sensors":

The reed switch is an electrical switch operated by an applied magnetic field.  It consists of a pair of contacts on ferrous metal reeds in an airtight glass envelope.  The contacts are normally open, making no electrical contact.  The switch is actuated (closed) by bringing a magnet near the switch.  Once the magnet is pulled away, the reed switch will go back to its original position.

What is a Hall Effect Sensor?
A Hall effect sensor is a transducer that varies its output voltage in response to changes in magnetic field.  In some ways, Hall effect sensors can ultimately perform a similar function as a reed switch, but with no moving parts.  Think of it as a solid-state component, good for digital applications.

Which of these two sensors is right for your application depends on a number of things.  Factors include cost, magnet orientation, frequency range (reed switches typically aren't usable over 10 kHz), signal bounce and the design of the associated logic circuitry.

## References
- [TI DRV5055 datasheet](http://www.ti.com/lit/ds/symlink/drv5055.pdf?HQS=TI-null-null-mousermode-df-pf-null-wwe&DCM=yes&ref_url=https%3A%2F%2Fwww.mouser.com%2F&distId=26), Texas Instruments
- [Hall Effect Sensing and Applications](https://sensing.honeywell.com/hallbook.pdf), Honeywell

## Videos
- [What is the Hall Effect and How do Hall Effect Sensors Work](https://youtu.be/wpAA3qeOYiI), How to Mechatronics
- [Hall Effect Sensors](https://youtu.be/jdgU49ne4gA), Ludic Science
- [Arduino Tutorial: Tachometer (RPM Counter)](https://youtu.be/u2uJMJWsfsg), InterlinkKnight

## Citations
Dimitri Van Landuyt, Steven Op de beeck, Aram Hovsepyan, Sam Michiels, Wouter Joosen, Sven Meynckens, Gjalt de Jong, Olivier Barais, and Mathieu Acher. 2014. Towards managing variability in the safety design of an automotive hall effect sensor. In Proceedings of the 18th International Software Product Line Conference - Volume 1 (SPLC ’14). Association for Computing Machinery, New York, NY, USA, 304–309. DOI:https://doi.org/10.1145/2648511.2648546