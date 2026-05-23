---
layout: default
title: L9&#58; Bluetooth Low Energy
parent: ESP32
has_toc: true # (on by default)
usemathjax: false
comments: true
usetocbot: true
nav_order: 9
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
1. Create Fritzing wiring diagrams for the ESP32-S3 Feather with potentiometer + LED circuit
2. Record workbench video of nRF Connect discovering the ESP32 and reading a characteristic (include captions/transcript)
3. Record workbench video of sensor data streaming via notifications (include captions/transcript)
4. Record workbench video of NeoPixel color control from nRF Connect (include captions/transcript)
5. Record screencast of the Web Bluetooth demo page controlling the NeoPixel (include captions/transcript)
6. Get screenshots of nRF Connect: scanning, service/characteristic tree, reading values, subscribing (include descriptive alt text)
7. Create a GATT hierarchy diagram (Server → Service → Characteristic → Value/Properties)
8. Create a diagram showing the BLE advertising and connection lifecycle
9. Create a side-by-side diagram comparing USB serial flow vs. BLE characteristic flow
10. Build and host the Web Bluetooth demo pages on GitHub Pages
11. Write and test all Arduino sketches; push to makeabilitylab/arduino GitHub repo under ESP32/Bluetooth/
12. Test all code on both ESP32-S3 Feather and Huzzah32
13. Once ble.js is tested and merged, link to https://github.com/makeabilitylab/js/blob/main/src/lib/ble/ble.js
    and add a Part 4b showing the same NeoPixel controller using ble.js (parallels how L8 uses serial.js)
14. Verify Bluedroid vs. NimBLE default for Arduino core v3.x — update "The ESP32 BLE library" section accordingly
-->

<!-- See also:
- ESP32 BLE Arduino docs: https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ble.html
- ESP32 BLE library source: https://github.com/espressif/arduino-esp32/tree/master/libraries/BLE
- NimBLE-Arduino: https://github.com/h2zero/NimBLE-Arduino
- Web Bluetooth API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
- Chrome Web Bluetooth guide: https://developer.chrome.com/docs/capabilities/bluetooth
- Nordic UART Service: https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth_services/services/nus.html
- Random Nerd Tutorials BLE: https://randomnerdtutorials.com/esp32-bluetooth-low-energy-ble-arduino-ide/
- Random Nerd Tutorials Web BLE: https://randomnerdtutorials.com/esp32-web-bluetooth/
- p5.ble.js: https://itpnyu.github.io/p5.ble.js/
-->

In the [last lesson](bluetooth-serial.md), we used Bluetooth Classic to create a wireless serial connection—simple, fast, and satisfying. But it came with real limitations: no iPhone support, no ESP32-S3 support, higher power consumption, and only one device at a time. In this lesson, we'll learn **Bluetooth Low Energy (BLE)**—the protocol that powers your Fitbit, your AirPods' pairing process, your smart thermostat, and billions of IoT devices worldwide.

BLE is more complex than Bluetooth Classic. Instead of a simple serial byte stream, BLE organizes data into a structured model of **services** and **characteristics**. This takes some getting used to—but that structure is exactly what makes BLE so powerful and ubiquitous. And unlike Bluetooth Classic, BLE works on the ESP32-S3, works with iPhones, and—as we'll see—even works directly from a web browser.

{: .note }
> **In this lesson, you will learn:**
> - What BLE is and how it fundamentally differs from Bluetooth Classic
> - The BLE communication model: **peripherals** and **centrals**, advertising and connecting
> - The GATT data model: **servers**, **services**, **characteristics**, and **UUIDs**
> - How to use the ESP32 BLE library to create a BLE peripheral that exposes sensor data
> - How to read, write, and subscribe to BLE characteristics from a phone app (nRF Connect)
> - How to stream real-time sensor data using BLE **notifications**
> - How to control the onboard NeoPixel by writing to a BLE characteristic from your phone
> - How to build a **Web Bluetooth** web page that communicates with the ESP32 from a browser—paralleling the [Web Serial](../communication/web-serial.md) approach but wireless
> - The Nordic UART Service (NUS) as a "serial-like" bridge for BLE

**Did you skip Lesson 8?** No problem. This lesson is self-contained—you don't need Bluetooth Classic experience to follow along. We'll briefly cover how BLE differs from Classic in the first section. If you want the full comparison, see [Lesson 8](bluetooth-serial.md). And unlike Bluetooth Classic, which is blocked on iOS and only works on the original ESP32, **BLE works with iPhones, Android phones, and the ESP32-S3**—so everyone can participate.

## What is BLE?

**Bluetooth Low Energy** (BLE) is a wireless communication protocol introduced in Bluetooth 4.0 (2010). Despite sharing the "Bluetooth" name with Bluetooth Classic, BLE is a completely different protocol stack designed from the ground up for **low-power, intermittent data exchange**. Where Bluetooth Classic was built for continuous streaming (music, file transfers, serial bridges), BLE was built for devices that send small amounts of data infrequently—a heart rate monitor broadcasting a reading every second, a door sensor reporting open/closed, a fitness tracker uploading step counts.

This design priority—**extreme power efficiency**—is what makes BLE transformative for physical computing. A BLE sensor can run for months or even years on a coin cell battery. That's not possible with Bluetooth Classic or WiFi.

{: .important }
> **BLE is not "wireless serial."** This is the single most important conceptual shift in this lesson. If you've used `Serial.println()` over USB or `SerialBT.println()` over Bluetooth Classic, you're used to a continuous byte stream—data flows like water through a pipe. BLE doesn't work that way. Instead, BLE organizes data into discrete, named **characteristics** that can be read, written, or subscribed to. Think less "serial port" and more "structured data API."

If you completed [Lesson 8](bluetooth-serial.md), here's a quick comparison:

| Feature | Bluetooth Classic (L8) | BLE (this lesson) |
|---|---|---|
| Data model | Continuous byte stream | Structured characteristics |
| API feel | Like `Serial` | Like a REST API |
| Power | Higher | Very low |
| iOS support | ❌ (Apple blocks SPP) | ✅ |
| ESP32-S3 | ❌ | ✅ |
| Typical range | ~10m | ~10m |
| Max throughput | ~3 Mbps | Up to 2 Mbps (BLE 5.0 PHY), but practical throughput is much lower |
| Complexity | Very simple | More setup, more concepts |

**Table.** Key differences between Bluetooth Classic (Lesson 8) and BLE (this lesson). BLE trades simplicity for universality, power efficiency, and structured data.
{: .fs-1 }

## How BLE works

BLE communication involves two fundamental concepts: **roles** (who talks to whom) and the **GATT data model** (how data is organized). Let's take these one at a time.

### Peripherals and centrals

Every BLE interaction has two roles:

- A **peripheral** advertises its presence and hosts data. In our lessons, this is always the ESP32. Think of it as a weather station mounted on a wall—it has data (temperature, humidity) and it waits for someone to come read it.

- A **central** scans for peripherals, initiates connections, and reads or writes data. In our lessons, this is your phone or laptop. Think of it as a person walking up to the weather station to check the temperature.

The peripheral **advertises** by periodically broadcasting short packets (called advertisement packets) that say, in essence, "I'm here, my name is X, and I offer these services." The central **scans** for these packets, finds the peripheral, and can then **connect** to it for richer data exchange.

{: .note }
> These roles are about who *initiates* the connection, not who sends data. Once connected, data flows in both directions—the central can read from the peripheral *and* write to it. The terms "peripheral" and "central" replace the older "slave" and "master" terminology that you may encounter in older documentation.

<!-- TODO: Create a diagram showing the BLE lifecycle:
     1. Peripheral advertising (broadcasting packets)
     2. Central scanning (listening for packets)
     3. Central connects to peripheral
     4. Data exchange (read, write, notify)
     5. Disconnect
-->

### The GATT data model

Once a central connects to a peripheral, how does it know what data is available? This is where **GATT** (Generic Attribute Profile) comes in. GATT defines how data is organized on a BLE peripheral, and it's the conceptual heart of BLE.

Think of GATT as a structured bulletin board. The peripheral (ESP32) maintains a bulletin board organized into sections (**services**), and each section contains individual data items (**characteristics**). A central (your phone) walks up to the board, browses the sections, and reads or modifies specific items.

