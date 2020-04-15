---
layout: default
title: L3&#58; Potentiometers
nav_order: 3
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

A [potentiometer](https://en.wikipedia.org/wiki/Potentiometer) (or pot) is a three-terminal resistor with a sliding or rotating contact that can be used to dynamically vary resistance. They are truly ubiquitous electronic components found in everything from volume controls to analog joysticks. 

In this lesson, we'll learn about potentiometers, analog input, and voltage dividers. Similar to the [buttons lesson](buttons.md), we are going to use potentiometers on their own before learning how to use them with microcontrollers.

## Potentiometers

<div style="padding:66.67% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/76442431" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p><a href="https://vimeo.com/76442431">Ohm Part 2</a> from <a href="https://vimeo.com/fddrsn">Jeff Feddersen</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
{: .fs-1 }

TODO: different tapers

![Image of two physical potentiometers along with a diagram and schematic symbol](assets/images/Potentiometer_DiagramWithSchematicSymbol.png)

### Variable resistors

When only two terminals (or legs) of the potentiometer are used—an outer leg and the wiper (or signal) leg—the potentiometer acts as **rheostat** or a two-terminal **variable resistor**. 

There are many types of sensors that change their resistance based on some human input or environmental condition. For example, thermistors change their resistance based on temperature, photocells based on light, force-sensitive resistors based on force.

TODO: insert figure of variable resistors

<!-- TODO: Where to bring in circuit theory here? -->

## Making an LED dimmer with a potentiometer

We're first going to make a potentiometer-based LED dimmer in [Tinkercad Circuits](https://www.tinkercad.com/) before building a physical prototype. Tinkercad makes it easy to rapidly prototype, build, and simulate circuits in a software environment. And, for those that do not have access to electronic tools, Tinkercad also provides a simple multimeter and oscilloscope—so we can test and measure our circuits too!

### Workbench video of my trimpot dimmer

Here's a workbench video of my circuit:

### Replace trimpot with FSR and photocell

As long as we have this circuit, let's have a bit of fun: try replacing the trimpot with the force-sensitive resistor

<!-- TODO: before we make, show and have them play around with Tinkercad and Falstad JS simulator? -->

In Tinkercad, need to make breadboard version

### Making your own lo-fi potentiometer

Inspired by Jeff's video, I made my own potentiometer using paper, a 12B pencil, and, for the wiper, cardboard and a paper clip. You could try something similar. Note: in this video, only two terminals (or legs) of the potentiometer are used: an outer leg and the wiper (or signal) leg. In this configuration, the potentiometer acts as **rheostat** or a two-terminal variable resistor. You should try something like this too!

<iframe width="736" height="414" src="https://www.youtube.com/embed/NRlJbuj5jr4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Outline
- Use trimpot on own to change brightness of LED
- Just focus on trimpot or also slide potentiometer (could close with that?)?