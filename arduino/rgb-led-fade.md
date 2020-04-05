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

This is our most complex lesson yet. From a circuit standpoint, things are easy—it's the same circuit as [before](rgb-led.md) (yay!). From a coding standpoint, things are more complicated. If you don't have a coding background, it's OK if the code doesn't make sense. Try to read it and understand it given your current abilities. Certainly, feel free to copy the code and play with it on your own!

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

The [code](https://github.com/makeabilitylab/arduino/blob/master/Basics/analogWrite/CrossFadeRGB/CrossFadeRGB.ino) for crossfading an RGB LED is the most complex that we've covered thus far (and, if you don't have a coding background, it's OK if you don't fully understand it). For those in our engineering courses (like Ubiquitous Computing or Prototyping Interactive Systems), you should read and understand this code.

At a high level, the code works by increasing one LED color value (from `0` to `255`) while decreasing another (from `255` to `0`). For example, the code begins by **decreasing** the red LED `analogWrite` value while **increasing** the green LED value. When the red LED value reaches `0`, the green LED will have reached `255`, so we begin decreasing the green LED value and shift to increasing the blue LED value, and so on.

We have an array `int _rgbLedValues[3]` that stores our `{int red, int green, int blue}` values. We initialize the array to `{255, 0, 0}`—so `red=255`, `green=0`, and `blue=0`. So, our RGB LED will start red. 

{% highlight C %}
int _rgbLedValues[] = {255, 0, 0}; // Red, Green, Blue
{% endhighlight C %}

To help index into this array, we create an `enum` so that we can access our RGB LED values by writing `_rgbLedValues[RED]`, `_rgbLedValues[GREEN]`, and `_rgbLedValues[BLUE]` rather than `_rgbLedValues[0]`, `_rgbLedValues[1]`, and `_rgbLedValues[2]`:

{% highlight C %}
enum RGB{
  RED,
  GREEN,
  BLUE,
  NUM_COLORS
};
{% endhighlight C %}

Our crossfade algorithm uses two `for` loops to simultaneously increase one color while decreasing another. We start by **increasing green** and **decreasing red** as controlled by `enum RGB _curFadingUp = GREEN;`) and (`enum RGB _curFadingDown = RED;`). Once we reach our maximum color value `255` for the current `_curFadingUp` color, we select the next color to increase (beginning with `RED` and then to `GREEN` then `BLUE` then back to `RED`). Similarly, once we reach our minimum color value `0` for `_curFadingDown`, we select the next color to decrease (same order as before: from `RED` to `GREEN` to `BLUE` then back to `RED`).

{% highlight C %}
void loop() {

  // Increment and decrement the RGB LED values for the current
  // fade up color and the current fade down color
  _rgbLedValues[_curFadingUp] += FADE_STEP;
  _rgbLedValues[_curFadingDown] -= FADE_STEP;

  // Check to see if we've reached our maximum color value for fading up
  // If so, go to the next fade up color (we go from RED to GREEN to BLUE
  // as specified by the RGB enum)
  // This fade code partially based on: https://gist.github.com/jamesotron/766994
  if(_rgbLedValues[_curFadingUp] > MAX_COLOR_VALUE){
    _rgbLedValues[_curFadingUp] = MAX_COLOR_VALUE;
    _curFadingUp = (RGB)((int)_curFadingUp + 1);

    if(_curFadingUp > (int)BLUE){
      _curFadingUp = RED;
    }
  }

  // Check to see if the current LED we are fading down has gotten to zero
  // If so, select the next LED to start fading down (again, we go from RED to 
  // GREEN to BLUE as specified by the RGB enum)
  if(_rgbLedValues[_curFadingDown] < 0){
    _rgbLedValues[_curFadingDown] = 0;
    _curFadingDown = (RGB)((int)_curFadingDown + 1);

    if(_curFadingDown > (int)BLUE){
      _curFadingDown = RED;
    }
  }

  // Set the color and then delay
  setColor(_rgbLedValues[RED], _rgbLedValues[GREEN], _rgbLedValues[BLUE]);
  delay(DELAY_MS);
}
{% endhighlight C %}

In total, we crossfade between 768 color combinations (`3*256`) though this can be controlled with `const int FADE_STEP`—the total amount to step up and down the `analogWrite` LED values per loop iteration. It's set to `5` by default, which results in 156 color combinations.