Here's the hierarchy:

```
BLE Peripheral (GATT Server)
  └── Service (e.g., "Sensor Data")                    ← a category of related data
       ├── Characteristic (e.g., "Potentiometer")       ← a single data point
       │    ├── Value: 2847                             ← the actual data
       │    └── Properties: Read, Notify                ← what you can do with it
       └── Characteristic (e.g., "LED Color")
            ├── Value: [255, 0, 128]
            └── Properties: Read, Write
```

**Services** group related data. A peripheral can have multiple services—for example, one for sensor data and another for device information. Each service is identified by a **UUID** (more on this below).

**Characteristics** are the individual data points within a service. Each characteristic has:

- A **UUID** (a unique identifier—like a name or address for this data point)
- A **value** (the actual data—up to 512 bytes, though typically much smaller)
- **Properties** that define how the characteristic can be accessed:
  - **Read**: the central can request the current value (like polling)
  - **Write**: the central can set the value (like sending a command)
  - **Notify**: the peripheral pushes updates to the central automatically when the value changes—this is the most efficient way to stream data, because the central doesn't have to keep asking
  - **Indicate**: like Notify but the central sends an acknowledgment (rarely needed for our use cases)

{: .note }
> **Why so much structure?** If the GATT model feels over-engineered for reading a potentiometer, that's because it was designed for a much broader world of devices—from heart rate monitors to smart locks to industrial sensors. The structure lets *any* BLE central discover what a peripheral offers without prior knowledge. Your phone's Bluetooth settings can show that a nearby device has a "Battery Service" at level 73% without needing a custom app—because "Battery Service" and "Battery Level" are standard UUIDs that every BLE stack understands. This interoperability is BLE's superpower.

### UUIDs: identifying services and characteristics

Every service and characteristic needs a unique identifier. BLE uses **UUIDs** (Universally Unique Identifiers) for this.

