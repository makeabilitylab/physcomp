---
layout: default
title: L2&#58; Addressable LEDs
nav_order: 2
parent: Output
grand_parent: Advanced I/O
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

<!-- TODO: Record a hero video showing a rainbow animation cycling across an LED stick or strip and embed here -->

From holiday lights to wearable costumes to interactive art installations, addressable RGB LEDs are everywhere. Unlike the [single RGB LEDs](../arduino/rgb-led.md) we used in Intro to Arduino—which required three PWM pins and careful `analogWrite()` mixing for just *one* LED—addressable LEDs have a tiny driver chip built into *each* LED, allowing you to individually control hundreds of pixels from a single Arduino pin. In this lesson, we'll learn how they work and build some colorful projects!

{: .note }
> **In this lesson, you will learn:**
> - What addressable RGB LEDs are and how they differ from standard RGB LEDs
> - How the WS2812B/SK6812 single-wire protocol works (daisy-chained data)
> - Why each LED has a built-in driver chip and what it does for you
> - How to install and use the Adafruit NeoPixel library (which works with any WS2812B/SK6812 hardware)
> - How to set individual pixel colors using RGB and HSV values
> - How to calculate power requirements and when to use an external power supply
> - How to create animations by updating pixels in `loop()`

## Materials

You will need the following materials for this lesson:

| Arduino | LED Stick or Strip | Breadboard | Potentiometer |
|:-----:|:-----:|:-----:|:-----:|
| ![Arduino Uno or Leonardo]({{ site.baseurl }}/assets/images/ArduinoUno_Fritzing.png) | ![WS2812B 8-LED stick](assets/images/WS2812B_8LED_Stick.png) | ![Breadboard]({{ site.baseurl }}/assets/images/Breadboard_Half.png) | ![10K potentiometer]({{ site.baseurl }}/assets/images/Potentiometer_Fritzing.png) |
| Arduino Uno, Leonardo, or similar | WS2812B or SK6812 LED stick (8 LEDs) or strip | Breadboard | 10KΩ Potentiometer (for interactive demos) |

<!-- TODO: Take a photo of the actual 8-LED stick from the student kit and use it for the materials image -->

