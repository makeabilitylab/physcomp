---
layout: default
title: L3&#58; Fading an LED
nav_order: 3
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

In the [previous lesson](led-blink.md), we learned how to turn on and off an LED using [`digitalWrite`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/)—which worked by alternatively setting Pin 3 to 5V (`HIGH`) and 0V (`LOW`). In this lesson, we'll learn how to programmatically control the output voltage at finer gradations using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/). More specifically, we will gradually fade an LED on and off like the animation below illustrates.

![Animation showing the LED on Pin 3 gradually fading on and off](assets/movies/Arduino_LEDFade_Pin3.gif)
This illustrative animation doesn't show current (the yellow circles) only due to my limited animation skills. But hopefully you can visualize (in your mind) how the LED varies in brightness with current just the same. :)
{: .fs-1 }

## Materials
You will use the same materials as [before](led-blink.md), including the [Arduino IDE](https://www.arduino.cc/en/main/software) and a USB cable to upload your program from your computer to your Arduino.

| Arduino | LED | Resistor |
|:-----:|:-----:|:-----:|
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |
| ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |

## Making the circuit

As noted in our previous lesson, the Arduino Uno has 14 digital I/O pins:

![Close-up image of the 14 digital I/O pins on the Arduino Uno](assets/images/ArduinoUno_CloseUp_DigitalIOPins.png)

However, **6** of the 14 I/O pins can **also** be used for "analog" output—voltage output that is not just `HIGH` (5V) or `LOW` (0V) but between these two extremes. These analog output pins are indicated by the tilde (`~`) printed next to the pin on the Arduino (silkscreened directly on the Arduino's PCB).

![Close up of the Arduino Uno highlighting the six analog output pins](assets/images/ArduinoUno_CloseUp_AnalogOutputPins.png)

So, for this lesson, we **don't** have to change our circuit at all! You can keep the same circuit as the [LED Blink lesson](led-blink.md). Indeed, this is the reason why we selected Pin 3 in the first place.

![Wiring diagram showing LED cathode wired to GND and LED anode wired to a 220 Ohm resistor and then to Pin 3](assets/images/Arduino_LEDFade_Pin3Circuit.png)

### A common confusion: analog I/O pins are different!

A common confusion amongst beginners is mixing up the analog **output** pins and the analog **input** pins. For digital I/O, the input and output pins are the same and configurable to `INPUT` or `OUTPUT` using the [`pinMode`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) command, the analog I/O pins are different! See the figure below:

![Annotated image of an Arduino Uno showing the difference between analog input and output pins](assets/images/ArduinoUno_AnalogInputAndOutputPinsAreDifferent.png)

We'll learn about analog output in this lesson (using [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/)). In a future lesson, we will learn about analog input (using [`analogRead`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/))

## Using analogWrite

To gradually fade an LED, we are going to use the [`analogWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/) function, which takes in a pin as the first parameter and an 8-bit value between 0-255 as the second. 

### Pulse-width modulation (PWM)

Despite its name, the Arduino Uno, Leonardo, Nano, Mega, and many other Arduino boards do not actually provide **true analog** output via a [digital-to-analog converter (DAC)](https://en.wikipedia.org/wiki/Digital-to-analog_converter). Instead, they use a method called Pulse-Width Modulation (PWM) to *emulate* analog output. For most purposes—like changing the brightness of an LED or controlling the speed of a motor—this won't matter; however, if you want to output a high-frequency sinusoidal waveform—a true analog output signal—like playing music, then you'll need to either find an Arduino microcontroller with a built-in DAC like the [Due](https://store.arduino.cc/usa/due) (see this [SimpleAudioPlayer tutorial](https://www.arduino.cc/en/Tutorial/SimpleAudioPlayer)) or connect your Uno to an external DAC board like this [SparkFun MP3 Player Shield](https://learn.sparkfun.com/tutorials/mp3-player-shield-hookup-guide-v15/all).

So, what does the `analogWrite` function do, exactly? The 8-bit value (0-255) directly controls how long a 5V value is applied to the output pin during one "analog write" period. So, `analogWrite(<pin>, 127)` would output a 5V value for half the period (because 127/255 = ~50%) and `analogWrite(<pin>, 191)` would output a 5V for 75% of the period (because 191/255 = ~75%). This fraction of the time the signal is `HIGH` is called the duty cycle.

![Pulse-width modulation duty cycle graphic](assets/images/PWM_ArduinoCC.png)

Pulse-width modulation duty cycle graph from [arduino.cc](https://www.arduino.cc/en/tutorial/PWM)
{: .fs-1 }

Why does the Arduino Uno only have six PWM outputs? Because the ATmega328 microcontroller has three hardware timers, which control the six PWM outputs.

Could I manually implement PWM on any pin simply by rapidly turning the pin on and off at a desired frequency and duty cycle? Yes, however, the PWM waveform could be jittery (unless you disable interrupts). See: [SecretsOfArduinoPWM](https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM) and [example code](https://playground.arduino.cc/Main/PWMallPins/) that manually implements a PWM loop.

To learn more about PWM, read this [guide from ITP NYU](https://itp.nyu.edu/physcomp/lessons/microcontrollers/analog-output/) and watch their "analog output" video:

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/93554355" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<!-- TODO: in the future, it would be cool to hook up OLED to display analogOut value + show PWM signal on Oscilliscope with
     top-down workbench camera. Could do two versions: (1) with the code running as written and another (2) with a pot
     to control the PWM signal -->

## Writing the code

OK, so let's write some code!

### Step 1: Start a new sketch in the Arduino IDE

Start a new sketch in the Arduino IDE:

![Screenshot of the Arduino IDE showing a new empty sketch](assets/images/ArduinoIDE_FreshSketch.png)

### Step 2: Write initialization code

Our initialization code is the same as for [LED blink](led-blink.md) except for the addition of `const int MAX_ANALOG_OUT = 255;` and a constant for the delay amount of 5 milliseconds (`const int DELAY_MS = 5;`).

{% highlight C %}
const int LED_OUTPUT_PIN = 3;
const int MAX_ANALOG_OUT = 255; // the max analog output on the Uno is 255
const int DELAY_MS = 5;

void setup() {
  // set Pin 3 to output
  pinMode(LED_OUTPUT_PIN, OUTPUT);
}
{% endhighlight C %}

### Step 3: Write fade loop

Now, write code that outputs steadily increasing values for [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/) (to fade on) followed by steadily decreasing values (to fade off).

{% highlight C %}
void loop(){
  // fade on
  for(int i = 0; i <= MAX_ANALOG_OUT; i += 1){
    analogWrite(LED_OUTPUT_PIN, i);
    delay(DELAY_MS);
  }

  // fade off
  for(int i = MAX_ANALOG_OUT; i >= 0; i -= 1){
    analogWrite(LED_OUTPUT_PIN, i);
    delay(DELAY_MS);
  }
}
{% endhighlight C %}

The full code from our [GitHub repo](https://github.com/jonfroehlich/arduino/blob/master/Basics/analogWrite/FadeOnAndOffForLoop/FadeOnAndOffForLoop.ino) is:
<script src="https://gist-it.appspot.com/https://github.com/jonfroehlich/arduino/blob/master/Basics/analogWrite/FadeOnAndOffForLoop/FadeOnAndOffForLoop.ino?footer=minimal"></script>

### Step 4: Compile, upload, and run!

Now, compile, upload, and run the code. After upload completes, the LED should immediately begin fading on then off. See video below.

<iframe width="736" height="414" src="https://www.youtube.com/embed/Y0mSFmW7G4U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Visualizing the voltage output

We can visualize the (effective) voltage output on Pin 3 using the Arduino IDE's [Serial Plotter](https://learn.adafruit.com/experimenters-guide-for-metro/circ08-using%20the%20arduino%20serial%20plotter). In the video below, we see a simulation of our code + circuit running in Tinkercad. On the right side, in the [Serial Monitor](https://www.programmingelectronics.com/using-the-print-function-with-arduino-part-1/) window, we are printing and graphing out the real-time voltages output on Pin 3. Hopefully, this matches your intuition for how things work.

<video controls="controls">
  <source src="assets/movies/Arduino_LEDFadeWithGraph_Pin3.mp4" type="video/mp4">
</video>

Of course, it's the **current** through the LED that determines brightness. Again, given Ohm's Law ($$I = \frac{V}{R}$$), we can determine the current through our circuit at various Pin 3 outputs. Recall that current does not pass through an LED until its forward voltage $$V_f$$ condition is met. With a red LED, a common forward voltage is $$V_f=2V$$. With [`analogWrite`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/), the GPIO pin is still driven `HIGH` (5V) but only for a fraction of the time due to PWM (this fraction is called the duty cycle). So, the $$V_f$$ requirement is still met and our **eyes** perceive the LED on but it's actually flashing on/off imperceptibly quickly! 

To calculate the current through our LED circuit with PWM, we can use the following equation: $$I = \frac{V_s - V_f}{R}DutyCycle_{fraction}$$. So, for example, if we `analogWrite` a `51` then our $$DutyCycle_{fraction}=\frac{51}{255}\to0.2$$. With a 220Ω, our current would be: $$I=\frac{5V - 2V}{220Ω}0.2\to2.7mA$$. See the table below.

| Resistor | Pin 3 Voltage | Pin 3 Value | PWM Duty Cycle | Resulting Current |
|:-------------|:-------------|:-------------|:-------------|:----------------|
| 220Ω | 5V | 0 | $$\frac{0}{255}=0.0$$ | $$I = \frac{5V-2V}{220Ω}0.0=0.0mA $$ |
| 220Ω | 5V | 45 | $$\frac{45}{255}=0.176$$ | $$I = \frac{5V-2V}{220Ω}0.176=2.4mA $$ |
| 220Ω | 5V | 103 | $$\frac{103}{255}=0.404$$ | $$I = \frac{5V-2V}{220Ω}0.404=5.5mA $$ |
| 220Ω | 5V | 128 | $$\frac{128}{255}=0.502$$ | $$I = \frac{5V-2V}{220Ω}0.780=6.8mA $$ |
| 220Ω | 5V | 199 | $$\frac{199}{255}=0.780$$ | $$I = \frac{5V-2V}{220Ω}0.780=10.5mA $$ |
| 220Ω | 5V | 255 | $$\frac{255}{255}=1.0$$ | $$I = \frac{5V-2V}{220Ω}1.0=13.4mA $$ |

## Improved fading approach: limiting delays

Recall that we want to limit the use of long `for` loops and long `delays` in our code. Why? Because while we are in a delay, we can't do anything else: we can't read or respond to other input (side note: we could use interrupts but let's defer that point for now).

So, let's rewrite the fade example but without for loops and, instead, rely on the fact that `loop()` is already a `loop` :). While the code below is different, the resulting LED fade behavior is the same (so you won't notice a difference if you try them both out).

---

**NOTE:**

I have a habit of prefixing my global variables by `_` but this is just my own convention and helps me easily discern between local variables and global variables.

---

{% highlight C %}
const int LED_OUTPUT_PIN = 3;
const int MAX_ANALOG_OUT = 255; // the max analog output on the Uno is 255
const int DELAY_MS = 5;

int _fadeAmount = 5;      // the amount to fade the LED by on each step
int _curBrightness = 0;   // how bright the LED is

// The setup function runs once when you press reset or power the board
void setup() {
  // set the LED pin to as an output
  pinMode(LED_OUTPUT_PIN, OUTPUT);
  Serial.begin(9600); // for using Serial.println
}

// The loop function runs over and over again forever
void loop() {
  
  // set the brightness of the LED pin
  analogWrite(LED_OUTPUT_PIN, _curBrightness);

  // change the brightness for next time through the loop
  _curBrightness = _curBrightness + _fadeAmount;

  // reverse the direction of the fading at the end of each fade direction
  if (_curBrightness <= 0 || _curBrightness >= MAX_ANALOG_OUT) {
    _fadeAmount = -_fadeAmount; // reverses fade direction
  }
  
  // wait for some milliseconds to see the dimming effect
  delay(DELAY_MS);
}
{% endhighlight C %}

## Next Lesson

In the [next lesson](led-blink2.md), we will learn about the difference between **current sources** and **current sinks** to help reinforce our understanding of how microcontrollers can control output.

<span class="fs-6">
[Previous: LED Blink](led-blink.md){: .btn .btn-outline }
[Next: LED Blink 2](led-blink2.md){: .btn .btn-outline }
</span>
