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
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Piezo Buzzer](assets/images/PiezoBuzzer_TDK_200w.jpg) |
| Breadboard | Arduino Uno, Leonardo, or similar | Passive Piezo Buzzer |

We'll be using a passive piezo buzzer such as the [TDK PS1240](https://www.mouser.com/ProductDetail/810-PS1240P02BT) (~$0.40 from Mouser). These buzzers work with both 3.3V and 5V signals, and their resonant frequency (loudest tone) is around 4 kHz—but they can produce a wide range of audible frequencies. Piezo buzzers are **non-polarized** (like resistors), so they can be connected in either orientation.

{: .note }
> Make sure you have a **passive** piezo buzzer, not an **active** one. An active buzzer has a built-in oscillator and plays a fixed tone when powered. A passive buzzer requires an external signal (which is what `tone()` provides) and can play different frequencies. If your buzzer makes a sound when you simply connect it to 5V and GND, it's an active buzzer.
> 
> Here's the [TDK PS1240 piezoelectronic buzzer datasheet](https://product.tdk.com/system/files/dam/doc/product/sw_piezo/sw_piezo/piezo-buzzer/catalog/piezoelectronic_buzzer_ps_en.pdf), which makes clear on the title page that it is "without an oscillator circuit".

## `analogWrite` vs. `tone()`: what's the difference?

Before we start making sounds, it's important to understand how `tone()` differs from `analogWrite`, which we learned about in the [previous lesson](led-fade.md). Both produce square waves, but they control **different properties** of the wave:

- **`analogWrite(pin, value)`** varies the **duty cycle** (the fraction of time the signal is HIGH) while keeping the frequency **fixed** (490 Hz or 980 Hz, depending on the pin). This is what we used to control LED brightness.

- **`tone(pin, frequency)`** varies the **frequency** (how many cycles per second) while keeping the duty cycle **fixed** at 50%. This is what controls pitch—the frequency of the sound wave determines whether you hear a low rumble or a high squeal.

<!-- TODO: Create a side-by-side diagram or animation showing: (1) analogWrite with varying duty cycles at fixed frequency, (2) tone() with varying frequencies at fixed 50% duty cycle -->

Here's a fun experiment to make this concrete: try connecting a piezo buzzer to a PWM pin and running `analogWrite(pin, 127)`. You'll hear a steady buzz at the PWM frequency of that pin (~490 Hz or ~980 Hz on the Uno, depending on the pin). Now try `tone(pin, 440)`. You'll hear concert A—a completely different pitch. With `analogWrite`, you can make the buzz louder or softer (by changing the duty cycle), but you can't change the pitch. With `tone()`, you control the pitch directly.