You will also need jumper wires. For longer strips (more than ~10 LEDs), you will need an external 5V power supply—see [Power considerations](#power-considerations) below.

{: .note }
> Our student kits include an 8-LED WS2812B/SK6812 stick. If you have a different addressable LED product (a strip, ring, or matrix), everything in this lesson still applies—only the number of LEDs changes in your code.

## Addressable RGB LEDs

### From single RGB LEDs to addressable strips

In the [Intro to Arduino RGB LED lesson](../arduino/rgb-led.md), you learned how to control a single RGB LED by connecting its red, green, and blue legs to three separate PWM pins and calling `analogWrite()` on each channel to mix colors. It worked, but it was pin-hungry: controlling just one LED required three PWM pins. To control 10 LEDs individually, you would need 30 PWM pins—more than most Arduino boards even have!

Addressable RGB LEDs solve this problem elegantly. Each LED package contains a tiny integrated circuit (IC) that handles the color mixing and current limiting internally. Instead of three analog wires per LED, the entire strip of LEDs is controlled through a **single digital data pin**. The Arduino sends color data for all pixels down one wire, and each LED's built-in chip reads its own data and passes the rest downstream.

### How addressable LEDs work

The most common addressable LED chipsets are the **WS2812B** and the **SK6812** (an enhanced clone with wider color gamut and better voltage stability). Both use the same single-wire protocol and are fully compatible with the same software libraries. You'll find them sold under many brand names—Adafruit calls theirs "[NeoPixels](https://learn.adafruit.com/adafruit-neopixel-uberguide)"—but they all work the same way.

{: .note }
> **"NeoPixel" is Adafruit's brand name** for WS2812B/SK6812-compatible LEDs, much like "Band-Aid" is a brand name for adhesive bandages. The Adafruit NeoPixel library works with *any* WS2812B or SK6812 LEDs regardless of manufacturer. Throughout this lesson, we'll use "NeoPixel library" to refer to the software and "addressable LEDs" or "WS2812B/SK6812" to refer to the hardware generically.

Here's how the data flows:

1. The Arduino sends a stream of color data (3 bytes per LED: one each for red, green, and blue) on a single data pin.
2. The **first LED** in the chain reads the first 3 bytes (its own color), latches them, and passes the remaining data downstream to the next LED.
3. The **second LED** reads the next 3 bytes, latches them, and passes the rest along.
4. This continues down the chain until every LED has received its color.
5. After a brief pause (~50µs) in the data stream, the LEDs treat the next transmission as a new frame.

<!-- TODO: Create a diagram showing the daisy-chain data flow:
     Arduino Pin 2 → [LED 1] → [LED 2] → [LED 3] → ... → [LED N]
     With labeled arrows showing "3 bytes consumed" at each LED and "remaining bytes passed downstream" -->

This daisy-chain architecture is what makes addressable LEDs so powerful: you can control hundreds of LEDs from a single pin, with each LED individually addressable.

### Form factors

Addressable LEDs come in a wide variety of form factors, all using the same protocol and code:

<!-- TODO: Create a figure showing different form factors — individual LEDs, sticks, rings, strips, matrices — with brief labels -->

- **Sticks** (like the 8-LED stick in your kit) — compact, easy to breadboard, great for learning
- **Strips** — the most common form factor, available in densities of 30, 60, or 144 LEDs per meter
- **Rings** — circular arrangements, popular for clocks, gauges, and wearable projects
- **Matrices** — rectangular grids (*e.g.,* 8x8 or 16x16) for pixel-art displays
- **Individual LEDs** — for custom PCB designs or embedding into 3D-printed enclosures

Regardless of form factor, the wiring and code are identical—only the number of LEDs changes.

## Power considerations

Power management is one of the most important practical skills when working with addressable LEDs. Each LED can draw a surprising amount of current, and miscalculating power can lead to dim LEDs, flickering, Arduino resets, or even damaged components.

### Per-LED current draw

Each WS2812B/SK6812 LED contains three internal LEDs (red, green, and blue), each of which draws up to **20mA** at full brightness. At full white (all three channels at maximum), a single LED draws:

$$I_{LED} = 20\text{mA (red)} + 20\text{mA (green)} + 20\text{mA (blue)} = 60\text{mA}$$

At lower brightness or non-white colors, the current draw is proportionally less. A single red LED at full brightness draws only 20mA. A dim purple might draw 10mA total.

### Calculating total current

To calculate the maximum current your LED project could draw, multiply the number of LEDs by 60mA:

$$I_{total} = N_{LEDs} \times 60\text{mA}$$

Here are some common scenarios:

| Configuration | LEDs | Max current (full white) | Typical current (mixed colors, ~50% brightness) |
|---|---|---|---|
| 8-LED stick (your kit) | 8 | 480mA | ~100-200mA |
| 30-LED/m strip (1 meter) | 30 | 1.8A | ~400-600mA |
| 60-LED/m strip (1 meter) | 60 | 3.6A | ~800mA-1.2A |
| 144-LED/m strip (1 meter) | 144 | 8.6A | ~2-3A |

### Three power tiers

Depending on how many LEDs you're driving, you'll need different power strategies:

#### Tier 1: Arduino USB power (≤ ~8-10 LEDs)

For small projects like your 8-LED stick, the Arduino's **5V pin** powered by USB is usually sufficient. USB provides up to 500mA, and at moderate brightness with colorful (non-white) patterns, 8 LEDs typically draw 100-200mA—well within the limit.

This is the simplest wiring: just three connections from the LED stick to the Arduino.

<!-- TODO: Create a Fritzing wiring diagram showing the 8-LED stick connected directly to Arduino:
     - 5V → VCC on LED stick
     - GND → GND on LED stick
     - Pin 2 → DIN on LED stick
     Include a 300-470Ω resistor on the data line (recommended but optional for short runs) -->

![Wiring diagram showing an 8-LED WS2812B stick connected to an Arduino Uno with three wires: 5V to VCC, GND to GND, and Pin 2 to DIN through a small resistor](assets/images/Arduino_WS2812B_8LED_BasicWiring.png)
**Figure.** Basic wiring for an 8-LED stick powered from the Arduino's 5V pin. This setup is fine for small numbers of LEDs at moderate brightness. The 300-470Ω resistor on the data line is recommended by Adafruit to protect the first LED's data input from voltage spikes, but the circuit often works without it for short connections.
{: .fs-1 }

{: .warning }
> Even with just 8 LEDs, calling `strip.fill(strip.Color(255, 255, 255))` (full white at max brightness) draws ~480mA from USB—very close to the 500mA limit. If your Arduino resets or behaves erratically when all LEDs are full white, reduce the brightness with `strip.setBrightness(128)` or use an external power supply.

#### Tier 2: External 5V supply (10-60+ LEDs)

For longer strips, you **must** use a dedicated external 5V power supply. A USB phone charger (rated 2A or higher), a 5V wall adapter, or a bench power supply all work well. The key requirement is that the supply is rated for the total current your LEDs could draw.

<!-- TODO: Create a Fritzing wiring diagram showing:
     - External 5V supply → VCC and GND on LED strip
     - Arduino GND → shared ground bus (connected to supply GND and strip GND)
     - Arduino Pin 2 → DIN on LED strip (through 300-470Ω resistor)
     - Arduino powered separately via USB
     - 1000µF capacitor across the supply's + and - (near the strip)
     - Clear labels showing "COMMON GROUND" connection -->

![Wiring diagram showing an LED strip powered by an external 5V supply with a shared ground connection to the Arduino, a 1000µF capacitor across the power supply, and the data line connected from Pin 2 through a resistor](assets/images/Arduino_WS2812B_Strip_ExternalPower.png)
**Figure.** Wiring for longer LED strips with an external 5V power supply. The Arduino and the external supply **must share a common ground** connection—without this, the data signal won't work. The 1000µF capacitor across the power supply protects the LEDs from the initial power surge when the supply is first connected.
{: .fs-1 }

{: .warning }
> **The common ground is critical!** The Arduino and the external power supply must share a ground connection. Without a common ground, the Arduino's data signal has no reference voltage and the LEDs won't respond. This is the most common wiring mistake with externally-powered LED strips.

#### Tier 3: Large installations (100+ LEDs)

For very long strips or LED matrices, you may need to "inject" power at multiple points along the strip (every 1-2 meters) to compensate for voltage drop across the thin copper traces. This is beyond the scope of this lesson, but the [Adafruit NeoPixel Überguide](https://learn.adafruit.com/adafruit-neopixel-uberguide/powering-neopixels) covers it in detail.

### The brightness trick

In practice, you almost never need to run all LEDs at full white brightness. Calling `strip.setBrightness(128)` (half brightness) roughly halves your current draw, and most projects actually look *better* at reduced brightness—full-power NeoPixels are blindingly bright! This is a simple way to stay within your power budget without an external supply.

## The Adafruit NeoPixel library

### Installation

The Adafruit NeoPixel library can be installed directly from the Arduino Library Manager. Go to `Sketch → Include Library → Manage Libraries`, search for "Adafruit NeoPixel", and click Install.

<!-- TODO: Screenshot of the Arduino Library Manager showing the Adafruit NeoPixel library -->

### Key API

The NeoPixel library API will feel familiar if you've completed the [OLED lesson](oled.md)—it follows the same **buffer → display** pattern:

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;       // Any digital pin works — no PWM required!
const int NUM_LEDS = 8;      // Number of LEDs in the strip/stick

// Create the NeoPixel object
// NEO_GRB: most WS2812B/SK6812 strips use Green-Red-Blue color order
// NEO_KHZ800: 800 KHz data rate (standard for WS2812B/SK6812)
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();             // Initialize the strip
  strip.setBrightness(50);   // Set brightness (0-255). 50 is a good starting point!
  strip.show();              // Initialize all pixels to 'off'
}
{% endhighlight C++ %}

{: .note }
> Notice the same **buffer → show** pattern from the [OLED lesson](oled.md): `setPixelColor()` writes to a buffer in RAM, and `show()` pushes the data to the LEDs. If you forget to call `show()`, nothing will change on the LEDs—just like forgetting `_display.display()` on the OLED!

{: .note }
> **Why Pin 2 (not a PWM pin)?** You might expect addressable LEDs to require a PWM pin since they involve precise signal timing. But the NeoPixel library generates its timing entirely in software using carefully timed bit-banging—no hardware PWM is involved. Any digital pin works! We intentionally chose Pin 2 (a non-PWM pin) to make this clear and to keep the PWM pins free for other uses like [vibromotors](vibromotor.md) or [LED fading](../arduino/led-fade.md).

Here are the most commonly used functions:

| Function | Description |
|----------|-------------|
| `strip.begin()` | Initialize the strip. Call once in `setup()`. |
| `strip.show()` | Push the color buffer to the LEDs. **Nothing changes on the strip until you call this.** |
| `strip.setPixelColor(index, r, g, b)` | Set pixel at `index` to the specified RGB color (0-255 per channel). |
| `strip.setPixelColor(index, color)` | Set pixel using a packed 32-bit color value. |
| `strip.Color(r, g, b)` | Helper that packs RGB values into a single 32-bit color value. |
| `strip.ColorHSV(hue, sat, val)` | Convert HSV color to a packed value. `hue` is 0-65535, `sat` and `val` are 0-255. |
| `strip.setBrightness(value)` | Set global brightness (0-255). Affects all subsequent `show()` calls. |
| `strip.clear()` | Set all pixels to off (black). Still need to call `show()` to take effect. |
| `strip.fill(color, first, count)` | Fill a range of pixels with a single color. |
| `strip.numPixels()` | Returns the number of LEDs in the strip. |
| `strip.getPixelColor(index)` | Returns the current color of a pixel as a packed 32-bit value. |

### Color representation

Each pixel's color is specified using RGB values from 0-255 per channel, just like the [RGB LED lesson](../arduino/rgb-led.md). Some examples:

{% highlight C++ %}
// Named colors using strip.Color(R, G, B)
uint32_t red    = strip.Color(255, 0, 0);
uint32_t green  = strip.Color(0, 255, 0);
uint32_t blue   = strip.Color(0, 0, 255);
uint32_t white  = strip.Color(255, 255, 255);
uint32_t purple = strip.Color(128, 0, 255);
uint32_t off    = strip.Color(0, 0, 0);
{% endhighlight C++ %}

For animations that cycle through colors, the **HSV** (hue, saturation, value) color space is much more useful than RGB. Remember the [HSL crossfading lesson](../arduino/rgb-led-fade.md)? The same principle applies here. The `ColorHSV()` function lets you smoothly sweep through the entire rainbow by varying just the hue value:

{% highlight C++ %}
// Hue ranges from 0 to 65535 (full color wheel)
// 0 = red, ~10922 = yellow, ~21845 = green, ~32768 = cyan,
// ~43690 = blue, ~54613 = magenta, 65535 wraps back to red

uint32_t color = strip.ColorHSV(hue, 255, 255); // Full saturation, full brightness
// Note: ColorHSV returns a value that should be passed through strip.gamma32()
// for perceptually accurate colors:
strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(hue, 255, 255)));
{% endhighlight C++ %}

