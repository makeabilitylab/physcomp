---
layout: default
title: Circuit Playground Express
has_toc: false # (on by default)
usemathjax: true
comments: false
has_children: true
nav_exclude: false
nav_order: 5
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/CPX_CapacitiveSensing_SodaCanProximityDetector_MakeCode_Optimized.mp4" type="video/mp4" />
</video>
**Video.** In this tutorial series, you will learn how to use [Adafruit's Circuit Playground Express (CPX) microcontroller platform](https://www.adafruit.com/product/3333) and the wonderfully powerful and easy-to-use visual programming language called [MakeCode](https://www.microsoft.com/en-us/makecode). In the video above, we are using capacitive sensing to measure the hand's distance from the soda can. See more in [Lesson 5: Capacitive Sensing](capacitive-touch.md).
{: .fs-1 }

Welcome! These tutorials are designed to be completed **in order**.

{: .note }
We've written these CPX tutorials assuming you have limited background in circuits and/or programming. If these concepts are new to you, these tutorials are likely a great place to start before diving into our series on [Intro to Electronics](../electronics/) and [Intro to Arduino](../arduino/).

Many of the lessons have full video tutorials. If you want to view them conveniently in one place, see the [YouTube playlist here](https://youtube.com/playlist?list=PLW7IRNr2aHZNWbCav5ez_dOus3o_qkHzv).

## [Lesson 1: Introduction to the CPX and MakeCode](cpx.md)

In [this lesson](cpx.md), you'll learn about the Circuit Playground Express (CPX), how it differs from and relates to the Arduino platform, and how to program the board.

## [Lesson 2: Programming the CPX with MakeCode](makecode.md)

In [this lesson](makecode.md), we will make our first MakeCode+CPX program—called Blinky. As we build, we will learn about the MakeCode programming environment, the simulator, and how to load our program on to the CPX.

## [Lesson 3: Making a Simple Button Piano](button-piano.md)

In [this lesson](button-piano.md), we will make our first interactive CPX program: a simple button piano, which uses the CPX's built-in buttons and the speaker to make sound.

## [Lesson 4: Light-Level Instrument](sensor-instrument.md)

In [this lesson](sensor-instrument.md), we will make our second interactive CPX program, which builds on our knowledge from the first: a light-responsive instrument.

## [Lesson 5: Capacitive Sensing](capacitive-touch.md)

In [this multi-part lesson](capacitive-touch.md), we will use the CPX's capacitive touch features to create a proximity sensor, a banana piano, and a lo-fi input controller made out of cardboard, copper tape, and tin foil.