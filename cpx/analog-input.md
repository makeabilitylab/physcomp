---
layout: default
title: L8&#58; Analog Input
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

In Lesson 8, we move beyond working with internal sensors on the CPX (light, microphone, accelerometer) and show how to connect to external sensors using analog input. 

## Lesson 8.1: Overview of Analog Input

In this lesson, we introduce **analog input** on the Circuit Playground Express (CPX) primarily focusing on variable resistive sensors like rotary potentiometers, slide potentiometers, force-sensitive resistors (FSRs), flex sensors (Nintendo Power Glove!), softpot position sensors, and more!

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/S6X4Y5gfekc?si=RysXDQ5unRU7n79H" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 8.1 Code

- [Graphing Analog Input](https://makecode.com/_TbV5Tx22rdTh). Graphs the A1 value between 0-1023 in console and uses onboard NeoPixels as a graph

- [Analog Y Mouse Controller](https://makecode.com/_6HK2ucd74Aox). Controls mouse Y movement with A1 movement

## Lesson 8.2: What is Analog Input?

In this lesson, we learn more about *what* is **analog input** and *how* to use it on the CPX. We begin by introducing the 3.3V, GND, and A1 CPX connection pads and show how the function **[analog read](https://makecode.adafruit.com/learnsystem/pins-tutorial/analog-input/read-analog)** responds to different voltages (*e.g.,* 3.3V, GND). We then introduce the concept of dividing voltages via fixed resistors before building a lo-fi slide potentiometer using paper and a 2B pencil, which divides voltage dynamically.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/jX9gMRW-D1c?si=Ejqh4Oo25gVSDn8t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

{: .note }
It's OK if you don't understand exactly how voltage dividers work. The key is in developing a bit of intuition about how the CPX analog read function works and what physical phenomena it is reading on A1 (it's voltage!). Any sensor that can manipulate voltage can be used as input. If you want to learn more about potentiometers and voltage dividers, see our [Arduino L4: Potentiometer lesson](../arduino/potentiometers.md)

## Lesson 8.3: What is Analog Input?

In this lesson, we learn how to hook up **three-legged variable resistors** like rotary and slide potentiometers as well as **two-legged variable resistors** like force-sensitive resistors, photo-sensitive resistors, and flex sensors.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/7aujdrvN55w?si=ub-BLhdQSCc1gnSn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Previous Lesson

<span class="fs-6">
[Previous: CPX as a Mouse](cpx-mouse.md){: .btn .btn-outline }
</span>