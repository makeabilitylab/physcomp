---
layout: default
title: L4&#58; Bidirectional Serial
nav_order: 4
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

OK, now we're really rolling! We learned about [serial communication](serial-intro.md), then how to use serial in our browsers ([web serial!](web-serial.md)), and then how to do this with [p5.js](p5js-serial.md). And we've already made some cool proof-of-concept demos.

Let's take this growing knowledge and momentum to create slightly more sophisticated programs. First, we'll cover the case of using p5.js to control something on our Arduino (`Computer → Arduino`) then we'll introduce bidirectional communication (`Computer ↔ Arduino`) where the computer + Arduino work together to create a holistic interactive experience.

## p5.js to Arduino

To begin, we'll build a simple p5.js demo app that draws and resizes a selected shape (a circle, triangle, or rectangle) based on the mouse's x position and sends this shape data as a text-encoded comma-separated string over web serial: (`"shapeType, shapeSize"`). On the Arduino side, we'll parse this string and draw the current shape and size on the OLED. Because the p5.js canvas size and the OLED screen size do not match, we'll use a normalized size value between [0,1] where 0 is the smallest size and 1 is the maximum size. Shape type is encoded as 0 for circle, 1 for square, and 2 for rectangle.

Here's a small sneak preview of what the final interactive experience will look like.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/DisplayShapeIn.ino-DisplayShapeOut-Trimmed-Optimized.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of the p5.js app DisplayShapeOut (live page, code) and Arduino sketch DisplayShapeIn.ino. The p5.js app sends a `shapeType` and a `shapeSize` as a comma-separated text string to Arduino via web serial. The DisplayShapeIn.ino program parses this text and draws a shape with the appropriate size to the OLED.
{: .fs-1 }

TODO: add links to DisplayShapeOut above

### Creating DisplayShapeOut in p5.js

As with our [previous lesson](p5js-serial.md), we'll begin with our begin with our [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate). If you're using VSCode, copy [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) and rename the folder to `DisplayShapeOut`. If you're using the p5.js online editor, simply open this project, [Serial Template](https://editor.p5js.org/jonfroehlich/sketches/vPfUvLze_C),and rename your project to `DisplayShapeOut`.

#### Overview of DisplayShapeOut functionality

Now, we have to write code that allows the user to:

- **Select a current shape (circle, triangle, or rectangle)**. We'll do this by enumerating through them in order via a mouse press action

- **Change the size of the shape**. We'll do this by tracking the mouse's x position and mapping it to size

- **Send shape data over serial.** Each time either the current shape or size changes, we need to send an update over serial. We'll do this using [our web serial class](web-serial.md#our-web-serial-class)



### Arduino
TODO: make circuit

<!-- Show simple Computer to Arduino output
 -->

<!-- - Show computer communicating with Arduino
- Show simple bidirectional communication
- Make a simple drawing app
  -- First, two potentiometers as input. Now, let's switch these to accel
  -- Then, we can control the size of the brush with FSR
  ---- When not pressed, show as a crosshair or something
  -- Control "clearing" the display with a button
  -- Control color with color sensor

Another example:
 - One example could be using p5.js sound input to make either a FFT or just magnitude OLED output -->