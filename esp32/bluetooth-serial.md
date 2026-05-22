---
layout: default
title: L8&#58; Bluetooth Serial
parent: ESP32
has_toc: true # (on by default)
usemathjax: false
comments: true
usetocbot: true
nav_order: 8
---
# {{ page.title | replace_first:'L','Lesson ' }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

{: .warning }
> This lesson is in draft form. There are missing circuit diagrams, images, videos, and other content.

<!-- Content TODOs:
1. Create Fritzing wiring diagrams for the Huzzah32 with potentiometer + LED circuit
2. Record workbench video of the Bluetooth pairing process on Android
3. Record workbench video of the sensor streaming demo
4. Record workbench video of the bidirectional LED control demo
5. Get screenshots of the Serial Bluetooth Terminal app (pairing, receiving data, sending commands)
6. Get screenshots of Windows/macOS Bluetooth pairing dialogs
7. Create hero image or animated GIF showing wireless data flowing between ESP32 and phone
8. Write and test all Arduino sketches; push to makeabilitylab/arduino GitHub repo under ESP32/Bluetooth/
9. Test all code on the Huzzah32
10. Create a diagram showing the parallel between USB serial and Bluetooth serial connections
-->

<!-- See also:
- BluetoothSerial library source: https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial
- Espressif Bluetooth Classic docs: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/bluetooth.html
- Random Nerd Tutorials BT Classic: https://randomnerdtutorials.com/esp32-bluetooth-classic-arduino-ide/
- Serial Bluetooth Terminal app: https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal
-->

In the [last lesson](iot.md), you sent sensor data halfway around the world—through WiFi, across the internet, and up to a cloud dashboard. But what if you just want to talk to the phone in your pocket? Or stream sensor data to a laptop sitting on the same desk? Sometimes you don't need the entire internet—you just need to cut the USB cable.

In this lesson, we'll do exactly that using **Bluetooth**. And here's the fun part: the code is going to look *very* familiar. The ESP32's `BluetoothSerial` library provides an API that mirrors the `Serial` library you've been using since your [very first Arduino lesson](../arduino/serial-print.md)—`SerialBT.println()`, `SerialBT.available()`, `SerialBT.read()`—it's all the same, just wireless. By the end of this lesson, you'll have sensor data streaming to your phone over the air, and you'll be controlling an LED from a Bluetooth terminal app. ✨

{: .note }
> **In this lesson, you will learn:**
> - What Bluetooth is, its origin story, and why there are two very different flavors: Bluetooth Classic and Bluetooth Low Energy (BLE)
> - How the Serial Port Profile (SPP) turns a Bluetooth Classic connection into a wireless serial cable
> - How to use the `BluetoothSerial` library—and why it mirrors the `Serial` API you already know
> - How to pair with and exchange data with an Android phone using a free Bluetooth terminal app
> - How to stream real-time sensor data wirelessly and control an LED from your phone
> - Why Bluetooth Classic does **not** work on the ESP32-S3 and does **not** work with iPhones
> - When to use Bluetooth Classic *vs.* BLE—and why we'll learn BLE next

{: .warning }
> **This lesson requires the original ESP32** (like the Adafruit Huzzah32), **not** the ESP32-S3. The ESP32-S3 does not have the hardware for Bluetooth Classic—the `BluetoothSerial` library will not compile on it. If you only have an ESP32-S3, you can borrow a Huzzah32 from the equipment cart, or skip ahead to [Lesson 9: Bluetooth Low Energy](ble.md), which works with both boards. We'll explain why this limitation exists in the [next section](#what-is-bluetooth).

## What is Bluetooth?

Bluetooth is a short-range wireless communication standard for exchanging data between devices over radio waves. It operates in the 2.4 GHz ISM band (the same frequency range as WiFi and your microwave oven) and is designed for low-power, close-range connections—typically within about 10 meters indoors.

### A brief history

