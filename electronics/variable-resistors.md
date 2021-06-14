---
layout: default
title: L8&#58; Variable Resistors
nav_order: 8
parent: Intro to Electronics
has_toc: false # on by default
nav_exclude: false
search_exclude: true
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

In previous lessons, we worked with [fixed-value resistors](resistors.md). In this lesson, we'll learn about **variable resistors**—resistors that *change* their resistance based in response to some physical input (like potentiometers) or environmental input like thermistors (temperature), force-sensitive resistors (force), or photo-sensitive resistors (light). We've listed some examples below.

![Grid of images showing different types of variable resistors, including: potentiometers, touch membranes, photocells, thermistors, force-sensitive resistors, and flex sensors](assets/images/VariableResistors_ExampleGallery.png)
**Figure.** Many common **sensors** are actually variable resistors—they dynamically change their resistance in response to some human or environmental input. For example, thermistors change their resistance based on temperature, photocells based on light, force-sensitive resistors (FSRs) based on force. In fact, you have thermistors, photocells, and FSRs in your hardware kits! Prices and pictures are from Sparkfun.com; parts can often be cheaper in bulk from suppliers like [Digi-Key](https://www.digikey.com/) or [Mouser Electronics](https://www.mouser.com/).
{: .fs-1 }

This is exciting! Physical computing is all about **interaction** and resistive materials that respond to different stimuli open up a new world of possibilities! 

## Variable resistor types

There are **two-leg** (or "two-terminal" or "two-lead") variable resistors like rheostats, photocells, and force-sensitive resistors and there are **three-leg** variable resistors, which are called potentiometers. Both types are orientation agnostic—just like regular resistors, they will work in either direction (non-polarized). See schematic symbols below.

![](assets/images/SchematicSymbolsOfVariableResistors_ByJonFroehlich.png)
**Figure.** Schematic symbols for some example two-leg and three-leg variable resistors. Notice how some schematic symbols are the *same* across variable resistor types.
{: .fs-1 }

Regardless of specific type, all variable resistors have a schematic symbol similar to a regular resistor but with some visual modification to indicate "variability." A few general things to note:

1. The two-leg variable resistor schematic symbol looks quite similar to a regular resistor but has a **diagonal line** through it indicating variability
2. Potentiometers have three legs, which are also represented in the schematic. The **middle arrow** (the "wiper leg") can be connected in a circuit and will actually be shown that way in a circuit diagram. We'll see this below.
3. Some common variable resistors, like light-dependent resistors (LDRs or photocells), have their **own schematic symbols**. Others, like force-sensitive resistors and rheostats share the same symbol.

Potentiometers are probably the most common type of variable resistor and an important component to learn about, so let's get started!

## Potentiometers

A [potentiometer](https://en.wikipedia.org/wiki/Potentiometer) (or pot) is a three-terminal resistor with a sliding or rotating contact that can be used to dynamically vary resistance.  

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/Potentiometer_Overview_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** This animation shows how the wiper can be used to vary resistance in a rotary potentiometer. The figure on the right is the formal electrical symbol. Animation by Jon Froehlich. Created in PowerPoint.
{: .fs-1 }

Potentiometers are truly ubiquitous electronic components found in everything from volume controls to analog joysticks. In our UW courses, we often provide 10kΩ potentiometers in our kits like the [10K panel mount potentiometer](https://www.adafruit.com/product/562) and [10K trim potentiometer](https://www.sparkfun.com/products/9806), shown below.

![](assets/images/Potentiometers_TwoExamplesWithSchematicSymbol.png)
**Figure.** Two example potentiometers commonly included in our hardware kits: a 10kΩ panel mount and and a 10kΩ trim potentiometer.
{: .fs-1 }

While potentiometers are often used as human input devices, this is not always the case. For example, a potentiometer might be used in a feedback circuit for a servo motor. As the motor rotates, it also rotates an embedded potentiometer's control dial (wiper), which feedsback rotational information to the control circuit (see [Chapter 15.4 on RC Servos](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/26_Chapter_15.xhtml) in [Scherz and Monk, 2016](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/)).

Though still widely used, some of a potentiometer's application spaces have been subsumed by digital controls like rotary encoders and buttons. Don't get confused: [rotary encoders](https://learn.adafruit.com/rotary-encoder) can look very similar to potentiometers—indeed, with knobs attached they can look identical. However, [rotary encoders](https://en.wikipedia.org/wiki/Rotary_encoder) are not resistive devices, require digital circuits to use, and can be spun around continuously. In contrast, potentiometers are resistive components, can be used in analog or digital circuits, and typically have a controllable angle of 200°-270°.

### How does a potentiometer work?

Potentiometers have three legs: the resistance between the outer two legs (Leg 1 and Leg 3) will not vary. For example, if you are using a 10kΩ potentiometer, then the resistance between Legs 1 and 3 will always be 10kΩ regardless of wiper position (Leg 2). If you're using a 1kΩ resistor, then the resistance between Legs 1 and 3 will be 1kΩ, and so on.

The power of a potentiometer is in that middle leg (Leg 2) whose resistance varies depending on the potentiometer's sliding or rotating contact (the wiper) position. It may help to think of a potentiometer as containing two interdependent resistors $$R_1$$ and $$R_2$$ that always sum to $$R_{Total}$$ (where $$R_{Total}$$ is the potentiometer's total value like 1kΩ or 10kΩ). As you move the slider contact, $$R_1$$'s resistance will increase as $$R_2$$'s resistance decreases. See animation below.

<!-- As you move the wiper, the resistance across Legs 1 and 2 ($$R_{1}$$) and Legs 2 and 3 ($$R_{2}$$) proportionally change but always sum to $$R_{total}$$. -->

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/PotentiometerIntroduction_TrimmedAndCropped.mp4" type="video/mp4" />
</video>
**Video.** Animation by Jon Froehlich. Created in PowerPoint.
{: .fs-1 }

### Potentiometer types

Potentiometers come in a range of sizes, power ratings, and physical designs. Some larger designs can handle several watts of power (capable of dissipating alot of heat) while smaller, surface-mounted designs are rated for only a fraction of a watt (just like the $$\frac{1}{4}$$ watt resistors in your kits). 

![](assets/images/VarietyOfPotentiometers.png)
**Figure.** Potentiometers are ubiquitous input devices found in everything from cars to audio mixing boards. There are nearly infinite designs, so we're only showing a small sample above. Note that you cannot tell the resistance value of a potentiometer (or pot) simply by looking at it nor can you tell whether it is a linear taper or a logarithmic taper. Logarithmic potentiometers are common in audio applications (because the human ear senses loudness logarithmically). Images sources: the potentiometer pictures with dark backgrounds are from [Adafruit](https://www.adafruit.com). The others are from [digikey](https://www.digikey.com/).
{: .fs-1 }

Potentiometers differ primarily in terms of:

- **Resistance range**. Just like resistors, potentiometers are designed to provide different resistances but over a range (0-1kΩ and 0-10kΩ are common). 

- **Linear** vs. **logarithmic** tapers (or tracks). With linear potentiometers, the resistance varies linearly as the wiper is moved. With logarithmic potentiometers, the resistance varies logarithmically. The latter type is common in audio applications because the human ear perceives sound magnitude logarithmically with more sensitivity for quiet sounds and less for loud sounds.

- **Power dissipation**. Again, similar to resistors, potentiometers have different "power ratings", which correspond to their ability to dissipate heat. This trim potentiometer [datasheet](https://www.sparkfun.com/datasheets/Components/General/TSR-3386.pdf) states that the power rating is 0.5W while this panel mount potentiometer is rated at 0.1-0.2W (see [datasheet](https://cdn-shop.adafruit.com/product-files/562/p160.pdf)).

- **Rotary** vs. **slider**. Rotary potentiometers use a rotating knob to control the wiper leg while slider potentiometers use a slider.

- **Mount**. Some potentiometers are built for "mounting", for example, in a car dashboard or audio mix board. Others are built for breadboarding or for mounting on printed-circuit boards (so-called "surface-mount" potentiometers)

- **Knob**. For those potentiometers used for human-input applications, there are a variety of knob types to support ergonomic and grippable interaction.

### Inside a potentiometer

If you're curious about how a potentiometer is constructed, this video by John Cooper provides a wonderful deconstruction of rotary potentiometers and how they work.

<iframe width="736" height="414" src="https://www.youtube.com/embed/rUkrpqEmXb8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
**Video.** A [video](https://youtu.be/rUkrpqEmXb8) deconstruction of potentiometers and how they work by John Cooper (on YouTube).
{: .fs-1 }

### Potentiometer knobs

You have very likely interacted with potentiometers many times in your life; however, they have been covered by knobs, which make the potentiometer more ergonomic and grippable. 

There are a large diversity of knobs, which fit both panel-mount potentiometers and rotary encoders, used in a variety of user-facing applications like audio mixers, joysticks, and control panels. Take a look at some examples below:

![](assets/images/ExamplePotentiometerKnobs_ImagesFromAdafruit.png)
**Figure.** Small sample of potentiometer and rotary encoder knobs. All images from [Adafruit](https://www.adafruit.com/). From left-to-right: [Soft Touch T18 - White](https://www.adafruit.com/product/2047), [Soft Touch T18 - Red](https://www.adafruit.com/product/2046), [Slim Metal Knob](https://www.adafruit.com/product/2058), [Machined Metal Knob](https://www.adafruit.com/product/2056), [Slide Pot with Plastic Knob](https://www.adafruit.com/product/4271)
{: .fs-1 }

#### Creating custom 3D-printable knobs

A fun introductory 3D-printing exercise is to design, model, and print your own potentiometer knob. We typically do this activity at the beginning of our fabrication module in our physical computing course. Here are some simple example 3D-printable potentiometer knobs that we designed.

![](assets/images/CustomPotentiometerKnobsCreatedInFusion360_ByJonFroehlich.png)
**Figure.** Three simple potentiometer knobs created in Fusion 360 (in 5-10 minutes each). The CAD designs take roughly 20 minutes to print on an Ultimaker 2+ 3D printer with 0.2mm layer height and no supports or plate adhesion (*e.g.,* brims). All designs by Jon Froehlich. You can see step-by-step tutorial videos [here](https://youtu.be/bF1hreNH_E0) and [here](https://youtu.be/1Yz9DDb4QnI).
{: .fs-1 }

Even more fun is to combine your custom 3D prints with a microcontroller and to build custom applications that create new interactive experiences

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/3DPrintedTrimPotKnobDemo2_TrimmedAndOptimized_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** A short video demonstrating the custom 3D printed potentiometer knobs being used as custom game controllers with an Arduino Leonardo and custom [Processing](https://processing.org/) sketches. The code for the Arduino+Processing "Etch-a-sketch" is [here](https://github.com/makeabilitylab/arduino/tree/master/Processing/ArduinoEtchASketch) and the code for the Arduino+Processing "Pong" is [here](https://github.com/makeabilitylab/arduino/tree/master/Processing/ArduinoPong). All 3D CAD designs and code by Jon Froehlich.
{: .fs-1 }

### Potentiometers as analog joysticks

Just as our 3D-printed designs hint at, potentiometers have a long history as game controllers. In our hardware kits, we often include a 2-axis joystick like [this one](https://learn.parallax.com/tutorials/language/propeller-c/propeller-c-simple-devices/joystick) from Parallax ([$6.95 on Adafruit](https://www.adafruit.com/product/245)), which contains two embedded 10kΩ potentiometers.

![](assets/images/Parallax2AxisJoystickWithTwoEmbeddedPotentiometers.png)
**Figure.** The [Parallax 2-Axis Joystick](https://learn.parallax.com/tutorials/language/propeller-c/propeller-c-simple-devices/joystick) has two embedded 10 kΩ potentiometers, one for each axis. You can see a video demo [here](https://youtu.be/SXtPGAu4MMw).
{: .fs-1 }

By moving the analog joystick, you independently control the two potentiometers in a voltage divider configuration. There is a $$V_{Out}$$ for the "Up/Down" potentiometer and a $$V_{Out}$$ for the "Left/Right" potentiometer. See the circuit diagram above.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/Parallax_2-AxisJoystick_TrimmedAndMuted.mp4" type="video/mp4" />
</video>
**Video.** A short snippet from this [official Parallax video](https://youtu.be/SXtPGAu4MMw) showing how physical movement of the joystick is translated into an electrical signal using two potentiometers.
{: .fs-1 }

### Potentiometers as voltage dividers

Potentiometers are actually conveniently packaged voltage dividers, which we first described in [Lesson 3](series-parallel.md): $$R_{1}$$ and $$R_{2}$$ divide the voltage as the potentiometer wiper moves.

![](assets/images/PotentiometersAsVoltageDividers2_ByJonFroehlich.png)
**Figure.** A potentiometer is a compact voltage divider. Image made in PowerPoint.
{: .fs-1 }

As an example, let's hook up a potentiometer to 5V (Leg 1) and ground (Leg 3) and see the output voltage $$V_{out}$$ vary at the wiper leg (the signal at Leg 2):

![](assets/images/PotentiometerHookedUpTo5VAndGnd_ByJonFroehlich.png)
**Figure.** Let's hookup the potentiometer to a 5V and ground. Image made in PowerPoint.
{: .fs-1 }

Now, let's see what happens as we change the wiper. Notice how $$V_{out}$$ changes according to $$V_{in} * \frac{R2}{(R1 + R2)}$$. In the video below, we are using a 1kΩ potentiometer but the function is the same.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/PotentiometerIntroduction-VoltageDividerWithCircuitJS_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of how $$V_{out}$$ changes according to $$V_{in} * \frac{R2}{(R1 + R2)}$$. Animation made in PowerPoint and CircuitJS.
{: .fs-1 }

<!-- ![Image showing how you potentiometers can be thought of as voltage dividers](assets/images/PotentiometersAsVoltageDividers.png)
A 10kΩ potentiometer split into two constituent resistors ($$R_{1}$$) and ($$R_{2}$$). In this case, the wiper is in the middle, so $$V_{A0}$$ equals 2.5V.
{: .fs-1 } -->

<!-- My old YouTube video on this:
<iframe width="736" height="414" src="https://www.youtube.com/embed/ZAzX_pxuWps" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
Video shows how the voltage output at Leg 2 changes based on the wiper position, which splits the potentiometer into two "resistor" sub-parts, ($$R_{1}$$) and ($$R_{2}$$), which creates a voltage divider.
{: .fs-1 } -->

### Using a potentiometer as a two-terminal variable resistor

When only two terminals (or legs) of the potentiometer are used—an outer leg and the wiper (or signal) leg—the potentiometer acts as **rheostat** or a two-terminal **variable resistor**. You might use a potentiometer in this configuration to vary the resistance in your circuit rather than as a voltage divider. In fact, this is what we'll do below. We'll return to using a potentiometer as a voltage divider when we start working with microcontrollers.

## Activity: Build LED circuit with potentiometer as variable resistor

Whew, now we're ready to build stuff! Let's start by building a simple LED circuit with our potentiometer as a two-terminal variable resistor. Here, we will only use one outer leg (either Leg 1 or 3, it doesn't matter) and the signal leg (Leg 2). Let's take a look at the circuit diagram—is it what you expected? Why or why not?

![](assets/images/HookingUpPotentiometerAsTwoTerminalVariableResistor_ByJonFroehlich.png)
**Figure.** An example of how to hook up a potentiometer as a variable resistor. Image made in [Fritzing](http://fritzing.org/) and PowerPoint. 
{: .fs-1 }

Do you notice that additional fixed-value resistor in our circuit? Why do you think we have it?

Answer: because many potentiometers go from 0Ω to their max value, we must use a "backup" resistor in **series** with our potentiometer. Otherwise, when we rotate the potentiometer to low resistance values, too much current will go through our LED. For example, with a typical red LED with $$V_f=2V$$ and a 9V battery, if we set the potentiometer to 50Ω, then we will have $$I=\frac{7V}{50Ω}=140mA$$, which is far beyond the 20-30mA threshold of the LED.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/PotentiometerWithBackupResistor_TinkercadCircuits_Cropped_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** Here's an example of what would happen if you rotated the potentiometer to low resistance without a backup resistor. Boom, another blown out LED. Video made with [Tinkercad](https://www.tinkercad.com/things/d6wWCmUhl7g) and Camtasia. 
{: .fs-1 }

You can, of course, also build a potentiometer-based circuit in [CircuitJS](https://www.falstad.com/circuit/circuitjs.html) like [this one](https://www.falstad.com/circuit/circuitjs.html?ctz=CQAgjCAMB0l3BWcMBMcUHYMGZIA4UA2ATmIxAUgpABZsKBTAWjDACgA3EFPPWubr3CEqo-iGJQpMBGwDugvmBG0aSlewBOFHuGIodfTAao0MkeYv5UEumgPYLbfbIT7Pr3NgA9uCckQBGITc5rTCEgBqbMoGHjzuuq5GIAAmDABmAIYArgA2AC5MeQyp4NJQsOxgGDSq6qbEISgodRBg8JWIIABKDADOAJb9BVkAdgDGDJY0TXpxumD6Xk66xoZWKGxAA).

### Prototype circuit in Tinkercad Circuits

We'd like you to prototype two potentiometer-based LED circuits in Tinkercad Circuits: the first **without** a breadboard and the second **with** a breadboard. If you'd like, you can include a ammeter and voltmeter showing how the current and voltage drops change as you rotate the potentiometer knob. Here are two possible examples of potentiometer-based LED circuit. Make sure both the pictorial representations and circuit schematics make sense. Remember, we are only using **two** of the **three** legs of the potentiometer.

![](assets/images/BreadboardingPotentiometerAsTwoTerminalVariableResistorWithLED_ByJonFroehlich.png)
**Figure.** An example of how to hook up a potentiometer as a variable resistor with a breadboard. Many other possible functionally equivalent circuits exist. Image made in [Fritzing](http://fritzing.org/) and PowerPoint. 
{: .fs-1 }

For both Tinkercad Circuits, include a screenshot in your prototyping journals and describe your observations (just a sentence or two is fine).

### Prototype circuit on breadboard

After you've built and simulated the circuits in Tinkercad, we'd like you to physically build the breadedboarded version with your hardware kits. Take a photo and a quick demo video of the circuit working and put them in your prototyping journals. Describe any challenges.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/TrimPotentiometer-IMG_5685_Trim-Optimized.mp4" type="video/mp4" />
</video>
**Video.** Here's one possible way to breadboard a trim potentiometer circuit with a backup resistor and red LED. What did you make? Please take a similar video for your prototyping journals.
{: .fs-1 }

## Activity: Swap in another variable resistor

After you finish the above, we would like you to play and experiment with other variable resistors in your hardware kits, which include the **thermistor** (in your Plusivo box), the **light-dependent resistor** (also in your Plusivo box), the **slide potentiometer**, and/or my favorite, the **force-sensitive resistor**. 

Choose two of these and swap them in instead of the trim potentiometer on your breadboard. Take some photos, a video demo, and write a brief description of what you observed/learned for your prototyping journals.

We provide two examples below. 

### Force-sensitive resistor circuit

The force-sensitive resistor (FSR) responds to force or pressure. As an applied force increases, the resistance across the two terminals decreases. In the simple circuit below, the LED will receive more current (and emit more light as a result) as more pressure is applied to the FSR.

![](assets/images/ForceSensitiveResistor_BasicLEDCircuit_ByJonFroehlich.png)
**Figure.** An example of how to hook-up a force-sensitive resistor for a simple LED circuit. Image made in [Fritzing](http://fritzing.org/) and PowerPoint. 
{: .fs-1 }

Here's a video demonstration:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/FSR-TopDown9VCircuit-IMG_5683_Trimmed-Optimized.mp4" type="video/mp4" />
</video>
**Video.** A video demonstration of an FSR-based LED circuit.
{: .fs-1 }

### Light-dependent resistor circuit

A light-dependent resistor (LDR)—sometimes called a photocell or photo-sensitive resistor—reduces its resistance in response to light. In the simple circuit below, you'll notice that the red LED illuminates brightly in response to a flashlight. Often, we want just the opposite behavior: brighten an LED inversely proportional to light.

![](assets/images/LightDependentResistor_BasicLEDCircuit_ByJonFroehlich.png)
**Figure.** An example light-dependent resistor (LDR) circuit with an LED. In this configuration, the LED brightness will increase in proportion to the amount of light cast on the LDR sensor. Image made in [Fritzing](http://fritzing.org/) and PowerPoint. 
{: .fs-1 }

And the video demonstration:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/Photocell-IMG_5686_Trim-Optimized.mp4" type="video/mp4" />
</video>
**Video.** A video demonstration of an LDR-based LED circuit.
{: .fs-1 }

## Activity: build your own DIY variable resistor

For the final activity, we'd like you to build your own DIY variable resistor. We included [12B graphite pencils](https://www.amazon.com/XDT-Pencils-Art-Drawing-Graphite/dp/B08269G6QQ/ref=sr_1_44?dchild=1&keywords=graphite+pencils+12B+graphite&qid=1603388081&sr=8-44) in your hardware kits for just this purpose but you can use other materials if you so choose. 

Pencil leads are mixtures of clay and graphite—the more graphite, the more conductive. The more graphite, the higher the **B** rating (you can get 1B, 2B, 3B... 14B pencils). For your kits, we got 12B.

This activity is inspired by Jeff Feddersen, from NYU's ITP program. Please watch this video before continuing (it's one of my favorites!).

<div style="padding:66.67% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/76442431" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p><a href="https://vimeo.com/76442431">Ohm Part 2</a> from <a href="https://vimeo.com/fddrsn">Jeff Feddersen</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
{: .fs-1 }

For your prototyping journals, sketch out the circuit diagram for the DIY potentiometer, physically build it, and then take some photos and a video demonstrating how it works. Please also include a brief description and a reflection of what you learned.

### Example DIY rotary potentiometer

Here is an example DIY rotary potentiometer I made out of some cardboard, paper, a paper clip and a thumb tack (for the wiper), and a 12B pencil sketch (for the resistive material).

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/DIY_Rotary_Pot-Reversed_AdobePremiere_720p_ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** A lo-fi rotary potentiometer made out of some cardboard, paper, a paper clip and a thumb tack (for the wiper), and a 12B pencil sketch (for the resistive material).
{: .fs-1 }

### Example DIY slider potentiomter

Here is an example DIY slider potentiometer I made out of similar materials: cardboard, paper, a cardboard wiper with copper tape, and some 12B pencil sketch (for the resistive track).

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/DIY_Slider_Pot-720p-Optimized-ByJonFroehlich.mp4" type="video/mp4" />
</video>
**Video.** A lo-fi slider potentiometer made out of some cardboard, paper, copper tape-wrapped cardboard (for the slider), and a 12B pencil sketch (for the resistive track).
{: .fs-1 }

### DIY lo-fi electronics
There are lots of great resources for building lo-fi sensors, buttons, and connectors using everyday craft materials like tinfoil, cardboard, and paper clips. See these resources to help kickstart your brainstorming!

- The [KOBAKANT DIY Wearable Technology website](https://www.kobakant.at/DIY/) by Mika Satomi and Hannah Perner-Wilson has a wonderful set of resources for crafting your own electronic components, including [sensors](https://www.kobakant.at/DIY/?cat=26), [actuators](https://www.kobakant.at/DIY/?cat=28), [traces](https://www.kobakant.at/DIY/?cat=38), and [connectors](https://www.kobakant.at/DIY/?cat=32).

- Similarly, the ["kit-of-no-parts" website ](http://konp.plusea.at/) describes multiple methods for handcrafting electronics and sensors.

- [Scrappy Circuits](https://www.kickstarter.com/projects/deweymac/scrappy-circuits) by Michael Carroll covers cardboard-based circuits. See [their Twitter](https://twitter.com/ScrappyCircuits) for more ideas.

## Resources

- [Chapter 8, Variable Resistors](https://learning.oreilly.com/library/view/practical-electronics-components/9781449373221/ch08.html), Hughes, *Practical Electronics: Components and Techniques*, O'Reilly Media, 2015 

- [Chapter 11: Potentiometer](https://learning.oreilly.com/library/view/Encyclopedia+of+Electronic+Components+Volume+1/9781449333881/ch11.html) in Platt, *Make: Encyclopedia of Electronic Components Volume 1: Resistors, Capacitors, Inductors, Switches, Encoders, Relays, Transistors*, O'Reilly, 2012.