{: .note }
> **What is `gamma32()`?** Human eyes perceive brightness non-linearly—the difference between 0 and 50 looks much bigger than the difference between 200 and 250. The `gamma32()` function applies a correction curve so that color transitions look smooth and natural to our eyes. It's optional but makes a noticeable difference in gradients and fades.

### Color order

One common "gotcha": not all addressable LEDs use the same color channel order. Most WS2812B strips use **GRB** (green-red-blue) order, but some use RGB, and SK6812 RGBW strips use GRBW. If you set a pixel to red but it lights up green, try changing `NEO_GRB` to `NEO_RGB` (or vice versa) in your strip constructor.

## Wiring

The wiring for addressable LEDs is refreshingly simple—just three connections:

| Wire | LED Stick Pin | Arduino Pin | Color (typical) |
|------|-------------|-------------|-----------------|
| Power | VCC / 5V | 5V | Red |
| Ground | GND | GND | Black |
| Data | DIN (Data In) | Pin 2 (or any digital pin) | Green or White |

### Preparing the LED stick

Many LED sticks (including the 8-LED WS2812B sticks in our kits) come with **bare solder pads** on the back—there are no pre-attached wires or header pins. You'll need to solder either jumper wires or header pins to the pads before you can connect the stick to your breadboard.

Our sticks have **four pads on each end**—both ends have GND, +5V, a data pad, and GND again. The difference is the data pad: one end is labeled **DI** (data in) and the other end is labeled **DO** (data out). You connect the Arduino to the **DI end**. The DO end is used to daisy-chain the data signal out to another stick or strip. The duplicate GND pads on each end make it easy to share a ground connection when chaining.

