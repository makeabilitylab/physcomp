---
layout: default
title: L7&#58; CPX as a Mouse
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

In Lesson 7 of our CPX series, we will learn how to use the CPX as a programmable mouse. We'll begin by making a discrete mouse that shifts the mouse cursor by small amounts with button A and B presses before building a more complex accelerometer-based mouse with continuous input.

## Lesson 7.1: Making a Programmable Mouse with CPX and MakeCode

In this lesson, we will show how to use the CPX as a programmable mouse.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/bOm1qXTDi-o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 7.2: Making an Accelerometer Mouse

In this lesson, we will show how to use the CPX's built-in accelerometer to make smooth, continuous mouse input.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/vnqNmQnbpO8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<!-- Ideas:
- Start very simple with moving mouse by some amount with a button or touchpad press. 
  - https://editor.p5js.org/jonfroehlich/sketches/MSGdVYUle
- Maybe A1 down, A5 up, A3 right, A7 left
  - Need mouse click for http://jacksonpollock.org/
  - https://freepong.org/ (has mouse option)
- Then use Tilt for left, right, up, down, and buttons for click
  - Show off with a basic mouse game
    - Start by exploring Google Earth 
    - Maybe put a airplane on controller and play: https://gamaverse.com/anti-virus-game/
  - https://thisissand.com/ (actually have a bottle filled with sand)
  - http://jacksonpollock.org/
  - Show off with p5js painter app?
  - https://freepong.org/ (has mouse option)
- Then most complex example with raw accelerometer data.
  - Version 1: https://makecode.com/_fEDc8m0FqJt0
  - Version 2: https://makecode.com/_JccC6U5Dj4Ko -->

## Project Examples

All project examples below provide tutorials with example MakeCode code.

- [Mouse Painter](https://learn.adafruit.com/mouse-painter-emulate-mice-with-makecode/overview), John Park
- [Make it a Mouse](https://learn.adafruit.com/make-it-a-mouse), Anne Barela