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
2. Record workbench video of macOS Bluetooth pairing and Python serial demo (include captions/transcript)
3. Record workbench video of Windows Bluetooth pairing and Python serial demo (include captions/transcript)
4. Record workbench video of the p5.js visualization over Bluetooth serial (include captions/transcript)
5. Record workbench video of the bidirectional LED control via p5.js (include captions/transcript)
6. Record workbench video of Android phone demo (optional bonus section) (include captions/transcript)
7. Get screenshots of macOS Bluetooth pairing dialogs (include descriptive alt text)
8. Get screenshots of Windows Bluetooth pairing and Device Manager COM port (include descriptive alt text)
9. Get screenshots of the p5.js sketch receiving Bluetooth serial data (include descriptive alt text)
10. Create a diagram showing USB serial vs. Bluetooth serial (same code, different transport)
11. Write and test all Arduino sketches; push to makeabilitylab/arduino GitHub repo under ESP32/Bluetooth/
12. Write and test Python scripts; push to makeabilitylab/arduino repo under Python/Bluetooth/
13. Build and host the p5.js Bluetooth demo on GitHub Pages
14. Test all code on the Huzzah32 with macOS and Windows
15. Verify CDN URL: https://cdn.jsdelivr.net/gh/makeabilitylab/js@main/dist/makelab.serial.iife.min.js
-->

<!-- See also:
- BluetoothSerial library source: https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial
- Espressif Bluetooth Classic docs: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/bluetooth.html
- pySerial docs: https://pyserial.readthedocs.io/en/latest/
- Random Nerd Tutorials BT Classic: https://randomnerdtutorials.com/esp32-bluetooth-classic-arduino-ide/
- Serial Bluetooth Terminal app (Android): https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal
-->

In the [last lesson](iot.md), you sent sensor data halfway around the world—through WiFi, across the internet, and up to a cloud dashboard. But what if you just want to talk to the laptop sitting right in front of you—without a USB cable? What if you could run the same Python scripts and p5.js sketches from the [Communication module](../communication/serial-intro.md), but wirelessly?

In this lesson, we'll do exactly that using **Bluetooth**. And here's the fun part: the code on your computer is going to be *identical*. Bluetooth Classic's Serial Port Profile (SPP) creates a **virtual serial port** on your computer that looks and behaves exactly like a USB serial connection. Your Python scripts, your p5.js sketches, your [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) library—they all work unchanged. The only difference is which port you select. ✨

{: .warning }
> **This lesson requires the original ESP32** (like the Adafruit Huzzah32), **not** the ESP32-S3. The ESP32-S3 does not have the hardware for Bluetooth Classic—the `BluetoothSerial` library will not compile on it. If you only have an ESP32-S3, you can borrow a Huzzah32 from the equipment cart, or skip ahead to [Lesson 9: Bluetooth Low Energy](ble.md), which works with both boards. We'll explain why this limitation exists in the [next section](#what-is-bluetooth).

Apple does not allow third-party apps to use Bluetooth Classic SPP on iOS, so **iPhones cannot connect to the ESP32 over Bluetooth Classic**. This lesson is entirely computer-based (Mac and Windows), so your phone type doesn't matter for Parts 1–4. If you have an **Android** phone, there's an optional bonus activity at the end. In [Lesson 9: BLE](ble.md), we'll use a protocol that works with *everyone's* phone—including iPhones.