<!-- TODO: Add a photo showing both ends of the LED stick with the solder pads labeled (DI end and DO end), plus a photo of the stick with header pins soldered on and inserted into a breadboard -->

{: .note }
> **First time soldering?** This is a great beginner soldering project—the pads are large and widely spaced. If you need guidance, see the [Adafruit Guide to Excellent Soldering](https://learn.adafruit.com/adafruit-guide-excellent-soldering). The key tips: tin both the pad and the wire first, then bring them together with the iron. You only need to solder three connections to get started: **DIN** (data in), **+5V**, and one of the **GND** pads.

{: .warning }
> **Watch the data direction!** Most LED strips and sticks have directional arrows printed on the PCB. Data flows from **DIN** (data in) to **DOUT** (data out). Make sure you connect the Arduino to the **DIN** end. If you wire it to the DOUT end, nothing will work—and there will be no error message to help you debug it!

A 300-470Ω resistor on the data line between the Arduino and the first LED's DIN pin is recommended by Adafruit to protect against voltage spikes. For short connections (like plugging a stick into a breadboard), it often works without the resistor, but it's a good habit.

### Using addressable LEDs with 3.3V boards (ESP32)

The WS2812B/SK6812 protocol expects 5V logic levels. When using a **5V Arduino** (Uno, Leonardo), this works perfectly since the GPIO pins output 5V.

However, if you're using a **3.3V board** like the [ESP32](../esp32/index.md), the data signal may not be reliably recognized by the LEDs. The WS2812B datasheet specifies a minimum logic HIGH of 0.7 × VDD (= 3.5V when powered at 5V), and a 3.3V signal falls just below this threshold. In practice, many strips *happen* to work at 3.3V—but some don't, and reliability can vary with temperature, strip length, and manufacturing batch.

There are two common solutions:

- **Level shifter (recommended):** Use a level-shifting chip like the [74AHCT125](https://www.adafruit.com/product/1787) to convert the 3.3V data signal to 5V. This is the most reliable approach and only requires one extra chip.
- **Sacrificial first pixel:** Power the first LED at 3.3V (from the ESP32's 3.3V pin) instead of 5V. Its data output will be at 3.3V logic levels, which the *next* LED in the chain—powered at 5V—will interpret correctly (since 3.3V > 0.7 × 3.3V = 2.31V). This is a clever hack but wastes one LED and its color may look slightly different due to the lower voltage.

{: .note }
> For the projects in this lesson using an Arduino Uno or Leonardo (5V boards), you don't need to worry about any of this—just wire it up and go!

## Let's make stuff!

Now that we understand how addressable LEDs work and have our stick wired up, let's build some colorful projects!

### Activity 1: Light 'em up

Let's start by simply setting each LED to a different color. This confirms that your wiring is correct and that the library is communicating with all 8 LEDs. This is our equivalent of the [shape drawing activity](oled.md#activity-draw-shapes-and-text) from the OLED lesson—the simplest possible test.

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;
const int NUM_LEDS = 8;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(50);  // Keep it gentle on the eyes!

  // Set each LED to a different color
  strip.setPixelColor(0, strip.Color(255, 0, 0));     // Red
  strip.setPixelColor(1, strip.Color(255, 128, 0));   // Orange
  strip.setPixelColor(2, strip.Color(255, 255, 0));   // Yellow
  strip.setPixelColor(3, strip.Color(0, 255, 0));     // Green
  strip.setPixelColor(4, strip.Color(0, 255, 255));   // Cyan
  strip.setPixelColor(5, strip.Color(0, 0, 255));     // Blue
  strip.setPixelColor(6, strip.Color(128, 0, 255));   // Purple
  strip.setPixelColor(7, strip.Color(255, 0, 128));   // Pink

  strip.show();  // Don't forget this!
}

void loop() {
  // Nothing to do — the colors persist until changed
}
{% endhighlight C++ %}

If your colors look wrong (*e.g.,* you asked for red but got green), try changing `NEO_GRB` to `NEO_RGB` in the strip constructor. This is the most common issue students encounter!

### Activity 2: Rainbow animation

Now let's create a classic rainbow animation that cycles smoothly across all 8 LEDs. This introduces the concept of **animation on LED strips**: update pixel colors, call `show()`, wait a bit, repeat. It's the same pattern we used for the [bouncing ball](oled.md#activity-draw-a-bouncing-ball) on the OLED.

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;
const int NUM_LEDS = 8;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

long firstPixelHue = 0;  // Tracks the hue offset for animation

void setup() {
  strip.begin();
  strip.setBrightness(50);
  strip.show();
}

void loop() {
  // Spread the rainbow evenly across all pixels
  for (int i = 0; i < strip.numPixels(); i++) {
    // Calculate hue for this pixel, evenly spaced around the color wheel
    int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
    strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
  }
  strip.show();

  // Advance the starting hue for the next frame
  firstPixelHue += 256;
  if (firstPixelHue >= 65536) {
    firstPixelHue = 0;
  }

  delay(20);  // ~50 fps
}
{% endhighlight C++ %}

Try changing the `+= 256` increment to `+= 64` (slower rainbow) or `+= 1024` (faster rainbow). What happens if you change `setBrightness()` to 255? (Shield your eyes!)

### Activity 3: Potentiometer-controlled color

Now let's add **analog input** to control the LED colors. We'll use a potentiometer on `A0` to sweep the hue across the entire color wheel—turn the knob and watch all LEDs shift from red to green to blue and back. This is the same `analogRead()` → `map()` → output pattern we used in the [OLED interactive demos](oled.md#activity-interactive-graphics) and the [vibromotor potentiometer activity](vibromotor.md#activity-2-potentiometer-controlled-vibration).

#### The circuit

Use the same LED wiring as before, and add a 10KΩ potentiometer with its wiper connected to `A0`.

<!-- TODO: Create a Fritzing wiring diagram showing the 8-LED stick plus a potentiometer on A0 -->

#### The code

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;
const int NUM_LEDS = 8;
const int POT_PIN = A0;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(50);
  strip.show();
  Serial.begin(9600);
}

void loop() {
  // Read the potentiometer (0-1023)
  int potVal = analogRead(POT_PIN);

  // Map to hue (0-65535 for the full color wheel)
  long hue = map(potVal, 0, 1023, 0, 65535);

  // Set all pixels to the same hue
  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(hue)));
  }
  strip.show();

  // Debug output
  Serial.print("Pot: ");
  Serial.print(potVal);
  Serial.print(" -> Hue: ");
  Serial.println(hue);

  delay(20);
}
{% endhighlight C++ %}

