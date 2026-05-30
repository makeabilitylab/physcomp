---
layout: default
title: L3&#58; Bluetooth Web Serial
parent: Wireless
grand_parent: ESP32
has_toc: true # (on by default)
usemathjax: false
comments: true
usetocbot: true
nav_order: 3
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
2. Record workbench video of the p5.js visualization over Bluetooth serial (include captions/transcript)
3. Record workbench video of the bidirectional LED control via p5.js (include captions/transcript)
4. Record workbench video of Android phone bidirectional demo (include captions/transcript)
5. Get screenshots of the p5.js sketch receiving Bluetooth serial data (include descriptive alt text)
6. Get screenshot of Chrome's port selection dialog showing both USB and Bluetooth ports (include descriptive alt text)
7. Write and test Arduino sketches (BluetoothPot, BluetoothLedControl); push to makeabilitylab/arduino under ESP32/Bluetooth/
8. Build and host the p5.js Bluetooth demo on GitHub Pages
9. Verify CDN URL: https://cdn.jsdelivr.net/gh/makeabilitylab/js@main/dist/makelab.serial.iife.min.js
-->

In the [last lesson](bluetooth-serial.md), you established a wireless serial connection between the ESP32 and your computer using Bluetooth Classic's Serial Port Profile (SPP). You verified the wireless communication link with terminal tools and Python but we didn't actually sending real sensor data yet.

In this lesson, we'll add a **potentiometer** and an **LED** to the circuit, stream live sensor readings over Bluetooth, and build interactive [p5.js](https://p5js.org/) sketches using [Web Serial](../communication/web-serial.md) and the [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) library—exactly the same tools from the [Communication module](../communication/index.md), but wireless. Then we'll close the loop with bidirectional control: a slider in your browser that dims an LED on your breadboard wirelessly.