Here's the code in its entirety:

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/analogWrite/CrossFadeRGB/CrossFadeRGB.ino?footer=minimal"></script>

And here's a video showing the code running in the Tinkercad simulator. You can see the crossfade colors and a plot of the corresponding `analogWrite` values.

<iframe width="736" height="414" src="https://www.youtube.com/embed/ZyfHRQFwmeg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!--TODO: add in a p5js that demonstrates how this works? And maybe let's reader play with different color values? -->

### Crossfading in HSL color space

The second method for crossfading the RGB LED takes advantage of the [Hue, Saturation, Lightness (HSL)](https://en.wikipedia.org/wiki/HSL_and_HSV) color space. To change the "color" of the RGB LED, we are really talking about changing its hue. It's much easier to do this using HSL and then converting to  RGB set our RGB LED color. In fact, our code will be comparatively much simpler, something like the following pseudocode (we increment hue but keep saturation and lightness fixed):

{% highlight C %}
// Basic overview of our approach (pseudocode)
float hue = 0, saturation = 0.8, lightness = 1.0;
float stepValue = 0.1f;
float MAX_HUE = 1.0f;
loop(){
    hue += stepValue;  // increment hue
    RGB rgb = convertHslToRgb(hue, saturation, lightness) // convert HSL to RGB
    setColor(rgb.red, rgb.green, rgb.blue); // set the color
    if(hue > MAX_HUE){ // reset hue to zero if MAX_HUE reached
        hue = 0;
    }
}
{% endhighlight C %}

The downside of this implementation is that we must use `floats` with the [RGBConverter](https://github.com/ratkins/RGBConverter) library. TODO: expand on why floats can be costly for embedded programming with microcontrollers.

The full code from our GitHub is below. **Importantly**, you cannot simply copy/paste this code into your Arduino IDE. You must have the RGBConverter code in sub-folder called `src` in your root sketch directory. Use the same directory structure as our [GitHub](https://github.com/makeabilitylab/arduino/tree/master/Basics/analogWrite/CrossFadeHue).

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/analogWrite/CrossFadeHue/CrossFadeHue.ino?footer=minimal"></script>

<!-- TODO look up what the minimum step value is that makes sense with a 255 quantization -->

---
**NOTE:**

There are multiple ways of loading external libraries in the Arduino IDE (see this [official Arduino tutorial](https://www.arduino.cc/en/guide/libraries)); however, most are focused on **global libraries**—that is libraries that **all** of your sketches have access to. What if you want to load just a local library for the current sketch? Well, it turns out this fundamental "feature" has a long, sordid history in the Arduino community (for example: [link](https://stackoverflow.com/questions/4705790/keeping-all-libraries-in-the-arduino-sketch-directory), [link](https://arduino.stackexchange.com/questions/8651/loading-local-libraries)). In short, there is a way to do this since the ~Arduino 1.6 release; however, you must put all libraries in your target sketch folder (which has the `.ino` file) in a sub-folder called `src` ([link](https://github.com/arduino/Arduino/issues/4936#issuecomment-312953260)). Notice how this is exactly our setup for using the [RGBConverter](https://github.com/ratkins/RGBConverter) library. It's in `CrossFadeHue\src\RGBConverter`.

---

<!-- Could be fun to write a p5js sketch that shows how the initial RGB LED naive code works and then the HSL version -->

## Next Lesson

For our next and final [Intro to Output](intro-output.md) lesson, we are going to learn how to blink multiple LEDs at different frequencies, which is, evidently, one of the most common questions on the Arduino forums—perhaps because of the way the [official Arduino Blink tutorial](https://www.arduino.cc/en/tutorial/blink) teaches beginners to use`delay()` to control blinking rates. Before starting the lesson, it's worth thinking about how *you* would blink multiple frequencies at different rates. :)

<span class="fs-6">
[Previous: RGB LEDs](rgb-led.md){: .btn .btn-outline }
[Next: Blinking Multiple LEDs at Different Rates](led-blink3.md){: .btn .btn-outline }
</span>

## TODO: fade between colors
- First with simple for loops
- Then with HSL
- Probably want to move this to some advanced section, so students can move on to input

