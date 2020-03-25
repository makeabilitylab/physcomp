---
layout: default
title: L2&#58; Blinking an LED
nav_order: 2
parent: Intro to Arduino
has_toc: true # (on by default)
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---
In our [first activity](led-on.md), we directly hooked up an LED circuit to the Arduino's 5V pin. While this enabled learning about Arduino's supply voltage and GND pins and gave us practical experience wiring electrical components into the Arduino ports, it was admittedly, a toy exercise.

In this activity, we are going to do something more exciting: use the Arduino to turn the LED on and off by *programatically* controlling the output voltage on one of Arduino's GPIO pins. This begins our entrée into the two key aspects of making with microcontrollers: (1) building circuits and (2) writing code to interact with those circuits.

![Animation showing an LED connected to Pin 3 on the Arduino blinking on and off](assets/movies/Arduino_LEDBlink_Pin3.gif)

## Materials

You will use the same materials as before. You will also need the [Arduino IDE](https://www.arduino.cc/en/main/software) and a USB cable to upload your program from your computer to your Arduino.

| Arduino | LED | Resistor |
|:-----:|:-----:|:-----:|
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |
| ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | Red LED | 220Ω Resistor |

## Making the circuit

Using the same resistor-wrapped red LED from [before](led-on.md#step-1-wrap-resistor-around-led-leg), plug the anode + resistor side into Pin 3 and the cathode into GND. 

---

**TIP:** Double check to make sure that you've correctly connected GND and Pin 3—it's easy to be "off-by-one-pin" (a frustrating error!).

---

![Wiring diagram showing LED cathode wired to GND and LED anode wired to a 220 Ohm resistor and then to Pin 3](assets/images/Arduino_LEDBlink_Pin3Circuit.png)

Next, we'll write C code for the Arduino to turn on the LED from Pin 3, which programmatically sets Pin 3 to 5V.

## Get the Arduino IDE

But first, we need to download and install the Arduino IDE (if you haven't already).

### Step 1: Download and install the Arduino IDE

Download and install the local Mac, Windows, or Linux version of the [Arduino IDE](https://www.arduino.cc/en/main/software). We will **not** be using the Cloud version.

### Step 2: Open the IDE

After installation is complete, open the Arduino IDE. Notice that there are **two blocks** of code (called functions):

1. The first block: `setup()`, which is called once and only once when the Arduino is turned on
2. And the second block: `loop()`, which is called as soon as `setup()` completes. When `loop()` completes, it's automatically called again and again (until the Arduino is turned off).

![Screenshot of the Arduino IDE](assets/images/ArduinoIDE_BlankAndAnnotated.png)

For those who have used [Processing](https://processing.org/)—a programming environment for digital artists and creators—this code structure should seem familiar. Indeed, the Arduino IDE derives from Processing.

| Processing | p5js |
|----|----|
| ![Screenshot of the Processing IDE](assets/images/ProcessingIDE_Blank.png) | ![Screenshot of p5js IDE](assets/images/p5jsIDE_Blank.png) |

## Turn on LED programatically via Pin 3

Now, we are going to write code to turn on our LED by setting Pin 3 to HIGH (or 5V). Then, we will modify this code to flash the LED both on *and* off.

The Arduino Uno has 14 digital pins that can be used for general purpose digital I/O (input/output)—that is, to read or write digital information (HIGH or LOW) using [`digitalRead()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) and [`digitalWrite()`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/), respectively. We could have selected any of these pins for this lesson but we chose Pin 3 (in part, because this will simplify a few of the future lessons).

![Close-up image of the 14 digital I/O pins on the Arduino Uno](assets/images/ArduinoUno_CloseUp_DigitalIOPins.png)

You can control any of these 14 digital I/O pins with three functions:

1. [`pinMode(int pin, int mode)`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) configures a specified pin as either an `INPUT` or `OUTPUT`
2. [`digitalRead(int pin)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/) reads digital input from the specified pin, either `HIGH` or `LOW`.
3. [`digitalWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/) writes digital output to the specified pin, either `HIGH` or `LOW`.

Let's write our program to set Pin 3 to HIGH (5V).

### Step 1: Start a new sketch in the Arduino IDE
Start a new sketch in the Arduino IDE:

![Screenshot of the Arduino IDE showing a new empty sketch](assets/images/ArduinoIDE_FreshSketch.png)

### Step 2: Set the pinMode for Pin 3
Because the 14 digital I/O pins can used for either input or output, we need to specify that we want to use Pin 3 for *output*. We want the Arduino to output a 5V signal on Pin 3 to turn on our LED. We configure pins in the  `setup()` block and use the [`pinMode(int pin, int mode)`](https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/) command, which takes in a pin as the first parameter and a mode (`INPUT` or `OUTPUT`) as the second.

{% highlight C %}
void setup() {
  // put your setup code here, to run once:
  pinMode(3, OUTPUT);
}
{% endhighlight C %}

### Step 3: Set Pin 3 HIGH

Lastly, we need to actually set the Pin 3 signal to HIGH. For this, we use the  [`digitalWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/) command, which takes in a pin as the first parameter and a value (`HIGH` or `LOW`) as the second.

{% highlight C %}
void setup() {
  // put your setup code here, to run once:
  pinMode(3, OUTPUT);
  digitalWrite(3, HIGH); // turn LED on (output 5V)
}
{% endhighlight C %}

### Step 4: Compile the code
We did it! Now it's time to compile and upload the code to Arduino.

Compile the code by clicking on the "verify" checkmark button in the upper-left corner of the Arduino IDE. If you haven't already, the Arduino IDE will also ask you to save your sketch. If there are any syntax or other identifiable errors in the code, the Arduino IDE will print them out in the console window at the bottom.

![Animation showing how to compile and save a sketch in the Arduino IDE](assets/movies/ArduinoIDE_Compile.gif)

### Step 5: Upload the code to Arduino

Finally, upload the code to the Arduino! Once complete, the code automatically runs.

TODO: insert video.

## Turn on and off the LED programatically via Pin 3

Now, let's modify our code to turn on *and* off the LED programatically. More specifically, we will alternate between having the LED on for one second and having the LED off for one second. To do this, we'll use the [`delay(int ms)`](https://www.arduino.cc/reference/en/language/functions/time/delay/) function, which pauses the program for the specified amount of time (in milliseconds).

### Step 1: Move the digitalWrite code from setup() to loop()

First, move the digitalWrite code from `setup()` to `loop()`:

{% highlight C %}
void setup() {
  // set Pin 3 to output
  pinMode(3, OUTPUT);
}

void loop() {
  digitalWrite(3, HIGH);  // turn LED on (output 5V)
}
{% endhighlight C %}

### Step 2: Add in delays and code to turn off LED

Now, add in code to pause (for one second) and then turn off the LED (for one second). Remember, when `loop()` completes, it is automatically called again (making the LED blink continuously).

{% highlight C %}
void setup() {
  // set Pin 3 to output
  pinMode(3, OUTPUT);
}

void loop() {
  digitalWrite(3, HIGH);  // turn LED on (output 5V)
  delay(1000);            // wait one second
  digitalWrite(3, LOW);   // turn LED off (output 0V)
  delay(1000);            // wait another second
}
{% endhighlight C %}

### Step 3: Compile and upload

We're done! Now, compile and upload the code and see it run!

TODO: insert video

### Step 4: Replace constants

Typically, we want to limit the use of *literal constants* and replace them by variables. So, while the code below is functionally equivalent to that above, it's more maintainable (and less prone to errors). Here, we define our output pin as `LED_OUTPUT_PIN`.

{% highlight C %}
const int LED_OUTPUT_PIN = 3;
void setup() {
  // set Pin 3 to output
  pinMode(LED_OUTPUT_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_OUTPUT_PIN, HIGH);  // turn LED on (output 5V)
  delay(1000);            // wait one second
  digitalWrite(LED_OUTPUT_PIN, LOW);   // turn LED off (output 0V)
  delay(1000);            // wait another second
}
{% endhighlight C %}

### Walking through the code

How does this work? See the code walkthrough video below:

<video controls="controls">
  <source src="assets/movies/Arduino_BlinkWithCode_Pin3.mp4" type="video/mp4">
</video>

### Mental model check: code is loaded and running on the Arduino

As a quick mental model check, it's worth emphasizing that once you upload the code to your Arduino, you no longer need the USB cable. Instead, for example, you could run your Arduino off of a 9V battery using the barrel jack. The code is stored on your Arduino even when the Arduino loses power.

<video controls="controls">
  <source src="assets/movies/Arduino_LEDBlink_Pin3-9VPower.mp4" type="video/mp4">
</video>

### Our Blink code is in GitHub

You can access our Blink code in our [Arduino GitHub repository](https://github.com/jonfroehlich/arduino). It's also displayed below:
<script src="https://gist-it.appspot.com/https://github.com/jonfroehlich/arduino/blob/master/Basics/digitalWrite/Blink/Blink.ino?footer=minimal"></script>

## Use the built-in LED

Finally, it's worth pointing out that Arduino has a built-in LED that's often useful for some quick debugging (*e.g.,* turn on the built-in LED to indicate some program state). On the Arduino Uno and Leonardo, the built-in LED is on Pin 13. So, if you write `digitalWrite(13, HIGH);` in your code, the built-in LED will turn on.

The official [Arduino Blink example](http://www.arduino.cc/en/Tutorial/Blink) uses the built-in LED to demonstrate blinking. You can access this example directly in the Arduino IDE:

![Screenshot of accessing the official Blink example directly from the Arduino IDE](assets/images/ArduinoIDE_FileMenuToBlinkExample.png)

## Next Lesson

In the next lesson, we will learn how to control the output voltage not just at `LOW` (0V) or `HIGH` (5V) but at finer levels between 0 and 5V using [`analogWrite(int pin, int value)`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/).

<span class="fs-6">
[Previous: Turning on an LED with Arduino](led-on.md){: .btn .btn-outline }
[Next: Fading an LED with Arduino](led-fade.md){: .btn .btn-outline }
</span>