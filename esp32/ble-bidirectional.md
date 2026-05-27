---
layout: default
title: L5&#58; Bidirectional BLE
parent: Wireless
grand_parent: ESP32
has_toc: true # (on by default)
usemathjax: false
comments: true
usetocbot: true
nav_order: 5
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
2. Record workbench video of NeoPixel color control from nRF Connect (include captions/transcript)
3. Record screencast of the Web Bluetooth demo page controlling the NeoPixel (include captions/transcript)
4. Get screenshots of nRF Connect write dialog with hex values (include descriptive alt text)
5. Create a side-by-side diagram comparing USB serial flow vs. BLE characteristic flow
6. Build and host the Web Bluetooth demo pages on GitHub Pages
7. Write and test Arduino sketches (BLENeoPixelControl, BLEUartService); push to makeabilitylab/arduino under ESP32/Bluetooth/
8. Test all code on both ESP32-S3 Feather and Huzzah32
9. Once ble.js is tested and merged, link to https://github.com/makeabilitylab/js/blob/main/src/lib/ble/ble.js
   and add a Part 1b showing the same NeoPixel controller using ble.js (parallels how L8 uses serial.js)
-->

<!-- See also:
- Web Bluetooth API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
- Chrome Web Bluetooth guide: https://developer.chrome.com/docs/capabilities/bluetooth
- Nordic UART Service: https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth_services/services/nus.html
- Random Nerd Tutorials Web BLE: https://randomnerdtutorials.com/esp32-web-bluetooth/
- p5.ble.js: https://itpnyu.github.io/p5.ble.js/
-->

In the [last lesson](ble-intro.md), you learned the fundamentals of BLE: the peripheral/central model, the GATT data hierarchy, and how to stream sensor data from the ESP32 to your phone and computer using notifications. Data flowed in one direction — *from* the ESP32 *to* the central.

In this lesson, we'll close the loop. You'll learn how to send data in the *other* direction — from a phone or web browser *to* the ESP32 — to control hardware wirelessly. Along the way, you'll encounter BLE's **callback model** for handling incoming writes, build a **Web Bluetooth** interface that runs entirely in the browser, and learn about the **Nordic UART Service (NUS)** for serial-like text communication over BLE.

{: .note }
> **In this lesson, you will learn:**
> - How to create a **writable** BLE characteristic and handle incoming data with callbacks
> - The difference between BLE's callback model and the `Serial.available()` polling pattern
> - How to combine readable, writable, and notify characteristics in a single service for bidirectional communication
> - How to build a **Web Bluetooth** web page that connects to the ESP32 from a browser — paralleling the [Web Serial](../communication/web-serial.md) approach but wireless
> - The **Nordic UART Service (NUS)** — a widely adopted convention for serial-like text communication over BLE

{: .note }
> **Prerequisites:** This lesson builds directly on [Lesson 4: Introduction to BLE](ble-intro.md). You should be comfortable with BLE concepts (peripherals, centrals, GATT, services, characteristics, UUIDs, notifications) and have successfully completed Parts 1 and 2 from that lesson.

## Part 1: Controlling the NeoPixel over BLE

So far, data has flowed in one direction: from the ESP32 to the central. Now let's go the other direction — send data *from* your phone *to* the ESP32 to control hardware. In this part, you'll create a **writable** characteristic that accepts RGB color values and sets the onboard NeoPixel. You'll also learn the BLE **callback model** for handling incoming writes, which is fundamentally different from the `Serial.available()` polling pattern.

The ESP32-S3 Feather has a built-in NeoPixel (WS2812B) RGB LED on `PIN_NEOPIXEL`, powered by `NEOPIXEL_POWER`. We used it in [Lesson 2: Blink](led-blink.md) and [Lesson 3: LED Fading](led-fade.md), so the NeoPixel setup should be familiar.

### The Arduino code

<!-- TODO: Push BLENeoPixelControl.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

