---
layout: default
title: L7&#58; Rate Blinking LEDs
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

In this lesson, we will learn how to blink multiple LEDs at different rates and build our first [C/C++ class](http://www.cplusplus.com/doc/tutorial/classes/), which will greatly simplify our code and, as an added bonus, reduce its size by eliminating code redundancy! 

As with our previous lesson on [crossfading RGB LEDs](rgb-led-fade.md), this lesson involves **simple circuits** but comparatively **complex code**. Often, when using microcontrollers, our code is the magic sauce—the circuits are straightforward but the code can be complicated.

## Background

The canonical and beloved **first Arduino sketch**, [Blink](https://www.arduino.cc/en/tutorial/blink), enables beginners to quickly build and write code for a circuit. The code looks something like this, which we covered in our own [Blink lesson](led-blink.md):

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

Blink is easy. It's gratifying. But... it sets up a flawed mental model about how to structure programs and when/how to use [`delay()`](https://www.arduino.cc/reference/en/language/functions/time/delay/).

What if you want to blink multiple LEDs at **different rates**? How would you do this with `delay()`? Well, **you can't.** While in a `delay()`, your program is literally *doing nothing* (well, it's stuck in a `while` loop waiting for the delay period to finish but that's essentially nothing).

So, what should we do instead? We **eliminate all delays** and track time and state using [state machines](https://en.wikipedia.org/wiki/Finite-state_machine).

## Materials

You'll need **three LEDs**—we'll use red, blue, and yellow but you can use whatever LEDs you want—along with current limiting resistors, a breadboard, and an Arduino.

| Breadboard | Arduino | Three LEDs | Three Resistors |
|:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![An RGB LED]({{ site.baseurl }}/assets/images/RedBlueYellowLEDs_Fritzing_120w.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Breadboard | Arduino Uno, Leonardo, or similar  | Three LEDs (We'll use a red, blue, and yellow) | **Three** 220Ω Resistors |

## Circuit

The circuit is the same as our basic [LED blink lesson](led-blink.md) but we duplicate it three times—once for each LED. By now, this should feel familiar. Indeed, you may not even need a wiring diagram like this to help!

![Wiring diagram for three LEDs hooked up to Pins 2, 5, and 9 (with anodes facing pins and cathodes connected to GND with current limiting resistors)](assets/images/ArduinoUno_LEDBlink3_WiringDiagramWithSchematic.png)

## Writing code

We are going to implement two approaches:

1. The first introduces the overall idea of using state tracking variables and state change timestamps to control timing output without `delays()`.
2. The second will use the same approach but simplified using object-oriented programming. Here, we'll also show you how to make and use a `C++` class in Arduino.

### Multi-rate blinking: an initial approach

For our initial approach, we need four things for each LED:

1. **Pin Number:** An integer value specifying the output pin.
2. **Blink Interval:** A per-LED *blink interval* that controls how long to turn on (`HIGH`) and off (`LOW`) the LED. 
3. **Toggle Timestamp:** The *last time the LED was toggled* from `HIGH` to `LOW` or `LOW` to `HIGH`. 
4. **Current LED State:** The *current LED state* (either `HIGH` or `LOW`), which is toggled every blink interval.

For the **blink interval**, we'll use `const` variables like `LED1_BLINK_INTERVAL_MS`, `LED2_BLINK_INTERVAL_MS`, and `LED3_BLINK_INTERVAL_MS`

{% highlight C %}
const int LED1_OUTPUT_PIN = 2;
const int LED1_BLINK_INTERVAL_MS = 200; // interval at which to blink LED1 (in milliseconds)

const int LED2_OUTPUT_PIN = 5;
const int LED2_BLINK_INTERVAL_MS = 333; // interval at which to blink LED2 (in milliseconds)

const int LED3_OUTPUT_PIN = 9;
const int LED3_BLINK_INTERVAL_MS = 1111; // interval at which to blink LED3 (in milliseconds)
{% endhighlight C %}

For the **toggle timestamps** and **LED states**, we'll use variables like `_led1LastToggledTimestampMs` and `_led1State`. We can toggled `ledState` simply by: `ledState = !ledState`.

{% highlight C %}
unsigned long _led1LastToggledTimestampMs = 0; // tracks the last time LED1 was updated
int _led1State = LOW; // will toggle between LOW and HIGH

unsigned long _led2LastToggledTimestampMs = 0; // tracks the last time LED2 was updated
int _led2State = LOW; // will toggle between LOW and HIGH

unsigned long _led3LastToggledTimestampMs = 0; // tracks the last time LED3 was updated
int _led3State = LOW; // will toggle between LOW and HIGH
{% endhighlight C %}

To capture timestamps, we use Arduino's [`millis()` ](https://www.arduino.cc/reference/en/language/functions/time/millis/) function, which returns "the number of **milliseconds** passed since the Arduino board began running the current program". On the Arduino, the `unsigned long` data type is 32 bits (4 bytes), which ranges from `0` to `4,294,967,295` (2^32 - 1). Thus, `millis()` will overflow—go back to zero and begin counting again—after `4,294,967,295` milliseconds  (or approximately 50 days). If you need more precise timing, you could use `micros()`, which provides **microsecond resolution** rather than millisecond resolution but `micros()` overflows every ~70 minutes.

We then use the same [BlinkWithoutDelay.ino](https://github.com/makeabilitylab/arduino/blob/master/Basics/digitalWrite/BlinkWithoutDelay/BlinkWithoutDelay.ino) code as before for each LED:

{% highlight C %}
unsigned long currentTimestampMs = millis();

// Check to see if we reached the toggle state interval for LED1 
if (currentTimestampMs - _led1LastToggledTimestampMs >= LED1_BLINK_INTERVAL_MS) {
  _led1LastToggledTimestampMs = millis();
  _led1State = !_led1State;
  digitalWrite(LED1_OUTPUT_PIN, _led1State);
}

// Check to see if we reached the toggle state interval for LED2
if (currentTimestampMs - _led2LastToggledTimestampMs >= LED2_BLINK_INTERVAL_MS) {
  _led2LastToggledTimestampMs = millis();
  _led2State = !_led2State;
  digitalWrite(LED2_OUTPUT_PIN, _led2State);
}

... // and so on, copy the above block of code for each LED you're trying to blink
{% endhighlight C %}

The code, in full, is below:

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/digitalWrite/BlinkMultiple/BlinkMultiple.ino?footer=minimal"></script>

<!-- TODO: insert video -->

### Multi-rate blinking: an object-oriented approach

Given the amount of code redundancy and shared logic and structure, our solution is a strong candidate for refactoring into functions or classes. We're going to define a new class, called `Blinker`, to help, which will greatly simplify our code, decrease redundancy (and the potential for human error), and even make our compiled code smaller. With `Blinker`, our code will reduce to:

{% highlight C++ %}
Blinker _led1Blinker(2, 200);  // specify pin, blink interval
Blinker _led2Blinker(5, 333);  // specify pin, blink interval
Blinker _led3Blinker(9, 1111); // specify pin, blink interval

// The setup function runs once when you press reset or power the board
void setup() {
  // empty 
}

// The loop function runs over and over again forever
void loop() {
  _led1Blinker.update();
  _led2Blinker.update();
  _led3Blinker.update();
}
{% endhighlight C++ %}

#### Making the Blinker class
If you're familiar with object-oriented programming and declaring and using classes in `Java`, `C#`, `Python`, and even, to some extent, `JavaScript` since [ECMAScript 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), then `C++` classes will feel familiar. `C++` classes have a classname, member variables, member functions, and like `C#` and `Java`, access specifiers (*e.g.,* private, public). For a quick tutorial, see these links ([link1](https://www.geeksforgeeks.org/c-classes-and-objects/), [link2](http://www.cplusplus.com/doc/tutorial/classes/)).

To build our Blinker class, recall that we need four things per LED:
1. **Pin Number:** An integer value specifying the output pin.
2. **Blink Interval:** A *blink interval* that controls how long to turn on (`HIGH`) and off (`LOW`) the LED. 
3. **Toggle Timestamp:** The *last time the LED was toggled* from `HIGH` to `LOW` or `LOW` to `HIGH`. 
4. **Current LED State:** The *current LED state* (either `HIGH` or `LOW`), which is toggled every blink interval.

For `Blinker`, we are simply going to convert these four things into member variables.

{% highlight C++ %}
class Blinker{

  private:
    const int _pin;                 // output pin
    const unsigned long _interval;  // blink interval in ms

    int _state;                     // current state (either HIGH OR LOW)
    unsigned long _lastToggledTimestamp; // last state toggle in ms
{% endhighlight C++ %}

Finally, we need two functions: a `constructor` and `update()`—the latter which handles our core logic and toggling code and is intended to be called once per `loop()` iteration. We are going to declare these in the class definition itself:

{% highlight C++ %}
  public: 
    Blinker(int pin, unsigned long blinkInterval) :
        _pin(pin), _interval(blinkInterval) // initialize const like this in C++
    {
        _state = LOW;
        _lastToggledTimestamp = 0;
        pinMode(_pin, OUTPUT);
    }

    /**
    * Calculates whether to toggle output state based on the set interval
    * Call this function once per loop()
    */ 
    void update(){
        unsigned long currentTimestampMs = millis();
        
        if (currentTimestampMs - _lastToggledTimestamp >= _interval) {
        _lastToggledTimestamp = currentTimestampMs;
        _state = !_state;
        digitalWrite(_pin, _state);
        }
    }
{% endhighlight C++ %}

#### Full Blinker code
So, the entire code looks like this:

<script src="https://gist-it.appspot.com/https://github.com/makeabilitylab/arduino/blob/master/Basics/digitalWrite/BlinkMultipleWithInternalClass/BlinkMultipleWithInternalClass.ino?footer=minimal"></script>

## Exercises

Want to go further? Here are some design challenges to help improve your skills:

- **Morse code**. Try adapting the Blinker class to support a sequence of on and off intervals like [Morse code](https://en.wikipedia.org/wiki/Morse_code)
- **Fade**. What about *fading* the LEDs rather than flashing them. How would you do this? **Stuck?** Nick Gammon wrote a class for this on his [blog](https://www.gammon.com.au/blink) called LedFader but don't look at his solution until you've tried your own!

## References

Some additional references:

- [Multi-tasking the Arduino: Part 1 - Blinking without delays](https://learn.adafruit.com/multi-tasking-the-arduino-part-1/overview), Adafruit Learn
- [Multi-tasking the Arduino: Part 2 - Using interrupts](https://learn.adafruit.com/multi-tasking-the-arduino-part-2/overview), Adafruit Learn
- [Multi-tasking the Arduino: Part 3](https://learn.adafruit.com/multi-tasking-the-arduino-part-3/overview), Adafruit Learn
- [How to do multiple things at once](https://www.gammon.com.au/blink), Nick Gammon

## Next Lesson

We did it! This completes our [Intro to Output](intro-output.md) series. Let's now begin [Intro to Input](intro-output.md) to learn about buttons, sensors, voltage dividers, and more!

<!-- In the next lesson, we'll learn about making sound with passive piezoelectric buzzers and the [`tone()`](https://www.arduino.cc/reference/en/language/functions/advanced-io/tone/).

<span class="fs-6">
[Previous: LED Blink 2](led-blink2.md){: .btn .btn-outline }
[Next: Cross-fading RGB LEDs](rgb-led-fade.md){: .btn .btn-outline }
</span> -->