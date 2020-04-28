---
layout: default
title: ESP32
nav_order: 2
has_toc: true # on by default
has_children: true
nav_exclude: false
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- Content TODOs:
1. Make blink example
2. Make fade example. Show PWM
3. Make touch sensor example?
4. Show off WiFi? And/or bluetooth?
5.  -->

## ESP32

![Image of a variety of ESP32 boards](assets/images/ESP32Boards_MakerAdvisor.png)
Image from [makeradvisor.com](https://makeradvisor.com/esp32-development-boards-review-comparison/). There are literally dozens of ESP32 boards. Search online for comparisons (*e.g.,* [link](https://makeradvisor.com/esp32-development-boards-review-comparison/)).
{: .fs-1 } 

The [ESP32](https://en.wikipedia.org/wiki/ESP32) is a low-cost, "system-on-a-chip" board with integrated WiFi, Bluetooth, and a Tensilica Xtensa LX6 microprocessor running at 160 or 240 MHz. It is a successor to the massively successful [ESP8266](https://en.wikipedia.org/wiki/ESP8266). It's far more powerful than introductory Arduino boards like the Uno or Leonardo but also more complex.

There are literally dozens of ESP32 boards on the market, including Adafruit's [Huzzah32](https://www.adafruit.com/product/3405) and Sparkfun's [ESP32 Thing](https://www.sparkfun.com/products/13907). Search online for comparisons (*e.g.,* [link](https://makeradvisor.com/esp32-development-boards-review-comparison/)). 

We will be using the [Huzzah32](https://www.adafruit.com/product/3405).

### Programming environment

You can program the ESP32 in variety of languages and programming environments, including `C/C++`, [Micropython](https://github.com/pvanallen/esp32-getstarted), [Lua](https://nodemcu.readthedocs.io/en/dev-esp32/), and more. For programming environments, many ESP32 boards have developed Arduino libraries so you can use the Arduino IDE, the [Espressif IoT Development Framework](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/), or [VSCode with PlatformIO](https://docs.platformio.org/en/latest/tutorials/espressif32/arduino_debugging_unit_testing.html).

For our examples, we are going to use the Arduino libraries and IDE.

## The Adafruit ESP32 Huzzah32 Feather

| Name | Arduino Uno | Huzzah32 |
| ---- | ----------- | -------- |
| Image | ![Arduino Uno]({{ site.baseurl }}/assets/images/ArduinoUno_ArduinoCC.png) | ![ESP32 Huzzah32]({{ site.baseurl }}/assets/images/ESP32Huzzah32_Adafruit.png) |
| Microcontroller | 8-bit, 16 MHz [ATmega328P](https://www.microchip.com/wwwproducts/en/ATmega328) | 32-bit, 240 MHz dual core Tensilica LX6 |
| Microcontroller Manufacturer | Microchip (Atmel) | Espressif |
| System-on-a-chip | N/A | [ESP32](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf) |
| Input voltage (limit) | 6-20V | 7-12V |
| Operating voltage | 5V | 3.3V |
| Flash memory | 32KB (0.5KB used by bootloader) | 4MB |
| SRAM | 2KB | 520KB |
| Analog inputs | 6 | 8 |
| GPIO pins | 14 | 21 |
| PWM pins | 6 | All |
| Wi-Fi | N/A | 802.11b/g/n HT40 Wi-Fi transceiver |
| Bluetooth | N/A | Dual mode (classic and BLE) |

Recall that flash memory is where your compiled program is stored and SRAM is where your microcontroller creates and manipulates variables when it runs.

The ESP32 also has 2xI2S Audio, 2xDAC, 2xI2C (only one configured by default in the Feather Arduino IDE support), 3xSPI (only one configured by default in Feather IDE support). See [Adafruit overview](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/overview).

### Huzzah32 pin diagram

So, what do all of these pins do? Oh, so many things!

The pin diagram for the Huzzah32 in the official Adafruit [docs](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/pinouts) is pretty confusing. So, we read a few documentation sources and created our own pin diagram:

![Huzzah32 pin diagram](assets/images/AdafruitHuzzah32PinDiagram.png)
See the Adafruit Huzzah32 [docs](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/pinouts) for details. Right-click and open image in a new tab to zoom in.
{: .fs-1 } 

Some important notes:
- The ESP32 runs on **3.3V power and logic**, and unless otherwise specified, GPIO pins are not 5V safe!
- There are **21 GPIO pins**; however, on the Huzzah32, pins 34 (A2), 39 (A3), 36 (A4) are not output-capable and thus should only be used for input. So, **18 GPIO pins** in total. Be forwarned: the pins are in a strange order, so read the diagram carefully.
- **PWM** is possible on all 18 GPIO pin
- **13 of the 21 GPIO pins** can be used **analog input pins**; however, A13 is not exposed. It's used for measuring the voltage on the LiPoly battery via a voltage divider. When reading in the battery level using `analogRead(A13)`, make sure multiply by 2 to get correct reading.
- The **ADC resolution is 12 bits** (0-4095). This is in contrast to the Arduino Uno and Leonardo, which uses ATmega chips with 10 bit ADCs (so, 0-1023). Make sure you use the proper max value in your conversions (*e.g.,* using [`map()`](https://www.arduino.cc/reference/en/language/functions/math/map/))
- The Adafruit [docs](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/pinouts) state (somewhat confusingly) that ADC#1 only works when WiFi has started. This affects A2, A3, A4, A7, and A9. However, the EspressIf [docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html) state that ADC#2 only works when WiFi has **not** started, so there are strange (potential) contradictions here. Needs investigation!

<!-- ![ESP32 Huzzah32 pin diagram from Zerynth]({{ site.baseurl }}/assets/images/adafruithuzzah32pin_zerynth.jpg)
Pin diagram from [Zerynth](https://docs.zerynth.com/latest/official/board.zerynth.adafruit_huzzah32/docs/index.html). ICU stands for [Input Capture Unit](https://docs.zerynth.com/official/core.zerynth.stdlib/r2.0.9/icu.html).
{: .fs-1 }  -->

<!-- Another helpful pin diagram: https://people.eecs.berkeley.edu/~boser/courses/49_sp_2019/N_gpio.html#_pin_diagram -->


### Huzzah32 installation instructions for the Arduino IDE

You can follow the [official Adafruit Huzzah32 Arduino IDE installation instructions](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/using-with-arduino-ide), which we've expanded a bit below.

#### Step 1: Add ESP32 to Arduino Board Manager

1. Open the Arduino IDE

2. Go to Preferences
![Screenshot of opening preferences](assets/images/ArduinoIDE_OpenPreferences.png)

3. In preferences, find the `Additional Board Manager URLs:` field 
![Screenshot of additional board manager url in preferences](assets/images/ArduinoIDE_EnterAdditionalBoardManagerJSON.png)

4. Add the ESP32 JSON url `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
![Screenshot of entering in ESP32 JSON string](assets/images/ArduinoIDE_EnteringESP32JsonString.png)

5. Open the Arduino IDE Board Manager
![Screenshot of the Arduino IDE opening the board manager](assets/images/ArduinoIDE_OpenBoardManager.png)

6. Search for `ESP32` and click `Install`
![Screenshot showing ESP32 added to board manager](assets/images/ArduinoIDE_ESP32AddedInBoardManager.png)

#### Step 2: Install USB to UART Bridge Virtual COM Port Driver

As noted in the [official Adafruit Huzzah32 Arduino IDE installation instructions](https://learn.adafruit.com/adafruit-huzzah32-esp32-feather/using-with-arduino-ide), the second step is to install the USB to UART Bridge Virtual COM Port (VCP) driver to interface with the ESP32 board. You can download the driver from Windows, Mac, and Linux [here](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers).

#### Step 3: Select `Adafruit ESP32 Feather` in board menu

Once installed, select the `Adafruit ESP32 Feather` in the Board menu.

![Screenshot showing how to select the Adafruit ESP32 in the Board Manager menu](assets/images/ArduinoIDE_SelectAdafruitESP32Board.png)

#### Step 4: Select the appropriate port

Finally, select the appropriate port

![Screenshot showing how to select correct ESP32 port](assets/images/ArduinoIDE_SelectESP32Port.png)

## Resources

### Official ESP32 Documentation
- [API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/index.html)
- [API Guides](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/index.html)

### Other
- [Sparkfun's ESP32 Thing Hookup Guide](https://learn.sparkfun.com/tutorials/esp32-thing-hookup-guide/all). Written for Sparkfun's ESP32 Thing board but has relevant WiFi and BLE examples.

<!-- ## Application ideas
- Connect to WiFi, get the time, print out on OLED. Create a clock?
- Connect to WiFi, download Covid-19 stats, print out on display
- Evidently ESP32 may support Serial.printf? [See link](https://arduino.stackexchange.com/a/53751).

### Sound / VUMeters

- [Using the ESP32's built-in DAC](https://www.reddit.com/r/esp32/comments/bid08m/finally_got_audio_sampling_via_dma_with_no_cpu/)?
- [Streaming music with I2S](https://www.reddit.com/r/esp32/comments/dluvgl/streaming_web_radio_to_esp32_playing_it_using_the/)

### Platform IO for VSCode

- https://docs.platformio.org/en/latest/integration/ide/visualstudio.html
- https://maker.pro/arduino/tutorial/how-to-use-platformio-in-visual-studio-code-to-program-arduino -->

