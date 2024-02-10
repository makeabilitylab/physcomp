---
layout: default
title: L9&#58; Digital Input
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

In Lesson 9, we continue exploring how to hook up and use external electronics with our CPX. In Lesson 8, we worked with analog input—which converts voltage signals from 0 - 3.3V to 0 - 1023. In Lesson 9, we'll work with **digital input**, which converts voltage input signals to either ON (1) or OFF (0). This is useful for components like buttons.

## Lesson 8.1: Overview of Digital Input

In this lesson, we learn about _what_ is **digital input** and _how_ to use it on the Circuit Playground Express (CPX). We begin similarly to our [analog input lessons](analog-input.md): introducing the 3.3V, GND, and A1 CPX connection pads and showing how the **digital read** function responds to different input voltages (e.g., 3.3V, GND).

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/raIc-EuHfmc?si=-KCgO3ypF9kPKBVd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 8.2: Hooking up Buttons to the CPX & Why Pull-down Resistors?

In this video, we introduce a solution to the "floating pin" problem using pull-down resistors and hook up our first button to the CPX.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/mFXvAfsiRx0?si=_6ks-_M8sWD0XlSQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 8.3: Using Internal Pull-up & Pull-down Resistors with the CPX

In this video, we introduce external pull-up resistors and then using internal pull-up and pull-down resistors on the CPX with MakeCode.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/JT4sQ72HJAM?si=ib8fGLSrsdvz5T-u" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Lesson 8.4: Hooking up Arcade Buttons to the CPX

TODO

<!-- TODO: add in circuit diagrams and code links 
Post advance code for debouncing
-->

## Advanced Code

* [Debouncing Buttons in MakeCode](https://makecode.com/_ie5VHcgsXfEu). Note: I haven't really found the need to debounce buttons with MakeCode and CPX but if you're getting unexpected multiple button presses when using a button, try this out. For more on debouncing, see our [Debouncing Lesson](../arduino/debouncing.md).

## Resources
Here are some additional resources:

* [MakeCode Pins](https://makecode.adafruit.com/reference/pins)
* [MakeCode's Digital Read Function](https://makecode.adafruit.com/reference/pins/digital-read)
* [MakeCode Input States](https://makecode.adafruit.com/learnsystem/pins-tutorial/digital-input/input-states)
* [Adafruit MakeCode Learning: Digital Input](https://makecode.adafruit.com/learnsystem/digital-input)
* [Using Digital Input on the CPX with Arduino C/C++](https://learn.adafruit.com/circuit-playground-digital-input/overview)


## Previous Lesson

<span class="fs-6">
[Previous: Analog Input](analog-input.md){: .btn .btn-outline }
</span>