Bluetooth was developed in the 1990s by [Ericsson](https://en.wikipedia.org/wiki/Ericsson) as a wireless replacement for RS-232 serial cables (the same serial communication we studied in [Lesson 1 of the Communication module](../communication/serial-intro.md)!). The name comes from [Harald Bluetooth](https://en.wikipedia.org/wiki/Harald_Bluetooth), a 10th-century Danish king who united warring Scandinavian tribes—a fitting metaphor for a technology designed to unite different devices. The Bluetooth logo is even a [bind rune](https://en.wikipedia.org/wiki/Bind_rune) merging Harald's initials in [Younger Futhark](https://en.wikipedia.org/wiki/Younger_Futhark): ᚼ (Hagall, "H") and ᛒ (Bjarkan, "B").

<!-- TODO: Add an image showing the Bluetooth logo and the two runic initials side by side -->

The technology was standardized by the [Bluetooth Special Interest Group (SIG)](https://www.bluetooth.com/) in 1998 and quickly became ubiquitous in wireless keyboards, mice, headphones, and phone accessories.

### Two flavors: Classic and Low Energy

Here's where things get interesting—and a bit confusing. When people say "Bluetooth," they might mean one of **two fundamentally different protocols** that happen to share a name:

**Bluetooth Classic** (also called BR/EDR, for "Basic Rate / Enhanced Data Rate") is the original Bluetooth. It was designed for **continuous data streaming**—think wireless headphones playing music, file transfers between phones, or serial port emulation. It establishes a persistent connection and can push data at up to 3 Mbps. This is the flavor we'll use in this lesson.

**Bluetooth Low Energy** (BLE, introduced in Bluetooth 4.0 in 2010) is a completely different protocol stack designed from the ground up for **low-power, intermittent data exchange**. Think fitness trackers that run for months on a coin cell battery, broadcasting a heart rate reading every few seconds. BLE trades throughput for extraordinary power efficiency. We'll cover BLE in [Lesson 9](ble.md).

Despite sharing the "Bluetooth" name and the 2.4 GHz radio band, Classic and BLE are **not compatible with each other**. A BLE-only device cannot talk to a Bluetooth Classic device and vice versa. A device can support one, the other, or both—the original ESP32 supports **both**, which is why it's such a versatile chip.

| Feature | Bluetooth Classic (BR/EDR) | Bluetooth Low Energy (BLE) |
|---|---|---|
| Introduced | Bluetooth 1.0 (1999) | Bluetooth 4.0 (2010) |
| Design goal | Continuous streaming | Intermittent, low-power data |
| Data throughput | Up to 3 Mbps | ~1 Mbps (typically much less) |
| Power consumption | Higher | Very low (coin cell battery for months) |
| Connection model | Persistent stream (like serial) | Structured reads/writes/notifications |
| Range | ~10–30m (Class 2) | ~10–30m (similar) |
| Audio streaming | Yes (A2DP, HFP profiles) | Not originally (LE Audio added in BT 5.2) |
| iOS app support | **No** (Apple blocks SPP for third-party apps) | **Yes** |
| ESP32 (original) | ✅ | ✅ |
| **ESP32-S3** | **❌** | **✅** |
| ESP32-S2 | ❌ (no Bluetooth at all) | ❌ (no Bluetooth at all) |
| ESP32-C3, C6 | ❌ | ✅ |
| Typical use cases | Audio, file transfer, serial bridges | Sensors, wearables, beacons, IoT |

**Table.** Comparison of Bluetooth Classic and Bluetooth Low Energy. The original ESP32 supports both, but the ESP32-S3 only supports BLE.
{: .fs-1 }

{: .warning }
> **Why doesn't the ESP32-S3 support Bluetooth Classic?** It's a hardware decision by Espressif. The ESP32-S3 chip was designed for IoT and edge AI workloads where BLE's low power consumption is more important than Classic's streaming capabilities. Dropping the Classic radio reduces die area, power consumption, and cost. If you try to compile a `BluetoothSerial` sketch on the ESP32-S3, you'll get the error: `Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.` This is a chip-level limitation, not a software bug.

{: .warning }
> **iOS does not support Bluetooth Classic SPP for third-party apps.** Apple restricts Bluetooth Classic access to its own system-level protocols (audio via AirPods, keyboards, *etc.*). If you or your partner have an iPhone, you **cannot** pair with the ESP32 and send data using the approach in this lesson. The good news: BLE works great on iOS, and we'll cover that in [Lesson 9](ble.md). For this lesson, you'll need an **Android phone** or a **computer** (Windows, macOS, or Linux) with Bluetooth.

## The Serial Port Profile (SPP)

So how does Bluetooth Classic act like a serial cable? Through something called the **Serial Port Profile (SPP)**. A Bluetooth "profile" is a specification for how a particular type of communication should work over Bluetooth. There are profiles for audio (A2DP), file transfer (FTP), human input devices like keyboards (HID), and many more. SPP is the profile that emulates a wired RS-232 serial port—exactly the kind of serial communication we've been doing over USB.

From your code's perspective, SPP makes the Bluetooth link look and behave like the USB serial connection you've used throughout this course. You call `SerialBT.println("Hello!")` and the string arrives at the other end, just as if you'd called `Serial.println("Hello!")` over a USB cable. The Bluetooth stack handles all the radio-layer complexity—frequency hopping, error correction, packet framing—invisibly.

<!-- TODO: Create a diagram showing the parallel:
     USB Serial: Arduino --> USB Cable --> Computer (Serial Monitor)
     BT Serial:  Arduino --> [radio waves] --> Phone (BT Terminal App)
     Emphasize that the code on the Arduino side is nearly identical -->

This is the key insight of this lesson: **SPP is a wireless serial cable.** Everything you learned about serial communication in the [Communication module](../communication/serial-intro.md)—baud rates, data framing, parsing comma-separated values, bidirectional communication—applies here. The only difference is the transport layer: radio waves instead of copper wire.

## Materials

You'll need the following components. This lesson uses the **original ESP32** ([Adafruit Huzzah32 ESP32 Feather](https://www.adafruit.com/product/3591)), not the ESP32-S3.

| Breadboard | ESP32 | LED | Resistor | Potentiometer |
| ---------- |:-----:|:-----:|:-----:|:-----:|
| ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Huzzah32 ESP32 Feather](assets/images/AdafruitHuzzah32_200h.png) | ![Red LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![Resistors]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![Potentiometer]({{ site.baseurl }}/assets/images/Potentiometer_100h.png) |
| Breadboard | [Huzzah32 ESP32 Feather](https://www.adafruit.com/product/3591) | Red LED | 220Ω Resistor | 10kΩ Potentiometer |

You will also need:

- An **Android phone** with the free [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) app by Kai Morich installed. Alternatively, you can use a **Windows, macOS, or Linux computer** with Bluetooth (we'll cover computer pairing briefly, but the phone experience is more fun and portable).

{: .note }
> If you only have an ESP32-S3, you can borrow a Huzzah32 from the equipment cart for this lesson, or skip ahead to [Lesson 9: Bluetooth Low Energy](ble.md), which works with the ESP32-S3.

## Part 1: Hello Bluetooth

Let's get wireless! Our first sketch creates a **bridge** between the USB serial connection (to your computer) and a Bluetooth serial connection (to your phone). Anything you type in the Arduino Serial Monitor gets forwarded over Bluetooth to your phone, and anything you type on your phone gets forwarded back to Serial Monitor. It's the simplest possible demonstration of Bluetooth serial communication.

### The code

```cpp
/**
 * HelloBluetooth: creates a bidirectional bridge between USB Serial
 * and Bluetooth Serial (SPP). Type in Serial Monitor → appears on
 * phone. Type on phone → appears in Serial Monitor.
 *
 * Requires: Original ESP32 (e.g., Huzzah32). Will NOT compile on ESP32-S3.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/bluetooth-serial
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include "BluetoothSerial.h"

// These compile-time checks ensure we're running on a chip that
// supports Bluetooth Classic. On the ESP32-S3 (or C3, S2, etc.),
// these #error lines will trigger and the sketch won't compile.
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth Classic is not enabled. This sketch requires the original ESP32.
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth (SPP) is not available. It is only supported on the original ESP32 chip.
#endif

BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);

  // Initialize Bluetooth with a device name.
  // This is the name that appears when you scan for devices on your phone.
  SerialBT.begin("ESP32-Bluetooth");
  Serial.println("Bluetooth device started! You can now pair with 'ESP32-Bluetooth'.");
}

void loop() {
  // Forward USB Serial → Bluetooth Serial
  if (Serial.available()) {
    SerialBT.write(Serial.read());
  }

  // Forward Bluetooth Serial → USB Serial
  if (SerialBT.available()) {
    Serial.write(SerialBT.read());
  }
}
```

That's it—under 20 lines of logic! Let's walk through it.

**The `#include` and compile-time guards.** The `BluetoothSerial.h` header is part of the ESP32 Arduino core—no library installation needed. The `#if !defined(...)` blocks are compile-time checks that produce a clear error message if you accidentally try to build this sketch on an ESP32-S3 or other chip that lacks Bluetooth Classic hardware. You won't see these checks at runtime; they prevent the sketch from compiling at all. Try it on an S3 and you'll see the error in the Arduino IDE's output pane.

**`BluetoothSerial SerialBT`** creates a Bluetooth serial object. Notice the naming: `SerialBT`. This is not arbitrary—the object supports the same methods as Arduino's built-in `Serial`: `.begin()`, `.available()`, `.read()`, `.write()`, `.print()`, `.println()`. The API was intentionally designed to mirror `Serial` so that converting a wired serial sketch to Bluetooth is trivially easy.

**`SerialBT.begin("ESP32-Bluetooth")`** initializes the Bluetooth radio and starts advertising with the name `"ESP32-Bluetooth"`. This is the name you'll see when scanning for Bluetooth devices on your phone. You can change it to anything you like—your name, your project name, *etc.*

**The `loop()` body** is a two-way bridge. If data arrives on USB serial (from Serial Monitor), forward it to Bluetooth. If data arrives on Bluetooth (from your phone), forward it to USB serial. Each call to `Serial.read()` or `SerialBT.read()` returns one byte at a time—the same behavior you know from the [serial introduction](../communication/serial-intro.md).

{: .note }
> **Spot the parallel:** this bridge sketch is structurally identical to the cross-device serial forwarding pattern from the [Communication module](../communication/serial-intro.md). The only difference is that one of the two serial connections is now wireless. All your existing serial knowledge—parsing, formatting, handshaking—carries over directly.

### Pairing from an Android phone

Now let's connect! Follow these steps:

1. **Upload the sketch** to your Huzzah32. Open Serial Monitor at 115200 baud. You should see `"Bluetooth device started!"`.

2. **On your Android phone**, open **Settings → Bluetooth** (or **Settings → Connected devices → Pair new device**, depending on your Android version). You should see `"ESP32-Bluetooth"` in the list of available devices. Tap it to pair.

<!-- TODO: Add screenshot of Android Bluetooth settings showing ESP32-Bluetooth in the device list -->

3. **Open the Serial Bluetooth Terminal app** ([free on Google Play](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal)). Tap the menu icon (☰) → **Devices** → select `"ESP32-Bluetooth"` → tap **Connect**.

<!-- TODO: Add screenshot of Serial Bluetooth Terminal showing the connection process -->

4. **You're connected!** 🎉 Type a message in the app and tap Send—it should appear in Arduino Serial Monitor. Type a message in Serial Monitor and press Enter—it should appear on your phone.

<!-- TODO: Add a side-by-side photo or screenshot showing text flowing between Serial Monitor and the phone app -->

{: .note }
> **Alternative terminal apps:** [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) by Kai Morich is our recommended app for its clean interface and reliability. Other options include [Bluetooth Terminal](https://play.google.com/store/apps/details?id=com.sena.bterm) and [Bluetooth Serial Controller](https://play.google.com/store/apps/details?id=nextprotocols.bluetooth.serial.controller). Any app that supports the Bluetooth SPP profile will work.

<details markdown="1">
<summary><strong>Pairing from a computer instead?</strong> (click to expand)</summary>

You can also pair from a desktop or laptop computer with Bluetooth:

**Windows 10/11:** Go to **Settings → Bluetooth & devices → Add device → Bluetooth**. Select `"ESP32-Bluetooth"`. Once paired, Windows creates a virtual COM port. Find the port number in **Device Manager → Ports (COM & LPT)** — look for a "Standard Serial over Bluetooth link" entry. You can then open this COM port in any serial terminal (PuTTY, Arduino Serial Monitor on a second instance, *etc.*) at any baud rate (SPP ignores the baud setting; it's handled at the Bluetooth layer).

**macOS:** Go to **System Settings → Bluetooth**. Click **Connect** next to `"ESP32-Bluetooth"`. Once paired, the ESP32 appears as a serial device at `/dev/tty.ESP32-Bluetooth-ESP32SPP` (or similar). You can open it with `screen /dev/tty.ESP32-Bluetooth-ESP32SPP 115200` in Terminal.

**Linux:** Use `bluetoothctl` to pair, then `rfcomm` to create a serial device. The process varies by distribution; see the [Arch Wiki Bluetooth page](https://wiki.archlinux.org/title/Bluetooth) for a thorough walkthrough.

</details>

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. Uploading the sketch to the Huzzah32
     2. Pairing from an Android phone
     3. Sending text back and forth between Serial Monitor and the phone app
     4. The "aha moment" of wireless serial communication -->

## Part 2: Streaming sensor data

Typing text back and forth is a nice proof-of-concept, but let's do something more interesting: stream **live sensor data** from a potentiometer to your phone, wirelessly—the same data you'd normally see in Serial Monitor or Serial Plotter, but arriving over Bluetooth instead of USB.

### The circuit

Connect a 10kΩ potentiometer to the Huzzah32. Use pin **A7** (GPIO 32), which is an ADC1 pin. (On the original ESP32, ADC2 pins conflict with both WiFi *and* Bluetooth Classic, so always use ADC1 pins for analog input when using wireless features.)

<!-- TODO: Create a Fritzing wiring diagram showing the potentiometer connected to A7 on the Huzzah32 -->

### The code

```cpp
/**
 * BluetoothPotentiometer: reads a potentiometer and streams the value
 * over Bluetooth Serial to a connected device (phone or computer).
 * Also prints to USB Serial for debugging.
 *
 * Circuit:
 * - 10kΩ potentiometer on A7 (GPIO 32) — must be an ADC1 pin
 *
 * Requires: Original ESP32 (e.g., Huzzah32). Will NOT compile on ESP32-S3.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/bluetooth-serial
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth (SPP) is not available. It is only supported on the original ESP32 chip.
#endif

BluetoothSerial SerialBT;

const int POT_INPUT_PIN = A7; // GPIO 32, an ADC1 pin on the Huzzah32

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32-PotSensor");
  Serial.println("Bluetooth started! Pair with 'ESP32-PotSensor' to see live data.");
}

void loop() {
  int potVal = analogRead(POT_INPUT_PIN);

  // Send to USB Serial (for Serial Monitor / Serial Plotter debugging)
  Serial.print("Pot:");
  Serial.println(potVal);

  // Send to Bluetooth Serial (to the phone)
  SerialBT.print("Pot:");
  SerialBT.println(potVal);

  delay(100); // ~10 readings per second
}
```

Upload this sketch, pair your phone, and open the Serial Bluetooth Terminal app. You should see a stream of potentiometer values scrolling by—twist the knob and watch the numbers change in real time on your phone. It's the same experience as Serial Monitor, but without the USB cable. 🎉

{: .note }
> **Why is `delay(100)` OK here?** In the [IoT lesson](iot.md), we warned that `delay()` is dangerous because it blocks the `io.run()` MQTT keepalive loop. Bluetooth Classic SPP doesn't have that constraint—the connection is persistent and tolerates delays just fine. That said, `millis()`-based timing is still better practice for more complex sketches where you need multiple tasks running at different rates. See the [IoT lesson](iot.md#why-no-delay-in-the-main-loop) for the non-blocking pattern.

{: .note }
> **Serial Plotter over Bluetooth?** The Arduino IDE's built-in Serial Plotter reads from the USB serial port, not from Bluetooth. So you can't *directly* use Serial Plotter to graph Bluetooth data. However, since we're also printing to `Serial`, you can view the data in Serial Plotter over USB while simultaneously streaming it to your phone over Bluetooth. In [Exercise 1](#exercises), we'll suggest building your own wireless plotter using a web app or p5.js.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. The potentiometer circuit on the Huzzah32
     2. The phone receiving live potentiometer values
     3. Turning the potentiometer and watching values change on the phone in real time -->

## Part 3: Controlling an LED from your phone

Now let's go the other direction: send commands *from* your phone *to* the ESP32 to control hardware. We'll parse simple text commands received over Bluetooth to toggle an LED.

### The circuit

Add a standard LED circuit: LED on GPIO 21 through a 220Ω resistor to ground. Keep the potentiometer connected to A7 from Part 2—we'll stream sensor data *and* accept LED commands simultaneously.

<!-- TODO: Create a Fritzing wiring diagram showing the potentiometer on A7 + LED on GPIO 21 -->

### The code

```cpp
/**
 * BluetoothLedControl: bidirectional Bluetooth communication.
 * Streams potentiometer data to the phone AND accepts commands
 * from the phone to control an LED.
 *
 * Commands (sent from phone):
 *   "ON"  or "1" → turn LED on
 *   "OFF" or "0" → turn LED off
 *   Any integer 0-255 → set LED brightness via PWM
 *
 * Circuit:
 * - 10kΩ potentiometer on A7 (GPIO 32)
 * - LED with 220Ω resistor on GPIO 21
 *
 * Requires: Original ESP32 (e.g., Huzzah32). Will NOT compile on ESP32-S3.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/bluetooth-serial
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth (SPP) is not available. It is only supported on the original ESP32 chip.
#endif

BluetoothSerial SerialBT;

const int POT_INPUT_PIN = A7;     // GPIO 32, ADC1 pin
const int LED_OUTPUT_PIN = 21;    // Any PWM-capable GPIO pin

// Timing for non-blocking sensor reads
unsigned long _lastSensorSendMs = 0;
const unsigned long SENSOR_SEND_INTERVAL_MS = 200; // send sensor data 5x/sec

void setup() {
  Serial.begin(115200);
  pinMode(LED_OUTPUT_PIN, OUTPUT);

  SerialBT.begin("ESP32-LEDControl");
  Serial.println("Bluetooth started! Pair with 'ESP32-LEDControl'.");
  Serial.println("Send 'ON', 'OFF', or a number 0-255 from your phone.");
}

void loop() {
  // --- Receive commands from phone ---
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\n');
    command.trim(); // remove whitespace and newline characters

    Serial.print("Received via Bluetooth: ");
    Serial.println(command);

    if (command.equalsIgnoreCase("ON") || command == "1") {
      analogWrite(LED_OUTPUT_PIN, 255);
      SerialBT.println("LED: ON (brightness 255)");

    } else if (command.equalsIgnoreCase("OFF") || command == "0") {
      analogWrite(LED_OUTPUT_PIN, 0);
      SerialBT.println("LED: OFF");

    } else {
      // Try to parse as an integer for PWM brightness
      int brightness = command.toInt();

      // toInt() returns 0 for non-numeric strings, so check if
      // the command was actually "0" (which we handled above)
      if (brightness >= 0 && brightness <= 255) {
        analogWrite(LED_OUTPUT_PIN, brightness);
        SerialBT.print("LED brightness set to: ");
        SerialBT.println(brightness);
      } else {
        SerialBT.println("Unknown command. Send ON, OFF, or 0-255.");
      }
    }
  }

  // --- Stream sensor data to phone ---
  unsigned long now = millis();
  if (now - _lastSensorSendMs >= SENSOR_SEND_INTERVAL_MS) {
    _lastSensorSendMs = now;

    int potVal = analogRead(POT_INPUT_PIN);
    SerialBT.print("Pot:");
    SerialBT.println(potVal);

    // Also print to USB Serial for debugging
    Serial.print("Pot:");
    Serial.println(potVal);
  }
}
```

### Try it out

1. Upload the sketch and pair your phone with `"ESP32-LEDControl"`.
2. In the Serial Bluetooth Terminal app, type `ON` and tap Send. The LED turns on! Type `OFF` to turn it off.
3. Try sending a number like `128` for half brightness, or `50` for a dim glow.
4. Meanwhile, potentiometer readings scroll by automatically—you're doing **bidirectional communication** over Bluetooth.

This is the same bidirectional serial communication pattern from the [Communication module's I/O lesson](../communication/p5js-serial-io.md), but wireless. The ESP32 simultaneously streams sensor data *out* (potentiometer values) and accepts commands *in* (LED control)—all over a single Bluetooth SPP connection.

{: .note }
> **Parsing tip:** We used `SerialBT.readStringUntil('\n')` for simplicity, which blocks until a newline arrives (or times out after 1 second by default). For more complex protocols, consider the character-by-character parsing approach from the [Communication module](../communication/serial-intro.md), which doesn't block. The Serial Bluetooth Terminal app sends a newline after each message by default, so `readStringUntil('\n')` works well here.

{: .note }
> **Fun extension:** The Serial Bluetooth Terminal app supports custom buttons that send predefined strings when tapped. Go to **Settings → Buttons** and configure buttons for `ON`, `OFF`, and brightness presets like `50`, `128`, and `255`. Now you have a simple custom remote control UI on your phone—no app development required!

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. The full circuit (pot + LED) on the Huzzah32
     2. Sending ON/OFF/brightness commands from the phone
     3. The LED responding to each command
     4. Potentiometer data streaming simultaneously on the phone
-->

## Gotchas and limitations

Bluetooth Classic SPP is simple and effective, but it comes with real limitations that are worth understanding—both because they'll affect your projects and because they motivate learning BLE in the [next lesson](ble.md).

**One connection at a time.** SPP is a point-to-point protocol. Only one device can connect to the ESP32 at a time. If your phone is connected and a second phone tries to connect, it will fail. This is a fundamental constraint of the Serial Port Profile.

**No iOS support.** This bears repeating because it catches people off guard: Apple does not allow third-party apps to use Bluetooth Classic SPP on iOS. Your iPhone can use Bluetooth Classic for audio (AirPods, car stereo) and keyboards, but Apple reserves those system-level profiles. Third-party apps can only use BLE. If half your team has iPhones, Bluetooth Classic is a non-starter for collaborative projects.

**No ESP32-S3, S2, C3, or C6.** Only the original ESP32 chip includes the Bluetooth Classic radio. All the newer, more power-efficient variants dropped it in favor of BLE-only. As these newer chips become the standard (the S3 is already our primary board), Bluetooth Classic becomes increasingly niche for ESP32 development.

**Range and interference.** Bluetooth Classic Class 2 (which the ESP32 uses) has a theoretical range of about 10 meters, but walls, furniture, and other 2.4 GHz devices (WiFi routers, microwaves) reduce this significantly. In a busy classroom or lab, expect reliable communication at 5–8 meters. You'll explore this in [Exercise 4](#exercises).

**Memory usage.** Running Bluetooth Classic consumes significant RAM on the ESP32. If you also enable WiFi, the combined memory footprint can cause instability in complex sketches—the original ESP32 has only 520KB of SRAM. If you're building a project that needs both WiFi and Bluetooth, consider using BLE instead of Classic, or carefully manage memory allocation.

**Security.** Default Bluetooth pairing uses ["Just Works"](https://www.bluetooth.com/blog/bluetooth-pairing-part-1/) association, which provides basic encryption but no authentication—any nearby device can pair. For projects where security matters, you can require a PIN using `SerialBT.setPin("1234")` before `SerialBT.begin()`, but Bluetooth Classic security is generally considered weaker than BLE's options. For a classroom setting, the default is fine.

## When to use Bluetooth Classic vs. BLE

Given these limitations, when is Bluetooth Classic SPP actually the right choice?

**Use Bluetooth Classic SPP when:**
- You need a simple wireless serial bridge and are using the original ESP32
- You're communicating with an **Android** phone or a **computer**
- You want the fastest possible development time—the `BluetoothSerial` API is dead simple
- You're building a quick prototype where iOS compatibility doesn't matter
- You need higher throughput for continuous data streaming (audio, dense sensor data)

**Use BLE (Lesson 9) when:**
- You're using the ESP32-S3 (or any non-original ESP32)
- You need iOS compatibility
- Power efficiency matters (battery-powered projects)
- You want to connect multiple centrals, or communicate with standard BLE peripherals
- You're building something that needs to work with modern phones and computers universally
- You want to build a [Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) web app to interact with your ESP32 from a browser

For most new projects—especially with the ESP32-S3 as your primary board—**BLE is the better default choice**. But Bluetooth Classic SPP remains a useful tool for its sheer simplicity: when you just need a wireless serial cable and you have the right hardware, nothing is faster to get working.

## Exercises

**Exercise 1: Wireless sensor dashboard.** Modify Part 2 to send comma-separated values from *two* sensors (potentiometer + photoresistor). Write a simple [p5.js](https://p5js.org/) or vanilla JavaScript sketch that connects to the ESP32 via a [Bluetooth serial port on your computer](#pairing-from-a-computer-instead-click-to-expand) (using the [Web Serial API](../communication/web-serial.md) on the virtual Bluetooth COM port) and plots both sensor streams in real time. How does this compare to the wired serial plotter approach?

**Exercise 2: NeoPixel color controller.** Connect a NeoPixel strip (or the onboard NeoPixel on a Huzzah32, if available). Send RGB values as comma-separated text from the phone (*e.g.,* `255,0,128`). Parse the three values on the ESP32 and set the NeoPixel color. This is a great exercise in serial parsing—refer to the [Communication module](../communication/p5js-serial-io.md) for parsing patterns.

**Exercise 3: Bluetooth chat between two ESP32s.** The ESP32's `BluetoothSerial` library supports both peripheral (slave) and central (master) roles. Flash one ESP32 with the [`SerialToSerialBT`](https://github.com/espressif/arduino-esp32/blob/master/libraries/BluetoothSerial/examples/SerialToSerialBT/SerialToSerialBT.ino) example (peripheral) and another with [`SerialToSerialBTM`](https://github.com/espressif/arduino-esp32/blob/master/libraries/BluetoothSerial/examples/SerialToSerialBTM/SerialToSerialBTM.ino) (central). Build a two-way text chat between the two boards, displayed on Serial Monitor for each.

**Exercise 4: Range test.** With the sensor streaming sketch from Part 2 running, walk away from your ESP32 with the phone connected. At what distance do you start seeing gaps in the data? When does the connection drop entirely? Try with and without walls or obstacles between you and the ESP32. How does the range compare to your WiFi experience from the [IoT lesson](iot.md)?

**Exercise 5: Latency comparison.** Measure the round-trip latency of Bluetooth serial *vs.* USB serial. Write a sketch that listens for a single byte, immediately echoes it back, and records the timestamp. On a computer, send a byte over USB serial, measure the round-trip time, then send a byte over Bluetooth serial (via the virtual COM port) and measure again. How do they compare? You can use a Python script with the [`time`](https://docs.python.org/3/library/time.html) module and [`pyserial`](https://pyserial.readthedocs.io/) library for precise timing.

**Exercise 6: Custom Bluetooth name.** Modify the sketch to include sensor data in the Bluetooth device name itself—for example, `"ESP32-Light:742"`. Some BLE beacon systems use this trick to broadcast data without requiring a connection. Does it work with Bluetooth Classic? How often can you update the name? (Hint: you'll need to call `SerialBT.end()` and `SerialBT.begin()` with the new name—this is hacky and not recommended for production, but it's an interesting experiment.)

**Exercise 7: Servo control.** Connect a servo motor (from the [Servo lesson](../advancedio/servo.md)). Send angle values (0–180) from your phone. Parse the incoming number and call `myServo.write(angle)`. Now you have a wireless servo controller! Can you feel the latency compared to a directly-wired potentiometer control?

## Summary

In this lesson, you cut the wire! Here's what you learned:

- **Bluetooth** is a short-range wireless standard operating at 2.4 GHz, with two fundamentally different flavors: **Bluetooth Classic** (continuous streaming, higher power) and **Bluetooth Low Energy** (intermittent data, very low power). Despite sharing a name, they are incompatible protocols.
- **The Serial Port Profile (SPP)** is a Bluetooth Classic profile that emulates a wired RS-232 serial connection over the air. From your code's perspective, `SerialBT` behaves identically to `Serial`—the same `.available()`, `.read()`, `.write()`, `.println()` methods you've used all along.
- The `BluetoothSerial` library ships with the ESP32 Arduino core and requires no installation. Create a `BluetoothSerial` object, call `SerialBT.begin("DeviceName")`, and you're advertising.
- **Everything you know about serial communication transfers directly** to Bluetooth serial: parsing comma-separated values, bidirectional communication, formatting sensor data—the only difference is radio waves instead of a USB cable.
- **Bluetooth Classic SPP only works on the original ESP32** (like the Huzzah32). The ESP32-S3 and other newer variants do not have the hardware for Bluetooth Classic—attempting to compile a `BluetoothSerial` sketch will produce a clear compile-time error.
- **iOS does not support Bluetooth Classic SPP** for third-party apps. You need an Android phone or a computer with Bluetooth to use this lesson's approach.
- **One connection at a time:** SPP is point-to-point. Only one device can be connected to the ESP32's Bluetooth serial at once.
- Bluetooth Classic has a practical range of about **5–10 meters indoors** and is affected by walls, furniture, and 2.4 GHz interference (WiFi, microwaves).
- For most new projects—especially on the ESP32-S3—**BLE is the better default choice** due to universal device support, lower power consumption, and broader compatibility. But Bluetooth Classic SPP remains the fastest path from wired serial to wireless serial when you have the right hardware.

## Resources

- [BluetoothSerial library source and examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial) — the official library in the ESP32 Arduino core, including `SerialToSerialBT` and `SerialToSerialBTM` examples
- [ESP32 Arduino Bluetooth API docs](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/bluetooth.html) — Espressif's API reference for `BluetoothSerial`
- [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) — our recommended Android app for Bluetooth serial communication (free, by Kai Morich)
- [Bluetooth SIG: Learn About Bluetooth](https://www.bluetooth.com/learn-about-bluetooth/tech-overview/) — official overview of Bluetooth technology, profiles, and specifications
- [Bluetooth SIG: Classic vs. Low Energy](https://www.bluetooth.com/learn-about-bluetooth/tech-overview/le-vs-classic/) — the Bluetooth SIG's own comparison of Classic and BLE
- [Random Nerd Tutorials: ESP32 Bluetooth Classic](https://randomnerdtutorials.com/esp32-bluetooth-classic-arduino-ide/) — a well-written tutorial covering additional Bluetooth Classic features
- [Intro to Serial Communication](../communication/serial-intro.md) — our lesson on the serial fundamentals that underpin both USB serial and Bluetooth serial

## Next Lesson

In the [next lesson](ble.md), we'll learn **Bluetooth Low Energy (BLE)**—the protocol that powers fitness trackers, smart home devices, and billions of IoT sensors. BLE works on the ESP32-S3, works with iPhones, and introduces a completely different (and more powerful) way of structuring wireless data. The code is more complex, but the capabilities are transformative. Let's go! 🚀

<nav class="lesson-nav" aria-label="Lesson navigation">
  <a href="iot.html" class="nav-prev">
    <div class="nav-label">&larr; Previous Lesson</div>
    <div class="nav-title">Internet of Things</div>
  </a>
  <a href="ble.html" class="nav-next">
    <div class="nav-label">Next Lesson &rarr;</div>
    <div class="nav-title">Bluetooth Low Energy</div>
  </a>
</nav>
