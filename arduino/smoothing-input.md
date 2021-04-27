---
layout: default
title: L6&#58; Smoothing Input
nav_order: 6
parent: Input
grand_parent: Intro to Arduino
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

By now, you may have noticed that your analog input data can be noisy. 

TODO: insert video of me using Sharp with noise

How can we smooth our input and what factors should we consider? 

This is a big, complex question. Indeed, there is an entire field called [digital signal processing](https://en.wikipedia.org/wiki/Digital_signal_processing) (DSP), which explores algorithmic methods to sample, smooth, or otherwise transform sensor data. In signal processing, [filters](https://en.wikipedia.org/wiki/Filter_(signal_processing)) refer to mathematical techniques and/or hardware devices that remove unwanted components of a signal.

In this lesson, we will cover a few basic smoothing algorithms (aka **signal filters**), why they're helpful, and potential tradeoffs in their implementation and use.

---

**DIVE DEEPER:**

DSP is a vast, complex area. If you'd like to dive deeper into this topic, see our [Signal Processing](../signals/signal-processing.md) lessons, which introduce [quantization and sampling](../signals/quantization-and-sampling.md), [signal comparisons](../signals/comparing-signals.md), and [frequency analysis](../signals/frequency-analysis.md). For a more technical introduction to digital filters, see [Chapter 14: Introduction to Digital Filters](http://www.dspguide.com/ch14/1.htm) in Steven W. Smith's book [The Scientist and Engineer's Guide to Digital Signal Processing](http://www.dspguide.com/). We also recommend Jack Schaelder's fully [interactive primer on DSP](https://jackschaedler.github.io/circles-sines-signals/index.html).

That said, even simple smoothing techniques like those covered in this lesson are helpful. In fact, the moving average filter is the most common filter in DSP both because of its simplicity but also because it does a great job of reducing random noise (see [Chapter 15](http://www.dspguide.com/ch15.htm) of Smith's book)!

---

<!-- ## Digital Filters

There are two primary approaches to filtering a signal: **time domain** methods, where the x-axis is time and the y-axis is sensor data, and **frequency domain** methods that transform the signal such that the x-axis are the frequency components in the signal and the y-axis is the magnitude of those frequencies. You may have heard of low-pass or high-pass filters, which filter (keep) low frequency components of a signal or high frequency components of a signal, respectively. These filters are typically implemented in the frequency domain, and include  -->

<!-- methods, which are commonly used for smoothing, applying an offset (*e.g.,* DC removal) and **frequency domain** methods that analyze the frequency components of a signal to filter low-frequency -->

## Moving window filters

In this lesson, we will focus primarily on a class of time domain filters that use a moving window (or buffer) to smooth a signal in realtime. 

## Outline

- What is the problem
- Introduce digital signal processing
- Some potential approaches
- Moving average
- Moving weighted average (more recent values are weighted more)
    - Exponentially weighted moving average: https://hackaday.com/2019/09/06/sensor-filters-for-coders/
- Median filter
- Some general issues:
  - Latency (dependent on window size)
  - Beginning. How to initialize. Common solutions are to fill initial array with first value. Could refer to numpy documentation here

## Arduino filtering libraries

We have not had a chance to evaluate all of these libraries. So, use at your own risk. :)

- [Arduino Filters](https://github.com/tttapa/Arduino-Filters), [tttapa](https://github.com/tttapa)

## Resources

- [Signal Smoothing](https://www.mathworks.com/help/signal/ug/signal-smoothing.html), Mathworks.com
- [Sensor Filters for Coders](https://hackaday.com/2019/09/06/sensor-filters-for-coders/), Hackaday


<!-- 
USEFUL LINKS:
https://www.alanzucconi.com/2016/06/03/an-introduction-to-signal-smoothing/ 

Median filtering:
https://cdnsciencepub.com/doi/pdf/10.1139/v95-195

https://pyageng.mpastell.com/book/dsp.html
https://terpconnect.umd.edu/~toh/spectrum/Smoothing.html
-->