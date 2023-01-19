---
layout: default
title: L3&#58; Button Piano
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

In this lesson, we will make our first interactive CPX program in MakeCode—a simple Button Piano—which makes sounds when we press the CPX's built-in buttons.

<!-- Notes to self on lesson:
* Introduce notion of button
* Show how MakeCode supports four different button events: click, up, down, etc.
* If you have a block that doesn't have a notch up top, it means it will run an event when -->
<!-- Ref: https://youtu.be/NIKu0-Tgh2M (MakeCode Tutorial) -->

## Video Tutorial

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/wCSWP6PhNvY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

**Video.** Creating a button piano. Here's [the full code](https://makecode.com/_EyqF3g3xb6Cy) and a [link to the video on YouTube](https://youtu.be/wCSWP6PhNvY).
{: .fs-1 }

## Code

Here's the final [code](https://makecode.com/_EyqF3g3xb6Cy). Right-click on the code below and select "Open link in a new tab" to open it directly in the MakeCode editor.

<div style="position:relative;height:calc(300px + 5em);width:100%;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://makecode.adafruit.com/---codeembed#pub:_EsoWP4RwKXJK" allowfullscreen="allowfullscreen" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe></div>

## Blocks

We use the following MakeCode blocks in this example. See the [Adafruit MakeCode Reference](https://makecode.adafruit.com/reference) guide.

### Output

For output, we used **[Light](https://makecode.adafruit.com/reference/light)** and **[Music](https://makecode.adafruit.com/reference/music)** blocks, particularly:

- **[play tone](https://makecode.adafruit.com/reference/music/play-tone)** plays a tone on the speaker for a set amount of time (set the beat length with [tempo](https://makecode.adafruit.com/reference/music/tempo))
- **[set all pixel color](https://makecode.adafruit.com/reference/light/set-all)** sets all the NeoPixels to one color
- **[set volume](https://makecode.adafruit.com/reference/music/set-volume)** sets the volume of the output speaker

### Input

For **[Input blocks](https://makecode.adafruit.com/reference/input)**, we used:

- **[on button](https://makecode.adafruit.com/reference/input/button/on-event)** runs code segment when the button is clicked (or down, up, *etc.*)

### Event

To ensure that our volume is properly set, we initialize it to 255 (the highest value) when the program first starts using the [on start](https://makecode.adafruit.com/blocks/on-start) block

- **[on start](https://makecode.adafruit.com/blocks/on-start)** runs once and only once when the program starts

## Next Lesson

In the [next lesson](sensor-instrument.md), we'll create a light-responsive instrument!

<span class="fs-6">
[Previous: Button Piano](button-piano.md){: .btn .btn-outline }
[Next: Light-Responsive Instrument](sensor-instrument.md){: .btn .btn-outline }
</span>