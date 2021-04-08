---
layout: default
title: L7&#58; Breadboards
nav_order: 7
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

Breadboards allow us to prototype physical computing circuits quickly and efficiently. They have standardized holes, which allow integrated circuits and other components, to tightly sit in the board. You use "jumper wires" to connect placed components. These so-called "solderless breadboards" or just "breadboards" for short, dramatically simplify prototyping circuits. In the past, you would have to painfully wrap wires around mounted conductive poles or screws. 

![](assets/images/Breadboarding_FromLiteralBreadboardingToWireWrappingToSolderlessBreadboards_FromSparkfun.png)
**Figure** The left image is from an Instructable on "[Using a Real Breadboard for Prototyping Your Circuit](https://www.instructables.com/Use-a-real-Bread-Board-for-prototyping-your-circui/)" and the center image is originally from Wikipedia (user Wikinaut); however, both images were found on Sparkfun.com's [breadboard tutorial](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard).
{: .fs-1 }

That said, breadboards are a bit obscure at first and do take time to get used to and understand. In this lesson, we'll learn about breadboards, prototype with them in the simulation environment called [Tinkercad Circuits]((https://www.tinkercad.com/)), and build some simple circuits with resistors and LEDs.

## Inside a breadboard

If you tore open a breadboard, you would see a set of *pre-wired* columns and rows (internal metal strips). These pre-wired connections are exposed as holes on the top of the breadboard (looks like a grid), which you can quickly and easily tap into to make circuits. 

Unfortunately, it is not immediately clear *which* holes are pre-wired to one another—which introduces a lot of confusion and miswirings for novices. So, it's important that you study and understand these breadboarding images (and also be patient with yourself as you're learning—a very common and frustrating mistake for beginners is an 'off-by-one' error or by misunderstanding how the embedded wiring in a breadboard works).

