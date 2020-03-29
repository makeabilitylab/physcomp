---
layout: default
title: L1&#58; Using buttons
nav_order: 1
parent: Input
has_toc: true # (on by default)
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

This is the first lesson in the [**Intro to Arduino Input**](intro-input.md) lesson series, which builds on knowledge gained in the [**Intro to Arduino Output**](intro-output.md) series, so please complete that first!

In this lesson, we'll finally get to build something interactive: turning on an LED with a button. We'll cover buttons (aka momentary switches), how to use digital input with the [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) function, and pull-up and pull-down resistors.

TODO: show animation from Tinkercad-based circuit working and current flow

## Tinkercad circuits
- https://www.tinkercad.com/things/9skzhTypQRh-button-with-breadboard/
- https://www.tinkercad.com/things/hlkxqsvSz2E-button-no-breadboard

## Materials

For (most of) this lesson, we're only going to use the Arduino's built-in LED (`LED_BUILTIN`) to turn on and off with a button press. So, we'll need:

| Arduino | Button | Resistor |
|:-----:|:-----:|:-----:|
| ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![Image of a Tactile Switch Buttons (12mm square, 6mm tall) ordered from Adafruit]({{ site.baseurl }}/assets/images/Button_12mmX12mm_Adafruit_100w.png) | ![10 KOhm Resistor]({{ site.baseurl }}/assets/images/Resistor10K_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | Button (aka momentary switch). We'll be using [these 12x12mm "Tactile Switch Buttons"](https://www.adafruit.com/product/1119) from Adafruit. | 10KΩ Resistor |

## Digital I/O refresher

Recall that the Arduino Uno and Leonardo have 14 digital I/O pins that can be used either for input with [`digitalRead()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) or output with [`digitalWrite()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/), respectively. In our [**Intro to Arduino Output**](intro-output.md) lesson series, we covered output. Here, we'll cover input but the same 14 digital I/O pins apply:

![Close-up image of the 14 digital I/O pins on the Arduino Uno](assets/images/ArduinoUno_CloseUp_DigitalIOPins.png)

As previously noted, you can control any of these 14 digital I/O pins with three functions:

1. [`pinMode(int pin, int mode)`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) configures a specified pin as either an `INPUT` or `OUTPUT`. For our buttons, we'll be using `INPUT`.
2. [`digitalRead(int pin)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) reads digital input from the specified pin, either `HIGH` or `LOW`.
3. [`digitalWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/) writes digital output to the specified pin, either `HIGH` or `LOW`.

### Digital input

Digital input is any input that can be considered either **on** (`HIGH` or 5V) or **off** (`LOW` or 0V). For example, a push button, a reed switch, or a binary tilt sensor.

![Picture showing a variety of digital inputs, including tactile buttons, arcade buttons, SMD push buttons, slide switches, rocker switches, reed switches, and tilt switches](assets/images/DigitalInput_ExampleGallery.png)
Prices and pictures are from Sparkfun.com, Jan 2020; parts can be cheaper in bulk from suppliers like [Digi-Key](https://www.digikey.com/) or [Mouser Electronics](https://www.mouser.com/).
{: .fs-1 }

## Pull-down and pull-up resistors

To use a digital input with a microcontroller—say, a push button, a slider switch, or a tilt switch—you need either a pull-down or pull-up resistor. Why? See below (right-click on the image and select 'Open Image in New Tab' for an enlarged version).

![Visual walkthrough of why a pull-down resistor setup of a button circuit is necessary](assets/images/Arduino_Button_PullDownResistor_Walkthrough.png)
In this example, the button is hooked up to digital I/O pin 12 but any I/O pin will work.
{: .fs-1 }

<!-- TODO: add in video of floating pin and effect. Use external resistor + LED. Have current video so reshooting could be low priority -->

While a **pull-down resistor** configuration biases the input pin to GND when a switch or button is in the open state, a **pull-up resistor** configuration does the opposite: in an open state, the microcontroller input pin reads `HIGH` (5V). When the switch is closed, the microcontroller reads `LOW` (0V). See figure below.

![Difference between a pull-down vs. pull-up resistor](assets/images/Arduino_Button_PullDownVsPullUpResistor.png)

Finally, many microcontrollers include an internal pull-up resistor that can be activated with software. On the Arduino, we can configure an input pin to use its internal pull-up resistor with: `pinMode(<pin>, INPUT_PULLUP);`. This eliminates the need for any external resistors (thus simplifying your circuit).

![Difference between a pull-down, pull-up, and internal pull-up resistor](assets/images/Arduino_Button_InternalPullUpResistor.png)

<!-- TODO: fix syntax mistake in figure; have its instead of it's in the diagram above -->
<!-- TODO: maybe also add a switch after the internal pull-up to show that it's a software controlled switch like this: https://electronics.stackexchange.com/q/185953-->

We'll go through each of these circuit configurations below. But first, a bit more about pull-down and pull-up resistors.

### What value should I use for my pull-down or pull-up resistors?

The official [Arduino docs](https://www.arduino.cc/en/Tutorial/DigitalPins) recommend a 10kΩ pull-down or pull-up resistor for digital input pins. On the ATmega microcontrollers (those on the Arduino Uno and Leonardo), the internal pull-up resistor is 20kΩ. On the Arduino Due, the internal pull-up is between  50kΩ and 150kΩ.

TODO: talk about tradeoffs in setting pull-up and pull-down resistor values

### Some microcontrollers have built-in pull-up and pull-down resistors

Some Arduino boards use microcontrollers that have both pull-up and pull-down resistors. The popular ESP32 chip, for example, used in the [Adafruit Huzzah32](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/overview) has built-in pull-up and pull-down resistors on all GPIO pins except for GPIO34-GPIO39 (see [link](https://github.com/espressif/arduino-esp32/issues/316)). These can be enabled with either `pinMode(<pin>, INPUT_PULLUP);` or `pinMode(<pin>, INPUT_PULLDOWN);`

### Want to dive deeper?

To learn more about pull-up and pull-down resistors, watch this fantastic video by NYU ITP's Jeff Feddersen:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/241209240?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

See also:
- [Sparkfun's tutorial on Pull-up Resistors](https://learn.sparkfun.com/tutorials/pull-up-resistors/all)
- [Arduino's official `INPUT_PULLUP` tutorial](https://www.arduino.cc/en/Tutorial/InputPullupSerial)
- [Electronics Tutorials' Pull-up Resistors](https://www.electronics-tutorials.ws/logic/pull-up-resistor.html)

## Tactile button (momentary switch)

- The button is funky: why four legs? what's connected. Maybe show multimeter?

## Pull-down resistor configuration

![Wiring diagram and schematic for a button with a pull-down resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_PullDownResistor_WiringDiagram.png)

As with any circuit, there are many ways to wire up a button with a pull-down resistor configuration. Here are some examples—all are functionally equivalent. I tend to use the wiring shown on the far left, which is the same one shown above.

![Five separate wiring diagrams of a pull-down resistor configuration with a button wired to Pin 2 on the Arduino Uno](assets/images/ArduinoUno_Button_PullDownResistor_WiringDiagramGallery.png)

## Pull-up resistor configuration

![Wiring diagram and schematic for a button with a pull-up resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_PullUpResistor_WiringDiagram.png)

## Internal pull-up resistor configuration

![Wiring diagram and schematic for a button with an internal pull-up resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_InternalPullUpResistor_WiringDiagram.png)

## Putting it all together

## Outline
- The button is funky: why four legs? what's connected. Maybe show multimeter?
- We are going to cover three separate circuit designs: pull-down resistor, pull-up resistor, internal pull-up resistor
- Why do we need these resistors. Explain.
- Make pull-down circuit + code
- Make pull-up circuit + code
- Show using internal pull-up + code

## Notes:
Things to remember:
- [done] include Jeff Feddersen video of pull-up and pull-down
- ITP has some good content on switches that we should link to
- show calculation about pull-down and pull-up resistors (and the fact that they should be high to not waste current)
- Talk about super high impedance on input pin?