**16-bit UUIDs** are reserved by the [Bluetooth SIG](https://www.bluetooth.com/) for standard, well-known services and characteristics. For example:
- `0x180F` = Battery Service
- `0x181A` = Environmental Sensing Service
- `0x2A19` = Battery Level characteristic
- `0x2A6E` = Temperature characteristic

You can browse the full list in the [Bluetooth SIG Assigned Numbers](https://www.bluetooth.com/specifications/assigned-numbers/) document.

**128-bit UUIDs** are for custom services and characteristics—anything you define for your own project. They look like this: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`. You can generate your own at [uuidgenerator.net](https://www.uuidgenerator.net/). In this lesson, we'll use custom 128-bit UUIDs since we're defining our own sensor and LED control services.

{: .note }
> **Don't be intimidated by UUIDs.** A 128-bit UUID is just a unique label—think of it like a URL or a barcode. You generate one, paste it into your code, and use the same one in your phone app or web page so both sides agree on which characteristic is which. You don't need to memorize them or understand their internal structure.

## The ESP32 BLE library

The ESP32 Arduino core includes a built-in BLE library. No installation is needed—just `#include` the headers and go. The key classes you'll use are:

<!-- NOTE: Verify which BLE stack ships by default in your Arduino core version.
     In Arduino-ESP32 v2.x, the default was Bluedroid. In some v3.x releases,
     the default may have switched to NimBLE. The BLEDevice.h API is the same
     either way, but this affects the NimBLE-Arduino note below. -->

| Class | Purpose |
|---|---|
| `BLEDevice` | Initializes the BLE stack (call once in `setup()`) |
| `BLEServer` | Creates a GATT server on the ESP32 |
| `BLEService` | A service within the server (identified by UUID) |
| `BLECharacteristic` | A data point within a service (identified by UUID, has value + properties) |
| `BLE2902` | A descriptor that enables/disables notifications (required for Notify) |
| `BLEAdvertising` | Controls what the ESP32 broadcasts during advertising |
| `BLEServerCallbacks` | Event handler for connection/disconnection events |
| `BLECharacteristicCallbacks` | Event handler for read/write events on a characteristic |

Don't worry about memorizing these—we'll introduce each one as we use it in the activities below.

{: .note }
> **Alternative library: NimBLE-Arduino.** The default BLE library uses the Bluedroid stack, which consumes roughly 170KB of RAM and ~500KB of flash. An alternative called [NimBLE-Arduino](https://github.com/h2zero/NimBLE-Arduino) provides a lighter-weight BLE stack that uses approximately 60% less flash and 50% less RAM, with a similar (though not identical) API. For the ESP32-S3 with its 4MB flash and 2MB PSRAM, the memory savings are less critical—but if you're building a complex project that also uses WiFi, or targeting the ESP32-C3 with only 400KB SRAM, NimBLE is worth exploring. We use the default library in this lesson because it ships with the Arduino core, requires no installation, and is what most online tutorials reference.

## Materials

You'll need the following components. We use **[Adafruit's ESP32-S3 Feather](https://www.adafruit.com/product/5477)** but any ESP32 board with BLE support will work (including the Huzzah32).

| Breadboard | ESP32 | LED | Resistor | Potentiometer |
| ---------- |:-----:|:-----:|:-----:|:-----:|
| ![Half-sized solderless breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Adafruit ESP32-S3 Feather board, top view](assets/images/Adafruit_ESP32-S3-5477-11-vertical-cropped.jpg) | ![Red 5mm LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220-ohm resistor, striped red-red-brown-gold]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![10kΩ rotary potentiometer]({{ site.baseurl }}/assets/images/Potentiometer_100h.png) |
| Breadboard | [ESP32-S3 Feather](https://www.adafruit.com/product/5477) | Red LED | 220Ω Resistor | 10kΩ Potentiometer |

You will also need:

- **Python 3** with the [bleak](https://pypi.org/project/bleak/) library installed (`pip3 install bleak`). Bleak is a cross-platform BLE library for Python—it works on macOS, Windows, and Linux.
- A **smartphone** (iPhone or Android) with the free [nRF Connect](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile) app by Nordic Semiconductor. Unlike Bluetooth Classic, **BLE works with iPhones**—so everyone can participate! Available on [iOS](https://apps.apple.com/app/nrf-connect-for-mobile/id1054362403) and [Android](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp).

{: .note }
> [nRF Connect](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile) is a professional-grade BLE debugging tool made by Nordic Semiconductor (a major BLE chip manufacturer). It lets you scan for BLE devices, inspect their services and characteristics, read values, write data, and subscribe to notifications. It's free, available on [iOS](https://apps.apple.com/app/nrf-connect-for-mobile/id1054362403) and [Android](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp), and is the tool we'll use throughout this lesson. Alternatives include [LightBlue](https://punchthrough.com/lightblue/) (iOS/Android) and [BLE Scanner](https://play.google.com/store/apps/details?id=com.macdom.ble.blescanner) (Android).

## Part 1: Advertising and discovery

Let's start with the BLE equivalent of "Hello World": create a GATT server on the ESP32 with a single readable characteristic, advertise it, and see it on your phone.

### The Arduino code

<!-- TODO: Push BLEHelloWorld.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BLEHelloWorld).

```cpp
/**
 * BLEHelloWorld: creates a BLE GATT server with one service and one
 * readable characteristic. The characteristic contains a greeting
 * string that you can read from any BLE central (like nRF Connect).
 *
 * Works on: ESP32-S3 Feather, Huzzah32, or any ESP32 with BLE.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/ble
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

// Custom UUIDs for our service and characteristic.
// Generated at https://www.uuidgenerator.net/
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

bool _deviceConnected = false;

// Callback class to handle connection events
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    _deviceConnected = true;
    Serial.println("Central connected!");
  }

  void onDisconnect(BLEServer* pServer) {
    _deviceConnected = false;
    Serial.println("Central disconnected. Restarting advertising...");

    // IMPORTANT: restart advertising so other devices can find us again.
    // Without this, the ESP32 goes silent after the first disconnection.
    pServer->getAdvertising()->start();
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE Hello World...");

  // Step 1: Initialize the BLE stack with a device name.
  // This name appears when centrals scan for devices.
  BLEDevice::init("ESP32-BLE");

  // Step 2: Create a GATT server.
  BLEServer* pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Step 3: Create a service on the server (identified by UUID).
  BLEService* pService = pServer->createService(SERVICE_UUID);

  // Step 4: Create a characteristic within the service.
  // This characteristic is readable (PROPERTY_READ) — a central
  // can request its value.
  BLECharacteristic* pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ
  );

  // Step 5: Set the initial value of the characteristic.
  pCharacteristic->setValue("Hello from ESP32!");

  // Step 6: Start the service (makes it visible to connected centrals).
  pService->start();

  // Step 7: Start advertising so centrals can discover us.
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);  // include our service UUID in ads
  pAdvertising->setScanResponse(true);         // allow a scan response packet
  pAdvertising->start();

  Serial.println("BLE server is advertising. Open nRF Connect and scan!");
}

void loop() {
  // Nothing to do here yet — the BLE stack runs in the background.
  // We'll add sensor reading and notifications in Part 2.
  delay(1000);
}
```

Let's walk through the key steps:

**Step 1: `BLEDevice::init("ESP32-BLE")`** initializes the Bluetooth stack and sets the device name that appears during scanning. This is analogous to `SerialBT.begin("ESP32-Bluetooth")` from [Lesson 8](bluetooth-serial.md), but the similarity ends here—BLE has no `println()` or `read()` on the device object.

**Steps 2–4: Creating the GATT hierarchy.** We create a **server** (the ESP32 as a whole), a **service** within it (identified by `SERVICE_UUID`), and a **characteristic** within that service (identified by `CHARACTERISTIC_UUID`). The characteristic has `PROPERTY_READ`, meaning a central can request its value. This is the GATT structure we discussed earlier, built in code.

**Step 5: Setting the value.** `pCharacteristic->setValue("Hello from ESP32!")` stores a string in the characteristic. When a central reads this characteristic, it receives this string.

**Step 6–7: Starting the service and advertising.** `pService->start()` activates the service so connected centrals can see it. `pAdvertising->start()` begins broadcasting advertisement packets. We include our service UUID in the advertisement (`addServiceUUID`) so centrals filtering by service can find us.

**The `onDisconnect` callback.** This is a critical gotcha: when a central disconnects, the ESP32 **stops advertising by default**. If you don't restart advertising in `onDisconnect()`, the ESP32 goes silent and no new centrals can find it. Always restart advertising after disconnection.

### Discovering the ESP32 from your computer (Python)

Let's start on the computer, where debugging is easiest. We'll use [bleak](https://pypi.org/project/bleak/)—a cross-platform BLE client library for Python. If you haven't installed it yet:

```
pip3 install bleak
```

Here's a script that scans for BLE devices, connects to the ESP32, and reads our characteristic:

```python
"""
ble_discover.py: Scans for BLE devices, connects to the ESP32,
and reads the greeting characteristic.

Requires: bleak (pip3 install bleak)

By Jon E. Froehlich
@jonfroehlich
http://makeabilitylab.io
"""

import asyncio
from bleak import BleakScanner, BleakClient

SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

async def main():
    print("Scanning for BLE devices...")
    devices = await BleakScanner.discover(timeout=5.0)

    target = None
    for d in devices:
        print(f"  Found: {d.name} ({d.address})")
        if d.name and "ESP32" in d.name:
            target = d

    if target is None:
        print("Could not find ESP32 BLE device. Is the sketch running?")
        return

    print(f"\nConnecting to {target.name} ({target.address})...")
    async with BleakClient(target.address) as client:
        print(f"Connected: {client.is_connected}")

        # Read the greeting characteristic
        value = await client.read_gatt_char(CHARACTERISTIC_UUID)
        text = value.decode("utf-8")
        print(f"Read from characteristic: {text}")

asyncio.run(main())
```

Run it:

```
python3 ble_discover.py
```

You should see the ESP32 in the scan results and then read `"Hello from ESP32!"` from the characteristic. 🎉

{: .note }
> **Compare with pySerial from [Lesson 8](bluetooth-serial.md).** With Bluetooth Classic, you used `serial.Serial()` to open a virtual COM port—the same API as USB serial. With BLE, there's no virtual COM port; you use `bleak`'s `BleakClient` to connect directly to the device and read structured characteristics. This is the fundamental difference between the two Bluetooth flavors.

### Discovering the ESP32 from your phone (iPhone and Android)

Once you've confirmed the ESP32 is working from your computer, let's try it from your phone. **This works on both iPhones and Android phones**—unlike Bluetooth Classic, which was Android-only.

1. On your **iPhone** or **Android phone**, open the **nRF Connect** app ([iOS](https://apps.apple.com/app/nrf-connect-for-mobile/id1054362403) / [Android](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp)).
2. Tap **Scan** (top right). You should see `"ESP32-BLE"` in the list of discovered devices.

<!-- TODO: Add side-by-side screenshots of nRF Connect scan results on iOS and Android (include descriptive alt text) -->

3. Tap **Connect** next to `"ESP32-BLE"`. The app will connect and display the GATT server structure. You should see your custom service (listed by its UUID) with one characteristic underneath.

<!-- TODO: Add screenshot of nRF Connect showing the service and characteristic tree (include descriptive alt text) -->

4. Tap the **read arrow** (↓) next to the characteristic. You should see `"Hello from ESP32!"` appear as the value. You just read data from a BLE peripheral on your phone!

{: .note }
> **What you're seeing in nRF Connect** is the GATT structure we built in code: one service containing one characteristic. nRF Connect shows the UUIDs for each. Since we used custom 128-bit UUIDs (not standard Bluetooth SIG UUIDs), nRF Connect displays them as "Unknown Service" and "Unknown Characteristic"—it doesn't know what our custom UUIDs mean. If we'd used a standard UUID like `0x181A` (Environmental Sensing), nRF Connect would display the name automatically.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. Uploading the sketch to the ESP32-S3 Feather
     2. Running the Python ble_discover.py script
     3. Opening nRF Connect on a phone, scanning, finding ESP32-BLE
     4. Connecting, expanding the service tree, reading the value
     Include captions/transcript
-->

## Part 2: Streaming sensor data with notifications

Reading a static string is a good start, but the real power of BLE comes with **notifications**—the peripheral automatically pushes updates to the central whenever a value changes. Let's wire up a potentiometer and stream its value to your phone in real time.

### The circuit

Connect a 10kΩ potentiometer to the ESP32-S3 Feather on pin **A5** (GPIO 8), which is an ADC1 pin. This is the same potentiometer circuit from [Lesson 4: Analog Input](analog-input.md).

<!-- TODO: Create a Fritzing wiring diagram showing the potentiometer on A5 -->

<details markdown="1">
<summary><strong>Using the Huzzah32 instead?</strong> (click to expand)</summary>

On the Huzzah32, use pin **A7** (GPIO 32), which is an ADC1 pin. ADC2 pins conflict with both WiFi and Bluetooth on the original ESP32, so always use ADC1 for analog input when using wireless features.

</details>

### The Arduino code

<!-- TODO: Push BLENotifySensor.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BLENotifySensor).

```cpp
/**
 * BLENotifySensor: reads a potentiometer and streams its value to
 * connected BLE centrals using notifications. Open nRF Connect,
 * connect, and subscribe to notifications to see live sensor data.
 *
 * Circuit:
 * - 10kΩ potentiometer on A5 (GPIO 8, ADC1) for ESP32-S3 Feather
 *   (use A7 / GPIO 32 for the Huzzah32)
 *
 * Works on: ESP32-S3 Feather, Huzzah32, or any ESP32 with BLE.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/ble
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Custom UUIDs — same service UUID as Part 1, new characteristic UUID for sensor data
#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define SENSOR_CHAR_UUID       "beb5483e-36e1-4688-b7f5-ea07361b26a8"

const int POT_INPUT_PIN = A5; // GPIO 8, ADC1 on ESP32-S3 Feather

BLEServer* _pServer = NULL;
BLECharacteristic* _pSensorCharacteristic = NULL;
bool _deviceConnected = false;

// Timing for non-blocking sensor reads
unsigned long _lastSensorReadMs = 0;
const unsigned long SENSOR_READ_INTERVAL_MS = 100; // read sensor ~10x/sec

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    _deviceConnected = true;
    Serial.println("Central connected!");
  }

  void onDisconnect(BLEServer* pServer) {
    _deviceConnected = false;
    Serial.println("Central disconnected. Restarting advertising...");
    pServer->getAdvertising()->start();
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE Sensor Notify...");

  // Initialize BLE
  BLEDevice::init("ESP32-BLE-Sensor");
  _pServer = BLEDevice::createServer();
  _pServer->setCallbacks(new MyServerCallbacks());

  // Create service
  BLEService* pService = _pServer->createService(SERVICE_UUID);

  // Create characteristic with READ and NOTIFY properties
  _pSensorCharacteristic = pService->createCharacteristic(
    SENSOR_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );

  // Add the BLE2902 descriptor — this is required for notifications.
  // It allows the central to enable/disable notifications on this characteristic.
  _pSensorCharacteristic->addDescriptor(new BLE2902());

  // Start the service and begin advertising
  pService->start();
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("BLE server advertising. Connect with nRF Connect!");
}

void loop() {
  unsigned long now = millis();

  if (now - _lastSensorReadMs >= SENSOR_READ_INTERVAL_MS) {
    _lastSensorReadMs = now;

    int potVal = analogRead(POT_INPUT_PIN);

    // Always print to USB serial for debugging
    Serial.print("Pot:");
    Serial.println(potVal);

    // If a BLE central is connected, update the characteristic and notify
    if (_deviceConnected) {
      // Convert the integer to a string and set it as the characteristic value.
      // We could also send raw bytes for efficiency, but strings are easier
      // to read in nRF Connect for learning purposes.
      String valStr = String(potVal);
      _pSensorCharacteristic->setValue(valStr.c_str());
      _pSensorCharacteristic->notify();
    }
  }
}
```

There are two new elements here compared to Part 1:

**`PROPERTY_NOTIFY`** tells the BLE stack that this characteristic supports notifications. When a central subscribes to notifications, it will receive an automatic update every time we call `notify()`.

**`BLE2902` descriptor.** This is a BLE protocol requirement: the Client Characteristic Configuration Descriptor (CCCD), identified by UUID `0x2902`, is a small piece of metadata that the central uses to enable or disable notifications. Without it, the central cannot subscribe. The line `_pSensorCharacteristic->addDescriptor(new BLE2902())` adds this descriptor to our characteristic.

**`_pSensorCharacteristic->notify()`** pushes the current value to all subscribed centrals. We call this after updating the value with `setValue()`. If no central is subscribed, `notify()` does nothing.

### Reading notifications from your computer (Python)

Here's a Python script that subscribes to the potentiometer notifications and displays them in real time:

```python
"""
ble_sensor_reader.py: Connects to the ESP32 BLE sensor and subscribes
to potentiometer notifications. Displays values with a live ASCII bar.

Requires: bleak (pip3 install bleak)

By Jon E. Froehlich
@jonfroehlich
http://makeabilitylab.io
"""

import asyncio
from bleak import BleakScanner, BleakClient

SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
SENSOR_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

def on_notification(sender, data):
    """Called each time the ESP32 sends a notification."""
    text = data.decode("utf-8").strip()
    try:
        value = int(text)
        bar_length = int(value / 4095 * 50)
        bar = '█' * bar_length + '░' * (50 - bar_length)
        print(f"\r{bar} {value:4d}", end='', flush=True)
    except ValueError:
        print(f"\r{text}", end='', flush=True)

async def main():
    print("Scanning for ESP32-BLE-Sensor...")
    devices = await BleakScanner.discover(timeout=5.0)

    target = None
    for d in devices:
        if d.name and "ESP32" in d.name:
            target = d
            break

    if target is None:
        print("Could not find ESP32. Is the sketch running?")
        return

    print(f"Connecting to {target.name}...")
    async with BleakClient(target.address) as client:
        print(f"Connected! Turn the potentiometer.\n")

        # Subscribe to notifications
        await client.start_notify(SENSOR_CHAR_UUID, on_notification)

        # Keep running until Ctrl+C
        try:
            while True:
                await asyncio.sleep(1.0)
        except KeyboardInterrupt:
            print("\nStopping...")
            await client.stop_notify(SENSOR_CHAR_UUID)

asyncio.run(main())
```

Run it and turn the potentiometer—you'll see a live bar chart updating in your terminal, with data arriving wirelessly over BLE:

```
python3 ble_sensor_reader.py
```

{: .note }
> **Compare with the Python Bluetooth Classic script from [Lesson 8](bluetooth-serial.md).** In L8, you used `pyserial`'s `ser.readline()` to read data from a virtual COM port—a byte stream, just like USB serial. Here, you use `bleak`'s `start_notify()` to subscribe to a specific BLE characteristic—a callback fires each time the ESP32 pushes a new value. The data arrives structured and event-driven rather than as a continuous byte stream.

### Reading notifications from your phone (iPhone and Android)

Now try it from your phone:

1. Open **nRF Connect** on your **iPhone** or **Android phone**.
2. Scan and connect to `"ESP32-BLE-Sensor"`.
3. Expand the service and find the sensor characteristic.
4. Tap the **triple-down-arrow** icon (⇊) to **subscribe to notifications**.
5. Turn the potentiometer—you should see the value updating in real time on your phone!

<!-- TODO: Add screenshot of nRF Connect showing live notification values updating (include descriptive alt text) -->

{: .note }
> **Comparing with serial:** In the [Communication module](../communication/serial-intro.md), you call `Serial.println(sensorValue)` and bytes flow continuously through the USB cable at 115,200 bps. With BLE, you update a characteristic value and call `notify()`—the BLE stack delivers it at the negotiated connection interval (typically 7.5ms–4 seconds). BLE trades raw throughput for structured data, power efficiency, and wireless convenience.

### The 20-byte payload limit

Try changing the `setValue()` call to send a long string—something like `"Potentiometer reading is: " + String(potVal)`. You'll notice the value gets **truncated** in nRF Connect. Welcome to the 20-byte MTU limit!

By default, BLE's ATT (Attribute Protocol) layer has a Maximum Transmission Unit (MTU) of 23 bytes. After 3 bytes of protocol overhead, that leaves **20 bytes** for your actual data. Any value longer than 20 bytes gets silently truncated.

You can negotiate a larger MTU (up to 512 bytes) if both sides support it, but 20 bytes is the safe baseline that works with all BLE devices. For sensor data, this is rarely a problem—an integer like `"2847"` is only 4 bytes as a string (or 2 bytes as a raw `uint16_t`). But if you try to send long formatted strings, you'll hit this limit.

{: .caution }
> **Keep your BLE payloads compact.** Send numbers as short strings or raw bytes, not verbose text. If you need to send more than 20 bytes, either negotiate a larger MTU (call `BLEDevice::setMTU(185)` in `setup()`; both sides must agree), split the data across multiple characteristics, or send it in chunks.

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. The potentiometer circuit on the ESP32-S3 Feather
     2. Subscribing to notifications in nRF Connect
     3. Turning the pot and watching values update on the phone
     Include captions/transcript
-->

## Part 3: Controlling the NeoPixel over BLE

Now let's go the other direction: send data *from* your phone *to* the ESP32 to control hardware. We'll create a **writable** characteristic that accepts RGB color values and sets the onboard NeoPixel.

The ESP32-S3 Feather has a built-in NeoPixel (WS2812B) RGB LED on `PIN_NEOPIXEL`, powered by `NEOPIXEL_POWER`. We used it in [Lesson 2: Blink](led-blink.md) and [Lesson 3: LED Fading](led-fade.md), so the NeoPixel setup should be familiar.

### The Arduino code

<!-- TODO: Push BLENeoPixelControl.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

We'll extend the Part 2 sketch to add a second characteristic for LED control—so the ESP32 simultaneously streams sensor data *and* accepts LED commands. This is the same bidirectional pattern from [Lesson 8](bluetooth-serial.md#part-4-bidirectional-control), but over BLE with structured characteristics instead of a serial byte stream. The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BLENeoPixelControl).

```cpp
/**
 * BLENeoPixelControl: bidirectional BLE communication.
 * Streams potentiometer data via notifications (peripheral → central)
 * AND accepts RGB color commands via a writable characteristic
 * (central → peripheral) to control the onboard NeoPixel.
 *
 * Circuit:
 * - 10kΩ potentiometer on A5 (GPIO 8, ADC1)
 * - Onboard NeoPixel (no external wiring needed)
 *
 * Works on: ESP32-S3 Feather (for the onboard NeoPixel).
 * On the Huzzah32, substitute an external NeoPixel or LED.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/ble
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Adafruit_NeoPixel.h>

// Custom UUIDs
#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define SENSOR_CHAR_UUID       "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define LED_CHAR_UUID          "a3c87500-8ed3-4bdf-8a39-a01bebede295"

const int POT_INPUT_PIN = A5;

// NeoPixel setup — one pixel on the onboard NeoPixel pin
Adafruit_NeoPixel _pixel(1, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);

BLEServer* _pServer = NULL;
BLECharacteristic* _pSensorCharacteristic = NULL;
BLECharacteristic* _pLedCharacteristic = NULL;
bool _deviceConnected = false;

unsigned long _lastSensorReadMs = 0;
const unsigned long SENSOR_READ_INTERVAL_MS = 100;

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    _deviceConnected = true;
    Serial.println("Central connected!");
  }

  void onDisconnect(BLEServer* pServer) {
    _deviceConnected = false;
    Serial.println("Central disconnected. Restarting advertising...");
    pServer->getAdvertising()->start();
  }
};

// Callback for when the central writes to the LED characteristic
class LedCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    String value = pCharacteristic->getValue();

    if (value.length() >= 3) {
      // Interpret the first 3 bytes as R, G, B
      uint8_t r = (uint8_t)value[0];
      uint8_t g = (uint8_t)value[1];
      uint8_t b = (uint8_t)value[2];

      Serial.print("Received RGB: ");
      Serial.print(r); Serial.print(", ");
      Serial.print(g); Serial.print(", ");
      Serial.println(b);

      _pixel.setPixelColor(0, _pixel.Color(r, g, b));
      _pixel.show();
    } else {
      Serial.print("Received write with ");
      Serial.print(value.length());
      Serial.println(" bytes (expected 3 for RGB).");
    }
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE NeoPixel Control...");

  // Initialize NeoPixel
  #if defined(NEOPIXEL_POWER)
    pinMode(NEOPIXEL_POWER, OUTPUT);
    digitalWrite(NEOPIXEL_POWER, HIGH);
  #endif
  _pixel.begin();
  _pixel.setBrightness(30); // keep it dim to avoid blinding you
  _pixel.show();             // turn off (all zeros)

  // Initialize BLE
  BLEDevice::init("ESP32-BLE-NeoPixel");
  _pServer = BLEDevice::createServer();
  _pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = _pServer->createService(SERVICE_UUID);

  // Sensor characteristic (Read + Notify) — streams potentiometer data
  _pSensorCharacteristic = pService->createCharacteristic(
    SENSOR_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  _pSensorCharacteristic->addDescriptor(new BLE2902());

  // LED characteristic (Read + Write) — receives RGB color commands
  _pLedCharacteristic = pService->createCharacteristic(
    LED_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  _pLedCharacteristic->setCallbacks(new LedCallbacks());

  // Start service and advertising
  pService->start();
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("BLE server advertising. Connect with nRF Connect!");
}

void loop() {
  unsigned long now = millis();

  if (now - _lastSensorReadMs >= SENSOR_READ_INTERVAL_MS) {
    _lastSensorReadMs = now;

    int potVal = analogRead(POT_INPUT_PIN);
    Serial.print("Pot:");
    Serial.println(potVal);

    if (_deviceConnected) {
      String valStr = String(potVal);
      _pSensorCharacteristic->setValue(valStr.c_str());
      _pSensorCharacteristic->notify();
    }
  }
}
```

The key new element is the `LedCallbacks` class. When the central writes to the LED characteristic, `onWrite()` fires automatically. We interpret the first three bytes of the written value as R, G, B and set the NeoPixel color accordingly.

{: .highlight }
> **Callbacks vs. polling:** Notice the pattern: we don't poll for incoming data in `loop()` (like we do with `Serial.available()` or `SerialBT.available()` in [Lesson 8](bluetooth-serial.md)). Instead, BLE uses a **callback model**—the library calls our `onWrite()` function when data arrives. This is fundamentally different from the serial polling pattern you're used to, and it's one of the biggest code-level differences between Bluetooth Classic and BLE.

### Try it out from your computer (Python)

Here's a quick Python script that writes RGB values to the NeoPixel characteristic:

```python
"""
ble_neopixel.py: Connects to the ESP32 and sets the NeoPixel color.

Usage: python3 ble_neopixel.py
Then enter RGB values like: 255 0 128

Requires: bleak (pip3 install bleak)

By Jon E. Froehlich
@jonfroehlich
http://makeabilitylab.io
"""

import asyncio
from bleak import BleakScanner, BleakClient

LED_CHAR_UUID = "a3c87500-8ed3-4bdf-8a39-a01bebede295"

async def main():
    print("Scanning for ESP32-BLE-NeoPixel...")
    devices = await BleakScanner.discover(timeout=5.0)

    target = None
    for d in devices:
        if d.name and "ESP32" in d.name:
            target = d
            break

    if not target:
        print("ESP32 not found.")
        return

    async with BleakClient(target.address) as client:
        print(f"Connected to {target.name}!")
        while True:
            rgb = input("Enter R G B (0-255 each, or 'quit'): ")
            if rgb.lower() == 'quit':
                break
            parts = rgb.split()
            if len(parts) == 3:
                r, g, b = int(parts[0]), int(parts[1]), int(parts[2])
                await client.write_gatt_char(LED_CHAR_UUID, bytes([r, g, b]))
                print(f"  Sent RGB: ({r}, {g}, {b})")

asyncio.run(main())
```

### Try it out from your phone (iPhone and Android)

1. Upload the sketch. The NeoPixel should be off initially.
2. Open **nRF Connect** on your **iPhone or Android phone**. Scan and connect to `"ESP32-BLE-NeoPixel"`.
3. Expand the service. You should see **two** characteristics now.
4. Find the LED characteristic (the one with `a3c87500...` UUID).
5. Tap the **write arrow** (↑). In the write dialog, select **ByteArray** as the type, then enter `FF0000` (red), `00FF00` (green), or `0000FF` (blue). Tap **Send**.
6. Watch the NeoPixel change color! 🌈

<!-- TODO: Add screenshot of nRF Connect write dialog with hex values, showing both iOS and Android (include descriptive alt text) -->

{: .note }
> **nRF Connect write format:** When writing raw bytes in nRF Connect, select "ByteArray" (not "Text") and enter hex values without spaces or `0x` prefixes. `FF0000` = red, `00FF00` = green, `0000FF` = blue, `FF00FF` = magenta, `FFFFFF` = white. Each pair of hex digits is one byte (0–255).

### Workbench demo

<!-- TODO: Record and embed a workbench video showing:
     1. Connecting from nRF Connect
     2. Writing different RGB hex values
     3. The onboard NeoPixel changing color with each write
     Include captions/transcript
-->

## Part 4: Web Bluetooth

So far we've used nRF Connect as our BLE central—it's great for debugging, but it doesn't give us a custom UI. What if you could control the NeoPixel from a **web page** with sliders and a color picker? What if you could plot sensor data in a live chart—all in the browser, all wireless?

That's exactly what the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) provides. If you completed the [Web Serial lessons](../communication/web-serial.md), this will feel familiar—it's the same idea (browser talks to hardware) with a different transport (BLE instead of USB serial).

### Web Serial vs. Web Bluetooth

| | Web Serial ([L2](../communication/web-serial.md)) | Web Bluetooth (this section) |
|---|---|---|
| Browser API | `navigator.serial` | `navigator.bluetooth` |
| Connect | `port.open({ baudRate })` | `device.gatt.connect()` |
| Send data | `writer.write(bytes)` | `characteristic.writeValue(bytes)` |
| Receive data | Read from stream | Subscribe to notifications |
| User gesture | Required to open port | Required to pair |
| Security | No HTTPS required | **Requires HTTPS** (or localhost) |
| Chrome/Edge | ✅ | ✅ |
| Firefox | ❌ | ⚠️ (behind flag) |
| Safari / iOS | ❌ | ❌ |
| Android Chrome | ✅ | ✅ |

**Table.** Web Serial and Web Bluetooth have strikingly parallel structures. The main differences: Web Bluetooth requires HTTPS (or localhost), uses structured characteristics instead of raw byte streams, and is supported on Android but not iOS.
{: .fs-1 }

{: .warning }
> **Web Bluetooth requires HTTPS or localhost.** It will not work from a `file://` URL. Use a local development server (VS Code's [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, or `python3 -m http.server`) or host your page on [GitHub Pages](https://pages.github.com/). Web Bluetooth works in **Chrome and Edge** on desktop and Android, but **not on iOS**—Apple's Safari (and iOS Chrome, which uses WebKit) does not support Web Bluetooth. For iOS users, nRF Connect provides similar functionality.

### The web page

We'll build a single HTML page (vanilla JavaScript, no frameworks—matching the style of the [Web Serial lesson](../communication/web-serial.md)) that:

1. Connects to the ESP32's BLE service
2. Subscribes to potentiometer notifications and displays the live value
3. Has three sliders (R, G, B) that write to the LED characteristic to control the NeoPixel

Make sure the Part 3 sketch is running on your ESP32 before testing this page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ESP32 BLE NeoPixel Controller</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: 500px;
      margin: 40px auto;
      padding: 0 20px;
      background: #f5f5f5;
    }
    h1 { font-size: 1.4em; }
    button {
      padding: 12px 24px;
      font-size: 1em;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      background: #0066cc;
      color: white;
    }
    button:disabled {
      background: #999;
      cursor: not-allowed;
    }
    #status {
      margin: 12px 0;
      padding: 8px;
      border-radius: 4px;
      background: #e8e8e8;
    }
    .slider-group {
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .slider-group label {
      width: 20px;
      font-weight: bold;
    }
    .slider-group input[type="range"] {
      flex: 1;
    }
    .slider-group span {
      width: 30px;
      text-align: right;
    }
    #color-preview {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #ccc;
      margin: 10px 0;
    }
    #sensor-value {
      font-size: 2em;
      font-weight: bold;
      margin: 10px 0;
    }
    .controls { display: none; }
  </style>
</head>
<body>
  <h1>ESP32 BLE NeoPixel Controller</h1>

  <button id="connect-btn">Connect to ESP32</button>
  <div id="status">Not connected</div>

  <div class="controls" id="controls">
    <h2>Sensor Data</h2>
    <div id="sensor-value">—</div>
    <p>Potentiometer reading (0–4095)</p>

    <h2>NeoPixel Color</h2>
    <div class="slider-group">
      <label style="color:red">R</label>
      <input type="range" id="r-slider" min="0" max="255" value="0">
      <span id="r-val">0</span>
    </div>
    <div class="slider-group">
      <label style="color:green">G</label>
      <input type="range" id="g-slider" min="0" max="255" value="0">
      <span id="g-val">0</span>
    </div>
    <div class="slider-group">
      <label style="color:blue">B</label>
      <input type="range" id="b-slider" min="0" max="255" value="0">
      <span id="b-val">0</span>
    </div>
    <div id="color-preview"></div>
  </div>

  <script>
    // UUIDs must match the ESP32 sketch exactly
    const SERVICE_UUID        = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    const SENSOR_CHAR_UUID    = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    const LED_CHAR_UUID       = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';

    let ledCharacteristic = null;

    const connectBtn  = document.getElementById('connect-btn');
    const statusDiv   = document.getElementById('status');
    const controlsDiv = document.getElementById('controls');
    const sensorValue = document.getElementById('sensor-value');

    connectBtn.addEventListener('click', async () => {
      try {
        statusDiv.textContent = 'Requesting BLE device...';

        // Step 1: Request a BLE device.
        // This opens the browser's Bluetooth pairing dialog, filtered
        // to show only devices advertising our service UUID.
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: [SERVICE_UUID] }]
        });

        statusDiv.textContent = `Connecting to ${device.name}...`;

        // Listen for disconnection
        device.addEventListener('gattserverdisconnected', () => {
          statusDiv.textContent = 'Disconnected.';
          controlsDiv.style.display = 'none';
          connectBtn.disabled = false;
        });

        // Step 2: Connect to the GATT server.
        const server = await device.gatt.connect();

        // Step 3: Get our custom service.
        const service = await server.getPrimaryService(SERVICE_UUID);

        // Step 4: Get the sensor characteristic and subscribe to notifications.
        const sensorChar = await service.getCharacteristic(SENSOR_CHAR_UUID);
        await sensorChar.startNotifications();
        sensorChar.addEventListener('characteristicvaluechanged', (event) => {
          // The value arrives as a DataView. Decode it as a UTF-8 string.
          const decoder = new TextDecoder();
          const val = decoder.decode(event.target.value);
          sensorValue.textContent = val;
        });

        // Step 5: Get the LED characteristic (we'll write to it from the sliders).
        ledCharacteristic = await service.getCharacteristic(LED_CHAR_UUID);

        // Connected! Show the controls.
        statusDiv.textContent = `Connected to ${device.name}`;
        controlsDiv.style.display = 'block';
        connectBtn.disabled = true;

      } catch (error) {
        console.error('BLE error:', error);
        statusDiv.textContent = `Error: ${error.message}`;
      }
    });

    // --- Slider handling ---
    const rSlider = document.getElementById('r-slider');
    const gSlider = document.getElementById('g-slider');
    const bSlider = document.getElementById('b-slider');
    const rVal = document.getElementById('r-val');
    const gVal = document.getElementById('g-val');
    const bVal = document.getElementById('b-val');
    const colorPreview = document.getElementById('color-preview');

    async function sendColor() {
      const r = parseInt(rSlider.value);
      const g = parseInt(gSlider.value);
      const b = parseInt(bSlider.value);

      // Update the UI
      rVal.textContent = r;
      gVal.textContent = g;
      bVal.textContent = b;
      colorPreview.style.background = `rgb(${r}, ${g}, ${b})`;

      // Send 3 bytes (R, G, B) to the LED characteristic
      if (ledCharacteristic) {
        const data = new Uint8Array([r, g, b]);
        try {
          await ledCharacteristic.writeValue(data);
        } catch (error) {
          console.error('Write error:', error);
        }
      }
    }

    rSlider.addEventListener('input', sendColor);
    gSlider.addEventListener('input', sendColor);
    bSlider.addEventListener('input', sendColor);
  </script>
</body>
</html>
```

Let's walk through the JavaScript, step by step:

**Step 1: `navigator.bluetooth.requestDevice()`** opens the browser's Bluetooth pairing dialog. We pass a `filters` array that limits the list to devices advertising our service UUID—so only our ESP32 appears. This is the BLE equivalent of `navigator.serial.requestPort()` from the [Web Serial lesson](../communication/web-serial.md). Like Web Serial, this call **requires a user gesture** (a button click)—you can't trigger it automatically on page load.

**Step 2: `device.gatt.connect()`** establishes a GATT connection. This is analogous to `port.open()` in Web Serial—after this call, we can read and write data.

**Steps 3–4: Getting the service and characteristic, subscribing to notifications.** We drill down through the GATT hierarchy: server → service → characteristic. Then `sensorChar.startNotifications()` tells the ESP32 we want to receive updates. We listen for `characteristicvaluechanged` events—each event delivers a `DataView` containing the raw bytes. Since our ESP32 sends the potentiometer value as a string, we decode it with `TextDecoder`.

**Step 5: Getting the LED characteristic.** We store a reference to the LED characteristic so we can write to it later from the slider event handlers.

**`sendColor()`** reads the three slider values, packs them into a `Uint8Array` of 3 bytes (R, G, B), and writes them to the LED characteristic with `ledCharacteristic.writeValue(data)`. This triggers the `onWrite()` callback on the ESP32, which sets the NeoPixel color.

{: .note }
> **Spot the structural parallel.** In [Web Serial](../communication/web-serial.md), you write raw bytes to a `WritableStream`. In Web Bluetooth, you write raw bytes to a `BLECharacteristic`. The data format (a `Uint8Array`) is even the same! The key difference is that Web Bluetooth writes go to a *specific, named characteristic*—not a generic byte stream. This structure is what makes BLE self-describing and interoperable.

### Try it out

1. Make sure the Part 3 sketch is running on your ESP32.
2. Serve the HTML file from a local server (VS Code Live Server, or `python3 -m http.server`). Open it in Chrome.
3. Click **Connect to ESP32**. The browser shows a pairing dialog—select your ESP32 and click **Pair**.
4. The sensor value should appear and update in real time.
5. Drag the R, G, B sliders—the NeoPixel changes color as you move them!

<!-- TODO: Add a screenshot or screencast showing the web page in Chrome with sliders and live sensor data (include descriptive alt text) -->

{: .note }
> **Throttling writes.** If you drag a slider quickly, `sendColor()` fires on every pixel of movement—potentially dozens of times per second. BLE can handle this, but rapid writes may occasionally fail with a "GATT operation already in progress" error. For a more robust implementation, you could debounce the slider input or use `requestAnimationFrame()` to batch writes. For this lesson, occasional errors are harmless.

### Workbench demo

<!-- TODO: Record and embed a video showing:
     1. The Chrome web page connecting to the ESP32
     2. Potentiometer values appearing in real time
     3. Sliding the RGB sliders and the NeoPixel changing color wirelessly
     4. The "magic moment" of browser → BLE → physical hardware
     Include captions/transcript
-->

## Part 5: Nordic UART Service (NUS)

Throughout this lesson, we've worked directly with custom GATT services and characteristics—the fundamental BLE building blocks. But what if you just want to send text back and forth, like the serial bridge from [Lesson 8](bluetooth-serial.md)? This is where the **Nordic UART Service (NUS)** comes in.

NUS is a widely adopted convention (created by Nordic Semiconductor) that uses two BLE characteristics to emulate serial communication:

- **RX Characteristic** (`6E400002-B5A3-F393-E0A9-E50E24DCCA9E`): the central *writes* data here to send it to the peripheral (from the peripheral's perspective, this is "received" data—hence "RX").
- **TX Characteristic** (`6E400003-B5A3-F393-E0A9-E50E24DCCA9E`): the peripheral *notifies* data here to send it to the central (from the peripheral's perspective, this is "transmitted" data—hence "TX").

The naming is from the **peripheral's perspective**: RX = data coming *in* to the ESP32, TX = data going *out* from the ESP32.

{: .note }
> NUS is not an official Bluetooth SIG standard—it's a convention created by Nordic Semiconductor that has become a de facto standard because so many apps support it. Apps like nRF Connect, nRF Toolbox, and many Bluetooth terminal apps automatically recognize the NUS UUIDs and provide a serial terminal interface.

Here's a simple NUS example:

<!-- TODO: Push BLEUartService.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->
<!-- TODO: Push Python scripts (ble_discover.py, ble_sensor_reader.py, ble_neopixel.py) to https://github.com/makeabilitylab/arduino/tree/master/Python/BLE/ -->

```cpp
/**
 * BLEUartService: implements the Nordic UART Service (NUS) for
 * serial-like text communication over BLE. Type text in nRF Connect's
 * UART feature and it appears in Serial Monitor; type in Serial
 * Monitor and it is sent over BLE.
 *
 * Works on: ESP32-S3 Feather, Huzzah32, or any ESP32 with BLE.
 *
 * See: https://makeabilitylab.github.io/physcomp/esp32/ble
 *
 * By Jon E. Froehlich
 * @jonfroehlich
 * http://makeabilitylab.io
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Nordic UART Service UUIDs — these are a de facto standard
#define NUS_SERVICE_UUID   "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define NUS_RX_CHAR_UUID   "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define NUS_TX_CHAR_UUID   "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLEServer* _pServer = NULL;
BLECharacteristic* _pTxCharacteristic = NULL;
bool _deviceConnected = false;

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    _deviceConnected = true;
    Serial.println("Central connected!");
  }
  void onDisconnect(BLEServer* pServer) {
    _deviceConnected = false;
    Serial.println("Disconnected. Restarting advertising...");
    pServer->getAdvertising()->start();
  }
};

// Called when the central writes to the RX characteristic (sending data to us)
class RxCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    String rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0) {
      Serial.print("Received via BLE: ");
      Serial.println(rxValue.c_str());
    }
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE UART Service...");

  BLEDevice::init("ESP32-BLE-UART");
  _pServer = BLEDevice::createServer();
  _pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = _pServer->createService(NUS_SERVICE_UUID);

  // TX characteristic — we notify data OUT to the central
  _pTxCharacteristic = pService->createCharacteristic(
    NUS_TX_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  _pTxCharacteristic->addDescriptor(new BLE2902());

  // RX characteristic — the central writes data IN to us
  BLECharacteristic* pRxCharacteristic = pService->createCharacteristic(
    NUS_RX_CHAR_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  pRxCharacteristic->setCallbacks(new RxCallbacks());

  pService->start();
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(NUS_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("BLE UART ready. Connect with nRF Connect → UART.");
}

void loop() {
  // Forward USB Serial → BLE (via TX characteristic)
  if (_deviceConnected && Serial.available()) {
    String msg = Serial.readStringUntil('\n');
    _pTxCharacteristic->setValue(msg.c_str());
    _pTxCharacteristic->notify();
    Serial.print("Sent via BLE: ");
    Serial.println(msg);
  }
}
```

### Try it out

1. Upload the sketch and open Serial Monitor at 115200 baud.
2. Open **nRF Connect** on your phone. Scan and connect to `"ESP32-BLE-UART"`.
3. In newer versions of nRF Connect, tap the **UART** icon (or navigate to the NUS service manually). You should see a chat-like interface.
4. Type a message in nRF Connect and tap **Send**. It should appear in Serial Monitor.
5. Type a message in Serial Monitor and press Enter. It should appear in nRF Connect's UART view.

If your version of nRF Connect doesn't have the UART shortcut, you can do it manually: expand the NUS service, subscribe to notifications on the TX characteristic (`6E400003...`), and write text to the RX characteristic (`6E400002...`).

{: .note }
> **NUS is "serial over BLE."** It gives you the familiar send/receive text experience of Bluetooth Classic's `SerialBT`, but running over BLE—so it works on the ESP32-S3, works with iPhones, and coexists with custom GATT services. Under the hood, it's still GATT: the NUS service has two characteristics, and data flows as writes and notifications. Understanding the GATT layer (Parts 1–4) will help you debug NUS when things go wrong.

If you want a `Serial`-like API over BLE without manually managing NUS characteristics, check out the [NuS-NimBLE-Serial](https://www.arduino.cc/reference/en/libraries/nus-nimble-serial/) library, which wraps NUS in familiar `.read()` and `.write()` methods. It requires the [NimBLE-Arduino](https://github.com/h2zero/NimBLE-Arduino) stack.

## Comparing ESP32 wireless options

Now that you've seen WiFi ([Lesson 7](iot.md)), Bluetooth Classic ([Lesson 8](bluetooth-serial.md)), and BLE (this lesson), here's how the three compare at a glance:

| | WiFi (L7) | Bluetooth Classic (L8) | BLE (this lesson) |
|---|---|---|---|
| Best for | Cloud/internet connectivity | Wireless serial replacement | Low-power sensors, phones, web apps |
| Range | Depends on router | ~10m | ~10m |
| Power | High | Medium | Very low |
| iPhone support | ✅ (via web) | ❌ | ✅ |
| ESP32-S3 | ✅ | ❌ | ✅ |
| Complexity | Medium (needs WiFi credentials) | Very simple | Higher (GATT model) |
| Browser API | Fetch / WebSocket | Web Serial (via virtual COM port) | Web Bluetooth |

**Table.** Comparison of the three wireless technologies available on the ESP32. For most new projects, BLE is the default choice unless you need internet connectivity (WiFi) or a drop-in serial replacement (Bluetooth Classic).
{: .fs-1 }

{: .note }
> **A note on BLE security.** In this lesson, we use BLE's "Just Works" pairing mode, which requires no PIN and provides no protection against eavesdropping. This is fine for learning and for projects where the data isn't sensitive (potentiometer readings, LED colors). For production IoT devices that handle sensitive data—door locks, health monitors, payment systems—you'd want to explore passkey pairing or out-of-band (OOB) authentication. See the [Bluetooth SIG security overview](https://www.bluetooth.com/learn-about-bluetooth/key-attributes/bluetooth-security/) for more.

## Exercises

Want to go further? Here are some challenges to reinforce what you've learned:

**Exercise 1: NeoPixel strip control.** Modify Part 3 to control the 5-LED NeoPixel stick from your kit instead of (or in addition to) the onboard NeoPixel. You could either send 15 bytes (5 × RGB) in a single write to set all LEDs at once, or add a fourth byte for the LED index (0–4) and set one LED per write. Build a Web Bluetooth page with five color pickers—one per LED.

**Exercise 2: BLE range test.** With the notification sketch from Part 2 running, walk away from your ESP32 with nRF Connect open. At what distance do notifications stop arriving? How do walls and obstacles affect range? If you did the Bluetooth Classic range test in [Lesson 8, Exercise 4](bluetooth-serial.md#exercises), compare the two. Are they similar?

**Exercise 3: Multiple sensor characteristics.** Create a service with *three* characteristics: potentiometer data (notify), photoresistor data (notify), and LED brightness control (write). This requires reading two analog sensors and exposing each on its own characteristic. Build a Web Bluetooth dashboard that displays both sensor streams and includes a brightness slider for the LED.

**Exercise 4: BLE servo control.** Create a writable characteristic that accepts a single byte (0–180) representing a servo angle. When the central writes a value, the ESP32 moves a servo motor to that position (using the [Servo library](../advancedio/servo.md)). Build a Web Bluetooth page with a slider to control the servo wirelessly.

**Exercise 5: Connection status NeoPixel.** Use the onboard NeoPixel to display BLE connection status: **blue** while advertising (waiting for a connection), **green** when a central is connected, and **red** briefly on disconnection before returning to blue. This is a common pattern in commercial BLE products. Implement it using the `onConnect()` and `onDisconnect()` callbacks. (Accessibility note: for colorblind users, consider also adding a blink pattern—*e.g.,* slow pulse for advertising, solid for connected, fast blink for disconnection.)

**Exercise 6: Power comparison (research).** The ESP32-S3 Feather has a LiPoly battery connector and a MAX17048 battery monitor chip. Connect the 350mAh LiPoly battery from your kit and run a BLE sketch. How long does the battery last? Compare with a WiFi sketch (from the [IoT lesson](iot.md)). Which protocol consumes more power? For bonus points, use `BLEDevice::setPower()` to experiment with different transmit power levels and measure the effect on both range and battery life.

**Exercise 7: Web Bluetooth + p5.js.** Port the Web Bluetooth sensor display from Part 4 into [p5.js](https://p5js.org/). Use `createCanvas()` to draw a real-time visualization (bar chart, oscilloscope, *etc.*) of the incoming BLE sensor data. If you completed the [p5.js Serial lessons](../communication/p5js-serial.md), compare the code structure—how much carries over? (Hint: also check out [p5.ble.js](https://itpnyu.github.io/p5.ble.js/), a p5.js library specifically for Web Bluetooth.)

**Exercise 8: Port a Bluetooth Classic project to BLE.** If you completed any project from [Lesson 8](bluetooth-serial.md) (the potentiometer visualizer, the bidirectional LED control, *etc.*), rebuild it using BLE. Replace `BluetoothSerial` with the BLE library, design your GATT service and characteristics, and update the computer-side code to use `bleak` instead of `pySerial`. What changed? What stayed the same? This is a great exercise in understanding the conceptual differences between the two Bluetooth flavors.

## Lesson Summary

In this lesson, you learned Bluetooth Low Energy—a fundamentally different approach to wireless communication than the serial-style Bluetooth Classic from [Lesson 8](bluetooth-serial.md). Here's what you covered:

- **BLE is not wireless serial.** Instead of a continuous byte stream, BLE organizes data into structured **services** and **characteristics** with defined properties (read, write, notify). This structure enables interoperability across devices and applications.
- **BLE uses a peripheral/central model.** The ESP32 acts as a **peripheral** (advertising and hosting data), while your phone or laptop acts as a **central** (scanning, connecting, reading, and writing). Once connected, data flows in both directions.
- **GATT** (Generic Attribute Profile) is the data model at the heart of BLE. A GATT server contains **services** (categories of data), which contain **characteristics** (individual data points). Each service and characteristic is identified by a **UUID**.
- **Notifications** are the most efficient way to stream data. Instead of the central repeatedly polling, the peripheral pushes updates automatically when a value changes—dramatically reducing power consumption and latency.
- **The ESP32 BLE library** (`BLEDevice.h`) ships with the ESP32 Arduino core and requires no installation. It uses a callback model (not polling) for connection events and write operations—a different programming pattern than `Serial.available()`.
- **The `BLE2902` descriptor** must be added to any characteristic that supports notifications. Without it, centrals cannot subscribe.
- **The 20-byte MTU default** means BLE payloads should be kept compact. Send numbers as short strings or raw bytes, not verbose text.
- **After disconnection, the ESP32 stops advertising by default.** Always restart advertising in your `onDisconnect()` callback, or new centrals won't be able to find the device.
- **Web Bluetooth** lets you build browser-based interfaces for BLE devices using JavaScript—structurally parallel to the [Web Serial API](../communication/web-serial.md). It requires HTTPS (or localhost), works in Chrome/Edge on desktop and Android, but not on iOS Safari.
- **The Nordic UART Service (NUS)** provides serial-like text communication over BLE using standardized UUIDs. It's a practical bridge between the simplicity of serial and the universality of BLE—and is supported by most BLE terminal apps.
- **BLE works on the ESP32-S3, works with iPhones, and consumes dramatically less power than Bluetooth Classic or WiFi.** For most new wireless projects, BLE is the right default choice.

## Resources

- [ESP32 BLE Arduino library source and examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/BLE) — the official library in the ESP32 Arduino core
- [ESP32 Arduino BLE API documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ble.html) — Espressif's API reference
- [NimBLE-Arduino](https://github.com/h2zero/NimBLE-Arduino) — lighter-weight alternative BLE stack (~60% less flash, ~50% less RAM)
- [nRF Connect for Mobile](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile) — our recommended BLE debugging app (free, iOS + Android)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) — MDN Web Docs reference
- [Communicating with Bluetooth devices over JavaScript](https://developer.chrome.com/docs/capabilities/bluetooth) — Google's Web Bluetooth guide for Chrome
- [Bluetooth SIG Assigned Numbers](https://www.bluetooth.com/specifications/assigned-numbers/) — official list of standard service and characteristic UUIDs
- [Nordic UART Service specification](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth_services/services/nus.html) — Nordic Semiconductor's NUS documentation
- [NuS-NimBLE-Serial Arduino library](https://www.arduino.cc/reference/en/libraries/nus-nimble-serial/) — a Serial-like API over BLE using NUS
- [p5.ble.js](https://itpnyu.github.io/p5.ble.js/) — a p5.js library for Web Bluetooth, from ITP/NYU
- [Create Apps for the ESP32 Using BLE Through P5](https://www.hackster.io/lemio/create-apps-for-the-esp32-using-ble-through-p5-55292d) — Hackster.io tutorial combining p5.js + ESP32 BLE
- [Getting Started with ESP32 BLE on Arduino IDE](https://randomnerdtutorials.com/esp32-bluetooth-low-energy-ble-arduino-ide/) — Random Nerd Tutorials
- [ESP32 Web Bluetooth (BLE) Getting Started Guide](https://randomnerdtutorials.com/esp32-web-bluetooth/) — Random Nerd Tutorials

## Next Lesson

With BLE under your belt, you've now covered all three major wireless communication technologies available on the ESP32: **WiFi** (cloud connectivity via [IoT](iot.md)), **Bluetooth Classic** (wireless serial via [Lesson 8](bluetooth-serial.md)), and **BLE** (structured low-power wireless in this lesson). From here, you might explore BLE HID (making your ESP32 act as a wireless keyboard, mouse, or game controller), deep sleep with BLE wake-up for battery-powered projects, or combining BLE with sensors like the ADXL343 accelerometer for motion-controlled wireless devices. The wireless world is yours! 🚀

<nav class="lesson-nav" aria-label="Lesson navigation">
  <a href="bluetooth-serial.html" class="nav-prev">
    <div class="nav-label">&larr; Previous Lesson</div>
    <div class="nav-title">Bluetooth Serial</div>
  </a>
</nav>