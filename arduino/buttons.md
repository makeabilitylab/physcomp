---
layout: default
title: L1&#58; Using buttons
nav_order: 1
parent: Input
has_toc: true # (on by default)
comments: true
usemathjax: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

This is the first lesson in the [**Intro to Arduino Input**](intro-input.md) lesson series, which builds on knowledge gained in the [**Intro to Arduino Output**](intro-output.md) series, so please complete that first!

In this lesson, we'll finally get to build something interactive: turning on an LED with a push button. We'll cover buttons (aka momentary switches), how to use digital input with the [`digitalRead`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) function, and pull-up and pull-down resistors.

Switches themselves are conceptually easy to understand—they are either "closed" or "open". We use switches everyday when we turn on and off our light circuits in our home. However, when using switches with microcontrollers, we've found that students often struggle to understand why pull-up or pull-down resistors are necessary. So, take your time with this lesson. Try to understand the **why**  and **how** of these resistors in your circuits.

For example, in the animation below, we show a button circuit with a pull-down resistor hooked up to Pin 2. Importantly, notice **where** the current flows when the button is pressed—perhaps surprisingly, it does **not** flow into Pin 2. In fact, (virtually) no current flows into Pin 2! Why not? We'll talk about this and more in this lesson!

![Animation showing a Arduino Uno and a button hooked up to Pin 2 with a pull-down resistor configuration. When the button is pressed, the animation shows the current going from Vcc through the button and down through the pull-down resistor](assets/movies/Arduino_Button_InternalLED_Animation_Edited.gif)
Animation shows the Arduino's built-in LED illuminating when the button on Pin 2 is pressed. When the button is pressed, current flows from $$V_{CC}$$ through the pull-down resistor to GND. We'll learn more about this circuit in this lesson.
{: .fs-1 }

## Switches

As noted above, switches are simple components: they're either "open" (disconnected) or "closed" (connected). There are lots of different types of switches from **momentary switches** (aka buttons) to **toggle** or **slide** switches (which maintain their state) to switches that activate based on environmental conditions like a **tilt switch** or a **reed switch**.

