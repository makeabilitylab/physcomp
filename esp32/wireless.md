---
layout: default
title: Wireless
description: "The ESP32 Wireless series: connect to the cloud over WiFi with Adafruit IO, stream data over Bluetooth Classic serial, and build phone- and browser-friendly projects with Bluetooth Low Energy (BLE)."
parent: ESP32
nav_order: 2
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# ESP32 Wireless
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- TODO Add an awesome fun video extracted from one of the lessons as a hero teaser -->

In this lesson series, you will explore what makes the ESP32 truly special: **built-in wireless communication**. You'll connect to the cloud over WiFi, stream sensor data to your laptop wirelessly over Bluetooth Classic, build interactive [p5.js](https://p5js.org/) visualizations using [Web Serial](../communication/web-serial.md), and learn Bluetooth Low Energy (BLE)—the protocol behind billions of IoT devices that works on iPhones, Android phones, and directly from Chrome via [Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API). 📡

The lessons are interactive and designed to be completed **in order**. All ESP32 code is open source and in this [GitHub repository](https://github.com/makeabilitylab/arduino/tree/master/ESP32).

{: .note }
> Before starting, we recommend completing the [Fundamentals](fundamentals.md) series first. You should be comfortable with the ESP32 board layout, 3.3V logic, the LEDC PWM API, and `analogRead` on the 12-bit ADC. Several lessons here also reference the [Communication module](../communication/index.md)—particularly [Web Serial](../communication/web-serial.md), [p5.js + Serial](../communication/p5js-serial.md), and [p5.js + Serial I/O](../communication/p5js-serial-io.md).

{: .warning }
> **A note on boards:** Lessons 2 and 3 (Bluetooth Classic) require the **original ESP32** since the ESP32-S3 lacks Bluetooth Classic hardware. All other lessons in this series work on both the original ESP32 and the ESP32-S3. If you only have an S3, you can skim or skip Lessons 2 and 3 and jump straight to Lesson 4 (BLE).

## Lessons

### [Lesson 1: Internet of Things](iot.md)

Connect your ESP32 to WiFi and upload sensor data to the cloud using [Adafruit IO](https://learn.adafruit.com/welcome-to-adafruit-io). This is where the ESP32 truly shines! ✨

### [Lesson 2: Bluetooth Serial](bluetooth-serial.md)

Cut the wire! Pair your ESP32 with your Mac or Windows computer using Bluetooth Classic's Serial Port Profile (SPP), which creates a virtual serial port that behaves exactly like a USB cable. Verify the wireless link with built-in OS tools (`cat`, `screen`, PowerShell) and Python's [pySerial](https://pyserial.readthedocs.io/)—the same library from the [Communication module](../communication/index.md). **Requires the original ESP32** (*e.g.,* [Adafruit Huzzah32](https://www.adafruit.com/product/3405?srsltid=AfmBOopMLfaARdO_FA2CcUqo7YmyJdwVWYZksdyQ8eakXbFqg3IALDRs), [SparkFun ESP32 Thing](https://www.sparkfun.com/sparkfun-esp32-thing.html), [Espressif ESP32-DevKitC](https://www.amazon.com/Espressif-ESP32-DevKitC-32E-Development-Board/dp/B09MQJWQN2?th=1)).

### [Lesson 3: Bluetooth Web Serial](bluetooth-web-serial.md)

Stream live sensor data over Bluetooth and visualize it in the browser. Build interactive [p5.js](https://p5js.org/) sketches using [Web Serial](../communication/web-serial.md) and the [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) library—the same tools from the Communication module, but wireless. Close the loop with bidirectional control: a browser slider that dims an LED on your breadboard wirelessly. **Requires the original ESP32**.

### [Lesson 4: Introduction to BLE](ble-intro.md)

Learn **Bluetooth Low Energy (BLE)**—the protocol behind fitness trackers, smart home devices, and billions of IoT sensors. You'll learn the peripheral/central model, the GATT data hierarchy of services and characteristics, and how to stream live sensor data to your phone and computer using notifications. Works with the ESP32-S3 and iPhones!

### [Lesson 5: Bidirectional BLE](ble-bidirectional.md)

Send data in *both* directions over BLE. Control the onboard NeoPixel by writing to a BLE characteristic from your phone, build a **Web Bluetooth** interface with sliders and a color picker that runs entirely in the browser, and learn the **Nordic UART Service (NUS)** for serial-like text communication over BLE.

## What's next?

Once you've completed the Wireless lessons, you'll have a solid foundation for building WiFi-connected, Bluetooth-enabled, sensor-driven projects. Consider exploring more advanced topics like BLE HID devices (making your ESP32 act as a wireless keyboard or game controller), deep sleep for battery-powered projects, or building your own web server directly on the ESP32!

<!-- TODO: FUTURE WIRELESS LESSONS TO ADD
============================================================

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
-->