---
layout: default
title: L2&#58; Programming the CPX with MakeCode
parent: Circuit Express (CPX)
has_toc: true # (on by default)
comments: true
nav_exclude: true
usetocbot: true
search_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

Continued brainstorming:

[Done] Lesson 3: discrete piano
[Done] Lesson 4: basic analog sensor w console logging and theremin [did this]
[Done] Lesson 4 or 5: Maybe here, do more sensors—I did add more to Lesson 4 just now

Lesson 5: capacitive touch + touch piano
    - Have one capacitive touch. Use space bar. Have them play flappy bird.
    - Then show more complex example. Can share our Capacitive Touch Playground
    - Maybe introduce function here?

Lesson 6: CPX as a keyboard/mouse

Lesson 7: external sensors
    - First use a potentiometer and use graph to show value along with console log
    - Then maybe a slide potentiometer
    - Then a pressure sensor
    - Then maybe a flex sensor?
Lesson 8: lofi sensors
    - Lo-fi resistive sensors
Lesson 9: neopixel

other things:
- sound as input / loud sound
- do we want to introduce variables? If so, we could do the hue sweep one https://makecode.com/_WsCHuiTjeUoD
- how about infrared? if we do this, i want to do remote control servo motor
- ultrasonic sensors
  - Example: https://youtu.be/NIKu0-Tgh2M?t=3076

----
Lesson 1: Our first MakeCode program
In this lesson, we will learn about programming the CPX with MakeCode, including:

- MakeCode interface overview
    - https://makecode.adafruit.com/courses/maker/general/coding/environment
    - https://makecode.adafruit.com/courses/maker/general/load-manage-programs
- Building our first program: blinky
- Using the simulator
- Saving programs and sharing programs
- Playing with Neopixels
- Building first program with startup sound and then forever loop
- Maybe have full video recording of myself doing this and post to YouTube?

----
Lesson 2: More lights and console logging
- CrossFade example with console logging: https://makecode.com/_WsCHuiTjeUoD
- Introduce switch to help with debugging or not

-----
Lesson 3: Interaction, Sound, and Console Logging

To start, let’s make a simple piano keyboard that lights up when we click on buttons

https://makecode.com/_1pPDhAFx55u3

- Show our paper keyboard? Similar to: https://makecode.adafruit.com/courses/maker/projects/music-maker

-----
Lesson 3: Sensors?

- Example project: magic wand takes accel + speaker: https://makecode.adafruit.com/projects/magic-wand
- https://learn.adafruit.com/sensors-in-makecode

------
Lesson 4: Touch input

- https://makecode.adafruit.com/learnsystem/pins-tutorial/touch-input

-----
Lesson 5: Keyboard and Mouse

- Show examples

- What could we use as mouse? Button presses? Need analog input. Could do potentiometer (but maybe that's Week 4?)

-------
Neopixel
- Each Neopixel is made up of tiny RGB LEDs: https://youtu.be/Bo0cM2qmuAE?t=137
- We can use the MakeCode direct color to select specific colors
- Or loop through our own colors
- Talk about Neopixel strips: https://youtu.be/Bo0cM2qmuAE?t=238 at very end
- Maybe talk about photon and pen down, etc. (see https://youtu.be/NIKu0-Tgh2M?t=1338)

OTHER THINGS
- What about haptics?
- What about powering your projects: https://makecode.adafruit.com/courses/maker/general/maker-tools-techniques
- Projects: https://makecode.adafruit.com/projects/
- What about infrared communication?

----

Other things:
https://makecode.adafruit.com/behind-the-makecode-hardware

----
Accelerometer (Behind MakeCode Series): https://www.youtube.com/watch?v=byngcwjO51U. 
- Lovely explanation of the accel sensor here: https://youtu.be/2HzNKz-QlV0?t=65 (Shawn Hymel Behind the MakeCode Hardware)
- There is also an event block that uses Accel: On shake, on Tilt up, etc.
- Tilt piano: https://youtu.be/NIKu0-Tgh2M?t=780 (MakeCode Derek Banas)

----
Servo motor (Behind MakeCode Series): https://www.youtube.com/watch?v=okxooamdAP4 
- Neat inside look at servo: https://youtu.be/okxooamdAP4?t=183 (and just before this, shows how a DC motor works)
- Servo with MakeCode demo: https://youtu.be/cofElsolYk4
- Cool marble run with servo motors: https://makecode.adafruit.com/courses/maker/projects/marble-run
- https://makecode.adafruit.com/courses/maker/projects/servo-box
- Servo in MakeCode tutorial by Derek Banas: https://youtu.be/NIKu0-Tgh2M?t=1784

Buttons (Behind MakeCode Series): https://www.youtube.com/watch?v=t_Qujjd_38o
- Neat cutaway of a button: https://youtu.be/t_Qujjd_38o?t=217

Speaker (Behind MakeCode Series): https://youtu.be/JjJ-KGwKh_4
-- Nice explanation of a speaker here: https://youtu.be/JjJ-KGwKh_4
-- Creates Twinkle Twinkle Little Star here: https://youtu.be/JjJ-KGwKh_4?t=257

Using light sensor to make a trip wire (Behind MakeCode Series): https://youtu.be/9LrWQ68lO20?t=157