As you turn the potentiometer, you should see all 8 LEDs smoothly cycle through the rainbow together.

#### Part 2: Two-pot color and brightness control

Now let's add a **second potentiometer** on `A1` to independently control brightness while the first pot controls hue. This gives you two physical knobs—one for color, one for intensity—which is a nice introduction to **multi-input control**. It also demonstrates why the HSV color space is so useful: hue and brightness are independent parameters, so two knobs map naturally to two HSV axes.

<!-- TODO: Create a Fritzing wiring diagram showing the 8-LED stick plus two potentiometers on A0 and A1 -->

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;
const int NUM_LEDS = 8;
const int HUE_POT_PIN = A0;
const int BRIGHTNESS_POT_PIN = A1;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show();
  Serial.begin(9600);
}

void loop() {
  // Read both potentiometers
  int huePotVal = analogRead(HUE_POT_PIN);
  delay(1);  // Brief delay between analogReads for ADC stability
  int brightPotVal = analogRead(BRIGHTNESS_POT_PIN);

  // Map to HSV parameters
  long hue = map(huePotVal, 0, 1023, 0, 65535);         // Full color wheel
  int brightness = map(brightPotVal, 0, 1023, 0, 255);  // 0 (off) to 255 (max)

  // Set all pixels to the same hue with the controlled brightness
  // ColorHSV takes: hue (0-65535), saturation (0-255), value/brightness (0-255)
  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(hue, 255, brightness)));
  }
  strip.show();

  // Debug output
  Serial.print("Hue: ");
  Serial.print(hue);
  Serial.print(" | Brightness: ");
  Serial.println(brightness);

  delay(20);
}
{% endhighlight C++ %}

