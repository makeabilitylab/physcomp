---
layout: default
title: ESP32 IDE Setup
parent: ESP32
has_toc: true # (on by default)
nav_order: 9
nav_exclude: false
comments: true
usetocbot: true
---
# Setting Up the Arduino IDE for ESP32
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<video autoplay loop muted playsinline aria-label="Workbench video showing the Adafruit ESP32-S3 being plugged in and runinng the RGB cross-fade">
  <source src="assets/videos/PluggingInESP32-IMG_9319-TrimmedCroppedMuted.mp4" type="video/mp4">
</video>
**Video.** When you first power on the [Adafruit ESP32-S3](https://www.adafruit.com/product/5477), it runs a RGB cross-fade program that lights up the built-in NeoPixel LED on the ESP32-S3. Note: once you program the ESP32-S3 for the first time, you'll overwrite this program.
{: .fs-1 }

This page walks through setting up the Arduino IDE to program ESP32 boards. If you haven't already, make sure you've installed the [Arduino IDE 2](https://www.arduino.cc/en/software) and reviewed our [Arduino IDE setup page](../arduino/arduino-ide.md)—the basics of the IDE (editor layout, `setup()`/`loop()`, selecting ports) are the same.

{: .note }
> Already comfortable with the Arduino IDE and just need the ESP32 board support URL? Here it is: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`. Add it in **File → Preferences → Additional Board Manager URLs**, then install **esp32 by Espressif Systems** from the Boards Manager.

## Step 1: Add the ESP32 board support package

The Arduino IDE doesn't include ESP32 support by default—you need to add Espressif's board support package.

1. Open the Arduino IDE
2. Go to **File → Preferences** (or **Arduino → Settings** on macOS)
3. In the **Additional Board Manager URLs** field, add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   If you already have other URLs (such as the Adafruit AVR boards URL), separate them with commas.
4. Click **OK**
5. Open **Tools → Board → Boards Manager** (or click the Boards Manager icon in the left sidebar)
6. Search for `esp32` and install the **esp32 by Espressif Systems** package. This may take a few minutes—it's a large download.

<!-- TODO: Add Arduino IDE 2.x screenshots for each step. The existing screenshots are from IDE 1.x. -->

![Screenshot showing how to add the ESP32 board URL in Arduino IDE Preferences](assets/images/ArduinoIDE_ESP32_PreferencesURLScreenshot.png)
**Figure.** Adding the ESP32 board support URL in Arduino IDE Preferences. Note: this screenshot may show the older Arduino IDE 1.x layout—the preference location is the same in IDE 2.x.
{: .fs-1 }

![Screenshot of the Boards Manager showing the ESP32 package by Espressif](assets/images/ArduinoIDE_BoardsManagerESP32Screenshot.png)
**Figure.** Installing the ESP32 board package from the Boards Manager.
{: .fs-1 }

{: .important }
> **Which version of the ESP32 Arduino core?** As of Spring 2026, the ESP32 Arduino core is at version **3.x** (specifically 3.3.8 at time of writing). You can see the full changelog on the [GitHub releases page](https://github.com/espressif/arduino-esp32/releases). If you previously installed version 2.x, we recommend updating—the PWM and tone APIs changed significantly between v2 and v3. We'll note these API differences in the relevant lessons ([LED Fade](led-fade.md), [Tone](tone.md)).

{: .warning }
> You may notice **two** ESP32 packages in the Boards Manager: **"Arduino ESP32 Boards" by Arduino** and **"esp32" by Espressif Systems**. These are different! The "Arduino ESP32 Boards" package only supports official Arduino-manufactured ESP32 boards (like the Arduino Nano ESP32). For the Adafruit ESP32-S3 Feather, Huzzah32, and most third-party ESP32 boards, you need **"esp32" by Espressif Systems**.

<!-- TODO: Replace with an up-to-date screenshot. The current screenshot below shows
     Arduino IDE 2.3.8 with esp32 3.3.8 installed and Arduino ESP32 Boards 2.0.18 available. -->

![Screenshot of Boards Manager in Arduino IDE 2.3.8 showing both ESP32 packages](assets/images/ArduinoIDE2_BoardsManager_ESP32Packages.png)
**Figure.** The Arduino IDE Boards Manager showing two ESP32 packages. Install **"esp32" by Espressif Systems** (v3.x)—not "Arduino ESP32 Boards," which only supports official Arduino-branded ESP32 boards.
{: .fs-1 }

## Step 2: Select your board

Plug in your ESP32 board via USB. In Arduino IDE 2.x, you can select both the board and port from the **unified dropdown** at the top of the editor window—the IDE will often auto-detect your board. You can also use the traditional **Tools → Board → esp32** menu. Select the board that matches your hardware:

- **ESP32-S3 Feather** (4MB Flash, 2MB PSRAM, PID 5477): select **"Adafruit Feather ESP32-S3 2MB PSRAM"**
- **Huzzah32** (original ESP32): select **"Adafruit ESP32 Feather"**

![Screenshot showing how to select the Adafruit ESP32 in the Board Manager menu](assets/images/ArduinoIDE_SelectAdafruitESP32Board.png)
**Figure.** Selecting an Adafruit ESP32 board in the Arduino IDE board menu. Note: this screenshot is from the older Arduino IDE 1.x; the layout differs in IDE 2.x but the board names are the same.
{: .fs-1 }

{: .warning }
> **Selecting the wrong board** is one of the most common causes of upload failures and mysterious crashes. The ESP32-S3 Feather with 2MB PSRAM is a *different* board entry than the ESP32-S3 Feather with no PSRAM (PID 5323). Make sure the board name matches your exact hardware.

## Step 3: Select the port

If you used the unified dropdown in Step 2, the port may already be selected. Otherwise, select the correct serial port under **Tools → Port**:
- **Windows:** `COM#` (e.g., `COM3`)
- **macOS:** `/dev/cu.usbmodem#` (ESP32-S3) or `/dev/cu.SLAB_USBtoUART` (Huzzah32)
- **Linux:** `/dev/ttyACM#` (ESP32-S3) or `/dev/ttyUSB#` (Huzzah32)

{: .note }
> **ESP32-S3 Feather:** This board has **native USB**, so it should appear as a serial port automatically—no driver installation needed on any operating system.
>
> **Huzzah32:** This board uses a **CP2104 USB-to-UART bridge** chip. On **macOS 11 (Big Sur) and later**, Apple includes a native driver via DriverKit, so the board should work without installing anything. On **older macOS versions or Windows**, you may need to install the [Silicon Labs CP210x driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers). Linux typically includes the driver by default.

## Step 4: Upload a test sketch

To verify everything works, upload the built-in **Blink** example:

1. Open **File → Examples → 01.Basics → Blink**
2. Click the **Upload** button (→ arrow)
3. Wait for "Done uploading" in the status bar
4. The red LED on **Pin 13** (`LED_BUILTIN`) should blink on and off

🎉 If you see the LED blinking, congratulations—your ESP32 is ready to go!

{: .important }
> On some ESP32-S3 boards, you may need to **press the Reset button** after uploading for the code to start running. This is a [known issue](https://github.com/espressif/arduino-esp32/issues) in the ESP32 Arduino core.

## Troubleshooting

### Board doesn't appear in the port list

- **Check your USB cable.** Some cheap cables are power-only and don't include data wires. Try a different cable. This is the #1 cause of "invisible" boards.
- **ESP32-S3:** Try pressing the **Reset** button. If that doesn't work, enter the ROM bootloader manually: hold **BOOT**, press and release **Reset**, then release **BOOT**. The board should now appear as a port. (If the board isn't plugged in yet, you can also hold BOOT while plugging in the USB cable, then release BOOT.)
- **Huzzah32:** Make sure you've installed the [CP210x driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers).
- **Linux users:** You may need to add your user to the `dialout` group: `sudo usermod -aG dialout $USER` (then log out and back in). On Arch/Manjaro, use the `uucp` group instead.

### Upload fails with timeout or connection error

- Verify the correct **board** and **port** are selected (see [Step 2](#step-2-select-your-board) and [Step 3](#step-3-select-the-port)).
- Close any other programs that might be using the serial port (Serial Monitor in another IDE window, PuTTY, screen, etc.).
- Try lowering the upload speed: **Tools → Upload Speed → 115200**.
- For the ESP32-S3: hold **BOOT**, press and release **Reset**, then release BOOT. Click Upload while the board is in bootloader mode.

### Code uploads but nothing happens

- Press the **Reset** button on the board.
- Check that `LED_BUILTIN` is defined for your board. On the ESP32-S3 Feather, `LED_BUILTIN` is GPIO 13. You can verify by replacing `LED_BUILTIN` with `13` in your Blink sketch.
- Open **Tools → Serial Monitor** at 115200 baud—look for error messages or boot logs.

### "A fatal error occurred: Failed to connect to ESP32"

This usually means the board is stuck or the bootloader can't be reached. Try the BOOT-button method described above. If that doesn't work, try a different USB port or cable.

<!-- TODO: Add information about Arduino IDE 2.x specific issues, such as the board
     auto-detection feature and how it interacts with ESP32 native USB -->

### Decoding crash errors in Serial Monitor

If your ESP32 crashes, you'll see a "Guru Meditation Error" followed by a register dump and hex backtrace in the Serial Monitor. This looks alarming but is actually useful—it contains the exact location of the crash. To decode it into human-readable file names and line numbers, you can use an exception decoder tool. Unfortunately, the tooling situation is fragmented as of 2026: the [original EspExceptionDecoder](https://github.com/me-no-dev/EspExceptionDecoder) only works with the legacy Arduino IDE 1.x, and the [dankeboy36 fork](https://github.com/dankeboy36/esp-exception-decoder) has shifted its focus to VS Code. If you use VS Code with PlatformIO or the Arduino extension, the dankeboy36 decoder works well. For Arduino IDE 2.x users, you may need to [manually install a 1.x VSIX release](https://github.com/dankeboy36/esp-exception-decoder/tree/1.1.1). Alternatively, if you have [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html) installed, the [`idf.py monitor`](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/tools/idf-monitor.html) command automatically decodes backtraces in real time.

<!-- TODO: revisit this when Arduino IDE 2.x or 3.x improves plugin support -->

## ESP32 Arduino core version: v2 vs. v3

If you're following older ESP32 tutorials online, be aware that the **ESP32 Arduino core API changed significantly** between version 2.x and 3.x. The most impactful changes for our lessons:

| Feature | v2.x API | v3.x API |
|---|---|---|
| PWM setup | `ledcSetup(channel, freq, bits)` + `ledcAttachPin(pin, channel)` | `ledcAttach(pin, freq, bits)` |
| PWM write | `ledcWrite(channel, duty)` | `ledcWrite(pin, duty)` |
| Tone | `ledcWriteTone(channel, freq)` | `ledcWriteTone(pin, freq)` |
| `tone()` | Not available | ✅ Supported (wrapper around LEDC) |
| `analogWrite()` | Not available | ✅ Supported (wrapper around LEDC) |

In v3.x, the **channel abstraction was removed** from the public API. You now attach PWM directly to a pin rather than configuring a channel first. This is simpler but means old v2.x code won't compile without changes. We'll cover this in detail in [Lesson 3: Fading an LED](led-fade.md) and [Lesson 5: Playing Tones](tone.md).

{: .note }
> To check which version you have installed, go to **Tools → Board → Boards Manager**, search for `esp32`, and look at the version number next to "esp32 by Espressif Systems."