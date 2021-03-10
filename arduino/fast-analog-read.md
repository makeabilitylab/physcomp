---
layout: default
title: Fast Analog Read
parent: Advanced Arduino
has_toc: false # on by default
nav_exclude: true
usetocbot: true
---

## Speeding up the Arduino

The Arduino `C` library attempts to provide an easy-to-understand and accessible API to program and use microcontrollers. However, this comes at a cost. There are a number of interesting online discussions and blog posts analyzing Arduino code and providing faster techniques for I/O. Importantly, as Willem Maes—a faculty of engineering in Belgium—notes in his [Speeding Up the Arduino]((http://www.optiloading.be/willem/Arduino/speeding.pdf)) document: 
>the programmers who developed  Arduino weren't just lousy coders who couldn't write fast code, they consciously made the decision to add validations and safety checks since it benefits their target customers.

## How fast can we read data using analogRead and ATmega328? 

Some great discussions online, including:

This [Arduino forum ](https://forum.arduino.cc/index.php?topic=6549.0), which says:

> The ADC clock is 16 MHz divided by a prescale factor. The prescaler is set to 128 (16MHz/128 = 125 KHz) in wiring.c. Since a conversion takes 13 ADC clocks, the sample rate is about 125KHz/13 or 9600 Hz.
>
> So anyway, setting the prescale to, say, 16, would give a sample rate of 77 KHz. Not sure what kind of resolution you would get though!

A [user then followed up with](https://forum.arduino.cc/index.php?topic=6549.msg51572#msg51572):
>Bear in mind that the Arduino digital and analog read/write abstractions that make this platform so easy to use, do reduce the execution time over what could be achieved if one used low level code to directly access these functions. The arduino functions will be slower than the timings quoted above.
>
>For example, the Arduino digitalRead function first does a lookup to convert the Arduino pin number to an actual port and pin. It then disables any PWM function that could be running on this pin. And finally, it executes another dozen instructions or so to actually read the port. I would think it would take well over twenty times longer for each digitalRead compared to directly accessing a specific low level port pin.
>
>AnalogRead also does the Arduino pin mapping lookup and it sets the analog reference bits each time analogRead is called, although this probably represents a small fraction of the total ADC conversion time.
>
>If your application does need digital read times under a microsecond, you can read more about direct port manipulation here: http://www.arduino.cc/en/Reference/PortManipulation

This [blog post ](http://yaab-arduino.blogspot.com/2015/02/fast-sampling-from-analog-input.html)talks about using the "ADC Free Running mode" with interrupts to get a 76.8 KHz sampling rate (and also links [here](https://sites.google.com/site/qeewiki/books/avr-guide/analog-input))

## Who's calling loop() and how fast?

Inspired by the discussion on this [Sparkfun blog post](https://learn.sparkfun.com/blog/1687#comments), I looked up the source code directly to investigate. The entire `int main(void)` function in [main.cpp](https://github.com/arduino/ArduinoCore-avr/blob/2f67c916f6ab6193c404eebe22efe901e0f9542d/cores/arduino/main.cpp) is:

```C
int main(void)
{
    init();
    initVariant();

    #if defined(USBCON)
    USBDevice.attach();
    #endif

    setup();

    for (;;) {
        loop();
        if (serialEventRun) serialEventRun();
    }
    return 0;
}
```

## How fast can we write data using digitalWrite?

From this [Arduino forum post](https://forum.arduino.cc/index.php?topic=4324.msg32961#msg32961), digitalWrite() on a non-PWM pin runs at ~148.4KHz vs. 106.8KHz on a PWM pin. 

You can also manipulate the ports directly rather than via the Arduino libraries (which incur lots of overhead). From the same forum post:

```C
cli();
 while (1) {
   PORTD |= B1000;
   PORTD &= B11110111;
 }
```
Results in a 4MHz square wave.

[Sparkfun](https://learn.sparkfun.com/blog/1687#comments) also has an interesting discussion in comments.

### PWM pins are slower than non-PWM pins

From [Arduino forum](https://forum.arduino.cc/index.php?topic=4324.msg32956#msg32956):
> Speaking of the hefty digitalWrite() overhead, I noticed two things when I went poking into that code.
> 
> One, some pins are slower than others, because they have PWM timers that have to be disengaged.

## My own experiments with digitalWrite and analogRead:

In my own experiments with the SEED DSO Nano v3 pocket-sized oscilloscope (which can measure 0-200KHz, though the guide says max of half this for reliable measurements), the DSO Nano was able to measure the following using an Arduino Leonardo. 

I hooked on the oscilloscope on the individual pin to ground.

### digitalWrite Only
| Experimental Setup | Code | Measured Frequency |
|:----|:----|:----|
| Pin 3 | ```void loop() { digitalWrite(3,_ledVal); _ledVal = !_ledVal; }``` | 97.7KHz |
| Pin 3 | ```while(1){ digitalWrite(3, 1); digitalWrite(3, 0); }``` | 96.4KhZ |
| Pin 2 | ```void loop() { digitalWrite(2,_ledVal); _ledVal = !_ledVal; }``` | DSO Nano couldn't provide an inferred freq. |


### analogRead and digitalWrite
| Experimental Setup | Code | Measured Frequency |
|:----|:----|:----|
| Pin 2 with FASTADC | ```while(1){ int analogVal = analogRead(A0);digitalWrite(2, 1); digitalWrite(2, 0); }``` | 44.7KhZ |
| Pin 2 | ```while(1){ int analogVal = analogRead(A0);digitalWrite(2, 1); digitalWrite(2, 0); }``` | 8.3KhZ |
| Pin 2 | ```void loop() {int analogVal = analogRead(A0); digitalWrite(2, _ledVal); _ledVal = !_ledVal; }``` | 4.52KHz |
| Pin 3 | ```void loop() { int analogVal = analogRead(A0); digitalWrite(3, _ledVal); _ledVal = !_ledVal; }``` | 4.46KHz |