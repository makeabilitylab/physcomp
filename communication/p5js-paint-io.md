---
layout: default
title: L4&#58; Paint I/O Example
nav_order: 5
parent: Communication
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In the past few lessons, we've learned about [serial communication](serial-intro.md), [web serial](web-serial.md), and using serial to create [p5.js](https://p5js.org/) + Arduino applications ([first lesson](p5js-serial.md), [second lesson](p5js-serial-io.md)). In this lesson, we're going to build on these lessons to create a full end-to-end p5.js + Arduino application called PaintIO. PaintIO includes a custom "paintbrush" controller with OLED display that controls and bidirectionally communicates with a custom painting application in p5.js.

A painting app makes for a wonderfully fertile Physical Computing example and helps culminate our learning thus far because:
- There are many **different paint properties to control** such as paint brush size, speed, color, shape
- We can **explore** and **play** with different types of **sensors** and **hardware** **input** to control these properties
- Painting is an **openly creative** and **rich practice**—there are very few rules! And our custom hardware-based paintbrush" can directly influence *how* we paint and *what* we paint. From an interaction design perspective, this is exciting and fun!
- Finally, as we've already experienced, making a painting application in p5.js is **fairly easy** (and fun)! But how can we make it even more interesting with Arduino?

In lecture, we created this [simple painting application](https://editor.p5js.org/jonfroehlich/embed/MSGdVYUle). Below, you can mouse over the canvas to paint: the brush size is changed proportionally to mouse speed, the color is mapped to the mouse's x location, and you can click to switch between fill *vs.* outline. In this lesson, we will build on this example but with a custom "paintbrush" controller and different interaction mappings.

<iframe width="736" height="400" scrolling="no" src="https://editor.p5js.org/jonfroehlich/embed/MSGdVYUle"></iframe>
**Code.** A simple p5.js painting application in ~20 lines of code. You can view, edit, and play with it [here](https://editor.p5js.org/jonfroehlich/sketches/MSGdVYUle) via the p5.js online editor. In this lesson, we'll extend this example to include [web serial](web-serial.md) and a custom "paintbrush" controller.
{: .fs-1 }



<!-- ![](assets/images/PaintIO_Image1.png)

![](assets/images/PaintIO_Image2.png) -->

<!-- The paint brush size could be set by temperature, sound, etc. -->

![](assets/images/PaintIO_Image3-Accel.png)

![](assets/images/PaintIO_Image4-Accel2.png)

- Impressionist?
- Live video impressionist?