Try turning each knob independently—you can dial in any color at any brightness level. Notice how the `ColorHSV()` function's three parameters (hue, saturation, value) map perfectly to physical controls. What would you use a *third* potentiometer for? (Hint: saturation controls how vivid *vs.* pastel the color looks!)

### Activity 4: LED level meter

For our final activity, let's build a **level meter** (or VU meter)—a bar-graph display where the number of lit LEDs corresponds to an analog input value. This is similar to the [analog graph we built on the OLED](oled.md#demo-3-basic-real-time-analog-graph), but using physical LEDs instead of on-screen pixels. It's a great way to visualize sensor data in the physical world!

We'll color the LEDs from green (low) through yellow (mid) to red (high), like a classic audio level meter.

{% highlight C++ %}
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 2;
const int NUM_LEDS = 8;
const int SENSOR_PIN = A0;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// Colors for the level meter (green → yellow → red)
uint32_t levelColors[] = {
  strip.Color(0, 255, 0),     // LED 0: Green
  strip.Color(0, 255, 0),     // LED 1: Green
  strip.Color(0, 255, 0),     // LED 2: Green
  strip.Color(128, 255, 0),   // LED 3: Yellow-green
  strip.Color(255, 255, 0),   // LED 4: Yellow
  strip.Color(255, 128, 0),   // LED 5: Orange
  strip.Color(255, 0, 0),     // LED 6: Red
  strip.Color(255, 0, 0),     // LED 7: Red
};

