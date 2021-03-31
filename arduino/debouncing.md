---
layout: default
title: LX&#58; Debouncing
nav_order: 1
# parent: Input
# grand_parent: Intro to Arduino
has_toc: true # (on by default)
comments: true
usemathjax: true
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

![Animated gif from the YouTube channel "The Current Source" episode 37 called 'Contact and Bounce' which shows a slow motion video of two contact points oscillating back-and-forth](assets/movies/ContactBounce_TheCurrentSource-Optimized.gif)

Animation derived from Episide 37 ["Contact and Bounce"](https://youtu.be/jI-rC2FCKo4) of [The Current Source](https://www.youtube.com/channel/UCw0U6DtO0PHb3l37eKEAdSg) YouTube channel.
{: .fs-1 }



When you press a button or slide a switch, you are interacting with an electro-mechanical device. There is a **physical** mechanism moving to close a connection. When a switch/button first hits its contact point, it does not immediately stick. Instead, it rapidly "bounces" back and forth before eventually settling into a steady state. This "bouncing" action only takes a few milliseconds (rarely more) but can cause problems if you naively assume that every contact is a new button press. The solution is to "debounce" your switches, which can be done via pure hardware solutions (like XXX) or software solutions, which we'll address below. 

If you look at a tactile button being used with an oscilloscope, you can see the "bouncing" action—the voltage rapidly fluctuates between `LOW` (0V) and `HIGH`(5V) before finally settling into its steady state of `HIGH`.

![Bouncing action of a tactile button on an oscilloscope](assets/images/SwitchBounce_Oscilliscope_Ladyada.jpg)

Image from [ladyada.net](https://www.ladyada.net/learn/arduino/lesson5.html)
{: .fs-1 }

## Outline
- Describe problem and include snippets (or animated gifs) of videos we typically show in class
- Talk about potential solutions
- Show off the simplest: just check value wait for some amount of time and then check value again (using sleep)
- Show and talk about test code that shows why debouncing is important (maybe with video?). Could have top-down video of OLED display showing counting differences.
- Introduce class to do debouncing for us (and other things like deal with both pull-down and pull-up resistor configs)
  - Maybe talk about callback functions for handling buttonDown vs. buttonUp events? Or even like double click?
  - Some potential libraries to check out:
    -  [PushButton](https://github.com/kristianklein/PushButton) (looks quite nice)
    -  [SensorToButton](https://github.com/nathanRamaNoodles/SensorToButton) includes setting thresholds to interpret sensor states as "button" triggers
    -  [DebounchedSwitch](https://github.com/ThomasGravekamp/Arduino-Debounced-Switch) uses callback functions
 -  Consider also showing how to use a tilt switch? (just as another example digital input?)
 -  There are also hardware solutions using, for example, RC circuits (could include links?)

## Notes
- Check this: https://www.reddit.com/r/embedded/comments/gf74p8/reliable_user_input_with_unreliable_physical/