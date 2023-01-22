---
layout: default
title: L5&#58; Capacitive Touch
parent: Circuit Playground Express
has_toc: true # (on by default)
comments: true
nav_exclude: false
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In Lesson 5 in our CPX series, we will learn how to use capacitive touch sensing. This is a multi-part series starting with an introduction to capacitive sensing.

## Lesson 5.1: Intro to Capacitive Touch on the CPX

In this lesson, we will first introduce the concept of capacitive sensing before building a simple capacitive touch "piano." We will then show how to visualize the raw capacitance values and capacitance touch threshold values, which are used to trigger capacitance events. Third, we cover how to use both auto-calibration and manual calibration to change the capacitance touch threshold before building a capacitive-responsive instrument (similar to [Lesson 4: Light-Responsive Instrument](sensor-instrument.md)). 

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/HKwtXrTdocE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 5.1 Code

Here is a link to the programs we built in Lesson 5.1.

- [Code for graphing A1 capacitance](https://makecode.com/_EWVVviTtzWC5)
- [Code for graphing A1 capacitance, the touch threshold, and recalibration](https://makecode.com/_XKm2wUYgWcw9)
- [Code for capacitive-responsive instrument (proximity!)](https://makecode.com/_8pAMay1XXg6W)

## Lesson 5.2: Capacitive Sensing with Everyday Objects

Building on 5.1, we will prototype an interactive piano out of everyday objects like an orange, banana, and soda can with the CPX, MakeCode, and capacitive touch sensing. We'll again show how important it is to measure the capacitance touch values of different objects and to use auto-calibration or manual calibration to configure capacitance touch thresholds.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/_eMAbP7ATOU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 5.2 Code

Here is a link to the programs we built in Lesson 5.2.

- [Code for capacitive-touch piano](https://makecode.com/_X18RPxJte8EU)

## Lesson 5.3: Making a Capacitive Touch Keyboard

Building on 5.2, we'll use capacitive touch sensing to make a custom keyboard and play music and video games with fruit, a coin, and a soda can. Essentially, we're going to make your laptop think the CPX is a keyboard and have all sorts of fun using different objects as keys!

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/DrqrGA9OtvE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 5.3 Code

Here is a link to the programs we built in Lesson 5.3.

- [Code for capacitive-touch keyboard](https://makecode.com/_cfwTFgTK1AAy)

## Lesson 5.4: Making a Lo-fi Capacitive Touch Nintendo Controller

Building on 5.3, we'll use capacitive touch sensing to make a custom lo-fi Nintendo NES controller out of cardboard, copper tape, and tin foil and play Super Mario Bros.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/2HasGGKsyI0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 5.4 Code

Here is a link to the programs we built in Lesson 5.4.

- [Code for capacitive-touch gamepad](https://makecode.com/_2q5bAx9ch5am)


<!-- Flow:
Remember A0 cannot be used for capacitive touch
- Start with end result. A capacitive touch fruit piano (note: can edit this in)

- Then very simply with a capacitive touch on A1. Remember A0 cannot be used for capacitive touch. Show diagram.
- Build up A1 touch. Show console out when your finger touches the pad.
- Then build up touchpads A1 - A3
- But the exciting part is when we hook up to other conductive objects. Let's try a 
- Here's code for simple capactive touch on A1 that also shows the threshold. This threshold is really important
  as it's what triggers a touch event. https://makecode.com/_EWVVviTtzWC5
- How does this work? Well, when your program first starts, it calls a calibration sequence for the touchpads, which determines the capacitance threshold necessary to trigger a touch. Let's take a look
- Then build it up on all touchpads A1 through A3
- Now, here's the fun part. We can hook up external objects that are conductive. "Connecting an object to a touch pin can make it touch sensor. When some object is connected to a pin, it changes the capacitance that is measured for the pin. When your program starts, it calibrates its measurement of capacitance for the pin surface and any object connected to it. This allows it to properly detect your touch." https://makecode.adafruit.com/learnsystem/pins-tutorial/touch-input/sensor-objects

- Then show to make hover gesture that changes pitch? -->

<!-- Capacitive sensing technology works by measuring the change in capacitance (the ability of a system to store an electric charge) within its projected field due to the presence of a conductive object. See: https://www.rspinc.com/blog/contract-manufacturing/what-is-a-capacitive-touch-sensor-how-are-they-used/ -->

<!-- From Wikipedia:
"Capacitive sensing (sometimes capacitance sensing) is an electrical sensing method that can detect and measure anything that is conductive or has a dielectric constant (which is a measure of a substance's ability to store energy) different from air. ...

Many types of sensors use capacitive sensing, including sensors to detect and measure proximity, pressure, humidity.

And you're surrounded by capacitive sensing—it's how modern touchscreens and touchpads work as well" -->

<!-- Adafruit Touch Sensor Docs: https://makecode.adafruit.com/reference/input/button/touch-sensors 
Adafruit Capacitive lesson: https://learn.adafruit.com/make-it-sense/makecode-6-->

## References

<!-- https://makecode.adafruit.com/learnsystem/pins-tutorial/devices/capacitors -->

- [Capacitive Touch Input on the CPX](https://makecode.adafruit.com/learnsystem/pins-tutorial/touch-input), Adafruit MakeCode Documentation

- [Calibrate Capacitive Sensitivity](https://makecode.adafruit.com/learnsystem/pins-tutorial/touch-input/calibrate-sensitivity), Adafruit MakeCode Documentation

- [Making Touch Sensor Objects](https://makecode.adafruit.com/learnsystem/pins-tutorial/touch-input/sensor-objects), Adafruit MakeCode Documentation

## How Capacitive and Resistive Touch Work

If you want to learn more about how capacitive and resistive touchscreens work, see below:

- [Capacitive Touch Screens](https://youtu.be/BR4wNq6WGkg), Tufts Final Project 2015
- [Using a resistive touchscreen](https://www.youtube.com/watch?v=_GT_sgbKQrc), DroneBot Workshop
- [How to Add Capacitive Sensing to Any Arduino Project](https://www.digikey.com/en/maker/blogs/2021/how-to-add-capacitive-sensing-to-any-arduino-project), Maker.io

## Previous Lesson

<span class="fs-6">
[Previous: Light-Responsive Instrument](sensor-instrument.md){: .btn .btn-outline }
</span>