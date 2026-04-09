---
layout: default
title: L5&#58; Force-Sensitive Resistors
nav_order: 5
parent: Input
grand_parent: Intro to Arduino
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson, you'll learn about force-sensitive resistors (FSRs) and how to use FSRs and two-legged variable resistors more generally with microcontrollers. We'll conclude with building a "force-sensitive" musical instrument—very Jedi-like!

This lesson directly builds on the prior one ([potentiometers](potentiometers.md)), so definitely complete that first.

{: .note }
> **In this lesson, you will learn:**
> - What force-sensitive resistors (FSRs) are and how they work
> - How to use any two-legged variable resistor with a microcontroller by adding a fixed resistor to form a voltage divider
> - How to select an appropriate fixed resistor value for your sensor
> - How to use `map()` to convert between different value ranges
> - How to build a force-controlled musical instrument combining `analogRead` and `tone()`

![Animation showing an FSR pressing down and an LED getting brighter as resistance drops](assets/movies/FSR_LEDCircuit_ArduinoForPower_WorkbenchWithAmmeter.gif)

**Figure.** Animation shows how the resistance of the FSR drops with applied pressure (higher pressure, lower resistance, brighter LED).
{: .fs-1 }

## Materials

We'll need the following materials:

| Breadboard | Arduino | FSR | Resistor | Piezo Buzzer |
|:-----:|:-----:|:-----:|:-----:|:-----:|
| ![A half-sized breadboard for prototyping]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![An Arduino Uno microcontroller board]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![A force-sensitive resistor (FSR)]({{ site.baseurl }}/assets/images/FSR_200h.png) | ![A 10 kilohm fixed resistor]({{ site.baseurl }}/assets/images/Resistor10K_Fritzing_100w.png) | ![A passive piezo buzzer]({{ site.baseurl }}/assets/images/PiezoBuzzer_100h.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | [Force-Sensitive Resistor](https://www.adafruit.com/product/166) | 10kΩ Resistor | [Piezo Buzzer](https://www.mouser.com/ProductDetail/810-PS1240P02BT) |

## Force-sensitive resistors (FSRs)

Force-sensing (or force-sensitive) resistors (FSRs) are two-legged variable resistors that **decrease** in resistance with an **increase** in applied force. 

FSRs can differ in size, shape, and force sensing sensitivity. There are a variety of form factors, including square and circular (which host the active sensor area). In our hardware kits, we typically purchase and provide the popular [Interlink FSR 402]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) (either from [Sparkfun](https://www.sparkfun.com/products/9375) or [Adafruit](https://www.adafruit.com/product/166)), which is the product in the upper-left below.

![Grid of example force sensitive resistors from Sparkfun's website](assets/images/ForceSensitiveResistors_Examples_Sparkfun.png)
Prices and products from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all)
{: .fs-1 }

### FSR applications

What can we do with FSRs?

The [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) describes a number of example applications, including:
- **Detecting human interaction.** Sense whether a touch is accidental or intentional by a reading force (or other signal processing)
- **Using force for UI feedback.** Detect user's touch force to make a more intuitive interface
- **Enhancing tool safety.** Differentiate a grip from a touch as a safety lock
- **Finding centroid of force.** Use multiple sensors to determine centroid of force
- **Detecting presence, position, or motion.** Sense a person/patient in a bed, chair, or medical device
- **Detecting liquid blockage.** Detect tube or pump occlusion or blockage by measuring back pressure

While FSRs respond to force, they are not precision measurement instruments like [load cells](https://learn.sparkfun.com/tutorials/getting-started-with-load-cells) or [strain gauges](https://learn.sparkfun.com/tutorials/getting-started-with-load-cells/strain-gauge-basics), so use those if you want to precisely measure weight, load, or strain.

<!-- TODO: in future, include papers from HCI and UbiComp with pressure sensors -->

### How do FSRs work?

How do FSRs actually work? Their construction is quite simple. There are three layers: the top and bottom layers are conductive and the middle layer provides a "thin air gap" that separates the two. When the two conductive layers are pressed together, electrical pathways are made. The harder you press, the more connections. And the more connections, the less resistance. See the FSR construction diagram from Interlink below:

![FSR construction diagram from interlink showing three layers: top and bottom layer are conductive and middle layer is an "air gap" that separates the two.](assets/images/FSR_ConstructionDiagram_Interlink.png)
Diagram from the Interlink FSR [Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf)
{: .fs-1 }

<!-- TODO: in future, consider adding in a second diagram that shows how the connections in the "active area" are made when the top layer comes down? -->

### FSR force-resistance graph

So, what exactly is the relationship between an FSR's resistance and an applied force?

A graph of the force (g) vs. resistance (kΩ) of the FSR 402 is shown below (plotted on a log-log scale). As can be observed from the graph, the FSR has two response phases: 

1. An initial "break force" or "turn on threshold" that dramatically swings the resistance from >10MΩ to roughly 10kΩ
2. After this threshold, the FSR resistance becomes inversely proportional to the applied force (following an inverse power-law characteristic).  

At the high-end of the force range, the FSR's sensitivity diminishes significantly and the resistance curve begins to saturate.

![Graph of the resistance vs. force curve for the Interlink FSR 402 showing that resistance drops with applied pressure](assets/images/ForceSensitiveResistor_ResistanceForceCurve_InterlinkFSR402.png)
A graph of the force (g) vs. resistance (kΩ) plotted on a log-log scale for the Interlink FSR 402. Graph from the [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf).
{: .fs-1 }

For more details, see the Interlink [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) and [Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf).

## Making an LED dimmer with an FSR

Let's make something!

To begin, just like we did with the [buttons](buttons.md) and [potentiometers](potentiometers.md) lessons, we'll make a simple LED circuit without a microcontroller. In fact, this circuit will be the exact same as the "rheostat" potentiometer circuit [here](potentiometers.md#build-the-potentiometer-based-led-dimmer) (but we'll replace the rheostat with an FSR).

Below, we show two possible wiring diagrams: the first (preferred) shows the FSR circuit powered by a 9V battery while the second shows power derived from the 5V and GND pins on the Arduino. (Again, we prefer the former just to further emphasize that at this point, we're not using microcontrollers!)

![Two wiring diagrams of an FSR connected to an LED](assets/images/FSR_WiringDiagram_NoArduino_Fritzing.png)
Two wiring options of an FSR using a breadboard. Like typical resistors, FSRs can be inserted into your circuits in either direction.
{: .fs-1 }

With the 9V wiring, we include a backup resistor; however, with the 5V wiring (with Arduino), we do not. This is because both the [FSR 402 datasheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf) and our own empirical use demonstrate that even with significant force (roughly 1,000g according to the datasheet), the FSR still has ~200Ω-500Ω of resistance. So, while a potentiometer may drop to 0Ω at the lowest setting, the FSR does not, and thus does not require a backup resistor.

For the 9V wiring, if we assume the red LED's forward voltage ($$V_f$$) is 2V and the lowest FSR resistance is 200Ω, then the current is (9V - 2V) / 200Ω = 35mA, which exceeds the max continuous current of the LED (typically 20mA). We thus added a 470Ω backup resistor to be safe. Now, the current is (9V - 2V) / (200Ω + 470Ω) = 10.4mA.

### Positioning FSR on breadboard

The two contact legs are 2.54mm apart (0.1"), so should fit snugly into your breadboard. Just like a traditional resistor, the FSR can be inserted in either direction.

![FSR close-up of the two contact legs](assets/images/FSR_ContactLegs_Zoom_FromSparkfun.png)
Image from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#res).
{: .fs-1 }

If you want a more permanent connection, see this [fantastic guide](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#hardware-assembly) from Sparkfun on soldering FSRs (difficult) or using Amphenol FCI Clinchers (recommended):

![Image showing Amphenol CFI clincher connectors installed on the FSR's legs](assets/images/FSR_Clinchers_Sparkfun.png)
Image from [Sparkfun.com](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all#hardware-assembly) showing Amphenol CFI clincher connectors installed on the FSR's legs.
{: .fs-1 }

### Workbench video of completed circuit

Once you've made the circuit, have fun playing with the FSR. Get a sense of its responsiveness and how hard you have to press.

Here's a workbench video of our completed circuit (this is the same video as the one in the [potentiometers](potentiometers.md) lesson, so there is a backup resistor):

<iframe width="736" height="414" src="https://www.youtube.com/embed/YMCqDcnwMYo" title="Workbench video of an FSR-based LED dimmer circuit" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
Workbench video of the FSR LED dimmer circuit
{: .fs-1 }

## Using FSRs with microcontrollers
OK, now that you've gained some experience with FSRs and understand how to use them *without* a microcontroller, let's explore how to use them *with* a microcontroller.

First, like usual, we'll show you the wrong way to hook up a component to a microcontroller:

![Incorrect Arduino wiring diagram and schematic for FSR](assets/images/ArduinoUno_FSR_Incorrect_SchematicAndDiagram.png)

Why doesn't this work?

Recall from our [potentiometers](potentiometers.md) lesson, microcontrollers read voltages, not current. We have to set up a circuit that enables our microcontroller to "see" changes in voltages. 

<!-- make and show an animation of the pot splitting into two resistors and how this is the same thing that we have to do for our FSR -->

We had to do the same thing with the [potentiometer](potentiometers.md). The potentiometer would not work as analog input when only two legs were used. We had to connect all three potentiometer legs. 

To use an FSR—or any variable resistor—with a microcontroller, you must add a fixed resistor to form a voltage divider like this:

![Arduino wiring diagram and schematic for FSR](assets/images/ArduinoUno_FSR_SchematicAndDiagram.png)

That fixed resistor is like hooking up the third leg of a potentiometer. It's also similar to the pull-up or pull-down resistors for our switch circuits (and, indeed, when the FSR is **not** pressed, it acts like an open switch because its resistance is so high).

### How to select the fixed resistor

But how do we know what value to select for this fixed resistor? To the datasheets!

The [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf) suggests choosing the fixed resistor (which it calls $$R_M$$) based on your specific use context to maximize the desired force sensitivity range and to limit current.

The guide provides a useful force *vs.* $$V_{out}$$ graph with different fixed resistor values ($$R_M$$). As can be observed from the graph, selecting a 10kΩ resistor for $$R_M$$ provides the most dynamic $$V_{out}$$ range for the full sensing force range of the FSR. Note also the two-phase relationship with the initial steep slope followed by a softer increase.

![FSR force vs. Vout graph for different fixed resistor values from the Interlink FSR data sheet](assets/images/Voltage-divider-circuit-Interlink-FSR-402-Makerguides.png)
Graph originally from [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf). Image above from [Makerguides](https://www.makerguides.com/fsr-arduino-tutorial).
{: .fs-1 }

In general, for a resistive sensor like an FSR, read the datasheet (of course) but also play around with the sensor. Start with a 10kΩ fixed resistor, write a simple Arduino program to graph its analog input in response to various stimuli (in this case, force), and go from there.

## Let's make stuff!

We're going to begin with a simple circuit to read the FSR and proportionally set the Arduino's built-in LED brightness. We'll also graph the FSR input using the Arduino IDE's [Serial Plotter](https://randomnerdtutorials.com/arduino-serial-plotter-new-tool/). Then, we'll conclude with the Jedi-force "instrument." For both constructions, try to make the circuit and write the code before looking at our solutions. You can do it!

## FSR-based LED fader

### FSR-based LED fade circuit

Let's make a simple FSR circuit with the fixed resistor (10kΩ) in the pull-down position. In this configuration, the analog input A0 ($$V_{A0}$$) will increase with increasing force and start at 0V when the FSR is not pressed.

![FSR wiring diagram for Arduino Uno with FSR Leg 1 hooked to 5V, and Leg 2 hooked to a fixed resistor 10kΩ in the pull-down resistor position](assets/images/ArduinoUno_FSR_FixedResistorInPullDown_SchematicAndDiagram.png)

### FSR-based LED fade code

For our FSR-based LED fade code, we're going to read in the FSR value from the voltage divider using `analogRead` and then use this to proportionally set our LED brightness using `analogWrite`. Easy, right?

#### Converting analogRead range to analogWrite range using map()

There is one small issue, which is that `analogRead` (on the Uno and Leonardo) uses a 10-bit ADC. Thus, the `analogRead` value ranges from 0-1023; however, the `analogWrite` value is 8 bits, which means that it ranges from 0-255. So, we have to do a simple conversion between the two ranges: 0-1023 to 0-255.

If we assume both ranges start at zero (as they do in this case), our conversion is simply: `int outputVal = (int)(inputVal/1023.0 * 255);`. 

If, instead, we can't assume that both ranges start at zero, the more general conversion algorithm is: `int outputVal = ((inputVal - INPUT_MIN) * (OUTPUT_MAX - OUTPUT_MIN) / (INPUT_MAX - INPUT_MIN)) + OUTPUT_MIN;`. Notice that we must do the multiplication *before* the division to avoid C++ integer math truncating to zero! (If you divided first, `(inputVal - INPUT_MIN) / (INPUT_MAX - INPUT_MIN)` would almost always evaluate to `0` since the numerator is typically smaller than the denominator.)

This type of range conversion is so common that Arduino (and Processing and many other programming libraries) have a built-in function for it called [`map`](https://www.arduino.cc/reference/en/language/functions/math/map/). It's called "map" because we want to re-map a number from one range to another. Indeed, here's the entire `map` function from the Arduino source code—notice it also multiplies before dividing:

{% highlight cpp %}
long map(long x, long in_min, long in_max, long out_min, long out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
{% endhighlight cpp %}

Importantly, as the [docs](https://www.arduino.cc/reference/en/language/functions/math/map/) make abundantly clear, notice that this built-in method uses **integer** math and so will not return fractions (floats). If you need more precise conversions, implement your own mapping function (which also provides the opportunity to implement non-linear conversions like logarithmic mappings). 

OK, now that we have that out of the way, let's write our code!

#### Full FSR-based LED fade code

<!-- gist-it is down, so now using emgithub -->
<!-- <script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/analogRead/ForceSensitiveResistorLED/ForceSensitiveResistorLED.ino?footer=minimal"></script> -->
<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fmakeabilitylab%2Farduino%2Fblob%2Fmaster%2FBasics%2FanalogRead%2FForceSensitiveResistorLED%2FForceSensitiveResistorLED.ino&style=github&showCopy=on"></script>

This [source code](https://github.com/makeabilitylab/arduino/blob/master/Basics/analogRead/ForceSensitiveResistorLED/ForceSensitiveResistorLED.ino) is on GitHub.
{: .fs-1 }

### Workbench video with serial plotter

Here's a workbench video with a corresponding Serial Plotter screen recording. The `analogRead` FSR values are in blue (the taller, more dynamic trace), and the `analogWrite` LED PWM values are in orange (the shorter, scaled-down trace). We're using the built-in LED, so the LED brightness changes may be difficult to see in the video.

<iframe width="736" height="414" src="https://www.youtube.com/embed/MTpmVaVi92o" title="Workbench video of FSR-based LED fading with Serial Plotter showing analogRead and analogWrite values" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Jedi force instrument

For our final creation, we're going to make a Jedi force instrument: the harder you press on the FSR, the higher the frequency we play on the piezo. Again, try making this yourself without looking at our circuit or code.

### Jedi force circuit

Simply add in a piezo buzzer and connect it to a GPIO pin.

![Breadboard wiring diagram of the Jedi force instrument, showing an FSR connected to analog pin A0 as a voltage divider with a 10 kilohm fixed resistor, and a piezo buzzer connected to digital pin 9](assets/images/ArduinoUno_FSRPiezoInstrument_BreadboardDiagram.png)

### Jedi force code

In [our code](https://github.com/makeabilitylab/arduino/blob/master/Basics/analogRead/ForceSensitiveResistorPiezo/ForceSensitiveResistorPiezo.ino), we only play sound when the FSR is pressed (to limit the annoyance). :)

<!-- gist-it is down, so now using emgithub -->
<!-- <script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/analogRead/ForceSensitiveResistorPiezo/ForceSensitiveResistorPiezo.ino?footer=minimal"></script> -->
<script src="https://emgithub.com/embed.js?target=https%3A%2F%2Fgithub.com%2Fmakeabilitylab%2Farduino%2Fblob%2Fmaster%2FBasics%2FanalogRead%2FForceSensitiveResistorPiezo%2FForceSensitiveResistorPiezo.ino&style=github&showCopy=on"></script>

This [source code](https://github.com/makeabilitylab/arduino/blob/master/Basics/analogRead/ForceSensitiveResistorPiezo/ForceSensitiveResistorPiezo.ino) is on GitHub.
{: .fs-1 }

### Workbench video with serial plotter

Here's our take on it! Make sure to have your sound on (or not) if you want to hear the piezo buzzer! 

<iframe width="736" height="414" src="https://www.youtube.com/embed/OuEABPQV9_k" title="Workbench video of the Jedi force instrument playing tones controlled by FSR pressure" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Exercises

For your prototyping journals, choose one or more of the following extensions and implement it!

### Exercise 1: Quantized Jedi instrument

Improve the Jedi force instrument so that instead of playing arbitrary frequencies, it only plays notes on a musical scale (for example, C major: C4, D4, E4, F4, G4, A4, B4, C5). Use `map()` to divide the FSR's analog input range into discrete note bins. Does it sound more musical?

### Exercise 2: LED bar graph

Add three or more LEDs that work as a "bar graph" for the FSR value — the harder you press, the more LEDs light up. This is a great way to provide visual feedback for an analog sensor.

### Exercise 3: DIY pressure sensor

Try making a lo-fi pressure sensor using everyday materials (aluminum foil, conductive foam, pencil graphite on paper, or velostat) and use it to make a new instrument or LED controller. How does it compare to the FSR in sensitivity and range?

### Exercise 4: Combined instrument

Build an instrument that uses *both* a potentiometer and an FSR. For example, the potentiometer could select the octave (low, mid, high) while the FSR controls the specific note within that octave. Or the potentiometer could control volume (using `analogWrite` to the piezo) while the FSR controls pitch.

<!-- ### Make your own lo-fi pressure sensor. TODO: show super simple lo-fi pressure sensor out of pencil. Show both alligator clip version and taped jumper wire version. -->

## References
- [Interlink FSR 402 Data Sheet]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_InterlinkFSR402_2010-10-26-DataSheet-FSR402-Layout2.pdf)
- [Interlink FSR Integration Guide]({{ site.baseurl }}/assets/datasheets/ForceSensitiveResistor_Interlink_IntegrationGuide.pdf)
- [Force Sensing Resistor (FSR) with Arduino Tutorial](https://www.makerguides.com/fsr-arduino-tutorial/), Makerguides.com
- [Force Sensitive Resistors (FSRs)](http://www.openmusiclabs.com/learning/sensors/fsr/), Open Music Labs
- [Force Sensitive Resistor (FSR)](https://learn.adafruit.com/force-sensitive-resistor-fsr), Adafruit Learn
- [Force Sensitive Resistor Hookup Guide](https://learn.sparkfun.com/tutorials/force-sensitive-resistor-hookup-guide/all), Sparkfun Tutorials

## Lesson summary

Congratulations — you've completed the entire **Intro to Input** lesson series! In this final lesson, you learned:

- **Force-sensitive resistors (FSRs)** are two-legged variable resistors whose resistance decreases with applied force. They have a characteristic "break force" threshold followed by an inverse power-law response.
- To use **any two-legged variable resistor** (FSR, photocell, thermistor, *etc.*) with a microcontroller, you must add a **fixed resistor** to create a voltage divider. This is the key generalizable takeaway — the same pattern applies to dozens of analog sensors.
- The **`map()` function** re-maps a value from one range to another and is essential for converting between `analogRead` (0–1023) and `analogWrite` (0–255) ranges. Remember that Arduino's `map()` uses integer math.
- The position of the fixed resistor in the voltage divider (pull-up vs. pull-down) determines whether the analog input increases or decreases with the sensor's response.
- By combining `analogRead`, `map()`, and `tone()`, you built a **Jedi force instrument** — a force-controlled musical instrument that brings together everything you've learned across the Input series.

## What's next?

You've come a long way — from blinking an LED to building force-controlled instruments! Here are some paths forward:

- **[Communication](../communication/index.md):** Learn about serial communication between Arduino and your computer, enabling richer data visualization and computer-Arduino interaction.
- **[Advanced I/O](../advancedio/index.md):** Explore OLED displays, vibromotors, servo motors, and input smoothing techniques.
- **[Sensors](../sensors/index.md):** Dive deeper into analog and digital sensors, signal conditioning, and sensor fusion.

<span class="fs-6">
[Previous: Potentiometers](potentiometers.md){: .btn .btn-outline }
</span>