To really drive this home, we built a [Tinkercad Circuits example](https://www.tinkercad.com/) that sweeps through all `analogWrite` values (0–255) on a buzzer with an oscilloscope attached. Notice how the **duty cycle** changes (the waveform gets wider and narrower) but the **frequency stays the same**—the pitch of the buzz never changes!

<!-- TODO: Insert direct Tinkercad link to the PWM Sweep with Speaker and Oscilloscope circuit -->

![Tinkercad screenshot showing a PWM sweep circuit with a piezo buzzer and oscilloscope on an Arduino Uno](assets/images/Tinkercad_PWMSweepWithSpeakerAndOscilloscope.png)
**Figure.** A Tinkercad Circuits simulation demonstrating that `analogWrite` changes the duty cycle (visible on the oscilloscope) but not the frequency—so the buzzer pitch remains constant.
{: .fs-1 }

{% highlight cpp %}
// Uses a PWM sweep to demonstrate that analogWrite has a fixed frequency
// but different duty cycle; so the speaker pitch is always the same!
// This is why we need tone(), which has a fixed 50% duty cycle
// but allows you to control the frequency.

const int SPEAKER_OUTPUT_PIN = 5;
const int MAX_ANALOG_OUT = 255;

int _analogOutVal = 0;
int _analogOutStep = 20;
const int DELAY_BETWEEN_STEPS = 500;

void setup() {
  Serial.begin(9600);
  pinMode(SPEAKER_OUTPUT_PIN, OUTPUT);
}

void loop() {
  analogWrite(SPEAKER_OUTPUT_PIN, _analogOutVal);

  float dutyCycle = _analogOutVal / (float)MAX_ANALOG_OUT * 100;
  Serial.print("Duty cycle: ");
  Serial.print(dutyCycle, 0);
  Serial.println("%");

  // Sweep up and down
  _analogOutVal += _analogOutStep;
  _analogOutVal = constrain(_analogOutVal, 0, MAX_ANALOG_OUT);
  if (_analogOutVal <= 0 || _analogOutVal >= MAX_ANALOG_OUT) {
    _analogOutStep *= -1;
  }

  delay(DELAY_BETWEEN_STEPS);
}
{% endhighlight cpp %}

Compare this with `tone()`, where the duty cycle is always 50% but you control the frequency (pitch) directly. This is the fundamental distinction!

### Side-by-side comparison with a potentiometer

To make this comparison even more vivid, we built a Tinkercad circuit with **two piezo buzzers** driven by the same potentiometer but using different functions: one with `analogWrite` (varying duty cycle) and one with `tone()` (varying frequency). Each buzzer has its own oscilloscope so you can see the waveforms side by side.

<!-- TODO: Build this dual-buzzer Tinkercad circuit and insert the direct link here -->
<!-- TODO: Take a screenshot of the Tinkercad circuit showing both oscilloscopes side by side -->

![Tinkercad screenshot showing two buzzers with oscilloscopes — one driven by analogWrite and one by tone — controlled by a single potentiometer](assets/images/Tinkercad_AnalogWriteVsTone_SideBySide.png)
**Figure.** A Tinkercad Circuits simulation comparing `analogWrite` (left oscilloscope) and `tone()` (right oscilloscope) driven by the same potentiometer. Notice how the left waveform changes duty cycle but keeps the same frequency, while the right waveform changes frequency but keeps a constant 50% duty cycle.
{: .fs-1 }

> **Note:**
> This code uses `analogRead()` to read the [potentiometer dial](potentiometers.md). Don't worry if you don't understand how that works yet—we will cover it extensively in the upcoming [**Intro to Input**](intro-input.md) module! For now, just paste this into Tinkercad and turn the dial to watch the waveforms change.
{: .note }

{% highlight cpp %}
const int POT_PIN = A0;
const int BUZZER_ANALOG_PIN = 6;   // analogWrite (Timer0, no conflict with tone)
const int BUZZER_TONE_PIN = 9;     // tone (Timer2)

const int MIN_FREQ = 100;
const int MAX_FREQ = 1500;
const int MAX_ANALOG_IN = 1023;

void setup() {
  pinMode(BUZZER_ANALOG_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int potVal = analogRead(POT_PIN);

  // Buzzer 1: analogWrite — duty cycle changes, frequency stays fixed
  int dutyCycleVal = map(potVal, 0, MAX_ANALOG_IN, 0, 255);
  analogWrite(BUZZER_ANALOG_PIN, dutyCycleVal);

  // Buzzer 2: tone — frequency changes, duty cycle stays at 50%
  int freq = map(potVal, 0, MAX_ANALOG_IN, MIN_FREQ, MAX_FREQ);
  tone(BUZZER_TONE_PIN, freq);

  // Print both values to Serial Monitor / Plotter
  Serial.print("DutyCycle:");
  Serial.print(dutyCycleVal);
  Serial.print(",");
  Serial.print("Frequency:");
  Serial.println(freq);

  delay(50);
}
{% endhighlight cpp %}

As you turn the potentiometer, listen carefully: the `analogWrite` buzzer stays at the same pitch but gets louder and softer, while the `tone()` buzzer changes pitch from low to high. Watch the oscilloscopes: one waveform gets wider/narrower (duty cycle), the other gets faster/slower (frequency). This is the core distinction between PWM brightness control and tone frequency control!

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
- Because `tone()` relies on built-in hardware timers, it will **interfere with PWM output** on certain pins. On the Uno, it uses Timer2 (affecting Pins 3 and 11). On the Leonardo, it uses Timer3 (affecting Pins 5 and 13). Keep this in mind if you're combining `tone()` with `analogWrite`.

> **Hardware Conflict:**
> While a tone is playing, PWM `analogWrite()` functionality is disabled on specific pins depending on your board.
> * **Arduino Uno:** PWM is disabled on **Pins 3 and 11**.
> * **Arduino Leonardo:** PWM is disabled on **Pins 5 and 13**.
>
> If you need both `tone()` and `analogWrite` simultaneously, make sure to use PWM pins that don't conflict!
{: .warning }

For the implementation details, see [Tone.cpp](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/Tone.cpp) in the [ArduinoCore-avr](https://github.com/arduino/ArduinoCore-avr) repository.

## Making the circuit

The circuit couldn't be simpler. Connect one leg of the piezo buzzer to a digital pin (we'll use **Pin 9** to avoid the Timer2 conflict with Pin 3) and the other leg to **GND**. No resistor is needed—the piezo buzzer draws very little current.

<!-- TODO: Create a wiring diagram showing a piezo buzzer connected between Pin 9 and GND on an Arduino Uno, with breadboard -->

![Wiring diagram showing a piezo buzzer connected between Pin 9 and GND on the Arduino](assets/images/Arduino_ToneCircuit_Pin9.png)
**Figure.** A simple circuit connecting a passive piezo buzzer directly to Pin 9 and GND. No current-limiting resistor is required.
{: .fs-1 }

<!-- TODO: Build this circuit in Tinkercad Circuits and add a link here so students can try it in simulation -->

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
<!-- TODO: Create a Tinkercad Circuits version of this single-tone example and link it here -->

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
<!-- TODO: Create a Tinkercad Circuits version of the C scale example and embed or link it here -->

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
<!-- TODO: Create a Tinkercad Circuits version of the melody example and embed or link it here. Tinkercad's simulator lets students hear the tones without physical hardware! -->

{: .note }
> Want to play more complex melodies? Search online for "Arduino tone songs" or "Arduino buzzer melodies" — the community has transcribed hundreds of songs into Arduino `tone()` format. The [arduino-songs](https://github.com/robsoncouto/arduino-songs) repository by Robson Couto is a great collection. Just remember that the piezo buzzer can only play one note at a time (no chords!).

## Combining tone with an LED

Now let's bring everything together. Since we already know how to control LEDs from lessons [L1](led-on.md) through [L4](led-fade.md), we can add **visual feedback** synchronized with our audio output. This kind of **multimodal feedback**—combining sound and light—makes the output more engaging and is a common pattern in interactive projects.

### Flashing an LED with each note

The simplest approach is to turn an LED on while a note plays and off during the pause. Here's a simple two-tone siren that alternates an LED with each pitch change:

<!-- TODO: Insert direct Tinkercad link to the Simple Siren with External LED circuit -->

![Tinkercad screenshot showing a simple siren circuit with a piezo buzzer and LED on an Arduino Uno](assets/images/Tinkercad_SimpleSirenWithLED.png)
**Figure.** A Tinkercad Circuits simulation of a simple siren with an LED that toggles with each tone change. Try it yourself in [Tinkercad](https://www.tinkercad.com/)!
{: .fs-1 }

{% highlight cpp %}
const int BUZZER_PIN = 9;
const int LED_PIN = 2;
const int SOUND_DURATION_MS = 500;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // tone() generates a square wave of the specified frequency
  // (and 50% duty cycle) on a pin
  tone(BUZZER_PIN, 392);          // G4
  digitalWrite(LED_PIN, HIGH);     // LED on for high tone
  delay(SOUND_DURATION_MS);

  tone(BUZZER_PIN, 262);          // C4
  digitalWrite(LED_PIN, LOW);      // LED off for low tone
  delay(SOUND_DURATION_MS);
}
{% endhighlight cpp %}

Here's a version that plays a full scale with the LED flashing on each note:

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
<!-- TODO: Create a Tinkercad Circuits version of the tone+LED example — Tinkercad supports both piezo buzzers and LEDs, so students can see and hear the output in simulation -->

## Exercises

Want to go further? Here are some challenges:

- **Compose your own melody.** Transcribe a simple tune you know into note and duration arrays. Start with something short like "Mary Had a Little Lamb" or "Twinkle Twinkle Little Star."
- **Hearing range test.** Write a program that sweeps from 20 Hz to 20,000 Hz. At what frequency can you no longer hear the tone? Compare with friends—does it vary?
- **`analogWrite` on the buzzer.** Try connecting the piezo buzzer to a PWM pin and using `analogWrite` instead of `tone()`. What do you hear? How does changing the `analogWrite` value (0-255) affect the sound? Why is it different from `tone()`?
- **Multiple LEDs.** Use an RGB LED (from [L7](rgb-led.md)) and map different notes to different colors. Can you create a visual "color organ" that changes color with each note?
- **Serial Plotter.** Use `Serial.println` to output the frequency of each note as it plays and visualize it on the [Serial Plotter](serial-print.md#visualizing-data-with-the-serial-plotter).
- **Try it in Tinkercad.** If you don't have a physical piezo buzzer, you can build and test all of these examples in [Tinkercad Circuits](https://www.tinkercad.com/)—the simulator plays the buzzer tones through your computer speakers!

## Lesson Summary

In this lesson, you added a completely new sensory modality to your output toolkit. You learned:

- The critical difference between an **active buzzer** (plays a fixed pitch when powered) and a **passive buzzer** (requires a frequency signal to produce varying pitches).
- The conceptual difference between `analogWrite()` (which varies the duty cycle of a fixed-frequency wave) and `tone()` (which varies the frequency of a fixed 50% duty cycle wave).
- How to use `tone(pin, frequency)` and `noTone(pin)` to play notes, scales, and melodies.
- How to combine visual feedback (LEDs) and audio feedback (buzzers) to create engaging, multimodal outputs.
- How hardware timers limit which pins can use PWM while a tone is actively playing (Pins 3/11 on the Uno, Pins 5/13 on the Leonardo).

## A peek ahead

In the [Intro to Input](intro-input.md) lessons, you'll learn how to read buttons and build a [five-key button piano](piano.md) where each button plays a different note. The `tone()` function you learned here will be the foundation for that project!

## Next Lesson

In the [next lesson](led-blink2.md), we will learn about the difference between **current sources** and **current sinks** by building two LED circuits that behave in opposite ways when their pins are driven `HIGH` and `LOW`.

<span class="fs-6">
[Previous: Fading an LED](led-fade.md){: .btn .btn-outline }
[Next: Blinking Two LEDs](led-blink2.md){: .btn .btn-outline }
</span>