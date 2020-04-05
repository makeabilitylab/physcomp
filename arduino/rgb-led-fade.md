---
layout: default
title: L6&#58; Crossfade RGB LEDs
parent: Output
usemathjax: false
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

In this lesson, you will learn how to fade between RGB colors and how to use the [HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV) to more easily (and independently) control hue and brightness.

---
**NOTE:**

This is our most complex lesson yet. From a circuit standpoint, things are easy--it's the same circuit as [before](rgb-led.md). From a coding standpoint, things are more complicated. If you don't have a coding background, it's OK if the code doesn't make sense. Try to read it and understand it given your current abilities. Certainly, feel free to copy the code and play with it on your own!

---

## Materials

You'll need the same materials as the previous [RGB LED lesson](rgb-led.md). Recall that there are **two types** of RGB LEDs: a **common cathode design** and a **common anode design**, so make sure you know which one you have as it will affect the circuit you make and the code you write.

| Breadboard | Arduino | RGB LED | Resistors |
|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![An RGB LED]({{ site.baseurl }}/assets/images/RgbLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | RGB LED (Either Common Cathode or Common Anode) | **Three** 220Ω Resistors |

## Making the circuit

The circuit is the same as the previous [RGB LED lesson](rgb-led.md). Make sure you follow the appropriate wiring based on wheter you are using a **common cathode** or **common anode** RGB LED.

| RGB Common Cathode Wiring | RGB Common Anode Wiring |
|:-----:|:-----:|
| ![Breadboard circuit wiring for an RGB LED Common Cathode design where the cathode is hooked to GND](assets/images/ArduinoUno_RgbLEDCommonCathode_WiringDiagramWithBreadboard.png) | ![Breadboard circuit wiring for an RGB LED Common Anode design where the anode is hooked to 5V](assets/images/ArduinoUno_RgbLEDCommonAnode_WiringDiagramWithBreadboard.png) |

## Writing the code

We are going to explore and implement two different RGB crossfade approaches.

1. First, we will use `for` loops to step through dyadic combinations between red, green, and blue LED colors (note: we limit ourselves to powering **two** RGB LEDs simultaneously because powering all three would result in "white"). 
2. Second, we will use the HSL color space to manipulate **hue**—what colloquially we refer to as *color*—and then convert this to the RGB color space for our `analogWrite` calls. This approach is cleaner and less convoluted but requires using a [separate library](https://github.com/ratkins/RGBConverter) for the HSL-to-RGB conversion.

### Crossfading in RGB color space

The code for crossfading an RGB LED is the most complex that we've covered thus far (and, if you don't have a coding background, it's OK if you don't fully understand it). For those in our engineering courses (like Ubiquitous Computing or Prototyping Interactive Systems), you should read and understand this code.

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/analogWrite/CrossFadeRGB/CrossFadeRGB.ino?footer=minimal"></script>

In summary, we have an array `int _rgbLedValues[3]` that stores our `{int red, int green, int blue}` values. We initialize the array to `{255, 0, 0}`—so `red=255`, `green=0`, and `blue=0`—and then use two `for` loops to simultaneously increase one of the color values while decreasing another. We start by **increasing green** and **decreasing red** as controlled by `enum RGB _curFadingUp = GREEN;`) and (`enum RGB _curFadingDown = RED;`). Once we reach our maximum color value `255` for the current `_curFadingUp` color, we select the next color to increase (from `RED` to `GREEN` to `BLUE` then back to `RED`). Similarly, once we reach our minimum color value `0` for `_curFadingDown`, we select the next color to decrease (same order as before: from `RED` to `GREEN` to `BLUE` then back to `RED`).

In total, we crossfade between 768 color combinations (`3*256`) though this can be controlled with `const int FADE_STEP`—the total amount to step up and down the `analogWrite` LED values per loop iteration. It's set to `5` by default, which results in 156 color combinations.

Here's a video showing the code running in the Tinkercad simulator. You can see the crossfade colors and a plot of the corresponding `analogWrite` values.

<iframe width="736" height="414" src="https://www.youtube.com/embed/ZyfHRQFwmeg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!--TODO: add in a p5js that demonstrates how this works? And maybe let's reader play with different color values? -->

## Crossfading in HSL color space

The second method for crossfading the RGB LED takes advantage of the [Hue, Saturation, Lightness (HSL) color space](https://en.wikipedia.org/wiki/HSL_and_HSV). To change the "color" of the RGB LED, we are really talking about changing its hue. It's much easier to do this in the HSL color space and then convert back to the RGB color space to interact with the RGB LED. In fact, our code will be comparatively much simpler, something like the following pseudocode (we increment hue and keep saturation and lightness fixed):

``` Pseudocode
float hue, saturation, lightness;
loop(){
    hue += stepValue;
    RGB rgb = convertHslToRgb(hue, saturation, lightness)
    setColor(rgb.red, rgb.green, rgb.blue);
    if(hue > MAX_HUE){
        hue = 0;
    }
}
```

The downside of this implementation is that we must use `floats` with the [RGBConverter](https://github.com/ratkins/RGBConverter) library. TODO: expand on why floats can be costly for embedded programming with microcontrollers

---
**NOTE:**

There are multiple ways of loading external libraries in the Arduino IDE (see this [official Arduino tutorial](https://www.arduino.cc/en/guide/libraries)); however, most are focused on **global libraries**—that is libraries that **all** of your sketches have access to. What if you want to load just a local library for the current sketch? Well, it turns out this fundamental "feature" has a long, sordid history in the Arduino community (for example: [link](https://stackoverflow.com/questions/4705790/keeping-all-libraries-in-the-arduino-sketch-directory), [link](https://arduino.stackexchange.com/questions/8651/loading-local-libraries)). In short, there is a way to do this since the ~Arduino 1.6 release; however, you must put all libraries in your target sketch folder (which has the `.ino` file) in a sub-folder called `src` ([link](https://github.com/arduino/Arduino/issues/4936#issuecomment-312953260)). Notice how this is exactly our setup for using the [RGBConverter](https://github.com/ratkins/RGBConverter) library. It's in `CrossFadeHue\src\RGBConverter`.

---






## TODO: fade between colors
- First with simple for loops
- Then with HSL
- Probably want to move this to some advanced section, so students can move on to input

<!-- Could be fun to write a p5js sketch that shows how the initial RGB LED naive code works and then the HSL version -->