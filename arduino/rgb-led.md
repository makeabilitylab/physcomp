---
layout: default
title: L5&#58; RGB LEDs
# nav_order: 1
parent: Intro to Arduino
usemathjax: true
has_toc: true # (on by default)
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this tutorial, we will flash through a sequence of colors using an RGB LED (RGB stands for Red, Green, Blue) and learn about the difference between a Common Anode and Common Cathode RGB LED design.

![Animation showing the RGB LED being set to various colors based on digital output on Pins 3, 5, and 6](assets/movies/Arduino_RGBLED_CommonCathode-Optimized.gif)

## Materials

You'll need the following materials. Importantly, there are **two types** of RGB LEDs—described below—so make sure you **determine** which type of RGB LED you are using as it will affect how you configure your circuit. But don't worry, we'll walk through both RGB LED types.

| Arduino | RGB LED | Resistor |
|:-----:|:-----:|:-----:|
| ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png)    | ![An RGB LED]({{ site.baseurl }}/assets/images/RgbLED_Fritzing.png) | ![220 Ohm Resistor]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) |
| Arduino Uno, Leonardo, or similar  | RGB LED | **3** 220Ω Resistor |

### Common Anode vs. Common Cathode

While capable of displaying thousands of color combinations, RGB LEDs are actually quite simple; they contain three LEDs in one package: red, green, and blue. Importantly but somewhat confusingly, there are two RGB LED designs, which differ in the leg shared between all three embedded LEDs: 

1. With the **Common Anode**, the three embedded LEDs share the anode leg. You must hook up the anode to the higher voltage source and set the red, green, and blue legs to lower voltages to control the color. For example, with a 5V voltage source, setting the red leg to 0V and the other two legs to 5V would turn the RGB LED red. Setting all three color legs to 5V would turn off the RGB LED.

2. In contrast, the **Common Cathode** works much more like a typical LED (and like the red LED from our previous examples). Here, all three emedded LEDs share the cathode leg. So, you drive each individual color leg with a higher voltage source.

![Image showing schematics of a common anode RGB LED and a common cathode RGB LED. With the common anode, the second leg of the RGB LED needs to be hooked up to the higher voltage source. With a common cathode, the second leg of the RGB LED needs to be hooked up to the lower voltage]({{ site.baseurl }}/assets/images/RGBLEDs_CommonAnodeVsCommonCathodepng.png)

Images remixed from [os.mbed.com](https://os.mbed.com/users/4180_1/notebook/rgb-leds/) and [randomnerdtutorials.com](https://randomnerdtutorials.com/electronics-basics-how-do-rgb-leds-work/)
{: .fs-1 }

Unfortunately, you cannot tell whether you have a Common Anode or Common Cathode RGB LED simply by looking at it. You can either look at the supplier website, the datasheet, or experiment with the LED yourself (remember, diodes only work in one directly so as long as you include your current limiting resistors, you should be fine!).

| Common Anode | Common Cathode |
|:-----:|:-----:|
| ![Picture of a Common Anode RGB LED]({{ site.baseurl }}/assets/images/RgbLED_CommonAnode_Adafruit.png) | ![Picture of a Common Anode RGB LED]({{ site.baseurl }}/assets/images/RgbLED_CommonCathode_Sparkfun.png) |
| A diffused **Common Anode** RGB LED from [Adafruit](https://www.adafruit.com/product/159). It's called diffused because the epoxy casing is scratchy and not perfectly transparent | A clear **Common Cathode** RGB LED from [Sparkfun](https://www.sparkfun.com/products/105). |

## Common Cathode

### Making the circuit

We're going to start with a Common Cathode circuit + code because it's more intuitive before covering the Common Anode version.

### Writing the code

## Common Anode

### Making the circuit
TODO

### Writing the code
TODO

## Coding for both Common Cathode and Anode

## TODO:
- Working with a cathode RGB LED
- Now, let's do it with an anode RGB LED. Refer back to led-blink2 with current sink vs source

<span class="fs-6">
[Previous](led-blink2.md){: .btn .btn-outline }
[Next](TODO){: .btn .btn-outline }
</span>