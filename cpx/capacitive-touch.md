---
layout: default
title: L5&#58; Capacitive Touch
parent: Circuit Playground Express
has_toc: true # (on by default)
comments: true
nav_exclude: false
usetocbot: true
---

In this three-part lesson, we will learn how to use the capacitive touch pads on the CPX.

## Lesson 5.1: Intro to Capacitive Touch on the CPX

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/HKwtXrTdocE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 5.2: Interacting with Everyday Objects Using Capacitive Sensing

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/_eMAbP7ATOU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 5.3: Making a Capacitive Touch Keyboard

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/DrqrGA9OtvE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 5.4: Making a Lo-fi Capacitive Touch Nintendo Controller

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/2HasGGKsyI0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>


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

## How Capacitive and Resistive Touch Works

If you want to learn more about how capacitive and resistive touchscreens work, see below:

- [Capacitive Touch Screens](https://youtu.be/BR4wNq6WGkg), Tufts Final Project 2015
- [Using a resistive touchscreen](https://www.youtube.com/watch?v=_GT_sgbKQrc), DroneBot Workshop
- [How to Add Capacitive Sensing to Any Arduino Project](https://www.digikey.com/en/maker/blogs/2021/how-to-add-capacitive-sensing-to-any-arduino-project), Maker.io