![](assets/images/InsideABreadboard.png)
**Figure** Images originally from [here](https://slideplayer.com/slide/7059660/) and [here](http://www.captaincredible.com/abc/?page_id=92). Annotations in PowerPoint.
{: .fs-1 }

In the image below, we've highlighted *where* the pre-wired connections (those internal metal strips) exist. You can think of each of these lines as individual nodes. Just like the breadboards in your kit, this breadboard has two power rails on each side, individual columns for placing components, and a ravine (in the middle) that separates the columns on each side of the board.

![](assets/images/BreadboardOverviewWithConnectionsMarked.png)
**Figure** Breadboard image from [Fritzing](https://fritzing.org/). Annotations in PowerPoint.
{: .fs-1 }

![](assets/images/BreadboardExampleWithUnderlyingCircuitSchematicAndCurrentFlow_ByJonFroehlich.png)
**Figure** Made in [Fritzing](https://fritzing.org/) and PowerPoint.
{: .fs-1 }

## Some breadboard tips

### Tip 1: Use power rails

![](assets/images/BreadboardTips_UsePowerRails.png)

### Tip 2: Link power rails across board

![](assets/images/BreadboardTips_LinkPowerRails.png)

### Tip 3: Use wire colors to convey meaning

![](assets/images/BreadboardTips_UseWireColorsToConveyMeaning.png)

## Video tutorial

If you're still feeling lost, we highly recommend this breadboard tutorial video by *Science Buddies*. 

<iframe width="736" height="414" src="https://www.youtube.com/embed/6WReFkfrUIk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**Video** This video tutorial ["How to use a breadboard"](https://youtu.be/6WReFkfrUIk) by Science Buddies offers a great introduction to breadboards. 
{: .fs-1 }

## Breadboard voltage and current specifications

Generally, breadboards are designed to work with digital circuits (0-5V) and low amperages (0-1A). The breadboards we purchase for our courses ([link](https://www.amazon.com/Breadboards-Solderless-Breadboard-Distribution-Connecting/dp/B07DL13RZH/ref=sxin_2_ac_d_rm?ac_md=2-2-YnJlYWRib2FyZA%3D%3D-ac_d_rm&cv_ct_cx=perf+board&keywords=perf+board&pd_rd_i=B07DL13RZH&pd_rd_r=a9be70ad-f0e7-4956-b683-f1266bde56b4&pd_rd_w=mD02O&pd_rd_wg=faDF0&pf_rd_p=de19e82a-2d83-4ae8-9f5c-212586b8b9a0&pf_rd_r=H52F2FG970MN56W91230&psc=1&qid=1583787088)) specify a "300V/3-5A" rating. I'm highly incredulous. If you need to prototype a circuit with ~12V and greater than 500mA - 1A, it's better to use a [perfboard](https://learn.adafruit.com/collins-lab-breadboards-and-perfboards/learn-more) and a soldering iron. 

## Limitations

Breadboards have a number of limitations. First, their connections can wear over time (as you push in and pull out components) leading to unreliable contact points. Second, the internal metal clips and contact points add resistance and capacitance. I've seen estimates of about 0.1Ω and a stray capacitance of 2-20 picofarads (pFs) per connection ([link](https://www.circuitspecialists.com/blog/common-breadboard-specifications/), [link](https://www.baldengineer.com/electronics-introduction-to-breadboards.html)). Finally, due to these factors, high-frequency digital circuits—that switch on/off voltages at ~16 Mhz and beyond—won't work as well.

In physical computing, however, breadboards are often the perfect rapid prototyping board.

## Experimenting with breadboards in Tinkercad

To learn more about breadboards and gain experience with them before physically making, let's use [Tinkercad Circuits](https://www.tinkercad.com/) to play around. Tinkercad makes it easy to rapidly prototype, build, and simulate circuits in a software environment. And, for those that do not have access to electronic tools, Tinkercad also provides a simple multimeter and oscilloscope—so we can test and measure our circuits too!

For learning about breadboards, particularly, Tinkercad auto-highlights selected nodes when you mouse over breadboard columns and rows, so it builds up understanding before using a physical breadboard.

### Step 1: Open Tinkercad Circuits

Visit [tinkercad.com](https://www.tinkercad.com/) and login (if you already have an Autodesk account) or register if not. We are not using any of the "In School" features, so create a personal account:

![Screenshot of Tinkercad's registration page](../arduino/assets/images/Tinkercad_RegistrationPage.png)

### Step 2: Create a new circuit

In your dashboard, click on "Circuits":

![Screenshot of Tinkercad's dashboard](../arduino/assets/images/Tinkercad_ClickOnCircuits.png)

Then click on "Create new Circuit":

![Screenshot of Tinkercad's dashboard with "create new circuit button"](../arduino/assets/images/Tinkercad_CreateNewCircuit.png)

### Step 3: Aquaint yourself with Tinkercad

Tinkercad works by dragging and dropping components from the right sidebar menu onto the Circuit canvas. You can click on the "Start Simulation" button to simulate circuits (in later lessons, we'll show how you can even simulate circuits with and write code for Arduino in the Tinkercad environment). 

![](assets/images/Tinkercad_ShowingInterfaceWithBasicLEDCircuitOnBreadboard.png)

## Activity

For your prototyping journals, come up with three LED-based circuits and build them in Tinkercad circuits—each circuit can either be a minor or major variation. The goal of this activity is to get comfortable with breadboards. Play around. What do you observe? Take screenshots, provide a brief description, and include a link to your Tinkercad circuit in your prototyping journal.

Then, select your two favorite ideas and actually build them using the components in your hardware kits (*e.g.,* breadboard, 9V battery, resistors, LEDs). Using manual calculations for current draw, estimate how long your circuit will last on a 9V battery—assume 500 mAh at a 25mA discharge rate and ~400mAh at a 50mA discharge rate down to 4.8 volts ([9V Energizer Datasheet](https://data.energizer.com/PDFs/522.pdf)).

Note that you'll need to use the alligator clips on the 9V battery to supply power your breadboard rails. I suggest using the black alligator clip for the battery's negative terminal, the red alligator clip for the battery's positive terminal, and matching jumper wires to connect to your breadboard.

<!-- https://www.baldengineer.com/9v-batteries-suck.html -->

<!-- https://www.baldengineer.com/electronics-introduction-to-breadboards.html -->

## Resources

- [Setting Up a Breadboard](https://itp.nyu.edu/physcomp/labs/labs-electronics/breadboard/), NYU ITP

- ["How to use a breadboard"](https://youtu.be/6WReFkfrUIk), Science Buddies 

- [How to Use a Breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard), Sparkfun.com
