---
layout: default
title: L5&#58; Playing Tones
nav_order: 5
parent: Output
grand_parent: Intro to Arduino
usemathjax: true
has_toc: true # (on by default)
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

<!-- TODO: Record a video of a melody playing on a piezo buzzer (with an LED flashing in sync) and embed here as the opening hook -->

So far, every output we've produced has been visual—turning LEDs on, off, fading, and blinking. In this lesson, we'll add a completely new output modality: **sound!** Using a piezo buzzer and the Arduino [`tone()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/) function, we'll learn how to play individual notes, scales, and even melodies.

This lesson also gives us a chance to clarify an important conceptual distinction: the difference between `analogWrite` (which controls **duty cycle**) and `tone()` (which controls **frequency**). If that doesn't make sense yet, it will by the end of this lesson!

## Materials

| Breadboard | Arduino | Piezo Buzzer |
|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Piezo Buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_Fritzing.png) |
| Breadboard | Arduino Uno, Leonardo, or similar | Passive Piezo Buzzer |

<!-- TODO: Verify the piezo buzzer Fritzing image path exists; if not, add one to the shared assets -->

We'll be using a passive piezo buzzer such as the [TDK PS1240](https://www.adafruit.com/product/160) (~$1.50 from Adafruit). These buzzers work with both 3.3V and 5V signals, and their resonant frequency (loudest tone) is around 4 kHz—but they can produce a wide range of audible frequencies. Piezo buzzers are **non-polarized** (like resistors), so they can be connected in either orientation.

{: .note }
> Make sure you have a **passive** piezo buzzer, not an **active** one. An active buzzer has a built-in oscillator and plays a fixed tone when powered. A passive buzzer requires an external signal (which is what `tone()` provides) and can play different frequencies. If your buzzer makes a sound when you simply connect it to 5V and GND, it's an active buzzer.

## `analogWrite` vs. `tone()`: what's the difference?

Before we start making sounds, it's important to understand how `tone()` differs from `analogWrite`, which we learned about in the [previous lesson](led-fade.md). Both produce square waves, but they control **different properties** of the wave:

- **`analogWrite(pin, value)`** varies the **duty cycle** (the fraction of time the signal is HIGH) while keeping the frequency **fixed** (490 Hz or 980 Hz, depending on the pin). This is what we used to control LED brightness.

- **`tone(pin, frequency)`** varies the **frequency** (how many cycles per second) while keeping the duty cycle **fixed** at 50%. This is what controls pitch—the frequency of the sound wave determines whether you hear a low rumble or a high squeal.

<!-- TODO: Create a side-by-side diagram or animation showing: (1) analogWrite with varying duty cycles at fixed frequency, (2) tone() with varying frequencies at fixed 50% duty cycle -->

Here's a fun experiment to make this concrete: try connecting a piezo buzzer to Pin 3 and running `analogWrite(3, 127)`. You'll hear a steady buzz at the PWM frequency of that pin (~490 Hz on the Uno). Now try `tone(3, 440)`. You'll hear concert A—a completely different pitch. With `analogWrite`, you can make the buzz louder or softer (by changing the duty cycle), but you can't change the pitch. With `tone()`, you control the pitch directly.

## The `tone()` function

Arduino provides three functions for generating tones:

{% highlight cpp %}
tone(pin, frequency)              // play continuously until noTone() is called
tone(pin, frequency, duration)    // play for 'duration' milliseconds, then stop
noTone(pin)                       // stop playing
{% endhighlight cpp %}

A few important details:

- `tone()` can work on **any digital pin**—not just PWM pins. This is because it uses its own timer (Timer2 on AVR boards) rather than the PWM hardware timers.
- Only **one tone** can play at a time. If you call `tone()` on a different pin while a tone is already playing, the first tone will stop. This is a limitation of using a single hardware timer.
- Because `tone()` uses Timer2, it will **interfere with PWM output on Pins 3 and 11** on the Uno (since those pins also use Timer2). Keep this in mind if you're combining `tone()` with `analogWrite`.

{: .warning }
> On the Arduino Uno, `tone()` uses Timer2, which means **PWM on Pins 3 and 11 will not work** while a tone is playing. If you need both `tone()` and `analogWrite` simultaneously, use a PWM pin that is *not* on Timer2 (*e.g.,* Pins 5, 6, 9, or 10).

For the implementation details, see [Tone.cpp](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/Tone.cpp) in the [ArduinoCore-avr](https://github.com/arduino/ArduinoCore-avr) repository.

## Making the circuit

The circuit couldn't be simpler. Connect one leg of the piezo buzzer to a digital pin (we'll use **Pin 9** to avoid the Timer2 conflict with Pin 3) and the other leg to **GND**. No resistor is needed—the piezo buzzer draws very little current.

<!-- TODO: Create a wiring diagram showing a piezo buzzer connected between Pin 9 and GND on an Arduino Uno, with breadboard -->

![Wiring diagram showing a piezo buzzer connected between Pin 9 and GND on the Arduino](assets/images/Arduino_ToneCircuit_Pin9.png)

{: .note }
> We're using **Pin 9** rather than Pin 3 for the buzzer because `tone()` uses Timer2, which conflicts with PWM on Pins 3 and 11. By using Pin 9, we keep Pin 3 free for `analogWrite` in case we want to fade an LED at the same time (which we will, later in this lesson!).

## Playing individual tones

Let's start by playing a single tone. The following code plays concert A (440 Hz) for one second, pauses for half a second, then repeats:

{% highlight cpp %}
const int BUZZER_PIN = 9;

void setup() {
  // No setup needed for tone()!
  // Unlike analogWrite, we don't even need pinMode
}

void loop() {
  tone(BUZZER_PIN, 440);    // play concert A (440 Hz)
  delay(1000);               // for one second
  noTone(BUZZER_PIN);        // stop
  delay(500);                // pause for half a second
}
{% endhighlight cpp %}

Try changing the frequency: 262 is middle C, 523 is one octave higher (C5), and 1000 produces a high-pitched tone. What's the lowest frequency you can hear? The highest? (Most humans can hear roughly 20 Hz to 20 kHz, but this varies with age.)

<!-- TODO: Record a video of this simple tone example running on an Arduino with a piezo buzzer -->

## Playing a scale

Now let's play something more musical. The Arduino IDE ships with a helpful file called `pitches.h` that defines frequency constants for musical notes. You can find it in the [toneMelody example](https://github.com/arduino/arduino-examples/blob/main/examples/02.Digital/toneMelody/pitches.h) or access it via `File -> Examples -> 02.Digital -> toneMelody` in the IDE.

Here are a few of the note definitions from `pitches.h`:

{% highlight cpp %}
#define NOTE_C4  262   // Middle C
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440   // Concert A
#define NOTE_B4  494
#define NOTE_C5  523   // C one octave above middle C
{% endhighlight cpp %}

Using these constants, we can play a C major scale:

{% highlight cpp %}
#include "pitches.h"

const int BUZZER_PIN = 9;
const int NOTE_DURATION_MS = 400;
const int PAUSE_BETWEEN_NOTES_MS = 100;

// C major scale
int scale[] = {NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C5};
int numNotes = 8;

void setup() {
  // nothing to set up
}

void loop() {
  // Play each note in the scale
  for (int i = 0; i < numNotes; i++) {
    tone(BUZZER_PIN, scale[i], NOTE_DURATION_MS);
    delay(NOTE_DURATION_MS + PAUSE_BETWEEN_NOTES_MS);
  }

  delay(1000); // pause before repeating
}
{% endhighlight cpp %}

Notice that we use the `duration` parameter of `tone()` here, so we don't need to call `noTone()` manually—the tone stops automatically after `NOTE_DURATION_MS` milliseconds. The `delay` after each note is slightly longer than the tone duration to create a brief silence between notes.

<!-- TODO: Record a video of the C scale playing on a piezo buzzer -->

## Playing a melody

Now for the fun part—let's play a real melody! The approach is the same as the scale, but with different notes and varying durations. We store the melody as two arrays: one for the notes and one for the note durations.

The Arduino IDE includes a built-in example that plays a short melody. You can access it via `File -> Examples -> 02.Digital -> toneMelody`. Here's a simplified version of that approach:

{% highlight cpp %}
#include "pitches.h"

const int BUZZER_PIN = 9;

// A simple melody (Shave and a Haircut)
int melody[] = {
  NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4
};

// Note durations: 4 = quarter note, 8 = eighth note, etc.
int noteDurations[] = {
  4, 8, 8, 4, 4, 4, 4, 4
};

int numNotes = 8;

void setup() {
  for (int i = 0; i < numNotes; i++) {
    // Calculate note duration: 1000ms / duration value
    // So a quarter note = 1000/4 = 250ms, eighth note = 1000/8 = 125ms
    int duration = 1000 / noteDurations[i];
    tone(BUZZER_PIN, melody[i], duration);

    // Pause between notes (30% longer than the note duration works well)
    int pauseBetweenNotes = duration * 1.30;
    delay(pauseBetweenNotes);

    noTone(BUZZER_PIN);
  }
}

void loop() {
  // melody plays once in setup(), nothing to do here
}
{% endhighlight cpp %}

A note value of `0` in the melody array produces silence (since `tone(pin, 0)` doesn't generate a waveform), which acts as a rest.

<!-- TODO: Record a video of a melody playing. Consider recording a fun/recognizable melody like the Star Wars theme or Mario -->

{: .note }
> Want to play more complex melodies? Search online for "Arduino tone songs" or "Arduino buzzer melodies" — the community has transcribed hundreds of songs into Arduino `tone()` format. The [arduino-songs](https://github.com/robsoncouto/arduino-songs) repository by Robson Couto is a great collection. Just remember that the piezo buzzer can only play one note at a time (no chords!).

## Combining tone with an LED

Now let's bring everything together. Since we already know how to control LEDs from lessons [L1](led-on.md) through [L4](led-fade.md), we can add **visual feedback** synchronized with our audio output. This kind of **multimodal feedback**—combining sound and light—makes the output more engaging and is a common pattern in interactive projects.

### Flashing an LED with each note

The simplest approach is to turn an LED on while a note plays and off during the pause:

{% highlight cpp %}
#include "pitches.h"

const int BUZZER_PIN = 9;
const int LED_PIN = 5;  // Using Pin 5 (not Pin 3, which conflicts with tone's Timer2)
const int NOTE_DURATION_MS = 400;
const int PAUSE_MS = 100;

int scale[] = {NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C5};
int numNotes = 8;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  for (int i = 0; i < numNotes; i++) {
    digitalWrite(LED_PIN, HIGH);                    // LED on
    tone(BUZZER_PIN, scale[i], NOTE_DURATION_MS);   // play note
    delay(NOTE_DURATION_MS);

    digitalWrite(LED_PIN, LOW);                     // LED off during pause
    delay(PAUSE_MS);
  }

  delay(1000);
}
{% endhighlight cpp %}

<!-- TODO: Record a video of the scale playing with an LED flashing in sync -->

### Fading an LED with pitch

For a more sophisticated effect, we can use `analogWrite` to map the note frequency to LED brightness—higher notes produce a brighter LED:

{% highlight cpp %}
#include "pitches.h"

const int BUZZER_PIN = 9;
const int LED_PIN = 5;  // PWM pin (not on Timer2)
const int NOTE_DURATION_MS = 400;
const int PAUSE_MS = 100;

int scale[] = {NOTE_C4, NOTE_D4, NOTE_E4, NOTE_F4, NOTE_G4, NOTE_A4, NOTE_B4, NOTE_C5};
int numNotes = 8;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  for (int i = 0; i < numNotes; i++) {
    // Map note index to brightness (0-255)
    int brightness = map(i, 0, numNotes - 1, 30, 255);

    analogWrite(LED_PIN, brightness);                 // LED brightness matches pitch
    tone(BUZZER_PIN, scale[i], NOTE_DURATION_MS);     // play note
    delay(NOTE_DURATION_MS);

    analogWrite(LED_PIN, 0);                          // LED off during pause
    delay(PAUSE_MS);
  }

  delay(1000);
}
{% endhighlight cpp %}

As the scale ascends, the LED gets brighter. As it descends, the LED dims. This is a simple example of **data-driven multimodal output**—the same data (the note being played) drives two different output channels (sound and light).

<!-- TODO: Record a video of the scale playing with an LED fading in sync with pitch -->

## Exercises

Want to go further? Here are some challenges:

- **Compose your own melody.** Transcribe a simple tune you know into note and duration arrays. Start with something short like "Mary Had a Little Lamb" or "Twinkle Twinkle Little Star."
- **Hearing range test.** Write a program that sweeps from 20 Hz to 20,000 Hz. At what frequency can you no longer hear the tone? Compare with friends—does it vary?
- **`analogWrite` on the buzzer.** Try connecting the piezo buzzer to a PWM pin and using `analogWrite` instead of `tone()`. What do you hear? How does changing the `analogWrite` value (0-255) affect the sound? Why is it different from `tone()`?
- **Multiple LEDs.** Use an RGB LED (from [L7](rgb-led.md)) and map different notes to different colors. Can you create a visual "color organ" that changes color with each note?
- **Serial Plotter.** Use `Serial.println` to output the frequency of each note as it plays and visualize it on the [Serial Plotter](serial-print.md#visualizing-data-with-the-serial-plotter).

## A peek ahead

In the [Intro to Input](intro-input.md) lessons, you'll learn how to read buttons and build a [five-key button piano](piano.md) where each button plays a different note. The `tone()` function you learned here will be the foundation for that project!

## Next Lesson

In the [next lesson](led-blink2.md), we will learn about the difference between **current sources** and **current sinks** by building two LED circuits that behave in opposite ways when their pins are driven `HIGH` and `LOW`.

<span class="fs-6">
[Previous: Fading an LED](led-fade.md){: .btn .btn-outline }
[Next: Blinking Two LEDs](led-blink2.md){: .btn .btn-outline }
</span>