void setup() {
  strip.begin();
  strip.setBrightness(50);
  strip.show();
}

void loop() {
  // Read the analog sensor
  int sensorVal = analogRead(SENSOR_PIN);

  // Map to number of LEDs to light (0 to NUM_LEDS)
  int numLit = map(sensorVal, 0, 1023, 0, NUM_LEDS);

  // Update the strip
  strip.clear();
  for (int i = 0; i < numLit; i++) {
    strip.setPixelColor(i, levelColors[i]);
  }
  strip.show();

  delay(30);
}
{% endhighlight C++ %}

Turn the potentiometer and watch the LEDs fill up like a progress bar! This is a simple but satisfying example of mapping data to a physical display. Try replacing the potentiometer with a [force-sensitive resistor](../arduino/force-sensitive-resistors.md) or a [photoresistor](../sensors/photoresistors.md) for a more interactive experience.

{: .note }
> **Connecting to the previous lessons:** Notice how the same `analogRead()` → `map()` → output pattern appears in every lesson in this module. In the [OLED lesson](oled.md), it controlled a circle's size. In the [vibromotor lesson](vibromotor.md), it controlled vibration intensity. Here, it controls the number of lit LEDs. Learning to recognize this pattern is a key physical computing skill—once you can map sensor input to output, you can build almost anything!

