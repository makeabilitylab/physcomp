---
layout: default
title: Sound
parent: Intro to Arduino
nav_order: 3
has_toc: true # on by default
has_children: true
nav_exclude: true
usetocbot: true
search_exclude: true
---

Maybe rename this to making-sound

Notes:
- Because sound is so vast, I wonder if it should have it's own H1? Probably... Maybe similar to motors?
- Vi Hart's "What's up with noises: The science and mathematics of sound, frequency, and pitch" is a lovely [video](https://www.youtube.com/watch?v=i_0DXxNeaQ0) and recommended by Allen Downey in his SciPy2015 DSP talk ([link](https://youtu.be/0ALKGR0I5MA?t=96))

Sound Output:
I'm tempted to put in a tone lesson after LED fading because we are just too LED heavy here imo.
    - Putting it after LED fading (analogWrite) let's us bring up difference between changing PWM duty cycle (with analogWrite) and changing square wave freq (with tone)
    - Could demonstrate the above by hooking up a potentiometer that changes the PWM wave using a pot; then switch to changing freq with pot
    - Could also demonstrate by hooking up piezo two one pin that is 490 for PWM and another that is 980Hz
    - Show how inline pot can change sound volume
    - Some great ideas in our https://makeabilitylab.github.io/physcomp/esp32/tone.html lesson too

So, the outline is something like:

- Introduce what is sound and how to make it
- Start with simple program driving a square wave at 1kHz using digitalWrite
  - Then square wave at, say, 500Hz and listen to the difference
- Then talk about why we don't want to use digitalWrite for this (e.g., tone is built for this and offers better guarantees for timing due to interrupts)
- Introduce tone and what it does
- Show very simple example playing scale automatically (show with OLED for visual)
- Show using analogWrite to drive speaker vs. tone. Also show oscilliscope
- Show piezo and 8ohm speaker.
  - Should use inline resistor: https://forum.arduino.cc/t/connecting-an-8-ohm-speaker-to-arduino/111677 (100 ohm)
  - Check what current we are pulling on piezo with multimeter
- When you show the scale, show that tone returns immediately even with a specified duration as tone uses interrupts. This is useful for programming games (e.g., to fire a sound for a certain amount of time) and not be delayed
- Show how to play multiple tones?

Experiments
- With the piezo buzzer, I hooked up a multimeter in series and read 0 amp draw. I then hooked up an 8Ohm speaker with a 220 resistor (in series) and measured 10 mA draw. This was for both PwmWithSpeakersOLED and PwmScaleWithOLED

Some stretch/fun ideas:
- Make full octave keyboard with OLED and buttons. Could also make a game that shows you how to play something by telling you the next note?