{: .note }
> **In this lesson, you will learn:**
> - What Bluetooth is, its origin story, and why there are two very different flavors: Bluetooth Classic and Bluetooth Low Energy (BLE)
> - How the Serial Port Profile (SPP) creates a virtual serial port on your computer—making Bluetooth look exactly like a USB serial connection
> - How to use the `BluetoothSerial` library and why its API intentionally mirrors Arduino's built-in `Serial`
> - How to pair the ESP32 with your Mac or Windows computer and find the Bluetooth serial port
> - How to use Python and [pySerial](https://pyserial.readthedocs.io/) to communicate with the ESP32 over Bluetooth—using the same code patterns from the [serial introduction](../communication/serial-intro.md)
> - How to use [p5.js](https://p5js.org/) with [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) and [Web Serial](../communication/web-serial.md) to visualize Bluetooth sensor data in a web browser
> - Why Bluetooth Classic does **not** work on the ESP32-S3 and does **not** work with iPhones
> - When to use Bluetooth Classic *vs.* BLE—and why we'll learn BLE next

## What is Bluetooth?

Bluetooth is a short-range wireless communication standard for exchanging data between devices over radio waves. It operates in the 2.4 GHz ISM band (the same frequency range as WiFi and your microwave oven) and is designed for low-power, close-range connections—typically within about 10 meters indoors.

### A brief history

Bluetooth was developed in the 1990s by [Ericsson](https://en.wikipedia.org/wiki/Ericsson) as a wireless replacement for RS-232 serial cables (the same serial communication we studied in [Lesson 1 of the Communication module](../communication/serial-intro.md)!). The name comes from [Harald Bluetooth](https://en.wikipedia.org/wiki/Harald_Bluetooth), a 10th-century Danish king who united warring Scandinavian tribes—a fitting metaphor for a technology designed to unite different devices. The Bluetooth logo is a [bind rune](https://en.wikipedia.org/wiki/Bind_rune) merging Harald's initials in [Younger Futhark](https://en.wikipedia.org/wiki/Younger_Futhark): ᚼ (Hagall, "H") and ᛒ (Bjarkan, "B").

<!-- TODO: Add an image showing the Bluetooth logo and the two runic initials side by side -->

### Two flavors: Classic and Low Energy

When people say "Bluetooth," they might mean one of **two fundamentally different protocols** that happen to share a name:

**Bluetooth Classic** (also called BR/EDR, for "Basic Rate / Enhanced Data Rate") is the original Bluetooth. It was designed for **continuous data streaming**—wireless headphones, file transfers, or serial port emulation. It establishes a persistent connection and can push data at up to 3 Mbps at the radio level, though practical throughput for the Serial Port Profile is much lower (typically a few hundred kbps). This is the flavor we'll use in this lesson.

**Bluetooth Low Energy** (BLE, introduced in Bluetooth 4.0 in 2010) is a completely different protocol stack designed for **low-power, intermittent data exchange**—fitness trackers that run for months on a coin cell, sensors broadcasting a reading every few seconds. We'll cover BLE in [Lesson 9](ble.md).

Despite sharing the "Bluetooth" name, Classic and BLE are **not compatible with each other**. A BLE-only device cannot talk to a Bluetooth Classic device and vice versa. The original ESP32 supports **both**; the ESP32-S3 supports **BLE only**.

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

**Table.** Comparison of Bluetooth Classic and Bluetooth Low Energy. The original ESP32 supports both, but the ESP32-S3 only supports BLE.
{: .fs-1 }

{: .note }
> **Why doesn't the ESP32-S3 support Bluetooth Classic?** Espressif designed the ESP32-S3 for IoT and edge AI workloads where BLE's low power consumption matters more than Classic's streaming capabilities. Dropping the Classic radio reduces die area, power consumption, and cost. If you try to compile a `BluetoothSerial` sketch on the ESP32-S3, you'll get the error: `Serial Bluetooth not available or not enabled. It is only available for the ESP32 chip.` This is a chip-level limitation, not a software bug.

## The Serial Port Profile (SPP)

So how does Bluetooth Classic act like a serial cable? Through something called the **Serial Port Profile (SPP)**. SPP emulates a wired RS-232 serial port—exactly the kind of serial communication we've been doing over USB.

When you pair the ESP32 with your computer over Bluetooth Classic, your operating system creates a **virtual serial port**—a COM port on Windows (*e.g.,* `COM8`) or a `/dev/tty.*` device on macOS (*e.g.,* `/dev/tty.ESP32-Bluetooth`). This virtual port behaves *identically* to the USB serial port you've been using all along. Any software that can open a serial port—the Arduino Serial Monitor, a Python script with [pySerial](https://pyserial.readthedocs.io/), a web browser using the [Web Serial API](../communication/web-serial.md), your [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) library—can communicate over Bluetooth without any code changes. Just select the Bluetooth port instead of the USB port.

<!-- TODO: Create a diagram showing the parallel:
     USB Serial:       ESP32 → USB Cable → Computer → COM3 → pySerial / serial.js
     Bluetooth Serial: ESP32 → [radio] → Computer → COM8 → pySerial / serial.js
     Emphasize: same code, same libraries, different port -->

This is the key insight of this lesson: **Bluetooth Classic SPP is a wireless serial cable.** Everything you learned in the [Communication module](../communication/serial-intro.md)—data framing, parsing comma-separated values, serial.js—works unchanged. The only difference is the transport: radio waves instead of copper wire.

<details markdown="1">
<summary><strong>How SPP works under the hood</strong> (click to expand)</summary>

SPP sits on top of several Bluetooth Classic protocol layers. At the bottom, the **L2CAP** (Logical Link Control and Adaptation Protocol) layer provides connection-oriented data channels over the Bluetooth radio. Above that, **RFCOMM** (Radio Frequency Communication) emulates RS-232 serial ports over L2CAP—this is the layer that makes Bluetooth look like a wired serial connection. SPP is a *profile* that defines how RFCOMM should be used for general-purpose serial communication. When your computer pairs with the ESP32, the **SDP** (Service Discovery Protocol) lets the computer discover that the ESP32 offers an SPP service, and the OS creates a virtual COM port backed by an RFCOMM channel. You don't need to know any of this to use SPP—the `BluetoothSerial` library handles it all—but it explains why the abstraction works so seamlessly.

</details>

## Materials

You'll need the following components. This lesson uses the **original ESP32** ([Adafruit Huzzah32 ESP32 Feather](https://www.adafruit.com/product/3591)), not the ESP32-S3.

| Breadboard | ESP32 | LED | Resistor | Potentiometer |
| ---------- |:-----:|:-----:|:-----:|:-----:|
| ![Half-sized solderless breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Adafruit Huzzah32 ESP32 Feather board, top view](assets/images/AdafruitHuzzah32_200h.png) | ![Red 5mm LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220-ohm resistor, striped red-red-brown-gold]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![10kΩ rotary potentiometer]({{ site.baseurl }}/assets/images/Potentiometer_100h.png) |
| Breadboard | [Huzzah32 ESP32 Feather](https://www.adafruit.com/product/3591) | Red LED | 220Ω Resistor | 10kΩ Potentiometer |

You will also need:
- A **Mac or Windows computer** with Bluetooth (most modern laptops have Bluetooth built in)
- **Python 3** with [pySerial](https://pyserial.readthedocs.io/) installed (`pip3 install pyserial`)
- **Google Chrome** or **Microsoft Edge** (for the Web Serial / p5.js activity)

{: .note }
> If you only have an ESP32-S3, you can borrow a Huzzah32 from the equipment cart for this lesson, or skip ahead to [Lesson 9: Bluetooth Low Energy](ble.md), which works with the ESP32-S3.

## Part 1: Hello Bluetooth

Let's cut the wire! In this first activity, we'll upload a Bluetooth serial sketch to the ESP32, pair it with your computer, and communicate with it using a short Python script—the same approach you learned in the [serial introduction lesson](../communication/serial-intro.md), just wireless.

### The BluetoothSerial library

The ESP32 Arduino core includes a built-in library called [`BluetoothSerial`](https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial) that handles all the Bluetooth Classic SPP complexity for you. No library installation is needed—just `#include "BluetoothSerial.h"` and you're ready to go.

The library's API was **intentionally designed to mirror** Arduino's built-in `Serial` class. It provides the same `.begin()`, `.available()`, `.read()`, `.write()`, `.print()`, and `.println()` methods you already know. This means converting a wired serial sketch to Bluetooth is as simple as creating a `BluetoothSerial` object and using it alongside (or instead of) `Serial`. The rest of your code stays identical.

| Method | `Serial` (USB) | `SerialBT` (Bluetooth) | Notes |
|---|---|---|---|
| Initialize | `Serial.begin(115200)` | `SerialBT.begin("ESP32-BT")` | Serial takes a baud rate; SerialBT takes a device name (baud rate is negotiated by the Bluetooth stack) |
| Check for data | `Serial.available()` | `SerialBT.available()` | Identical — returns number of bytes waiting |
| Read a byte | `Serial.read()` | `SerialBT.read()` | Identical |
| Read until delimiter | `Serial.readStringUntil('\n')` | `SerialBT.readStringUntil('\n')` | Identical |
| Write bytes | `Serial.write(buf, len)` | `SerialBT.write(buf, len)` | Identical |
| Print text | `Serial.println("hello")` | `SerialBT.println("hello")` | Identical — also `.print()`, `.printf()` |
| Check connection | *(always connected)* | `SerialBT.connected()` | Returns `true` if a device is currently paired and connected |
| Connection events | *(n/a)* | `SerialBT.register_callback(cb)` | Optional callback for connect/disconnect events — no Serial equivalent |

**Table.** Key API comparison between Arduino's built-in `Serial` and the `BluetoothSerial` library. Every read/write method is identical — only initialization and connection management differ.
{: .fs-1 }

The key difference is in `.begin()`: `Serial.begin()` takes a baud rate because it configures a physical UART, while `SerialBT.begin()` takes a *device name* because the Bluetooth stack handles data rates internally. The other difference is that Bluetooth connections can come and go — unlike a USB cable, a Bluetooth device might walk out of range — so `BluetoothSerial` adds `connected()` and `register_callback()` for connection state management. We'll use these in [Part 4](#part-4-bidirectional-control) when we discuss what happens when a connection drops.

{: .warning }
> `BluetoothSerial` is **only available on the original ESP32 chip**. If you try to include it on an ESP32-S3 (or C3, S2, *etc.*), the sketch will not compile. The compile-time guards in our sketches below produce a clear error message when this happens.

### The Arduino code

<!-- TODO: Push HelloBluetooth.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

This sketch creates a bidirectional bridge between the USB serial connection (to your computer via USB) and a Bluetooth serial connection (to your computer via Bluetooth). Anything sent over Bluetooth arrives on USB serial and vice versa. The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/HelloBluetooth).

```cpp
/**
 * HelloBluetooth: creates a bidirectional bridge between USB Serial
 * and Bluetooth Serial (SPP). Sends a greeting over Bluetooth every
 * 2 seconds. Data received over Bluetooth is echoed to USB Serial
 * and vice versa.
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

unsigned long _lastGreetingMs = 0;
const unsigned long GREETING_INTERVAL_MS = 2000;

void setup() {
  Serial.begin(115200);

  // Initialize Bluetooth with a device name.
  // This is the name that appears when you scan for devices on your computer.
  SerialBT.begin("ESP32-Bluetooth");
  Serial.println("Bluetooth device started! You can now pair with 'ESP32-Bluetooth'.");
}

void loop() {
  // Periodically send a greeting over Bluetooth
  unsigned long now = millis();
  if (now - _lastGreetingMs >= GREETING_INTERVAL_MS) {
    _lastGreetingMs = now;
    SerialBT.println("Hello from ESP32!");
  }

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

Notice how the code reads like a standard serial sketch — compare the `SerialBT` calls with the `Serial` calls and you'll see the API mirroring from the [table above](#the-bluetoothserial-library) in action. The one difference is `SerialBT.begin("ESP32-Bluetooth")`: instead of a baud rate, it takes a device name that will appear when you scan for Bluetooth devices on your computer.

The `#if !defined(...)` compile-time guards at the top produce a clear error if you accidentally build this on an ESP32-S3 or other unsupported chip.

Upload this sketch to your ESP32 and open Serial Monitor at 115200 baud. You should see `"Bluetooth device started!"`.

### Pairing with your computer

Before you can communicate over Bluetooth, you need to **pair** your computer with the ESP32. This is a one-time step—once paired, your computer will remember the device.

#### macOS

1. Open **System Settings → Bluetooth** (or click the Bluetooth icon in the menu bar).
2. Make sure Bluetooth is turned on. You should see `"ESP32-Bluetooth"` appear in the nearby devices list.
3. Click **Connect** next to `"ESP32-Bluetooth"`. macOS will pair with the device.
4. Once paired, macOS creates a virtual serial port. To find it, open **Terminal** and run:

```
ls /dev/tty.*Bluetooth*
```

You should see something like `/dev/tty.ESP32-Bluetooth` or `/dev/tty.ESP32-BluetoothSPP`. This is your Bluetooth serial port—you'll use it in the Python script below.

<!-- TODO: Add screenshot of macOS System Settings showing ESP32-Bluetooth paired (include descriptive alt text) -->

{: .note }
> **Troubleshooting macOS:** If the Bluetooth serial port doesn't appear, try unpairing and re-pairing the device. On some macOS versions, you may need to open **Terminal** and run `ls /dev/tty.*` before and after pairing to identify the new port. The port name varies by macOS version and Bluetooth stack, but it typically contains the device name.

#### Windows

1. Open **Settings → Bluetooth & devices** (or **Settings → Devices → Bluetooth & other devices** on Windows 10).
2. Click **Add device → Bluetooth**. Windows will scan for nearby devices.
3. Select `"ESP32-Bluetooth"` and click **Pair**.
4. Once paired, Windows creates a virtual COM port. To find it, open **Device Manager** (right-click the Start button → Device Manager) and expand **Ports (COM & LPT)**. Look for a `"Standard Serial over Bluetooth link"` entry—note its COM port number (e.g., `COM8`).

<!-- TODO: Add screenshot of Windows Device Manager showing the Bluetooth COM port (include descriptive alt text) -->

{: .note }
> **Windows creates two COM ports** for Bluetooth serial: one for outgoing and one for incoming connections. You typically want the **outgoing** port. If one doesn't work, try the other. You can see which is which in **Control Panel → Devices and Printers → right-click ESP32-Bluetooth → Properties → Services**.

### Connecting with Python

Now let's connect to the Bluetooth serial port from Python—using the same [pySerial](https://pyserial.readthedocs.io/) library you used in the [serial introduction lesson](../communication/serial-intro.md). If you don't have it installed yet:

```
pip3 install pyserial
```

You already have a Python serial demo from the [Communication module](../communication/serial-intro.md): [`serial_demo.py`](https://github.com/makeabilitylab/arduino/blob/master/Python/Serial/serial_demo.py). Let's use it over Bluetooth—the only change is the port name.

Open `serial_demo.py` and change the port to your Bluetooth serial port:

```python
# In serial_demo.py, change this line:
ser = serial.Serial(port='COM13', baudrate=115200, timeout=1)

# To your Bluetooth port:
# macOS:
ser = serial.Serial(port='/dev/tty.ESP32-Bluetooth', baudrate=115200, timeout=1)
# Windows:
ser = serial.Serial(port='COM8', baudrate=115200, timeout=1)
```

That's it—one line change. The rest of the script (reading, writing, encoding, decoding) is identical. Run it:

```
python3 serial_demo.py
```

You should see `"Hello from ESP32!"` messages arriving every 2 seconds. Type a number and press Enter—it will be sent to the ESP32 and forwarded to USB Serial Monitor. You're communicating wirelessly! 🎉

{: .note }
> **The baud rate parameter is ignored for Bluetooth virtual COM ports** on most operating systems. SPP negotiates its own data rate at the Bluetooth protocol level, so the `baudrate=115200` argument is passed to pySerial for API compatibility but doesn't actually set a baud rate the way it does for USB serial. You can pass any value and it will work—but we use `115200` to match our `Serial.begin(115200)` for consistency.

{: .note }
> **This is the point of SPP.** Your [serial_demo.py](https://github.com/makeabilitylab/arduino/blob/master/Python/Serial/serial_demo.py) was written for USB serial. It works over Bluetooth with only a port name change. The pySerial API, the `readline()` calls, the `write()` calls—everything is the same. Your operating system makes Bluetooth look like a wired serial connection.

{: .warning }
> **Only one program can open a serial port at a time.** If you have Arduino's Serial Monitor open on the Bluetooth COM port, your Python script won't be able to connect (and vice versa). Close Serial Monitor before running Python—or use Serial Monitor on the *USB* port and Python on the *Bluetooth* port. This is the same constraint from the [serial introduction](../communication/serial-intro.md#only-one-computer-program-can-open-a-serial-port-at-a-time), just with two ports to manage.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. Uploading the sketch to the ESP32
     2. Pairing from macOS (and/or Windows)
     3. Running the Python script and exchanging messages
     4. The "aha moment": same pySerial code, wireless connection
     Include captions/transcript
-->

## Part 2: Streaming sensor data

Now let's stream live sensor data. We'll read a potentiometer and send its value over Bluetooth—then visualize it in Python.

### The circuit

Connect a 10kΩ potentiometer to the ESP32 on pin **A7** (GPIO 32), which is an ADC1 pin. (On the original ESP32, ADC2 pins conflict with both WiFi *and* Bluetooth Classic, so always use ADC1 pins for analog input when using wireless features.)

<!-- TODO: Create a Fritzing wiring diagram showing the potentiometer on A7. Use the Huzzah32 Fritzing part. -->

### The Arduino code

<!-- TODO: Push BluetoothPotentiometer.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BluetoothPotentiometer).

```cpp
/**
 * BluetoothPotentiometer: reads a potentiometer and streams the value
 * over both USB Serial and Bluetooth Serial.
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

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth Classic is not enabled. This sketch requires the original ESP32.
#endif

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

  // Send to USB Serial (for Serial Monitor / Serial Plotter)
  Serial.println(potVal);

  // Send to Bluetooth Serial (to your computer via Bluetooth)
  SerialBT.println(potVal);

  delay(50); // ~20 readings per second
}
```

### Reading the data in Python

You already have two Python visualization scripts from the [Communication module](../communication/serial-intro.md) that work perfectly here:

**Terminal bar graph:** [`serial_bar_graph.py`](https://github.com/makeabilitylab/arduino/blob/master/Python/SerialBarGraph/serial_bar_graph.py) reads a float value per line (0.0–1.0) and renders a live ASCII bar chart in the terminal. To use it over Bluetooth, just pass the Bluetooth port as an argument:

```
# macOS
python3 serial_bar_graph.py /dev/tty.ESP32-PotSensor 115200

# Windows
python3 serial_bar_graph.py COM8 115200
```

**Matplotlib circle:** [`serial_draw_circle.py`](https://github.com/makeabilitylab/arduino/blob/master/Python/SerialCircle/serial_draw_circle.py) reads a float value per line and draws a circle whose radius is proportional to the value. Same idea—just pass the Bluetooth port:

```
# macOS
python3 serial_draw_circle.py /dev/tty.ESP32-PotSensor 115200

# Windows
python3 serial_draw_circle.py COM8 115200
```

{: .note }
> **Both scripts expect float values in the range 0.0–1.0.** To use them, modify the Arduino sketch to send normalized values: `SerialBT.println(potVal / 4095.0, 4);` instead of `SerialBT.println(potVal);`. Alternatively, you could modify the Python scripts to accept raw integers—but normalizing on the Arduino side is the cleaner approach and matches the [AnalogOut](https://github.com/makeabilitylab/arduino/tree/master/Serial/AnalogOut) sketch the scripts were designed to work with. These Python scripts were written for USB serial. They work over Bluetooth with no code changes—only the port argument differs. This is SPP's core value: your computer's operating system makes the Bluetooth connection look like a regular serial port.

Turn the potentiometer—you'll see the bar chart or circle updating in real time, with data arriving wirelessly. Compare this with the wired experience: same visualization, no cable. You may notice a slight delay compared to USB serial—Bluetooth Classic SPP typically adds 10–30ms of latency per packet, which is usually imperceptible for human-paced interaction but can matter for high-speed control loops.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. The potentiometer circuit on the Huzzah32
     2. The Python script displaying the ASCII bar chart
     3. Turning the potentiometer and watching values change wirelessly
     Include captions/transcript
-->

## Part 3: p5.js over Bluetooth with serial.js

So far we've sent data in one direction—from ESP32 to computer—and visualized it in Python. Now let's bring it into the browser. Because your computer's Bluetooth serial port looks just like a USB serial port, the [Web Serial API](../communication/web-serial.md) works with it—and so does [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) from the Makeability Lab library. You can build the same [p5.js](https://p5js.org/) interactive sketches from the [Communication module](../communication/p5js-serial.md), but with data arriving wirelessly over Bluetooth.

When you click "Connect" in a Web Serial dialog, Chrome shows *all* available serial ports—including the Bluetooth virtual COM port. Select the Bluetooth port instead of the USB port, and your existing serial.js code works unchanged. This is the entire point of SPP: the operating system abstracts away the wireless transport.

### The web page

This p5.js sketch reads the potentiometer value over Bluetooth and draws a dynamic circle whose size and color respond to the sensor data. The code structure is identical to the [p5.js Serial lesson](../communication/p5js-serial.md)—only the port selection differs.

Make sure the Part 2 sketch (`BluetoothPotentiometer`) is running on your ESP32.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bluetooth Potentiometer Visualizer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/js@main/dist/makelab.serial.iife.min.js"></script>
</head>
<body>
  <script>
    // Setup Web Serial using serial.js — same as the Communication module!
    const serial = new Serial();
    serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
    serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
    serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

    let sensorValue = 0;

    function setup() {
      createCanvas(600, 400);
      textAlign(CENTER, CENTER);
      textSize(14);
    }

    function draw() {
      background(30);

      if (!serial.isOpen()) {
        fill(200);
        text("Click anywhere to connect via Bluetooth Serial", width / 2, height / 2);
        return;
      }

      // Map the 12-bit ADC value (0–4095) to circle size and color
      let circleSize = map(sensorValue, 0, 4095, 20, 300);
      let hue = map(sensorValue, 0, 4095, 0, 360);

      colorMode(HSB, 360, 100, 100);
      fill(hue, 80, 90);
      noStroke();
      circle(width / 2, height / 2, circleSize);

      // Display the value
      fill(255);
      colorMode(RGB);
      text(`Pot: ${sensorValue}`, width / 2, height - 30);
    }

    function mousePressed() {
      if (!serial.isOpen()) {
        serial.connectAndOpen();
      }
    }

    function onSerialConnectionOpened(eventSender) {
      console.log("Serial connection opened (Bluetooth)!");
    }

    function onSerialConnectionClosed(eventSender) {
      console.log("Serial connection closed.");
    }

    function onSerialDataReceived(eventSender, newData) {
      let trimmed = newData.trim();
      if (trimmed.length > 0) {
        let parsed = parseInt(trimmed);
        if (!isNaN(parsed)) {
          sensorValue = parsed;
        }
      }
    }

    function onSerialErrorOccurred(eventSender, error) {
      console.error("Serial error:", error);
    }
  </script>
</body>
</html>
```

### Try it out

1. Make sure the `BluetoothPotentiometer` sketch is running on your ESP32.
2. Open this HTML file using a local server (VS Code Live Server or `python3 -m http.server`). Open it in **Chrome**.
3. Click anywhere on the canvas. Chrome will show the serial port selection dialog.
4. **Select the Bluetooth serial port** (not the USB port). On macOS, it will be named something like `tty.ESP32-PotSensor`. On Windows, it will be the Bluetooth COM port you noted earlier.
5. Turn the potentiometer—the circle changes size and color in real time, with data arriving wirelessly! 🎉

<!-- TODO: Add screenshot of Chrome's port selection dialog showing both USB and Bluetooth ports (include descriptive alt text) -->
<!-- TODO: Add screenshot of the p5.js visualization responding to the potentiometer (include descriptive alt text) -->

{: .note }
> **Compare this with the [p5.js Serial lesson](../communication/p5js-serial.md).** The code is *identical*—same `serial.js` import, same event callbacks, same `connectAndOpen()` call. The only difference is which port you select in the browser dialog. This is SPP's superpower: your existing Web Serial code works wirelessly without any modifications.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. Opening the p5.js sketch in Chrome
     2. Selecting the Bluetooth serial port in the dialog
     3. Turning the pot and watching the visualization respond wirelessly
     Include captions/transcript
-->

## Part 4: Bidirectional control

Now let's close the loop: stream sensor data *from* the ESP32 *and* send LED control commands *to* the ESP32. We'll extend the p5.js sketch to include a slider that controls LED brightness.

### The circuit

Add an LED circuit: LED on GPIO 21 through a 220Ω resistor to ground. Keep the potentiometer connected from Part 2.

<!-- TODO: Create a Fritzing wiring diagram showing pot on A7 + LED on GPIO 21. Use the Huzzah32 Fritzing part. -->

### The Arduino code

<!-- TODO: Push BluetoothLedControl.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BluetoothLedControl).

```cpp
/**
 * BluetoothLedControl: bidirectional Bluetooth communication.
 * Streams potentiometer data out AND accepts brightness commands in.
 *
 * Incoming format: a single integer 0–255 followed by newline.
 * Outgoing format: potentiometer value (0–4095) followed by newline.
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

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth Classic is not enabled. This sketch requires the original ESP32.
#endif

#if !defined(CONFIG_BT_SPP_ENABLED)
#error Serial Bluetooth (SPP) is not available. It is only supported on the original ESP32 chip.
#endif

BluetoothSerial SerialBT;

const int POT_INPUT_PIN = A7;
const int LED_OUTPUT_PIN = 21;

unsigned long _lastSensorSendMs = 0;
const unsigned long SENSOR_SEND_INTERVAL_MS = 50;

void setup() {
  Serial.begin(115200);
  pinMode(LED_OUTPUT_PIN, OUTPUT);
  SerialBT.begin("ESP32-LEDControl");
  Serial.println("Bluetooth started! Pair with 'ESP32-LEDControl'.");
}

void loop() {
  // --- Receive brightness commands from computer ---
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\n');
    command.trim();
    int brightness = command.toInt();
    brightness = constrain(brightness, 0, 255);
    analogWrite(LED_OUTPUT_PIN, brightness);
    Serial.print("LED brightness: ");
    Serial.println(brightness);
  }

  // --- Stream sensor data to computer ---
  unsigned long now = millis();
  if (now - _lastSensorSendMs >= SENSOR_SEND_INTERVAL_MS) {
    _lastSensorSendMs = now;
    int potVal = analogRead(POT_INPUT_PIN);
    SerialBT.println(potVal);
    Serial.println(potVal);
  }
}
```

{: .note }
> **`analogWrite()` on the ESP32:** The `analogWrite()` function was added to the ESP32 Arduino core in v3.x as a compatibility wrapper around the LEDC PWM library. Older tutorials (and our [Lesson 3: LED Fade](led-fade.md)) may use the LEDC API directly (`ledcAttach`, `ledcWrite`). Both approaches work—`analogWrite()` is simpler for basic PWM output like this.

### The p5.js sketch with bidirectional communication

Extend the Part 3 sketch with a brightness slider that sends values to the ESP32:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bluetooth Bidirectional Control</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/js@main/dist/makelab.serial.iife.min.js"></script>
</head>
<body>
  <script>
    const serial = new Serial();
    serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
    serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
    serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

    let sensorValue = 0;
    let brightnessSlider;

    function setup() {
      createCanvas(600, 400);
      textAlign(CENTER, CENTER);
      textSize(14);

      // Create a slider for LED brightness (0–255)
      brightnessSlider = createSlider(0, 255, 0);
      brightnessSlider.position(width / 2 - 100, height - 60);
      brightnessSlider.size(200);
      brightnessSlider.input(onSliderChanged);
    }

    function draw() {
      background(30);

      if (!serial.isOpen()) {
        fill(200);
        text("Click anywhere to connect via Bluetooth Serial", width / 2, height / 2);
        brightnessSlider.hide();
        return;
      }

      brightnessSlider.show();

      // Visualize the potentiometer value
      let circleSize = map(sensorValue, 0, 4095, 20, 300);
      let hue = map(sensorValue, 0, 4095, 0, 360);

      colorMode(HSB, 360, 100, 100);
      fill(hue, 80, 90);
      noStroke();
      circle(width / 2, height / 2 - 20, circleSize);

      // Labels
      fill(255);
      colorMode(RGB);
      text(`Potentiometer: ${sensorValue}`, width / 2, 20);
      text(`LED Brightness: ${brightnessSlider.value()}`, width / 2, height - 30);
    }

    function mousePressed() {
      if (!serial.isOpen()) {
        serial.connectAndOpen();
      }
    }

    function onSliderChanged() {
      if (serial.isOpen()) {
        serial.writeLine(brightnessSlider.value().toString());
      }
    }

    function onSerialConnectionOpened(eventSender) {
      console.log("Serial connection opened (Bluetooth)!");
    }

    function onSerialConnectionClosed(eventSender) {
      console.log("Serial connection closed.");
    }

    function onSerialDataReceived(eventSender, newData) {
      let trimmed = newData.trim();
      if (trimmed.length > 0) {
        let parsed = parseInt(trimmed);
        if (!isNaN(parsed)) {
          sensorValue = parsed;
        }
      }
    }

    function onSerialErrorOccurred(eventSender, error) {
      console.error("Serial error:", error);
    }
  </script>
</body>
</html>
```

Drag the slider—the LED on your breadboard dims and brightens wirelessly. Meanwhile, the potentiometer data continues streaming to the visualization. This is the same bidirectional communication pattern from [p5.js Serial I/O](../communication/p5js-serial-io.md), but over Bluetooth.

### What happens when the connection drops?

If you carry your laptop out of Bluetooth range (or the ESP32 loses power), the connection will drop. The `BluetoothSerial` library handles this gracefully on the ESP32 side—it will automatically start advertising again when the connection is lost, so you can reconnect by re-opening the serial port from your computer. On the Python side, `pySerial` will raise a `serial.SerialException`, and in p5.js/serial.js, the `CONNECTION_CLOSED` event will fire. If you need to detect connection state in your Arduino sketch, you can use `SerialBT.connected()` to check whether a device is currently connected, or register a callback with `SerialBT.register_callback()` for connection and disconnection events.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. The p5.js sketch with circle visualization and brightness slider
     2. Turning the potentiometer → circle changes
     3. Moving the slider → LED brightness changes
     4. Everything happening wirelessly
     Include captions/transcript
-->

## Part 5: Android phone (optional bonus)

If you have an **Android** phone, you can also communicate with the ESP32 using a Bluetooth terminal app. This is a quick bonus activity—the main lesson is computer-based.

{: .note }
> **iPhone users:** You cannot use Bluetooth Classic SPP from an iPhone. Apple restricts Bluetooth Classic to system-level functions (audio, keyboards, *etc.*). In [Lesson 9: BLE](ble.md), we'll use a protocol that works with both iOS and Android.

1. On your Android phone, install the free [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) app by Kai Morich.
2. Go to **Settings → Bluetooth** and pair with `"ESP32-LEDControl"` (or whatever name your sketch uses).
3. Open the Serial Bluetooth Terminal app → **Devices** → select your ESP32 → **Connect**.
4. You should see potentiometer data streaming. Type a number (0–255) and tap Send to control the LED.

<!-- TODO: Add a screenshot or photo of the Android app showing data from the ESP32 (include descriptive alt text) -->

{: .note }
> **Custom buttons:** The Serial Bluetooth Terminal app lets you configure custom buttons (under **Settings → Buttons**) that send predefined strings. Set up buttons for `0`, `128`, and `255` to quickly toggle between off, half, and full brightness—a simple remote control UI!

## Gotchas and limitations

**One connection at a time.** SPP is point-to-point. Only one device (your computer *or* your phone) can connect to the ESP32's Bluetooth serial at a time.

**No iOS support.** Apple blocks Bluetooth Classic SPP for third-party apps. iPhone users can participate fully in the computer-based activities (Parts 1–4) but cannot connect from their phones.

**No ESP32-S3.** Only the original ESP32 supports Bluetooth Classic. The ESP32-S3, S2, C3, and C6 do not have the hardware.

**Range and interference.** Expect reliable communication within about 5–10 meters indoors. Walls, furniture, and other 2.4 GHz devices (WiFi, microwaves) reduce range.

**macOS Bluetooth port naming.** The virtual serial port name varies across macOS versions and can be long or cryptic. Use `ls /dev/tty.*Bluetooth*` or `ls /dev/tty.*ESP*` to find it. If the port disappears, unpair and re-pair the device.

**Memory usage.** Bluetooth Classic consumes significant RAM. If you also need WiFi, consider using BLE instead—or be prepared for potential instability in complex sketches on the original ESP32's 520KB SRAM.

## When to use Bluetooth Classic vs. BLE

**Use Bluetooth Classic SPP when:**
- You want the simplest possible wireless serial—your existing serial code works unchanged
- You're working entirely from a computer (Mac or Windows)
- You're using the original ESP32 (Huzzah32)
- You don't need iPhone support

**Use BLE ([Lesson 9](ble.md)) when:**
- You're using the ESP32-S3 (or any non-original ESP32)
- You need iPhone / iOS compatibility
- You want to connect from a phone app that works on both platforms
- Power efficiency matters (battery-powered projects)
- You want to build a [Web Bluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) web app

## Exercises

Want to go further? Here are some challenges to reinforce what you've learned:

**Exercise 1: Multi-sensor dashboard.** Modify the Arduino code to send comma-separated values from *two* sensors (potentiometer + photoresistor). Update the p5.js sketch to parse the CSV data and visualize both streams—one as circle size, one as background color. This is the same parsing pattern from [p5.js Serial I/O](../communication/p5js-serial-io.md).

**Exercise 2: Compare wired vs. wireless.** Open Arduino's Serial Plotter on the USB port while simultaneously running the Python sensor reader on the Bluetooth port. Both show the same data—one wired, one wireless. Can you see any latency difference? Try it with `delay(10)` vs. `delay(100)` in the Arduino sketch.

**Exercise 3: Chat between two ESP32s.** Flash one ESP32 with the [`SerialToSerialBT`](https://github.com/espressif/arduino-esp32/blob/master/libraries/BluetoothSerial/examples/SerialToSerialBT/SerialToSerialBT.ino) example (peripheral) and another with [`SerialToSerialBTM`](https://github.com/espressif/arduino-esp32/blob/master/libraries/BluetoothSerial/examples/SerialToSerialBTM/SerialToSerialBTM.ino) (central). Build a two-way text chat.

**Exercise 4: Range test.** With the sensor streaming sketch running, carry your laptop away from the ESP32. At what distance does the data start dropping out? When does the connection drop entirely? Test with and without walls between you and the ESP32.

**Exercise 5: Servo control.** Send angle values (0–180) from a p5.js slider over Bluetooth. Parse the value on the ESP32 and control a servo motor wirelessly. Compare the feel with a directly-wired potentiometer control—can you notice the latency?

**Exercise 6: Replicate a Communication module project.** Pick any project from the [Communication module](../communication/index.md) (the paint app, the shape drawer, *etc.*) and run it over Bluetooth instead of USB. How much code did you have to change? (The answer should be: none—just a different port selection.)

## Lesson Summary

In this lesson, you cut the wire! Here's what you learned:

- **The `BluetoothSerial` library** ships with the ESP32 Arduino core and intentionally mirrors the `Serial` API. Converting wired serial code to Bluetooth requires minimal changes on both the Arduino and computer side.
- **Bluetooth Classic's Serial Port Profile (SPP)** creates a virtual serial port on your computer that behaves identically to a USB serial port. Your Python scripts, p5.js sketches, serial.js library, and Serial Monitor all work unchanged—just select the Bluetooth port instead of the USB port.
- **Pairing** the ESP32 with your Mac or Windows computer is a one-time step. macOS creates a `/dev/tty.*` device; Windows creates a COM port.
- **pySerial** connects to the Bluetooth serial port with the same API you already know—only the port name changes.
- **Web Serial + serial.js** work with Bluetooth serial ports in Chrome. Your existing p5.js sketches from the Communication module can be used wirelessly without code changes.
- **Bluetooth Classic SPP only works on the original ESP32** (like the Huzzah32). The ESP32-S3 and other newer variants lack the hardware.
- **iOS does not support Bluetooth Classic SPP** for third-party apps. This lesson is computer-based, so phone type doesn't matter—but for phone-based projects, BLE (Lesson 9) is required.
- **Bluetooth Classic has a practical range of 5–10 meters indoors** and supports only one connection at a time. Expect 10–30ms of added latency compared to USB serial.
- **For most new projects—especially on the ESP32-S3—BLE is the better default choice** due to universal device and phone support. But Bluetooth Classic SPP is unbeatable when you want to reuse existing serial code wirelessly.

## Resources

- [BluetoothSerial library source and examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial) — the official library in the ESP32 Arduino core
- [ESP32 Arduino Bluetooth API docs](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/bluetooth.html) — Espressif's API reference
- [pySerial documentation](https://pyserial.readthedocs.io/en/latest/) — the Python serial library used throughout our lessons
- [Makeability Lab JS Library (serial.js)](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) — Web Serial wrapper used in our p5.js sketches
- [Web Serial lesson](../communication/web-serial.md) — our introduction to Web Serial (the same API that works with Bluetooth COM ports)
- [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) — our recommended Android app for Bluetooth serial (free, by Kai Morich)
- [Bluetooth SIG: Learn About Bluetooth](https://www.bluetooth.com/learn-about-bluetooth/tech-overview/) — official overview of Bluetooth technology
- [Random Nerd Tutorials: ESP32 Bluetooth Classic](https://randomnerdtutorials.com/esp32-bluetooth-classic-arduino-ide/) — additional Bluetooth Classic tutorials

## Next Lesson

In the [next lesson](ble.md), we'll learn **Bluetooth Low Energy (BLE)**—the protocol that powers fitness trackers, smart home devices, and billions of IoT sensors. BLE works on the ESP32-S3, works with iPhones *and* Android phones, and introduces a structured data model that's more powerful than serial. The code is more complex, but the capabilities—and the universal device compatibility—are worth it. Let's go! 🚀

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