![Picture showing a variety of digital inputs, including tactile buttons, arcade buttons, SMD push buttons, slide switches, rocker switches, reed switches, and tilt switches](assets/images/DigitalInput_ExampleGallery.png)
Prices and pictures are from Sparkfun.com, Jan 2020; parts can be cheaper in bulk from suppliers like [Digi-Key](https://www.digikey.com/) or [Mouser Electronics](https://www.mouser.com/).
{: .fs-1 }

In this lesson, we are going to use a four-legged push button (momentary switch). If you want to learn more about switches in general, see these articles by [Sparkfun](https://learn.sparkfun.com/tutorials/switch-basics/all) and [ITP NYU](https://itp.nyu.edu/physcomp/labs/labs-electronics/switches/).

<!-- TODO: show animation of a switch -->

<!-- TODO: add in schematic icons? Also, different types like SPST, DPST? -->

## Making an initial button circuit

We'll first learn how to use a button **without** a microcontroller. This will strengthen our understanding of buttons, in general, before switching over to digital input.

### Materials

We'll need the following materials:

| Breadboard | Arduino | LED | Resistor | Button |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing_100h.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![Image of a Tactile Switch Buttons (12mm square, 6mm tall) ordered from Adafruit]({{ site.baseurl }}/assets/images/Button_12mmX12mm_Adafruit_100w.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor | [12x12mm "Tactile Switch Buttons"](https://www.adafruit.com/product/1119) |

### Four-legged tactile buttons

The four-leg push button is one of the most common button types for breadboarding circuits; however, it's also a bit funky. You might be wondering: why **four legs** instead of two? How does this button work? 

![Examples of four-legged buttons from Sparkfun and Adafruit](assets/images/FourLeggedButtonExamplesFromSparkfunAndAdafruit.png)
<!-- TODO: in future, make this into a table with links for improved accessibility -->

We created the following animation to help explain how to use a four-legged button and how the four legs work. It's a bit non-intuitive at first. The best way to learn how to use it is to try it (and hopefully the animation will help).

![Animation showing how two sides of the button are disconnected until the button is pressed, creating a connection](assets/movies/FourLeggedTactileButtons_Animation.gif)

In general, if you're confused about how to use a component, it's a good idea to consult the [datasheet](https://cdn-shop.adafruit.com/datasheets/B3F-1000-Omron.pdf). You can also use a multimeter to check for continuity between the four legs.

<!-- TODO video of using a multimeter to figure out how the four legs are hooked up -->

### Using buttons without a microcontroller

We'll show how to make two button circuits: one using an external power source like a 9V battery with a snap connector and the other using Arduino's 5V pin for power, just like we did in the [LED on](led-on.md) lesson. We suggest the 9V battery approach just to avoid confusion—this circuit is, of course, completely independent of Arduino!

| With 9V Battery | With Arduino 5V Pin |
|:-------------:|:-----------:|
| ![Four-legged button circuit with 9V battery](assets/images/FourLeggedButtonCircuit_With9VBattery.png) | ![Four-legged button circuit with 5V pin](assets/images/FourLeggedButtonCircuit_WithArduino_5VPin.png) |

If you build the 9V battery circuit, then we suggest a 680Ω or 1KΩ resistor rather than a 220Ω resistor.
{: .fs-1 }

That's it! Once you've created the circuit, give it a try by pushing the button and the LED should turn on. See the animation below.

![Animation showing both the 9V battery and Arduino 5V power LED circuits with four-legged button working](assets/movies/FourLeggedTactileButton_LEDCircuitBreadboard_Animation.gif)

Now that we understand how this button works, let's move on to using switches/buttons with a microcontroller.

## Intro to digital input

In our [Blink](led-blink.md) lesson, we introduced [digital I/O](led-blink.md#introducing-digital-output) with a specific focus on **digital output**. Here, we are going to talk about **digital input**, which is a bit more complicated.

### Digital I/O refresher

Recall that the Arduino Uno and Leonardo have 14 digital I/O pins that can be used either for input with [`digitalRead()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) or output with [`digitalWrite()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/), respectively.

![Close-up image of the 14 digital I/O pins on the Arduino Uno](assets/images/ArduinoUno_CloseUp_DigitalIOPins.png)

As noted in our [Blink](led-blink.md) lesson, you can control any of these 14 digital I/O pins with three functions:

1. [`pinMode(int pin, int mode)`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) configures a specified pin as either an `INPUT` or `OUTPUT`. For our buttons, we'll be using `INPUT` and a variant called `INPUT_PULLUP`.
2. [`digitalRead(int pin)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) reads digital input from the specified pin, either `HIGH` or `LOW`.
3. [`digitalWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/) writes digital output to the specified pin, either `HIGH` or `LOW`.

### What is digital input?

Digital input is any input that can be considered either **on** (typically, `HIGH` or 5V) or **off** (typically, `LOW` or 0V). You would thus think that using digital input with microcontrollers would be easy—and it will be eventually once you gain familiarity—but it can be confusing initially.

The **most critical** concept to understand is that microcontrollers read voltage, not current. This directly (and dramatically) affects how we setup our input circuits. We cannot simply do this:

TODO: insert diagram of incorrect button circuit (and schematic).

Instead, we have to do something like this:

TODO: insert proper button circuit with schematic.

Why?

### High impedance input

When you configure a pin as `INPUT` via `pinMode(<pin>, INPUT)`:

From Arduino's [DigitalPins](https://www.arduino.cc/en/Tutorial/DigitalPins) tutorial: "Pins configured this way are said to be in a high-impedance state. Input pins make extremely small demands on the circuit that they are sampling, equivalent to a series resistor of 100 megohm in front of the pin. This means that it takes very little current to move the input pin from one state to another, and can make the pins useful for such tasks as implementing a capacitive touch sensor, reading an LED as a photodiode, or reading an analog sensor with a scheme such as RCTime." 

### Is it LOW or is it HIGH?

As Lee describes in [his Arduino lecture notes](https://web.stanford.edu/class/archive/engr/engr40m.1178/slides_sp17/arduino-io.pdf), "the value returned from `digitalRead()` is only well-defined when the input pin voltage is *close* to $$V_{CC}$$ or 0V. The precise meaning of "close" varies between microcontrollers"

For the ATmega328, the input voltage needs to be at least $$0.6\cdot V_{CC}\to 0.6\cdot5 V=3$$ to qualify as `HIGH` and between 0 and $$0.3\cdot V_{CC}\to 0.3\cdot 5V=1.5$$ to qualify as `LOW`. For the middle range $$0.3\cdot V_{CC}$$ to $$0.6\cdot V_{CC}$$, the behavior of the pin is undefined.

Note that the value returned by digitalRead() is only well-defined when the input pin voltage
is close to VDD or 0 V. The precise meaning of “close” varies between microcontrollers, but for the
Adafruit Metro Mini1 as it’s used in our circuit, the input pin voltage needs to be at least 0.6VDD
to qualify as HIGH, and at most 0.3VDD to qualify as LOW. In the middle (say, at 0.45VDD), the
behavior of the pin is undefined

## Pull-down and pull-up resistors
A key concept to understand is that microcontrollers read input like voltmeters—that is, they read voltage rather than current.

### Pull-down and pull-up resistors

To use a digital input with a microcontroller—say, a push button, a slider switch, or a tilt switch—you need either a pull-down or pull-up resistor. Why? Watch the following [video](https://youtu.be/wxjerCHCEMg) by AddOhms: 

<!-- See below (right-click on the image and select 'Open Image in New Tab' for an enlarged version).
![Visual walkthrough of why a pull-down resistor setup of a button circuit is necessary](assets/images/Arduino_Button_PullDownResistor_Walkthrough.png)
In this example, the button is hooked up to digital I/O pin 12 but any I/O pin will work.
{: .fs-1 } -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/wxjerCHCEMg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
[Video](https://youtu.be/wxjerCHCEMg) by AddOhms demonstrating floating pins and why pull-up resistors are necessary for digital input with microcontrollers.
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

The official [Arduino docs](https://www.arduino.cc/en/Tutorial/DigitalPins) recommend a 10kΩ pull-down or pull-up resistor for digital input pins. On the ATmega microcontrollers (those on the Arduino Uno and Leonardo), the internal pull-up resistor is 20kΩ. On the Arduino Due, the internal pull-up is between 50kΩ and 150kΩ.

TODO: talk about tradeoffs in setting pull-up and pull-down resistor values

### Some microcontrollers have built-in pull-up and pull-down resistors

Some Arduino boards use microcontrollers that have both pull-up and pull-down resistors. The popular ESP32 chip, for example, used in the [Adafruit Huzzah32](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/overview) has built-in pull-up and pull-down resistors on all GPIO pins except for GPIO34-GPIO39 (see [link](https://github.com/espressif/arduino-esp32/issues/316)). These can be enabled with either `pinMode(<pin>, INPUT_PULLUP);` or `pinMode(<pin>, INPUT_PULLDOWN);`

### Want to dive deeper?

To learn more about pull-up and pull-down resistors, watch this video by NYU ITP's Jeff Feddersen:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/241209240?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

See also:
- [Sparkfun's tutorial on Pull-up Resistors](https://learn.sparkfun.com/tutorials/pull-up-resistors/all)
- [Arduino's official `INPUT_PULLUP` tutorial](https://www.arduino.cc/en/Tutorial/InputPullupSerial)
- [Electronics Tutorials' Pull-up Resistors](https://www.electronics-tutorials.ws/logic/pull-up-resistor.html)

## Pull-down resistor configuration

![Wiring diagram and schematic for a button with a pull-down resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_PullDownResistor_WiringDiagram.png)

As with any circuit, there are many ways to wire up a button with a pull-down resistor configuration. Here are some examples—all are functionally equivalent. I tend to use the wiring shown on the far left, which is the same one shown above.

![Five separate wiring diagrams of a pull-down resistor configuration with a button wired to Pin 2 on the Arduino Uno](assets/images/ArduinoUno_Button_PullDownResistor_WiringDiagramGallery.png)

## Pull-up resistor configuration

![Wiring diagram and schematic for a button with a pull-up resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_PullUpResistor_WiringDiagram.png)

## Internal pull-up resistor configuration

![Wiring diagram and schematic for a button with an internal pull-up resistor wired to digital I/O Pin 2](assets/images/ArduinoUno_Button_InternalPullUpResistor_WiringDiagram.png)

The schematic is for illustrative purposes. The internal software controlled switch is a transistor so the actual circuit looks something like [this](assets/images/Arduino_InputPinWithPullUpResistor_Schematic.png) (from [Lee, Input/output pins on Arduino, Stanford ENGR40M](https://web.stanford.edu/class/archive/engr/engr40m.1178/slides_sp17/arduino-io.pdf))
{: .fs-1 }

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
- [done] ITP has some good content on switches that we should link to
- show calculation about pull-down and pull-up resistors (and the fact that they should be high to not waste current)
- Talk about super high impedance on input pin?

## References
- [Arduino Internal Pull-up Resistor Tutorial](https://www.baldengineer.com/arduino-internal-pull-up-resistor-tutorial.html), James Lewis

## Tinkercad circuits
- https://www.tinkercad.com/things/9skzhTypQRh-button-with-breadboard/
- https://www.tinkercad.com/things/hlkxqsvSz2E-button-no-breadboard