---
layout: default
title: L3&#58; Ohm's Law
nav_order: 3
parent: Electronics
has_toc: false # on by default
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

In this lesson, we will learn about **Ohm's Law**, one of the most important empirical laws in electrical circuits that describes how *current*, *voltage*, and *resistance* relate together. While Ohm's Law is incredibly useful in analyzing and understanding how circuits work, like many "laws", it is not always obeyed (particularly for what are called "non-ohmic" devices like LEDs or other diodes).

## Ohm's Law

In 1827, after years of experimentation, German physicist Georg Simon Ohm published the "[Galvanic Circuit Investigated Mathematically](https://en.wikipedia.org/wiki/Ohm%27s_law#History)", which became the foundation for Ohm's Law. Ohm's Law states that the current ($$I$$ in amperes) in a conductor is directly proportional to the applied voltage ($$V$$ in volts) *vs.* the conductor's resistance ($$R$$ in ohms):

$$I = \frac{V}{R}$$

Thus, if we double the voltage in our circuit—for example, by stacking two batteries together in series—then we will also double the current. Ohm's Law has many implications for how we build and use circuits with microcontrollers, including voltage dividers and resistive sensors.

Importantly, you will see and use Ohm's Law in all three equivalent incarnations (which can be derived with simple algebra):

When you want to solve for **current** in your circuit, you use:
$$I = \frac{V}{R}$$

To solve for **voltage**, use:
$$V = I * R$$

To solve for **resistance**, use:
$$R = \frac{V}{I}$$ 

### Why $$I$$ and not $$C$$?

You might be asking, "If $$R$$ is the **r**esistance in ohms (Ω) and V is the **v**oltage in volts (V) then why is $$I$$ used to represent the **c**urrent in amperes (A) rather than $$C$$?" Two reasons: first, $$C$$ is already reserved for the SI unit of coloumbs (C), which is used in the very definition of amperes (recall that $$1\ A = 1\ C / s$$) and thus, could get confusing! Second, the ampere is named after [André-Marie Ampère](https://en.wikipedia.org/wiki/Andr%C3%A9-Marie_Amp%C3%A8re), considered the father of electromagnetism, who referred to amperage as the "**i**ntensity of current." So, current is $$I$$ and not $$C$$.

### Make sure to use base units

The most common gotcha in applying Ohm's Law—or analyzing in circuits in general—is messing up base units. In digital circuits, we often deal with kilohms (kΩ)—which is 1,000 ohms—milliamps (ma)—which is $$\frac{1}{1000}$$ (0.001) of an amp—or even microamps (μA)—which is one millionth ($$\frac{1}{1,000,000}$$ or 0.000001) of an amp—and so on. We need to convert these units to **base units** volts (V), ohms (Ω), and amps (A) to perform our analysis.

You should feel comfortable switching between units. For example, if a circuit contains a 2.2kΩ resistor with a 9V battery, to calculate the current do not mistakenly write $$I = \frac{9}{2.2}A$$ but, instead, $$I = \frac{9}{2200}A$$. The former would give you 4.1A (a large amperage and incorrect!) while the latter gives you the correct value of 0.0041A—which is 4.1mA.

#### Common SI prefixes

Below, we've written some common SI prefixes—most of which should be familiar to you from other measurement quantities. This chart is based on [Wolfram's SI prefixes](https://mathworld.wolfram.com/SIPrefixes.html) and Figure 2.2 in [Bartlett's book](https://learning.oreilly.com/library/view/electronics-for-beginners/9781484259795/html/488495_1_En_2_Chapter.xhtml).

| Conversion factor   | Scientific notation | Prefix | Abbreviation | English word | Examples |
|:--------------------|:--------------------|:-------|:-------------|:-------------|:---------|
| 1,000,000,000,000   | $$10^{12}$$         | tera   | T            | trillion     | terabyte, terameter |
| 1,000,000,000       | $$10^{9}$$          | giga   | G            | billion      | gigabyte, gigawatt |
| 1,000,000           | $$10^{6}$$          | mega   | M            | million      | megabyte, mega-awesome |
| 1,000               | $$10^{3}$$          | kilo   | k            | thousand     | kilobyte, kilometer, kilohm |
| 1                   | $$1$$               | base unit |           |              | gram, meter, amp, volt, ohm |
| 0.001               | $$10^{-3}$$         | milli  | m            | thousandth   | millimeter, milliamp, millivolt |
| 0.000001            | $$10^{-6}$$         | micro  | μ            | millionth    | micrometer, microamp |
| 0.000000001         | $$10^{-9}$$         | nano   | n            | billionth    | nanosecond, nanoamp |
| 0.000000000001      | $$10^{-9}$$         | nano   | n            | billionth    | nanosecond, nanoamp |
{: .fs-1 .condensed-table }

#### Converting units


## Notes
- Single loop one resistor
- Single loop two resistors in series
- Single loop two resistors in parallel

## Some gotchas

- Make sure all of your units are the same—convert to base metric units! In digital circuits, the current is often in milliamperes (milliamps or mA). Make sure to convert mA to A in your equation. So, $$3mA$$ would be $$3x10^{-3}A$$ or $$0.03A$$. 

## Notes

https://ccrma.stanford.edu/wiki/Introduction_to_Electronics_(condensed)