## Exercises

Want to go further? Here are some challenges to reinforce what you've learned:

- **Larson scanner.** Create the classic "Knight Rider" or Cylon eye effect: a single bright LED (with a dim trail) that sweeps back and forth across the strip. Hint: on each frame, dim all LEDs slightly, then set the current position LED to full brightness.
- **Color mixer.** Use three potentiometers (on A0, A1, A2) to control the red, green, and blue channels of all LEDs. Display the current RGB values on the [OLED display](oled.md) at the same time for a multimodal output!
- **Reaction timer game.** Create a "light" that bounces back and forth across the strip. The player presses a button to try to "catch" the light when it reaches a specific LED. Display their reaction time on the Serial Monitor (or OLED).
- **Temperature indicator.** If you have a temperature sensor (like the [TMP36](https://www.adafruit.com/product/165)), map the temperature to a color gradient on the LEDs—blue for cold, green for comfortable, red for hot.

## Lesson Summary

In this lesson, you learned about addressable RGB LEDs and how to create colorful, animated, and interactive light displays. The key concepts were:

- **Addressable LEDs** (WS2812B/SK6812) contain a built-in driver chip at each LED, allowing individual control of hundreds of pixels from a single data pin. This is fundamentally different from standard RGB LEDs, which require three PWM pins per LED.
- The LEDs use a **daisy-chain protocol**: data flows from the Arduino to the first LED, which reads its color and passes the remaining data downstream. Each LED in the chain receives its own color data automatically.
- The **Adafruit NeoPixel library** provides a clean API that follows the same buffer → show pattern as the OLED: `setPixelColor()` writes to RAM, and `show()` pushes the data to the LEDs.
- **Power management** is critical: each LED can draw up to 60mA at full white. For 8 LEDs, Arduino USB power is usually sufficient; for longer strips, an external 5V power supply with a **shared ground** is required.
- The **HSV color space** (via `ColorHSV()`) makes it easy to create rainbow effects by sweeping the hue value, and `gamma32()` applies perceptual brightness correction for smoother gradients.
- "NeoPixel" is Adafruit's brand name; the underlying WS2812B/SK6812 hardware is made by many manufacturers and is all compatible with the same library.

## Resources

- [Adafruit NeoPixel Überguide](https://learn.adafruit.com/adafruit-neopixel-uberguide), Adafruit — the definitive guide to all things NeoPixel, including best practices, wiring, and advanced techniques

- [FastLED Library](https://fastled.io/) — a popular alternative library with advanced features like built-in palettes, noise functions, and math helpers. Worth exploring once you're comfortable with the NeoPixel library.

- [WS2812B Datasheet](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf), Worldsemi

- [NeoPixel Best Practices](https://learn.adafruit.com/adafruit-neopixel-uberguide/best-practices), Adafruit — essential reading on power, wiring, and protection

## Next Lesson

In the [next lesson](servo.md), we will learn about servo motors—another output device with a built-in control circuit—and how to precisely control angular position with the Arduino Servo library.

<span class="fs-6">
[Previous: OLED Displays](oled.md){: .btn .btn-outline }
[Next: Servo Motors](servo.md){: .btn .btn-outline }
</span>