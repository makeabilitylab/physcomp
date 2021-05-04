---
layout: default
title: Inside Arduino
parent: Intro to Arduino
has_toc: true # on by default
nav_exclude: false
nav_order: 4
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

This page is intended to provide more advanced information about the Arduino. Rest assured, you do not need to read or understand this page to use the Arduino! :)

## How can I print multiple variables using Serial.println?

A common question in our courses and, indeed, online such as on [Arduino StackExchange](https://arduino.stackexchange.com/) and the [Arduino forums](https://forum.arduino.cc/) is some variation of: "*How can I print multiple variables in one line of code using* `Serial.println`?" 

Here are some common answers. Note: I have not stress tested them all and I'm sure many solutions are slow and memory inefficient (but if neither of these are concerns, then feel free to use them!)

**First**, perhaps the simplest way is to cast everything as a String and use string concatenation:

``` C
Serial.println((String)"Var 1:" + var1 + " Var 2:" + var2 + " Var 3:" + var3);
```
[Source](https://arduino.stackexchange.com/a/69566)
{: .fs-1 }

Note: you should only do this for rapid prototypes because of memory inefficiencies with creating Strings in `C`; see ["The Evils of Arduino Strings"](https://hackingmajenkoblog.wordpress.com/2016/02/04/the-evils-of-arduino-strings/)

**Second**, you could use an external library such as [PrintEx](https://github.com/Chris--A/PrintEx#printex-library-for-arduino-).

**Third**, you could redirect `printf` to Serial output:

{% highlight C %}
// Function that printf and related will use to print
int serial_putchar(char c, FILE* f) {
    if (c == '\n') serial_putchar('\r', f);
    return Serial.write(c) == 1? 0 : 1;
}

FILE serial_stdout;

void setup(){
    Serial.begin(9600);

    // Set up stdout
    fdev_setup_stream(&serial_stdout, serial_putchar, NULL, _FDEV_SETUP_WRITE);
    stdout = &serial_stdout;

    printf("My favorite number is %6d!\n", 12);
}

void loop() {
  static long counter = 0;
  if (millis()%300==0){
    printf("millis(): %ld\tcounter: %ld (%02X)\n", millis(), counter, counter++);
    delay(1);    
  }
}
{% endhighlight C %}
[Source](https://arduino.stackexchange.com/a/480) and [discussion](https://forum.arduino.cc/index.php/topic,120440.0.html)

## What's calling loop() and how fast?

Because Arduino is [open source](https://github.com/arduino), we can look up the source code to answer this question. 

In short, `loop()` is called within an infinite `for` (or `while` loop). The only overhead is checking for whether there is data available on the serial port and then reading the serial buffers. The entire `int main(void)` function in [main.cpp](https://github.com/arduino/ArduinoCore-avr/blob/2f67c916f6ab6193c404eebe22efe901e0f9542d/cores/arduino/main.cpp) is:

{% highlight C %}
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
{% endhighlight C %}

Interestingly, this [Arduino forum post](https://forum.arduino.cc/index.php?topic=615714.0) suggests that because `serialEventRun()` is weakly defined in the core, you can define it locally in your sketch to override the default definition, which, according to the OP, will "save a little memory and makes the loop() run a little faster too!" You can do this if you don't need to user serial communication.

{% highlight C %}
void serialEventRun() {}

void setup() {
}

void loop() {
}
{% endhighlight C %}

## Converting analogRead to voltages

To convert an `analogRead` value to voltage, should we divide by 1023 or 1024?

There is an interesting thread on [Arduino forums](https://forum.arduino.cc/index.php?topic=303189.msg2109121) discussing the merits of 1023 vs. 1024 as divisors. The maximum `analogRead` value is 1023; however, there are 1024 'steps' between 0 and 5V. The official [Arduino tutorial uses 1023](https://www.arduino.cc/en/Tutorial/ReadAnalogVoltage)—which effectively translates 0 - 1023 to 0 to 5V; however, others argue that this is wrong.

I think the key here is to remember that an ADC conversion represents a range of values with a step size of `5V/1024 = 0.0048828125V`. So if `analogRead` returns 0, this is really a range of 0V to 0.0048828125V, and 1 is a range of 0.0048828125V to 0.009765625V, *etc.* In that regard, we would want to divide analogRead by 1024 and if analogRead returns 1023, 1023/1024 * 5V = 4.9951171875V **to** 5V.

The [ATmega datasheet](https://www.sparkfun.com/datasheets/Components/SMD/ATMega328.pdf) says:

![](assets/images/ATMegaDatasheet_ADCConversionResult.png)

For most practical purposes, dividing by 1023 or 1024 won't matter. :)

For more on this hotly debated issue, read:
- [Analog Input Noise](https://forum.arduino.cc/t/analog-input-noise/597713/6)
 
- [ADC Conversion on the Arduino](https://www.gammon.com.au/adc), by Nick Gammon

- [Precise Voltage Measurement with Arduino](http://www.skillbank.co.uk/arduino/measure.htm), by John Errington

## What does delay() actually do?

As you might expect—given our warnings about avoiding overuse of [`delay(int ms)`](https://www.arduino.cc/reference/en/language/functions/time/delay/)—the delay code consists of a `while` loop that simply waits for the given amount of delay time to pass. There is a `yield()` call within the `while` loop but this is, by default, an empty function—though you could implement it to create a "real cooperative scheduler." The code for `yield()` is [here](https://github.com/arduino/ArduinoCore-avr/blob/2f67c916f6ab6193c404eebe22efe901e0f9542d/cores/arduino/hooks.c).

The [`delay(int ms)`](https://www.arduino.cc/reference/en/language/functions/time/delay/) function is found in [wiring.c](https://github.com/arduino/ArduinoCore-avr/blob/2f67c916f6ab6193c404eebe22efe901e0f9542d/cores/arduino/wiring.c) and is, in its entirety, copied below:

{% highlight C %}
void delay(unsigned long ms)
{
	uint32_t start = micros();

	while (ms > 0) {
		yield();
		while ( ms > 0 && (micros() - start) >= 1000) {
			ms--;
			start += 1000;
		}
	}
}
{% endhighlight C %}

## How does the Arduino Uno ADC work exactly?

To convert analog signals to digital, the ATmega328 uses a successive approximation ADC, which [Wikipedia](https://en.wikipedia.org/wiki/Successive_approximation_ADC) nicely summarizes as: "*a type of analog-to-digital converter that converts a continuous analog waveform into a discrete digital representation via a binary search through all possible quantization levels before finally converging upon a digital output for each conversion*."

In "Encyclopedia of Electronic Components Volume 3", Platt states that a "*successive approximation converter uses a single comparator, comparing the input voltage with the output from a DAC. The binary number that is supplied to the DAC is determined one bit at a time, from the most significant to the least significant bit, using the comparator's result to determine if the bit should be 0 or 1. These bits are stored in a register, called a successive approximation register (SAR). When the process finishes, the SAR contains a binary representation of the input voltage. This type of ADC can achieve high resolution (many bits) at the cost of lower conversion speed.*"

## What is the analog input pin resistance on the ATmega328?

The [ATmega328 datasheet](http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061A.pdf) says that the analog input resistance is 100 megohms:

![Screenshot of Table 29-16 in ATmega328 datasheet describing the ADC](assets/images/ATmega328_Datasheet_Screenshot_ADCCharacteristics.png)

<!-- An additional in-depth thread describing this here: https://www.avrfreaks.net/forum/input-impedance-digital-ios-atmega328p -->

## References
- https://electronics.stackexchange.com/a/67173
- http://www.gammon.com.au/adc
- http://www.skillbank.co.uk/arduino/adc.htm

## Secrets of Arduino PWM

- https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM

<!-- Another nice article is Protecting Inputs in Digital Electronics: https://www.digikey.com/en/articles/protecting-inputs-in-digital-electronics -->