We'll extend the [Lesson 4](ble-intro.md) sensor streaming sketch to add a second characteristic for LED control—so the ESP32 simultaneously streams sensor data *and* accepts LED commands. This is the same bidirectional pattern from [Lesson 3, Part 3](bluetooth-web-serial.md#part-3-bidirectional-control), but over BLE with structured characteristics instead of a serial byte stream. The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BLENeoPixelControl).

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
> **Callbacks vs. polling:** Notice the pattern: we don't poll for incoming data in `loop()` (like we do with `Serial.available()` or `SerialBT.available()` in [Lessons 2–3](bluetooth-serial.md)). Instead, BLE uses a **callback model**—the library calls our `onWrite()` function when data arrives. This is fundamentally different from the serial polling pattern you're used to, and it's one of the biggest code-level differences between Bluetooth Classic and BLE.

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

## Part 2: Web Bluetooth

So far we've used nRF Connect as our BLE central — it's great for debugging, but it doesn't give us a custom UI. What if you could control the NeoPixel from a **web page** with sliders and a color picker? What if you could plot sensor data in a live chart — all in the browser, all wireless? In this part, you'll build a single-page HTML/JavaScript app using the [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) that connects to your ESP32, subscribes to sensor notifications, and writes RGB values to the NeoPixel — paralleling the [Web Serial](../communication/web-serial.md) approach from the Communication module but over BLE.

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

Make sure the Part 1 sketch is running on your ESP32 before testing this page.

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

1. Make sure the Part 1 sketch is running on your ESP32.
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

## Part 3: Nordic UART Service (NUS)

Throughout this lesson, we've worked directly with custom GATT services and characteristics — the fundamental BLE building blocks. But what if you just want to send text back and forth, like the serial bridge from [Lesson 2](bluetooth-serial.md)? In this part, you'll learn the **Nordic UART Service (NUS)** — a widely adopted convention that emulates serial communication over BLE using two characteristics. NUS bridges the gap between BLE's structured model and the simplicity of serial, and it's supported by most BLE terminal apps out of the box.

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
> **NUS is "serial over BLE."** It gives you the familiar send/receive text experience of Bluetooth Classic's `SerialBT`, but running over BLE—so it works on the ESP32-S3, works with iPhones, and coexists with custom GATT services. Under the hood, it's still GATT: the NUS service has two characteristics, and data flows as writes and notifications. Understanding the GATT layer (the [previous lesson](ble-intro.md)) will help you debug NUS when things go wrong.

