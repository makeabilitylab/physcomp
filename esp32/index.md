---
layout: default
title: ESP32
nav_order: 6
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

Welcome 👋 to the **ESP32** module! The [ESP32](https://www.espressif.com/en/products/socs/esp32) is a fast, low-cost, WiFi- and Bluetooth-enabled microcontroller that has become **the** platform for Internet of Things (IoT) projects. And the best part? You can program it with Arduino—so everything you learned in the [Intro to Arduino](../arduino/index.md) series carries over! In this module, you'll learn how the ESP32 differs from the Arduino boards you've used before, and you'll build projects that blink LEDs, fade lights with PWM, play tones, sense capacitive touch, connect to the cloud ☁️, and communicate wirelessly over Bluetooth 📡. Let's go! 🚀

![A collage of ESP32 boards including the original ESP32, ESP32-S2, and ESP32-S3](assets/images/ESP32Variants_FromS1-S3.png)
**Figure.** The ESP32 family includes dozens of variants from Espressif and third-party manufacturers. They are fast (up to 240 MHz dual-core), have built-in WiFi and Bluetooth, and many development boards cost around $10 USD!
{: .fs-1 }

{: .note }
> The ESP32 lessons assume you have completed both our [Intro to Electronics](../electronics/index.md) and [Intro to Arduino](../arduino/index.md) tutorial series. While not absolutely necessary, we build on concepts from those modules—like voltage dividers, `digitalWrite`, `analogWrite`, and PWM—without re-explaining them here. If this is your first time on our website, welcome 👋🏽—we recommend starting there!

<!-- TODO: add in link to Tinkercad circuits here... -->

## Which boards do we use?

For our tutorial series, we use **Adafruit's ESP32 boards** in the [Feather](https://learn.adafruit.com/adafruit-feather) form factor; however, you should be able to use almost any ESP32 board on the market and follow along (you might need to change pin numbers). Specifically, our lessons use:

- The [**Adafruit ESP32-S3 Feather**](https://www.adafruit.com/product/5477) (4MB Flash, 2MB PSRAM) — our **primary board** for Spring 2026. Features native USB-C, WiFi, BLE 5.0, and an onboard NeoPixel.

- The [**Adafruit Huzzah32 ESP32 Feather**](https://www.adafruit.com/product/3591) — uses the original ESP32. Our earlier videos and Fritzing diagrams reference this board, but all code transfers directly to the S3.

Because both boards share the **Feather form factor** and use the same [ESP32 Arduino core](https://github.com/espressif/arduino-esp32), the lessons work with either board—you'll just need to consult the correct pin diagram. We'll note specific differences where they arise. See [Lesson 1](esp32.md) for detailed specs, pin diagrams, and a side-by-side comparison with the Arduino Uno.

{: .highlight }
> You can find far cheaper ESP32 boards on [AliExpress](https://www.aliexpress.com/w/wholesale-esp32.html) or [Amazon](https://www.amazon.com/s?k=esp+32+board)—sometimes just a few dollars—and our lessons should work with them too. Adafruit boards cost more but offer reliable build quality, thorough documentation, and the [Feather ecosystem](https://learn.adafruit.com/adafruit-feather/featherwings) of stackable expansion boards ("FeatherWings").

### Chips, modules, and development boards

It's worth clarifying the supply chain—and differences between **chips**, **modules**, and **development boards**—since the terminology can be confusing and the layering actually explains the price differences you'll see online.

- **The chip:** **Espressif** designs the ESP32-S3 *chip* (the bare SoC). Working with bare silicon is difficult: it requires custom printed circuit boards (PCBs), complex surface-mount soldering, and precise RF antenna tuning.
- **The module:** To simplify manufacturing, Espressif packages the chip into *modules* (like the [ESP32-S3-WROOM-1](https://documentation.espressif.com/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)). Modules add flash memory, an integrated antenna, and metal RF shielding. Crucially, they are pre-certified by the FCC, saving hardware designers from expensive regulatory testing. However, you still can't easily plug a module into a laptop or a breadboard.
- **The development board:** This is where the maker companies come in. They bridge the gap between industrial components and human-usable prototyping tools. They take the Espressif module and build a *development board* around it, adding the missing essentials: a USB connector, a USB interface for programming and serial communication, a 3.3V voltage regulator (since USB provides 5V), battery charging circuitry, and breadboard-friendly header pins.

That's why an Adafruit Feather costs ~$18 while a bare Espressif module costs a few dollars. You're paying for the hardware that makes the chip accessible, standard form factors (like the plug-and-play [Feather ecosystem](https://learn.adafruit.com/adafruit-feather/featherwings)), and high-quality documentation. Because your code targets the underlying ESP32-S3 chip, it runs identically across all these boards—only the pin layout and onboard peripherals differ. We discuss the specific pin diagrams for our boards in [Lesson 1](esp32.md).

## How does the Arduino Uno or Leonardo differ from ESP32?

If you're coming from the [Intro to Arduino](../arduino/index.md) series, here are the key things to know upfront:

{: .warning }
> The ESP32 runs on **3.3V power and logic**, not 5V like the Arduino Uno and Leonardo. This affects how you interface with sensors and LEDs—and you can damage your board by applying 5V to a GPIO pin! We'll cover this in detail in [Lesson 1](esp32.md).

- **Way more computational power**: The ESP32 runs at up to 240 MHz with a 32-bit dual-core processor—15x faster than the 16 MHz, 8-bit ATmega chips in the Uno and Leonardo, with vastly more memory.
- **WiFi and Bluetooth built in**: No shields needed! This is what makes the ESP32 ideal for IoT projects.
- **More pins, more PWM**: The ESP32 has more GPIO pins, and *all* of them can do PWM (not just 6 like the Uno).
- **12-bit ADC**: The ESP32's analog-to-digital converter has 12-bit resolution (0–4095) compared to the Uno's 10-bit (0–1023).
- **Different PWM and tone APIs**: The ESP32 Arduino library uses a different approach for PWM output and tone generation—we'll walk you through it!
- **Native USB (ESP32-S3)**: The ESP32-S3 has native USB support, so it can act as a keyboard, mouse, MIDI device, or disk drive—no external USB-to-serial converter needed.
- **Capacitive touch sensing**: The ESP32 has built-in capacitive touch hardware—no external components required.

## Programming the ESP32

For our learning series, we program the ESP32 using **Arduino (C/C++)**—specifically, Espressif's [open-source Arduino core](https://github.com/espressif/arduino-esp32) for the ESP32 family. This means most of your [prior Arduino learning](../arduino/) transfers directly (woohoo! 🎉). You can use the same Arduino IDE, the same `setup()`/`loop()` structure, and many of the same functions like `digitalRead`, `analogRead`, and `Serial.print`.

The tradeoff is that the Arduino core is a **convenience layer** on top of the ESP32's native SDK. It doesn't expose all of the chip's features—you can see the [supported libraries here](https://docs.espressif.com/projects/arduino-esp32/en/latest/libraries.html)—and it adds some overhead compared to programming the chip directly. For our purposes, though, Arduino is a good choice: it lets us focus on learning physical computing concepts rather than wrestling with a new toolchain.

That said, the ESP32 is completely **independent** of the Arduino ecosystem—just as you don't *have* to use Arduino to program the ATmega328P (used in the Uno) or the ATmega32u4 (used in the Leonardo), you don't have to use Arduino to program the ESP32. Here are some alternatives you may want to explore in the future:

- **ESP-IDF (C/C++)**: Espressif's official [IoT Development Framework](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html) is a production-grade, FreeRTOS-based SDK that provides full access to the ESP32's hardware. It's what you'd likely use in industry—more powerful and efficient, but also more complex. If you want to try it, follow the [ESP-IDF Getting Started guide](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html).
- **CircuitPython / MicroPython**: Python-based alternatives that are great for rapid prototyping. See Adafruit's [CircuitPython guide](https://learn.adafruit.com/adafruit-esp32-s3-feather/circuitpython) for the ESP32-S3 Feather.
- **PlatformIO**: A professional [IDE and build system](https://platformio.org/) that supports ESP32 with both Arduino and ESP-IDF frameworks, and integrates with VS Code.

## Lessons

These lessons are interactive and designed to be completed **in order**. All ESP32 code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino/tree/master/ESP32).

### [Lesson 1: Introduction to the ESP32](esp32.md)

Learn about the ESP32 platform, how it compares to the Arduino Uno and Leonardo, and how to set up your development environment. You'll get familiar with the pin diagram and important hardware differences like the 3.3V operating voltage.

### [Lesson 2: Blinking an LED](led-blink.md)

Write your first ESP32 program! The code is the same as the Arduino [Blink lesson](../arduino/led-blink.md)—the challenge here is getting comfortable with the new board and its pin layout.

### [Lesson 3: Fading an LED with PWM](led-fade.md)

Learn how to use PWM output on the ESP32 to fade an LED. This is where things start to diverge from Arduino: instead of `analogWrite`, the ESP32 uses the LEDC (LED Control) library, which gives you more control over PWM channels, frequencies, and resolutions.

### [Lesson 4: Analog Input](analog-input.md)

Use the ESP32's 12-bit ADC to read a potentiometer and control an LED's brightness—combining analog input with PWM output.

### [Lesson 5: Playing Tones](tone.md)

Learn how to play tones and melodies on the ESP32 using the `tone()` function (now supported in ESP32 Arduino core v3.x!) and the LEDC PWM library.

### [Lesson 6: Capacitive Touch Sensing](capacitive-touch-sensing.md)

The ESP32 has built-in capacitive touch sensing hardware—no external components needed! In this lesson, you'll use a bare wire (or aluminum foil) as a touch sensor to control an LED.

### [Lesson 7: Internet of Things](iot.md)

Connect your ESP32 to WiFi and upload sensor data to the cloud using [Adafruit IO](https://learn.adafruit.com/welcome-to-adafruit-io). This is where the ESP32 truly shines! ✨

### [Lesson 8: Bluetooth Serial](bluetooth-serial.md)

Cut the wire! Use Bluetooth Classic's Serial Port Profile (SPP) to communicate with the ESP32 wirelessly—using the same Python scripts, p5.js sketches, and [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) library from the [Communication module](../communication/index.md). The `BluetoothSerial` library intentionally mirrors Arduino's `Serial` API, so converting wired code to wireless is trivially easy. Requires the original ESP32 (Huzzah32).

### [Lesson 9: Introduction to BLE](ble-intro.md)

Learn **Bluetooth Low Energy (BLE)**—the protocol behind fitness trackers, smart home devices, and billions of IoT sensors. You'll learn the peripheral/central model, the GATT data hierarchy of services and characteristics, and how to stream live sensor data to your phone and computer using notifications. Works with the ESP32-S3 and iPhones!

### [Lesson 10: Bidirectional BLE](ble-bidirectional.md)

Send data in *both* directions over BLE. Control the onboard NeoPixel by writing to a BLE characteristic from your phone, build a **Web Bluetooth** interface with sliders and a color picker that runs entirely in the browser, and learn the **Nordic UART Service (NUS)** for serial-like text communication over BLE.

<!-- ============================================================
     TODO: FUTURE LESSONS TO ADD
     ============================================================

## Reference page: Inside ESP32 (inside-esp32.md) [MEDIUM PRIORITY]
Similar to inside-arduino.md, a "deep dives for the curious" page covering:
- How LEDC PWM works under the hood (timer groups, channels, hardware)
- FreeRTOS and dual-core task scheduling (why loop() only runs on core 1)
- ESP32 ADC nonlinearity and calibration (the ADC is notoriously noisy/nonlinear;
  ESP-IDF has calibration APIs but the Arduino core doesn't fully expose them)
- The WiFi/ADC2 hardware conflict: why it happens at the silicon level
- How native USB works on the S3 vs. the CP2104 UART bridge on the Huzzah32
- ESP32 boot process: ROM bootloader → 2nd stage bootloader → application
- Memory architecture: IRAM, DRAM, PSRAM, RTC memory, flash cache
- Power domains and why deep sleep current is so low
Only create this page when there are at least 3-4 solid sections to fill it.
Thin reference pages feel incomplete and unmaintained.

## Lesson: Deep Sleep and Power Management [HIGH PRIORITY]
The ESP32-S3 Feather can get down to ~100µA in deep sleep. Cover:
- Why power management matters (battery-powered projects, wearables, field deployments)
- ESP32 sleep modes: light sleep, deep sleep, hibernation
- Waking from deep sleep via timer, touch pin, or external interrupt (GPIO)
- Using RTC memory to persist data across sleep cycles
- Measuring current draw with a multimeter
- The Feather's onboard MAX17048 battery monitor for reading battery level
- Practical example: a battery-powered temperature logger that wakes
  every N minutes, reads a sensor, uploads to WiFi, and goes back to sleep
- Tie-in: great follow-up to the IoT lesson

## Lesson: Web Server on ESP32
- Running a simple HTTP server directly on the ESP32 (no cloud service needed!)
- Serving an HTML page with buttons to control LEDs/servos from any browser
- WebSocket for real-time bidirectional communication
- mDNS for friendly hostnames (e.g., http://mydevice.local)
- Compare to the IoT lesson: local control vs. cloud-based dashboards
- Could use ESPAsyncWebServer library

## Lesson: ESP-NOW (Peer-to-Peer Communication)
- What ESP-NOW is and how it differs from WiFi and BLE
- Sending data between two ESP32 boards without a router
- Low-latency, connectionless communication (great for remote controls)
- Use case: wireless remote control, simple mesh sensor network
- Requires two ESP32 boards, so may need to be a partner activity

## Lesson: HID Devices (Keyboard, Mouse, Game Controller)
- Two different HID mechanisms are available:
  1. **USB HID (ESP32-S3 and S2 only):** Native USB lets the ESP32-S3 appear as a
     wired keyboard, mouse, MIDI device, or game controller when plugged into a
     computer via USB-C — just like the Arduino Leonardo's ATmega32u4.
     Use the TinyUSB library (or Adafruit_TinyUSB).
  2. **Bluetooth LE HID (all ESP32 variants):** Any ESP32 with BLE can act as a
     *wireless* Bluetooth keyboard, mouse, or game controller using libraries like
     ESP32-BLE-Keyboard, ESP32-BLE-Mouse, or ESP32-BLE-Combo.
     The original ESP32 (Huzzah32) does NOT have native USB, but CAN do BLE HID.
- Building a custom USB or BLE keyboard or game controller
- Connects well with capacitive touch lesson: touch-based MIDI controller!
- Could also build a custom accessibility input device (connects to HCI research)
- Compare: USB HID = wired, lower latency, plug-and-play on any OS, no pairing needed;
  BLE HID = wireless, needs pairing, slight latency, great for mobile/wearable

## Lesson: Using STEMMA QT / Qwiic I2C Devices
- The ESP32-S3 Feather has a STEMMA QT connector for plug-and-play I2C
- Connecting sensors (BME280, accelerometer, etc.) without soldering
- Using Adafruit sensor libraries
- Could combine with IoT lesson for a complete sensor-to-cloud pipeline

## Lesson: I2S Audio
- Using the I2S peripheral for higher-quality audio input/output
- Connecting an I2S microphone (e.g., INMP441) or amplifier (e.g., MAX98357A)
- Recording and playing back audio
- More advanced than the tone lesson; real audio, not just square waves

## Note on DAC lessons:
- The original ESP32 has two 8-bit DAC channels (GPIO25, GPIO26) for true analog output
- The ESP32-S3 does NOT have a DAC, so a DAC-specific lesson would only
  apply to students with an original ESP32 or Huzzah32
- If we add a DAC lesson, clearly mark it as original-ESP32-only
- For analog output on the S3, use PWM with an RC filter, or an external DAC (MCP4725)

============================================================ -->

## What's next?

Once you've completed the ESP32 lessons, you'll have a solid foundation for building WiFi-connected, Bluetooth-enabled, sensor-driven projects. Consider exploring more advanced topics like BLE HID devices (making your ESP32 act as a wireless keyboard or game controller), deep sleep for battery-powered projects, or building your own web server directly on the ESP32!