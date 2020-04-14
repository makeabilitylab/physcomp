---
layout: default
title: L2&#58; A simple piano
parent: Input
usemathjax: true
has_toc: true # (on by default)
comments: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

OK, we made it through our first digital input lesson. Now, let's do something fun with this newfound knowledge!

In this lesson, we are going to make a simple five-key piano with tactile buttons and a [piezo buzzer](https://www.adafruit.com/product/160). 

<iframe width="725" height="453" src="https://www.tinkercad.com/embed/dunwYl8U0Uq?editbtn=1" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

## Outline
- Show how to make a simple piano

## Materials

We are going to build input circuits using the microcontroller's own internal pull-up resistors, so our material list includes only four things:

| Breadboard | Arduino | Buttons | Piezo Buzzer |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Image of a Tactile Switch Buttons (12mm square, 6mm tall) ordered from Adafruit]({{ site.baseurl }}/assets/images/Button_12mmX12mm_Adafruit_40w.png) | ![Piezo buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_100h.png)
| Breadboard | Arduino Uno, Leonardo, or similar  | **5** [Tactile Buttons](https://www.adafruit.com/product/1119) | [Piezo Buzzer](https://www.mouser.com/ProductDetail/810-PS1240P02BT) |

## Making the circuit

![Tinkercad wiring diagram showing how to hook up the buttons and piezo speaker](assets/images/ArduinoUno_SimplePiano_TinkercadWiringDiagram.png)
You can play with this circuit and the underlying Arduino program on [Tinkercad](https://www.tinkercad.com/things/dunwYl8U0Uq-simple-piano)
{: .fs-1 }

## Making sound with Arduino

Sound waves are vibrations in air pressure. The speed of these vibrations (in cycles per second or Hertz) determines the pitch. The higher the vibration frequency, the higher the pitch.

If you're not familiar with sound waveforms and the differences between sinusoidal, triangle, and square waves—or even if you are—I recommend this short, interactive guide by Josh Comueau called "[Let's Learn About Waveforms.](https://pudding.cool/2018/02/waveforms/)" Make sure to have your sound on. The website defaults to **muted** volume, so press the letter 'm' to unmute once the website loads (or use the interactive sound volume widget). 

To play ear-pleasing, high-frequency waveforms with a microcontroller, you need a [digital-to-analog converter (DAC)](https://en.wikipedia.org/wiki/Digital-to-analog_converter). Some microcontrollers, like the Arduino Due, have DACs built in. The Arduino Uno and Leonardo microcontrollers do not.

Instead, these microcontrollers produce [square voltage waves](https://en.wikipedia.org/wiki/Square_wave). Indeed, when we use `analogWrite`, the Arduino produces a square wave of a fixed frequency—490Hz on most PWM pins but the Uno can produce double that (980Hz) on Pins 5 and 6 (see [docs](https://www.arduino.cc/en/Reference/AnalogWrite)). When you write an 8-bit value (0-255) to `analogWrite`, this changes the **duty cycle** of the waveform, not the **frequency**. And this fixed frequency waveform is not helpful for generating pitch-controllable tones. Well, it's fine if you just want to produce a tone at 490Hz or 980Hz but what about other frequencies?

Brett Hagman created the [tone](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) library to address this problem, which is part of the core Arduino library. While tone cannot generate sinusoidal waves like a DAC, it does produce square waves at specific frequencies, which can be used to actuate speakers and piezo buzzers. And,  

Using tone is easy. You simply call `tone(pin, frequency)` with the pin number and a frequency (the minimum frequency is 31Hz) and a square wave with the given frequency is generated on the pin. The library also offers a convenience method that enables you to specify how long to play a tone in milliseconds: `tone(pin, frequency, duration)`.

---

**ADVANCED INFO:**

Note that the tone call returns immediately—almost like an asynchronous call in a multi-threaded program. However, the Arduino Uno is a single-core chip with no multi-threading support. So, how does this work? Via timer interrupts.

The ATmega328 supports different types of interrupts, including interrupts to detect when a voltage value on a pin changes and time. The timer interrupts, for example, are used by the [millis()](https://www.arduino.cc/reference/en/language/functions/time/millis/) and [micros()](https://www.arduino.cc/reference/tr/language/functions/time/micros/) functions to precisely count. They are also used to generate square waves at specific frequencies.

The ATmega328 has three timers:
- Timer0: 8-bit timer used by millis() and micros().
- Timer1: 16-bit timer used by the [Servo](https://www.arduino.cc/en/reference/servo)() library
- Timer2: An-8 bit timer used by the [Tone()](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) library

If you want to take a (super) deep dive into how tone works, see the [source code here](https://github.com/bhagman/Tone/blob/master/Tone.cpp) and accompanying [notes](https://github.com/bhagman/Tone). If you want to learn more about interrupts on the Arduino, see [Nick Gammon's blog post](https://gammon.com.au/interrupts) and this [Adafruit Learn series](https://learn.adafruit.com/multi-tasking-the-arduino-part-2/timers).

---

### Making sound with piezo buzzers

There are two primary types of buzzers: magnetic and piezo. A magnetic buzzer operates similarly to a traditional speaker: a current driven through a coil of wire produces a magnetic field, which dynamically moves a magnetic disk resulting in a sound wave. A piezo buzzer is driven by voltage rather than current and is constructed out of piezoelectric material. This material mechanically deforms in response to applied voltages, which can be used to generate sounds.

There is some debate about whether you should use a small in-series resistor with a passive piezo buzzer ([link1](https://forum.arduino.cc/index.php?topic=16088.msg117474#msg117474), [link2](https://forum.arduino.cc/index.php?topic=522576.msg3564043#msg3564043)). I never have. I've always directly wired my piezo buzzer to the Arduino pins like the wiring diagram above (and [here](https://learn.adafruit.com/adafruit-arduino-lesson-10-making-sounds/playing-a-scale)).

### Playing multiple tones simultaneously

Can you use the [Tone()](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) library to generate chords?

No, the default [tone](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) library does not support generating square waves composed of multiple frequencies (in other words, chords). However, Brett Hagman, the author of the original Arduino tone function, wrote a more advanced tone library to generate multiple simultaneous tones:
https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki. This is also described in the [Arduino Cookbook (Section 9.3 Generating More than One Simultaneous Tone)](https://learning.oreilly.com/library/view/arduino-cookbook-2nd/9781449321185/ch09.html). Another discussion [here](https://forum.arduino.cc/index.php?topic=77447.0).

##

<iframe width="736" height="414" src="https://www.youtube.com/embed/FhfzZ4qpxZQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Exercises

- Try adding in LEDs for each key, which light up and then fade after each corresponding key press
- Try supporting chords—that is, multiple simultaneous tones—using [Brett Hagman's tone library](https://code.google.com/archive/p/rogue-code/wikis/ToneLibraryDocumentation.wiki)

## links

- [Lab 5: Tone Output Using An Arduino](https://itp.nyu.edu/physcomp/labs/labs-arduino-digital-and-analog/tone-output-using-an-arduino/)
- [Arduino sketch for high frequency precision sine wave tone sound synthesis](http://www.adrianfreed.com/content/arduino-sketch-high-frequency-precision-sine-wave-tone-sound-synthesis)