If you want a `Serial`-like API over BLE without manually managing NUS characteristics, check out the [NuS-NimBLE-Serial](https://www.arduino.cc/reference/en/libraries/nus-nimble-serial/) library, which wraps NUS in familiar `.read()` and `.write()` methods. It requires the [NimBLE-Arduino](https://github.com/h2zero/NimBLE-Arduino) stack.

{: .note }
> **A note on BLE security.** In this lesson, we use BLE's "Just Works" pairing mode, which requires no PIN and provides no protection against eavesdropping. This is fine for learning and for projects where the data isn't sensitive (potentiometer readings, LED colors). For production IoT devices that handle sensitive data—door locks, health monitors, payment systems—you'd want to explore passkey pairing or out-of-band (OOB) authentication. See the [Bluetooth SIG security overview](https://www.bluetooth.com/learn-about-bluetooth/key-attributes/bluetooth-security/) for more.

## Exercises

Want to go further? Here are some challenges to reinforce what you've learned:

**Exercise 1: NeoPixel strip control.** Modify Part 1 to control the 5-LED NeoPixel stick from your kit instead of (or in addition to) the onboard NeoPixel. You could either send 15 bytes (5 × RGB) in a single write to set all LEDs at once, or add a fourth byte for the LED index (0–4) and set one LED per write. Build a Web Bluetooth page with five color pickers—one per LED.

**Exercise 2: Multiple sensor characteristics.** Create a service with *three* characteristics: potentiometer data (notify), photoresistor data (notify), and LED brightness control (write). This requires reading two analog sensors and exposing each on its own characteristic. Build a Web Bluetooth dashboard that displays both sensor streams and includes a brightness slider for the LED.

**Exercise 3: BLE servo control.** Create a writable characteristic that accepts a single byte (0–180) representing a servo angle. When the central writes a value, the ESP32 moves a servo motor to that position (using the [Servo library](../advancedio/servo.md)). Build a Web Bluetooth page with a slider to control the servo wirelessly.

**Exercise 4: Web Bluetooth + p5.js.** Port the Web Bluetooth sensor display from Part 2 into [p5.js](https://p5js.org/). Use `createCanvas()` to draw a real-time visualization (bar chart, oscilloscope, *etc.*) of the incoming BLE sensor data. If you completed the [p5.js Serial lessons](../communication/p5js-serial.md), compare the code structure—how much carries over? (Hint: also check out [p5.ble.js](https://itpnyu.github.io/p5.ble.js/), a p5.js library specifically for Web Bluetooth.)

**Exercise 5: Port a Bluetooth Classic bidirectional project to BLE.** If you completed the bidirectional LED control from [Lesson 3, Part 3](bluetooth-web-serial.md#part-3-bidirectional-control), rebuild it using BLE with writable and notify characteristics. Update the computer-side code to use Web Bluetooth instead of Web Serial. What changed? What stayed the same?

## Lesson Summary

In this lesson, you learned how to send data *to* the ESP32 over BLE and build browser-based interfaces for BLE devices. Here's what you covered:

- **Writable characteristics** let the central send data to the peripheral. You created an RGB color control characteristic that accepts 3-byte payloads to set the onboard NeoPixel.
- **BLE uses a callback model** for handling incoming writes. Instead of polling with `Serial.available()` in `loop()`, you define a `BLECharacteristicCallbacks` class with an `onWrite()` method that the library calls automatically when data arrives. This is fundamentally different from the serial programming pattern.
- **Bidirectional communication** combines notify (peripheral → central) and write (central → peripheral) characteristics in a single service. The ESP32 can simultaneously stream sensor data and accept commands.
- **Web Bluetooth** lets you build browser-based interfaces for BLE devices using JavaScript — structurally parallel to the [Web Serial API](../communication/web-serial.md). It requires HTTPS (or localhost), works in Chrome/Edge on desktop and Android, but not on iOS Safari.
- **The Nordic UART Service (NUS)** provides serial-like text communication over BLE using standardized UUIDs. It's a practical bridge between the simplicity of serial and the universality of BLE — and is supported by most BLE terminal apps including nRF Connect's built-in UART mode.
- **NUS is still GATT under the hood.** It uses two characteristics (RX for writing to the peripheral, TX for notifications from the peripheral), with naming from the peripheral's perspective.

## Resources

- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) — MDN Web Docs reference
- [Communicating with Bluetooth devices over JavaScript](https://developer.chrome.com/docs/capabilities/bluetooth) — Google's Web Bluetooth guide for Chrome
- [Nordic UART Service specification](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/libraries/bluetooth_services/services/nus.html) — Nordic Semiconductor's NUS documentation
- [NuS-NimBLE-Serial Arduino library](https://www.arduino.cc/reference/en/libraries/nus-nimble-serial/) — a Serial-like API over BLE using NUS
- [p5.ble.js](https://itpnyu.github.io/p5.ble.js/) — a p5.js library for Web Bluetooth, from ITP/NYU
- [Create Apps for the ESP32 Using BLE Through P5](https://www.hackster.io/lemio/create-apps-for-the-esp32-using-ble-through-p5-55292d) — Hackster.io tutorial combining p5.js + ESP32 BLE
- [ESP32 Web Bluetooth (BLE) Getting Started Guide](https://randomnerdtutorials.com/esp32-web-bluetooth/) — Random Nerd Tutorials

## Next Lesson

With BLE under your belt, you've now covered all three major wireless communication technologies available on the ESP32: **WiFi** (cloud connectivity via [Lesson 1: IoT](iot.md)), **Bluetooth Classic** (wireless serial via [Lessons 2–3](bluetooth-serial.md)), and **BLE** (structured low-power wireless in [Lesson 4](ble-intro.md) and this lesson). From here, you might explore BLE HID (making your ESP32 act as a wireless keyboard, mouse, or game controller), deep sleep with BLE wake-up for battery-powered projects, or combining BLE with sensors like the ADXL343 accelerometer for motion-controlled wireless devices. The wireless world is yours! 🚀

<nav class="lesson-nav" aria-label="Lesson navigation">
  <a href="ble-intro.html" class="nav-prev">
    <div class="nav-label">&larr; Previous Lesson</div>
    <div class="nav-title">Introduction to BLE</div>
  </a>
</nav>
