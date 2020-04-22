---
layout: default
title: L1&#58; Photoresistors
nav_order: 1
parent: Sensors
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

In my own experiments, I found that the photoresistor resistance ranged from 100+ MΩ to ~50-100Ω with my iPhone LED flashlight on full power 

### Photoresistor 

To get a sense of the photoresistor's resistance as a function of light, try hooking it up to a multimeter (the ohmmeter setting). What do you observe?

Here's the results of our own informal experiments:

| Lighting condition | Photoresistor resistance |
| ------------------ | ------------------------ |
| iPhone LED flashlight on full power over photoresistor   | ~50-100Ω                     |
| Desk lamp **on**   | 1.6kΩ                    |
| Desk lamp **off** but some ambient light (*e.g.,* from computer moitor)   | 10kΩ                    |
| Finger over photoresistor   | ~130kΩ                    |
| Very dark room | 1+MΩ                    |

And a video:

<iframe width="736" height="414" src="https://www.youtube.com/embed/imbN0PtUQg0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
Our photoresistor ranges from 1.6kΩ with our desk lamp to 10kΩ with the lights off to over ~10MΩ when covered by a coffee cup
{: .fs-1 }

## Making an LED dimmer with a photoresistor

Let's make something.

As before, we're going to explore this sensor first **without** a microcontroller to build up familiarity before connecting it as analog input to the Arduino. 

Let's try making a simple, prototype nightlight that automatically turns **on** in the dark. 

### Initial auto-on nightlight circuit

Like the FSR, the photocell is a two-legged resistive sensor. So, we might initially try to hook it up in the exact same way. As we measured a minimum resistance of ~50-100Ω when an ultrabright LED flashlight was pointed directly at the photoresistor, in both wiring diagrams, we include a backup current limiting resistor.

![Two wiring diagrams of a photocell connected to an LED: one with 9V battery; other powered by Arduino 5V pin](assets/images/Photoresistor_WiringDiagram_NoArduino_Fritzing.png)

Try making this circuit. What happens?

Because the photoresistor resistance **decreases** with light levels, the LED gets brighter as the ambient light gets brighter. This is the opposite of what we want! See video below.

<iframe width="736" height="414" src="https://www.youtube.com/embed/tNOG2tYaBQU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
In this video, the photoresistor is in series with the LED. As the ambient light level increases, the photoresistor resistance decreases, and the LED gets brighter. But we want the opposite effect? Note: this video has no audio.
{: .fs-1 }

What should we do? Well, the coder in us wants to immediately hook the sensor up to the microcontroller and solve this in code (which is a fine solution and, ultimately, what we will do!). However, can we solve this in hardware too?

Let's try it.

### An improved auto-on nightlight circuit

We are going to create an inverse relationship between ambient light levels and LED brightness by placing the LED in parallel with the photoresistor wired in a voltage divider configuration. Now, as the photoresistor resistance drops, the LED will get brighter. The key is in selecting an appropriate fixed resistor $$R$$. 

![](assets/images/Photoresistor_WiringDiagramAndSchematicVoltageDivider_NoArduino_Fritzing.png)

If $$R$$ is too small, the LED will still turn on even in ambient light. Through experimentation, we determined that $$R=4.7kΩ$$ resulted in a 1.72V drop and 0.10mA through the LED with the **desk lamp off** (up to 0.6mA when the photoresistor is covered) and a 0.8V drop and 0mA through the LED with the lights on. So, while this circuit works, it doesn't work well. We are not able to sufficiently control the current through the LED based on lighting conditions. Yes, we have the general LED behavior we want but 0.10mA is a very small current, so the LED is not very bright (even in the darkest conditions). See video below.

| R     | Desk Lamp **Off** | Desk Lamp **Off** | Desk Lamp **On**  | Desk Lamp **On**  |
| ----- | ----------------- | ----------------- | ----------------- | ----------------- |
| -     | LED Voltage Drop  | LED Current       | LED Voltage Drop  | LED Current       |
| 1kΩ   | 1.89V             | 2.9mA             | 1.85V             | 2.13mA            |
| 2.2kΩ | 1.82V             | 1.23mA            | 1.78V             | 0.5mA             |
| 4.7kΩ | 1.78V             | 0.48mA            | 1.41V             | 0mA               |
| 10kΩ  | 1.72V             | 0.10mA            | 0.80V             | 0mA               |

