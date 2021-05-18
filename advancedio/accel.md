---
layout: default
title: L2&#58; Accelerometers
nav_order: 2
parent: Input
grand_parent: Advanced I/O
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
nav_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

## Outline

- Go over accels and how they work. MEMs video?
  - Great one from engineerguy (who else!): https://youtu.be/KZVgKu6v808?t=52
- Talk about ADXL335 (or ADXL345?) vs. LIS3DH. Maybe show example demos of both?

- Leveling table for calibration:
    - http://www.gcdataconcepts.com/calibration.html

### Activity possibilities

- Have board go into deep sleep and wake up when movement detected.

## Resources

- [Adafruit LIS3DH Triple-Axis Accelerometer Breakout](https://learn.adafruit.com/adafruit-lis3dh-triple-axis-accelerometer-breakout), Adafruit Tutorial

- [John Edgar Park's LIS3DH Pick of the Week](https://youtu.be/l1T3C-AZV0E), Adafruit YouTube Channel

- [LIS3DH Datasheet](https://www.st.com/resource/en/datasheet/cd00274221.pdf), STMicroelectronics

### How accelerometers work

- [How an accelerometer works](https://youtu.be/i2U49usFo10), Afrotechmods on YouTube

- [Accelerometers: How a Smartphone Knows Up from Down](https://youtu.be/KZVgKu6v808), Engineer Guy on YouTube


## Interesting links:

<!-- - Helpful vector2D implementation built for arduino: https://github.com/yazug/Arduino/blob/master/libraries/AP_Math/vector2.h 

- Ha, oh amazing, someone tried to implement the PVector class by Shiffman in Arduino: https://github.com/stuthedew/AVector. Does not look very feature complete. And should have used templates I think
-->