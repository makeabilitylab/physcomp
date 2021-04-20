---
layout: default
title: L3&#58; Debouncing
nav_order: 3
parent: Input
grand_parent: Intro to Arduino
has_toc: true # (on by default)
comments: true
usemathjax: true
nav_exclude: false
usetocbot: true
search_exclude: false
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- ![Animated gif from the YouTube channel "The Current Source" episode 37 called 'Contact and Bounce' which shows a slow motion video of two contact points oscillating back-and-forth](assets/movies/ContactBounce_TheCurrentSource-Optimized.gif) -->

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/movies/DebouncingButton_CurrentSource_720p-Optimized-WithLabels.mp4" type="video/mp4" />
</video>
**Video**. A slow-motion video of a switch mechanically bouncing off its contacts. Buttons are mechanical devices. When a button is pressed or a contact switch moved, it creates a rapid oscillation of open- and closed-circuits before settling to its final state. In comparison to computation, mechanical motion is slow. Microcontrollers—even old, slow ones like the ATmega328—work so fast that they will read these rapid oscillations as `HIGH` and `LOW` input state changes. Video from Episode 37 ["Contact and Bounce"](https://youtu.be/jI-rC2FCKo4) of [The Current Source](https://www.youtube.com/channel/UCw0U6DtO0PHb3l37eKEAdSg) YouTube channel.
{: .fs-1 }

When you press a button or slide a switch, you are interacting with an electro-mechanical device. There is a **physical** mechanism moving to close a connection. When a switch/button first hits its contact point, it does not immediately stick. Instead, it rapidly "bounces" back and forth before eventually settling into a steady state. This "bouncing" action only takes a few milliseconds (rarely more) but can cause problems if you naively assume that every contact is a new button press.

Indeed, if you look at a button signal with an oscilloscope, you can see the "bouncing" action—the voltage rapidly fluctuates between `LOW` (0V) and `HIGH` (5V) before finally settling into its steady state of `HIGH`. If you counted each of these fluctuations as a button press, you would have very erroneous input!

![Bouncing action of a tactile button on an oscilloscope](assets/images/SwitchBounce_Oscilliscope_Ladyada.jpg)
**Figure.** Image from [ladyada.net](https://www.ladyada.net/learn/arduino/lesson5.html)
{: .fs-1 }

So, what can you do? The solution is to "debounce" your switches, which can be done via software or [pure hardware solutions](#pure-hardware-solutions), which we'll address below.

## Do switches bounce both when closing and opening?

Yes! Take a look at the bouncing graphs below from an oscilloscope reading of both a switch activation (open to close) and deactivation (close to open).

![](assets/images/ContactBounce_ActivationAndDeactivation_FromCurrentSource.png)
**Figure.** Switches can bounce during both closing and opening operations. Image derived from [The Current Source](https://youtu.be/jI-rC2FCKo4).
{: .fs-1 }

## How long do switches bounce?

So, how long do buttons bounce for? The answer: it varies significantly depending on the switch type.

Thankfully, we have [Jack Ganssle](http://www.ganssle.com/), an expert in embedded systems, to help answer this question. He painstakingly tested nearly twenty different switches ranging from cheap joystick and old mouse buttons to toggle and slide switches (see figure below). For each switch, he hooked up their signals to an oscilloscope, individually pressed them 300 times, and logged the min and max amount of bouncing for both *closing* and *opening* activations. The results of his research are documented [here](https://my.eng.utah.edu/~cs5780/debouncing.pdf).

![](assets/images/Ganssle_SwitchesTested.png)
**Figure.** Switches tested by Jack Ganssle in his "switch bouncing" experiences ([source](https://my.eng.utah.edu/~cs5780/debouncing.pdf)).
{: .fs-1 }

In sum, most switches exhibited an average of 1.5 milliseconds (ms) of bouncing; however, two outlier switches exceeded 6.2ms. The worst  was a red pushbutton, which had an *open* bounce of 157ms but only 20 microseconds (μs) on close. Interestingly, each switch seemed to have its own "bounce pattern" off rapid oscillations.

## Pure hardware solutions

Like with many microcontroller+circuit problems, there are multiple approaches including **pure** hardware solutions. Typically, as computer scientists, we often default to code, which we'll focus on in this lesson. But the hardware solution can be just as functionally good (though it does complicate the build and require more components). For example, in this Texas Instruments video, the instructor shows how to use a capacitor and a [Schmitt Trigger](https://en.wikipedia.org/wiki/Schmitt_trigger) to debounce a switch. The capacitor smooths out the the rising and falling edges of a button state transition and the Schmitt Trigger converts this smoothed signal back into digital output.

<iframe width="736" height="414" src="https://www.youtube.com/embed/e1-kc04jSE4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
**Video.** This [Texas Instruments video](https://youtu.be/e1-kc04jSE4) shows how to use a capacitor and a Schmitt Trigger to debounce a switch.
{: .fs-1 }

## Software solution

The key to our software solution is to first detect a switch state change (`state1`), then wait for a set amount of time (a "debouncing window"), then check the switch state again (`state2`). If the initial state and the post-debouncing window state match (*i.e.,* `state1 == state2`), then we have transitioned from one steady state to another. See graph below.

![](assets/images/DebounceSwitchGraph_DebouncingWindow.png)
**Figure.** Both graphs are showing the same open-to-close switch state change but with different annotations. The graph on the left shows the first steady state (`LOW`), the transition and bouncing contact state, and the second steady state (`HIGH`). The graph on the right shows a depiction of our "debouncing window" solution. Image made in PowerPoint.
{: .fs-1 }

### What should our debounce window be?

So, how long should you set your debounce window? This depends on the switch type and on the expected use of your switch. Is it an occasionally-used toggle switch, a keyboard (a fast typist can generate ~10 characters/second), or a joystick button (button mashing anyone!?)? 

As a second consideration, what's a human perceptible amount of lag? Wikipedia suggests that "input lag"—from controller input to display response—of ~200ms are perceptible and distracting and that "quick twitch" games like [first-person shooters](https://en.wikipedia.org/wiki/First-person_shooter) and [fighting games](https://en.wikipedia.org/wiki/Fighting_game) have response times of 67ms. Similarly, [Ganssle suggests](https://my.eng.utah.edu/~cs5780/debouncing.pdf) that, in his tests, a 100ms delay is noticeable but 50ms seems instantaneous. 

### Solution 1: most basic using delays

TODO: insert circuit diagram.

For our first and most basic solution, we will read the button state, wait a given time period (the "debouncing window"), and then read the button state again.

{% highlight C %}

const int BUTTON_INPUT_PIN = 2;
const int LED_OUTPUT_PIN = 3;
const int DEBOUNCE_WINDOW = 40; //in milliseconds

int _savedButtonVal = LOW; //starts low because using pull-down resistor

void setup() {
  pinMode(BUTTON_INPUT_PIN, INPUT);
  pinMode(LED_OUTPUT_PIN, OUTPUT);
}

void loop() {

  // Read the button value. We assume a pull-down resistor button configuration so
  // the button will be HIGH when pressed and LOW when not pressed
  int buttonVal = digitalRead(BUTTON_INPUT_PIN);

  // Wait to check the button state again
  delay(DEBOUNCE_WINDOW);

  // read the button value again
  int buttonVal2 = digitalRead(BUTTON_INPUT_PIN);

  // If buttonVal and buttonVal2 are the same, then we are in steady state
  // If this stead state value does not match our _lastButtonVal, then
  // a transition has occurred and we should save the new buttonVal
  if(buttonVal == buttonVal2 && _savedButtonVal != buttonVal){
    _savedButtonVal = buttonVal;
  }

  // Write out HIGH or LOW
  digitalWrite(LED_OUTPUT_PIN, _savedButtonVal);
}
{% endhighlight C %}

<!-- From: https://github.com/makeabilitylab/arduino/tree/fd5a1403148cd98b7dcfa3a3be2ab64e0d231b76/RedBearDuo/RedBearDuoReadButtonSimpleDebouncing -->

## Solution 2


<!-- ## Solution 3
Uses interrupts:

https://github.com/makeabilitylab/arduino/blob/fd5a1403148cd98b7dcfa3a3be2ab64e0d231b76/RedBearDuo/RedBearDuoButtonInterruptWithDebouncing/RedBearDuoButtonInterruptWithDebouncing.ino -->

## What happens if we don't debounce?

TODO: show video of Arduino code with and without debouncing

<iframe width="736" height="414" src="https://www.youtube.com/embed/tw-pndJQFqw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Outline
- [Done] Describe problem and include snippets (or animated gifs) of videos we typically show in class
- Talk about potential solutions
- Show off the simplest: just check value wait for some amount of time and then check value again (using sleep)
- [Done] Show and talk about test code that shows why debouncing is important (maybe with video?). Could have top-down video of OLED display showing counting differences. Update: had video with serial monitor.
- Introduce class to do debouncing for us (and other things like deal with both pull-down and pull-up resistor configs)
  - Maybe talk about callback functions for handling buttonDown vs. buttonUp events? Or even like double click?
  - Some potential libraries to check out:
    -  [PushButton](https://github.com/kristianklein/PushButton) (looks quite nice)
    -  [SensorToButton](https://github.com/nathanRamaNoodles/SensorToButton) includes setting thresholds to interpret sensor states as "button" triggers
    -  [DebounchedSwitch](https://github.com/ThomasGravekamp/Arduino-Debounced-Switch) uses callback functions
 -  Consider also showing how to use a tilt switch? (just as another example digital input?)
 -  [Done] There are also hardware solutions using, for example, RC circuits (could include links?)



## Notes
- Check this: https://www.reddit.com/r/embedded/comments/gf74p8/reliable_user_input_with_unreliable_physical/

## Resources

- [Chapter 13: Microcontrollers - Debouncing](https://learning.oreilly.com/library/view/practical-electronics-for/9781259587559/xhtml/24_Chapter_13.xhtml), Scherz and Monk, Practical Electronics for Inventors