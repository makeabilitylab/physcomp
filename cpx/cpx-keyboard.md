---
layout: default
title: L6&#58; CPX as a Keyboard
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

In Lesson 6 of our CPX series, we will learn how to use the CPX as a programmable keyboard. We'll begin by making the A and B buttons into keyboard presses and then create increasingly fun and interesting keyboards, including a media controller keyboard (Lesson 6.2) and an accelerometer-based keyboard (Lesson 6.3).

{: .note }
Note: there is some overlapping content with [Lesson 5.3: Making a Capacitive Keyboard](capacitive-touch.md#lesson-53-making-a-capacitive-touch-keyboard) but we wanted to start from the beginning here and grow outward! So, you should be able to complete these lessons even if you have not completed Lesson 5.3.

## Lesson 6.1: Making a Programmable Keyboard

In this lesson, we will show how to use the CPX as a programmable keyboard

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/2ehFfhHLcNQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 6.1 Code

Here's a link to the MakeCode we wrote in this lesson:

- [Button A as a spacebar](https://makecode.com/_R01JeR0doWvL)
- [Left/right arrow + spacebar](https://makecode.com/_UkEUewXxhH07)
- [Pressings keys down and up](https://makecode.com/_02tfJu5xp785)

## Lesson 6.2: The CPX as a Media Player Controller

In this lesson, we will show how to use the media key functionality to control Spotify and YouTube.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/0Uwvc497r2w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 6.2 Code

Here's the [MakeCode](https://makecode.com/_Ks7Ftj2jqHHW) we created during this lesson, which shows how to use media key presses to control Spotify and YouTube.

## Lesson 6.3: Accelerometer Keyboard

In this lesson, we show how to translate the accelerometer signal to key presses.

<div class="iframe-container">
  <iframe width="100%" src="https://www.youtube.com/embed/0Uwvc497r2w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### Lesson 6.3 Code

- [Basic tilt program](https://makecode.com/_WJHbKkdeqEcx) 
- [Real-time tilt tester](https://makecode.com/_VCPKbR341UyA)
- [Tilt keyboard](https://makecode.com/_M3m2PA76F6TL)
- [Improved tilt keyboard](https://makecode.com/_atTA20HkMV3j)  

As promised, here's a different take ([code link](https://makecode.com/_e5kEupV4594H)) on the real-time tilt keyboard that we previously created but is different from the solution we came up with during the video.

<!-- Ideas:
- Start very simple. Hit button 'A' to send "I love making!" or "I love prototyping!"

- Simple game controller. Send 'space bar'. Better to use type here.
  - https://freeflappybird.org/

- Then build simple controller and play game by sending left and right keyboard commands and spacebar?
  - https://freegalaga.com/ <- uses left, right spacebar
  - https://www.retrogames.cc/arcade-games/galaga-namco.html
  - https://tetris.com/play-tetris
  
  - Example code: https://makecode.com/_UkEUewXxhH07

- But then improve to show key down and key up so it is more continuous
  - https://freepong.org/
  - https://www.retrogames.cc/arcade-games/galaga-namco.html
  - Example code: https://makecode.com/_02tfJu5xp785

- Show Spotify media commands: next song, previous song, spacebar for play/pause
  - Shake to go to the next song
  - https://open.spotify.com/playlist/5qTSCxoWreaB9ZTX5LFXSB#login

Sensors and keyboard commands
- Then show how we could use the accelerometer to play this game
  - Tilt left, tilt right, spacebar
  - https://freegalaga.com/
  - https://www.retrogames.cc/arcade-games/galaga-namco.html
  - Example code: https://makecode.com/_PCHaak0Ki2cf
  - More complex: https://makecode.com/_e5kEupV4594H

- Then show how to use a sensor to send commands like "loudness" for clapping
  - Maybe show that threshold again
  - Clappy Bird
  - Hmm, when I try to use loudness, I get a CPX error :( -->

## Project Examples

All project examples below provide tutorials with example MakeCode code.

- [Mouse Painter](https://learn.adafruit.com/mouse-painter-emulate-mice-with-makecode/overview), John Park
- [Make it a Mouse](https://learn.adafruit.com/make-it-a-mouse), Anne Barela

## Next Lesson

In the [next lesson](cpx-mouse.md), we'll extend our work to build a custom interactive mouse.

<span class="fs-6">
[Previous: Capacitive Sensing](capacitive-touch.md){: .btn .btn-outline }
[Next: CPX as a Mouse](cpx-mouse.md){: .btn .btn-outline }
</span>