{: .note }
> **In this lesson, you will learn:**
> - How to stream live analog sensor data over Bluetooth and visualize it in Python
> - How to use [p5.js](https://p5js.org/) with [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) and [Web Serial](../communication/web-serial.md) to visualize Bluetooth sensor data in a web browser
> - How to send commands *to* the ESP32 over Bluetooth for bidirectional control (slider → LED brightness)
> - How to handle connection drops gracefully on both the ESP32 and computer sides
> - When to choose Bluetooth Classic vs. BLE for new projects

{: .note }
> **Prerequisites:** This lesson builds directly on [Lesson 2: Bluetooth Serial](bluetooth-serial.md). You should have already paired your ESP32 with your computer and verified the connection works. The platform requirements from L2 still apply: you'll need the **original ESP32** (Huzzah32)—the ESP32-S3 doesn't support Bluetooth Classic. **iPhone users**: phone-based activities in this lesson are Android-only; see [Lesson 4: BLE](ble-intro.md) for a phone-friendly alternative. See L2's [Two Important Notes Before We Build](bluetooth-serial.md#two-important-notes-before-we-build) for the full context.

## Materials

In addition to the materials from [Lesson 2](bluetooth-serial.md#materials), you'll need:

| Breadboard | ESP32 | LED | Resistor | Potentiometer |
| ---------- |:-----:|:-----:|:-----:|:-----:|
| ![Half-sized solderless breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![Adafruit Huzzah32 ESP32 Feather board, top view]({{ site.baseurl }}/assets/images/ESP32Huzzah32_Adafruit_vertical_h200.png) | ![Red 5mm LED]({{ site.baseurl }}/assets/images/RedLED_Fritzing.png) | ![220-ohm resistor, striped red-red-brown-gold]({{ site.baseurl }}/assets/images/Resistor220_Fritzing.png) | ![10kΩ rotary potentiometer]({{ site.baseurl }}/assets/images/PanelMountPotentiometer_NoCap_150h.jpg) |
| Breadboard | [Huzzah32 ESP32 Feather](https://www.adafruit.com/product/3591) | Red LED | 220Ω Resistor | 10kΩ Potentiometer |

You will also need:
- **Google Chrome** or **Microsoft Edge** (for the Web Serial / p5.js activities)—same browser requirement as the [Web Serial lesson](../communication/web-serial.md)
- pySerial in a virtual environment, set up in [Lesson 2, Part 2](bluetooth-serial.md#setting-up-pyserial)

## Part 1: Streaming sensor data

Now let's stream live sensor data. We'll read a potentiometer and send its value over Bluetooth—then visualize it in Python.

### The circuit

Connect a 10kΩ potentiometer to the ESP32 on pin **A7** (GPIO 32), which is an ADC1 pin. (On the original ESP32, ADC2 pins conflict with both WiFi *and* Bluetooth Classic, so always use ADC1 pins for analog input when using wireless features.)

<!-- TODO: Create a Fritzing wiring diagram showing the potentiometer on A7. Use the Huzzah32 Fritzing part. -->

### The Arduino code

<!-- TODO: Push BluetoothPot.ino to https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/ -->

The full source is available in our [Arduino GitHub repo](https://github.com/makeabilitylab/arduino/tree/master/ESP32/Bluetooth/BluetoothPot).

```cpp
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

const int POT_INPUT_PIN = A7;           // GPIO 32, an ADC1 pin on the Huzzah32
const int LED_PIN = LED_BUILTIN;        // Pin 13 on the Huzzah32; aliased for clarity
const int ADC_MAX = 4095;               // ESP32 ADC is 12-bit (0..4095)
const int PWM_MAX = 255;                // analogWrite() expects 0..255 by default
const bool MIRROR_DATA_TO_USB = false;  // if on, transmits data over Serial.println as well.

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32-PotSensor");
  Serial.println("Bluetooth started! Pair with 'ESP32-PotSensor' to see live data.");
  Serial.println("The built-in LED brightness tracks the pot position.\n");
}

void loop() {
  int potVal = analogRead(POT_INPUT_PIN);   // 0..4095 (12-bit ADC on ESP32)

  // Normalize to 0.0–1.0 before sending
  float normalized = potVal / (float)ADC_MAX;

  // Drive the built-in LED. analogWrite on the ESP32 wraps LEDC and expects 0..255.
  int brightness = (int)(normalized * PWM_MAX);
  analogWrite(LED_PIN, brightness);

  // Track Bluetooth connection state changes and report them over USB Serial.
  static bool wasConnected = false;
  bool isConnected = SerialBT.connected();
  if (isConnected != wasConnected) {
    Serial.println(isConnected ? "[BT] Client connected." : "[BT] Client disconnected.");
    wasConnected = isConnected;
  }

  // Send the normalized value over Bluetooth — but only if a client is paired
  if (isConnected) {
    SerialBT.println(normalized, 4);
  }

  // Also send data via USB serial for debugging
  if(MIRROR_DATA_TO_USB){
    Serial.println(normalized, 4);
  }
}
```

{: .note }
> **Pairing reminder:** Since this sketch uses a new device name (`ESP32-PotSensor`), you'll need to pair it from your computer's Bluetooth settings the first time. See [Lesson 2: Pairing with your computer](bluetooth-serial.md#pairing-with-your-computer) for instructions.

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

## Part 2: Bluetooth with serial.js

So far we've sent data in one direction—from ESP32 to computer—and visualized it in Python. Now let's bring it into the browser. Because your computer's Bluetooth serial port looks just like a USB serial port, the [Web Serial API](../communication/web-serial.md) works with it—and so does [serial.js](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) from the Makeability Lab library. 

In fact, we can use all of our previous p5.js Web Serial sketches from before, including:
* [p5.js Circle Visualization with Web Serial](https://editor.p5js.org/jonfroehlich/sketches/5Knw4tN1d)
* [p5.js Sensor Graph with Web Serial](https://editor.p5js.org/jonfroehlich/sketches/Szs_sh4qI)

When you click "Connect" in a Web Serial dialog, Chrome shows *all* available serial ports—including the Bluetooth virtual COM port. Crucially, select **the Bluetooth port** instead of the USB port, and your existing serial.js code works unchanged. This is the entire point of SPP: the operating system abstracts away the wireless transport.

{: .note }
> **Compare this with the [p5.js Serial lesson](../communication/p5js-serial.md).** The code is *identical*—same `serial.js` import, same event callbacks, same `connectAndOpen()` call. The only difference is which port you select in the browser dialog. This is SPP's superpower: your existing Web Serial code works wirelessly without any modifications.

### Workbench demo of circle visualization

<!-- TODO: Record and embed a workbench video showing:
     1. Opening the p5.js sketch in Chrome
     2. Selecting the Bluetooth serial port in the dialog
     3. Turning the pot and watching the visualization respond wirelessly
     Include captions/transcript
-->

### Workbench demo of graph visualization

<!-- TODO: Record and embed a workbench video showing:
     1. Opening the p5.js sketch in Chrome
     2. Selecting the Bluetooth serial port in the dialog
     3. Turning the pot and watching the visualization respond wirelessly
     Include captions/transcript
-->

## Part 3: Bidirectional control

Now let's close the loop: stream sensor data *from* the ESP32 *and* send LED control commands *to* the ESP32. We'll extend the p5.js sketch to include a slider that controls LED brightness.

### The circuit

Add an LED circuit: LED on GPIO 21 through a 220Ω resistor to ground. Keep the potentiometer connected from Part 1.

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
 * See: https://makeabilitylab.github.io/physcomp/esp32/bluetooth-web-serial
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
> **`analogWrite()` on the ESP32:** If you're wondering why we use `analogWrite()` here when [Lesson 3: Fading an LED with PWM](led-fade.md) taught the LEDC API (`ledcAttach`, `ledcWrite`)—both work! As we discussed in that lesson, `analogWrite()` was added in ESP32 Arduino core v3.x as a [convenience wrapper around LEDC](https://github.com/espressif/arduino-esp32/blob/master/cores/esp32/esp32-hal-ledc.c). For simple PWM output like dimming an LED, `analogWrite()` is the simpler choice. Use the LEDC API directly when you need control over PWM frequency or resolution.

### The p5.js sketch with bidirectional communication

Extend the Part 2 sketch with a brightness slider that sends values to the ESP32:

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

## Part 4: Android phone (optional bonus)

If you have an **Android** phone, you can also control the ESP32 from a Bluetooth terminal app—no laptop needed. This is an optional bonus activity for Android users.

{: .note }
> **iPhone users:** You cannot use Bluetooth Classic SPP from an iPhone. In [Lesson 4: BLE](ble-intro.md), we'll use a protocol that works with both iOS and Android.

Make sure the Part 3 `BluetoothLedControl` sketch is running on your ESP32, then:

1. On your Android phone, install the free [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) app by Kai Morich (you may already have it from [Lesson 2, Part 3](bluetooth-serial.md#part-3-android-phone-optional-bonus)).
2. Go to **Settings → Bluetooth** and pair with `"ESP32-LEDControl"`.
3. Open the Serial Bluetooth Terminal app → **Devices** → select your ESP32 → **Connect**.
4. You should see potentiometer data streaming. Type a number (0–255) and tap Send to control the LED.

<!-- TODO: Add a screenshot or photo of the Android app showing data from the ESP32 (include descriptive alt text) -->

{: .note }
> **Custom buttons:** The Serial Bluetooth Terminal app lets you configure custom buttons (under **Settings → Buttons**) that send predefined strings. Set up buttons for `0`, `128`, and `255` to quickly toggle between off, half, and full brightness—a simple remote control UI right on your phone!

## Gotchas and limitations

**One connection at a time.** SPP is point-to-point. Only one device (your computer *or* your phone) can connect to the ESP32's Bluetooth serial at a time.

**No iOS support.** Apple blocks Bluetooth Classic SPP for third-party apps. iPhone users can participate fully in the computer-based activities but cannot connect from their phones.

**No ESP32-S3.** Only the original ESP32 supports Bluetooth Classic. The ESP32-S3, S2, C3, and C6 do not have the hardware.

**Range and interference.** Expect reliable communication within about 5–10 meters indoors. Walls, furniture, and other 2.4 GHz devices (WiFi, microwaves) reduce range.

**macOS Bluetooth port naming.** The virtual serial port name varies across macOS versions and can be long or cryptic. Use `ls /dev/tty.*Bluetooth*` or `ls /dev/tty.*ESP*` to find it. If the port disappears, unpair and re-pair the device.

**Memory usage.** Bluetooth Classic consumes significant RAM. If you also need WiFi, consider using BLE instead—or be prepared for potential instability in complex sketches on the original ESP32's 520KB SRAM.

## When to use Bluetooth Classic vs. BLE

You've now seen what Bluetooth Classic can do—the next two lessons cover **Bluetooth Low Energy (BLE)**. Before moving on, here's a quick guide for choosing between them in your own projects:

**Use Bluetooth Classic SPP when:**
- You want the simplest possible wireless serial—your existing serial code works unchanged
- You're working entirely from a computer (Mac or Windows)
- You're using the original ESP32 (Huzzah32)
- You don't need iPhone support

**Use BLE ([Lesson 4](ble-intro.md)) when:**
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

In this lesson, you went beyond Hello World to build real interactive Bluetooth projects:

- **Streaming sensor data** over Bluetooth using `SerialBT.println()`—the same pattern as USB serial, but wireless. Always use ADC1 pins (like A7) on the original ESP32 when WiFi or Bluetooth are active.
- **Web Serial + serial.js** work with Bluetooth serial ports in Chrome. Your existing p5.js sketches from the Communication module can be used wirelessly without code changes.
- **Bidirectional communication** is just as easy: poll `SerialBT.available()` and use `readStringUntil('\n')`—exactly like wired serial.
- **Connection drops** are handled gracefully: the ESP32 re-advertises automatically, and on the computer side you get `SerialException` (Python) or a `CONNECTION_CLOSED` event (serial.js).
- **Bluetooth Classic SPP has a practical range of 5–10 meters indoors** and supports only one connection at a time. Expect 10–30ms of added latency compared to USB serial.
- **For most new projects—especially on the ESP32-S3—BLE is the better default choice** due to universal device and phone support. But Bluetooth Classic SPP is unbeatable when you want to reuse existing serial code wirelessly.

## Resources

- [BluetoothSerial library source and examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/BluetoothSerial) — the official library in the ESP32 Arduino core
- [Makeability Lab JS Library (serial.js)](https://github.com/makeabilitylab/js/blob/main/src/lib/serial/serial.js) — Web Serial wrapper used in our p5.js sketches
- [Web Serial lesson](../communication/web-serial.md) — our introduction to Web Serial (the same API that works with Bluetooth COM ports)
- [p5.js Serial lesson](../communication/p5js-serial.md) and [p5.js Serial I/O lesson](../communication/p5js-serial-io.md) — the Communication module foundations this lesson builds on
- [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal) — our recommended Android app for Bluetooth serial (free, by Kai Morich)

## Next Lesson

In the [next lesson](ble-intro.md), we'll learn **Bluetooth Low Energy (BLE)**—the protocol that powers fitness trackers, smart home devices, and billions of IoT sensors. BLE works on the ESP32-S3, works with iPhones *and* Android phones, and introduces a structured data model that's more powerful than serial. The code is more complex, but the capabilities—and the universal device compatibility—are worth it. Let's go! 🚀

<nav class="lesson-nav" aria-label="Lesson navigation">
  <a href="bluetooth-serial.html" class="nav-prev">
    <div class="nav-label">&larr; Previous Lesson</div>
    <div class="nav-title">Bluetooth Serial</div>
  </a>
  <a href="ble-intro.html" class="nav-next">
    <div class="nav-label">Next Lesson &rarr;</div>
    <div class="nav-title">Introduction to BLE</div>
  </a>
</nav>