<iframe width="736" height="414" src="https://www.youtube.com/embed/ZYVQLw-7HU0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
This video shows a photoresistor wired in parallel to inverse the relationship between ambient light levels and LED brightness. Note: this video has no audio.
{: .fs-1 }

So, what could we do?

Two potential solutions: 

1. We could continue a pure hardware solution and add in a transistor like [this video](https://youtu.be/eEBMTpxdPiE). This would be the cheapest solution and the one EE's would advocate! :)
2. We could add in a microcontroller and solve this in software (a place where we are more comfortable but it's always useful to consider a pure hardware solution, if possible)

<!-- Using Thevenin equivalent circuits: https://ultimateelectronicsbook.com/voltage-dividers/#solving-by-hand-->

<!-- my own experiments voltage drop over LED and measured current through LED in dark | light
1.72V (0.10mA) | 0.80V (0mA) with 10kOhm (and turns off in light but LED dim)
1.78V (0.48mA) | 1.41V (0mA) with 4.7kOhm (and turns off in light but LED dim)
1.82V (1.23mA) | 1.78 (0.5mA) with 2.2k resistor (but still on in light)
1.89V (2.9mA) | 1.85V (2.13mA) with 1K resistor (but still on in light).
2.09V | 2.07V with 220 resistor -->

## Using photoresistors with microcontrollers

As a two-legged variable resistor, we can use the same voltage divider wiring as the [FSR](../arduino/force-sensitive-resistors.md). Recall the voltage divider equation introduced in the [potentiometers](../arduino/potentiometers.md) lesson: $$V_{out} = V_{in} \cdot \frac{R_2}{R_1 + R_2}$$. 

Below, we show two wiring options. On the left, the photoresistor is $$R_1$$ in the voltage divider configuration so $$V_{out}$$ will increase as light levels increase. On the right, the is $$R_2$$ so $$V_{out}$$ will increase as light levels decrease (a "darkness" sensor, if you will).

![Wiring diagram showing the photoresistor in a voltage divider configuration. On left diagram, photoresistor is the top resistor in the voltage divider, so Vout will increase as light levels increase. On the right diagram, the photoresistor is the bottom resistor, so Vout will increase as light levels decrease](assets/images/ArduinoUno_Photoresistor_WiringDiagramPlusSchematic.png)
Either wiring will work. They are functionally equivalent but opposite. 
{: .fs-1 }

And, of course, we could inverse the relationship in software (rather than hardware). So, for example, if we wanted to make an LED brighter as light levels decrease with the left wiring configuration, we could do:

{% highlight C %}

// In this code, we brighten an LED inversely proportional to light level (as measured by 
// a photoresistor). We assume the photoresistor is R1 and fixed resistor is R2 in the 
// voltage divider
int photoresistorVal = analogRead(INPUT_PHOTORESISTOR_PIN); // read in photoresistor val
int ledVal = map(photoresistorVal, 0, 1023, 0, 255); // convert to 8-bit range (0-255)
ledVal = 255 - ledVal; // invert so that LED gets brighter as photoresistor gets darker
analogWrite(OUTPUT_LED_PIN, ledVal);

{% endhighlight C %}

And I like to simplify this even more by relying on `map` for the inversion, so the code becomes:

{% highlight C %}

int photoresistorVal = analogRead(INPUT_PHOTORESISTOR_PIN); // read in photoresistor val
int ledVal = map(photoresistorVal, 0, 1023, 255, 0); // inverse relationship
analogWrite(OUTPUT_LED_PIN, ledVal);

{% endhighlight C %}

### What value should we make our fixed resistor?

I think, by now, we understand how to hook up a two-leg resistive sensor to a microcontroller (using a voltage divider!). But one key question is: what to use as the fixed resistor in the voltage divider? 

Ideally, we would want to vary $$V_{out}$$ across our entire ADC range (0-5V)—otherwise, we're artificially limiting our precision—and to discriminate between light levels of interest (do we care more about discriminating bright lights or darker environments).

To help answer this, we can graph $$V_{out}$$ as a function of various fixed resistors and a range of photoresistor resistances. We've also marked approximate resistances of the photoresistor based on ambient light levels. Note that these graphs don't incorporate how the photoresistor's resistance changes in response to light: they simply graph how $$V_{out}$$ changes as the photoresistors resistance changes linearly.

![Graph of various Vout voltages for a voltage divider network with various fixed resistors (as R1) and the photoresistor as R2 (from 100 to 100kΩ)](assets/images/Photoresistor_VoltageDividerGraph_PhotoresistorAsR2.png)

![Graph of various Vout voltages for a voltage divider network with various fixed resistors (as R2) and the photoresistor as R1 (from 100 to 100kΩ)](assets/images/Photoresistor_VoltageDividerGraph_PhotoresistorAsR1.png)

Both graphs show the same data, just the inverse depending on whether the fixed resistor is $$R_1$$ or $$R_2$$.

Let's focus on the bottom graph for now (the "darkness" sensor configuration). Here's a table of $$V_{out}$$ values for six different fixed resistors ($$R_1$$) and some various resistances for the photoresistor ($$R_2$$).

| $$R_1$$ | $$R_2=100Ω$$ | $$R_2=1kΩ$$ | $$R_2=10kΩ$$ | $$R_2=50kΩ$$ | $$R_2=100kΩ$$ | 
| ------- | ------------ | ----------- | ------------ | ------------ | ------------- |
| 100Ω    | 2.50V 	     | 4.55V       | 4.95V        | 4.99V        | 5.00V         |
| 1kΩ     | 0.45V	     | 2.50V       | 4.55V        | 4.90V        | 4.95V         |
| 2.2kΩ   | 0.22V        | 1.56V       | 4.10V        | 4.79V        | 4.89V         |
| 10kΩ    | 0.10V	     | 0.88V       | 3.40V        | 4.57V        | 4.78V         |
| 50kΩ    | 0.05V	     | 0.45V       | 2.50V        | 4.17V        | 4.55V         |
| 100kΩ   | 0.01V        | 0.10V       | 0.83V        | 2.50V        | 3.33V         |

Note how with a 1kΩ for $$R_1$$, almost our entire $$V_{out}$$ range falls between the photoresistance $$R_2=100Ω$$ and $$R_2=10kΩ$$. So, a 1kΩ for $$R_1$$ is useful if we want to discriminate between brighter light levels but not as useful for darker light levels (indeed, from $$R_2=50kΩ$$ to $$R_2=100kΩ$$, there is only a 0.05V difference across 50kΩ!). In contrast, if we select a 100kΩ for $$R_1$$, then at bright light levels ($$R_2=100Ω$$ to $$R_2=1kΩ$$), our voltage only differs by 0.09V but at darker light levels ($$R_2=50kΩ$$ to $$R_2=100kΩ$$), the voltage differs by 0.83V.

Once again, the handy 10kΩ for $$R_1$$ may be a nice compromise.

TODO: use serial plotter to select min/max values for conversion

## Exercises
- `map` assumes a linear mapping between two value ranges. What if you wanted a logarithmic or exponential conversion? How might this be useful here?

## References
- [Photoresistor](https://en.wikipedia.org/wiki/Photoresistor), Wikipedia
- Chapter 20: Photoresistor in Platt, [*Make: Encyclopedia of Electronic Components Volume 3: Sensing Light, Sound, Heat, Motion, and More*](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307), O'Reilly, 2016.

<!-- Selenium history:

"The word 'optophone' was first used by Dr. E E. Fournier d'Albe, who in 1910 was appointed Assistant Lecturer in Physics at the University of Birmingham in England. It was here that he set up a laboratory to look into the properties of selnium. Selenium had been discovered by Berzelius in 1817 and in the years that followed, it became apparent that selenium was photosensitive, racting to light in such a way as to vary its conductivity. Possibly uknown to Fournier d'Albe, a few devices had already been inveted, such as the Elktroftalm and the Photophonic book. The Elektroftalm, originally created in 1897 by Noiszewski, was a mobility aid for the blind. It used a single selenium cell that was placed on the forehad to control the intensity of a sound output, thus allowing a blind persont o distinguish between light and dark." From Capp_TheOptophone-AnElectronicBlindAid_BiomedicalEngineering2000.pdf

The Elektroftalm is described in:

Starkiewicz, W. and Kuluiszewski, Tv. "Active energy radiating system: the 80-channel Elektroftalm" Proc Int Congress on Technology and Blindness, 1963. Vol 1., pp. 157-166 (The American Foundation for the Blind, New York) -->