
---
layout: default
title: Inside Arduino
has_toc: false # on by default
nav_exclude: true
---

This page is intended to provide more advanced information about the Arduino. Rest assured,you do not need to read or understand this page to use the Arduino! :)

## What's calling loop() and how fast?

Because Arduino is [open source](https://github.com/arduino), we can look up the source code to answer this question. In short, `loop()` is called within an infinite `for` (or `while` loop) and the only overhead is checking for whether there is data available on the serial port and then reading the serial buffers. The entire `int main(void)` function in [main.cpp](https://github.com/arduino/ArduinoCore-avr/blob/2f67c916f6ab6193c404eebe22efe901e0f9542d/cores/arduino/main.cpp) is:

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

Interestingly, this [Arduino forum post ](https://forum.arduino.cc/index.php?topic=615714.0)suggests that because `serialEventRun()` is weakly defined in the core, you can define it locally in your sketch to override the default definition, which, according to the OP, will "save a little memory and makes the loop() run a little faster too!"

{% highlight C %}
void serialEventRun() {}

void setup() {
}

void loop() {
}
{% endhighlight C %}