---
layout: default
title: L1&#58; OLED
nav_order: 1
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

<!-- ## Serial communication protocols

TODO: intro i2c and SPI
- Can Leonardo actually use i2c pin student confusion: https://forum.arduino.cc/t/can-leonardo-actually-use-its-i2c-pins/417516

### Terminology

Master/slave

### i2C

- With 7-bit addressing, 112 devices. With 10-bit addressing, 1008 devices
- Each device has a unique id
- Need pull-up resistors (importantly, the breakout boards that we use in class **already** have these pull-up resistors builtin to the PCBs) 

- Hook up multiple devices at once with daisy chaining. Link to color sensor video

- -->

This is a **DRAFT LESSON** that will be finalized by the end of Tues, May 4, 2021.

In this lesson, you will learn about organic light-emitting diode (OLED) displays, basic graphics programming, and a brief introduction to two serial communication protocols called [I<sup>2</sup>C](https://en.wikipedia.org/wiki/I%C2%B2C) (Inter-Integrated Circuit) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) (Serial Peripheral Interface)

## OLED Display

Organic light-emitting diode ([OLED](https://en.wikipedia.org/wiki/OLED)) displays are relatively new technology, increasingly used in TVs, computer monitors, smartphones, and handheld game consoles. Unlike LCDs, which require backlighting, each OLED pixel generates its own light providing superior contrast and color control. 

In this lesson, we will be using the [monochrome (black-and-white) OLED displays](https://learn.adafruit.com/monochrome-oled-breakouts) from Adafruit along with their display control and graphics libraries. To do so, we need to install some required libraries.

<!-- - Include overview of graphics
    - https://learn.adafruit.com/adafruit-gfx-graphics-library/overview
    - https://lastminuteengineers.com/oled-display-arduino-tutorial/ -->

### Install Arduino libraries

To use the Adafruit OLED display, we need two libraries:

- The [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306) display driver library, which handles display communication, memory mapping, and low-level drawing routines
- The [Adafruit_GFX](https://github.com/adafruit/Adafruit-GFX-Library) graphics library, which provides core graphics routines for all Adafruit displays like drawing points, lines, circles. 

Fortunately, the Arduino IDE makes library installation easy. We can do it right from the IDE itself.

#### Step 1: Open "Manage Libraries"

Open your Arduino IDE, then go to `Tools -> Manage Libraries`.

![](assets/images/ArduinoIDE_ManageLibrariesScreenshot.png)

#### Step 2: Search for Adafruit SSD1306

In the Library Manager, search for "Adafruit SSD1306". There are other SSD1306 libraries so make sure you find the one by Adafruit. In this screenshot, the current version is 2.4.4.

![](assets/images/ArduinoIDE_LibraryManager_SearchForAdafruitSSD1306.png)

#### Step 3: Install Adafruit SSD1306 library
Click on the `Install` button.

![](assets/images/ArduinoIDE_LibraryManager_ClickInstallAdafruitSSD1306.png)

#### Step 4: Install all dependencies

The Adafruit SSD1306 library depends on two other libraries, which we also need to install. Fortunately, the Library Manager detects this and explicitly asks about dependencies. So, select `Install all`.

![](assets/images/ArduinoIDE_LibraryManager_AdafruitSSD1306Dependencies.png)

<!-- The Arduino IDE Library Manager let's library designers to identify other library dependencies in their metadata. This allows the IDE to ask users about dependencies automatically.  -->

#### Step 5: Confirm installation

If the SSD1306 library was correctly installed, you should see a teal "INSTALLED" label next to it as we do below:

![](assets/images/ArduinoIDE_LibraryManager_SSD1306Installed.png)

#### Library installation folder location on OS

All libraries are installed in the `Documents` folder on your OS. It's useful to be aware of this directory in case you want to do a manual install of a library (like the [Makeability Lab Arduino Library](https://github.com/makeabilitylab/arduino/tree/master/MakeabilityLab_Arduino_Library)) or want to view library source code. 

Depending on your OS, you can view the installed Arduino `libraries` folder on your filesystem here:

- On Windows, this defaults to `C:\Users\<username>\Documents\Arduino\libraries`
- On Mac, `/Users/<username>/Documents/Arduino/libraries`

| Arduino Library directory on Windows | Arduino Library directory on Mac |
|:------------------------------------:|:--------------------------------:|
| ![](assets/images/Arduino_LibraryDirectory_Windows.png) | ![](assets/images/Arduino_LibraryDirectory_Mac.png) |

You'll note that the `libraries` folder contains raw source and **not** pre-compiled binaries. The Arduino IDE may compile underlying library files differently depending on the selected board.

### Wiring the Adafruit OLED display

The [SSD1306](https://github.com/adafruit/Adafruit_SSD1306) driver chip and accompanying library allows you to communicate with the OLED via two independent serial communication methods—each require different wirings: [I<sup>2</sup>C](https://en.wikipedia.org/wiki/I%C2%B2C) (Inter-Integrated Circuit) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface) (Serial Peripheral Interface). The default is I2C, which is what we will use in this lesson. For more on the SPI mode, see [Adafruit's official docs](https://learn.adafruit.com/monochrome-oled-breakouts/wiring-128x64-oleds).

While the OLED display requires a 3.3V power supply and 3.3V logic levels for communication, the Adafruit breakout board includes a 3.3V regulator and level shifting on all pins, so you can interface with either 3V or 5V devices. Additionally, recall that the I<sup>2</sup>C requires pull-up resistors on the clock (SCL) and data (SDA) lines so that both are pulled-up to logic level `HIGH` by default. Thankfully, the Adafruit breakout board also includes these resistors. So, the wiring is quite straightforward, consisting of only four wires!

![](assets/images/ArduinoLeonardo_OLEDWiring_FritzingSchematics.png)
**Figure** Wiring the Adafruit OLED display requires only four wires (and nothing else). I used the standard STEMMA QT color coding for my wires: blue for data (SDA), yellow for clock (SCL), black for ground (GND), and red for the voltage supply (5V). Note that the I<sup>2</sup>C pins differ depending on your board. For example, on the Arduino Uno, they are A4 (SDA) and A5 (SCL) rather than digital pins 2 (SDA) and 3 (SCL) as they are for the Leonardo.
{: .fs-1 }

#### Physical wiring with jumper cables

![](assets/images/ArduinoLeonardo_OLEDWiring_Breadboard.png)
**Figure** Physically wiring the OLED display with jumper cables. The Arduino is running this demo code ['BitmapBounce.ino'](https://github.com/makeabilitylab/arduino/blob/master/OLED/BitmapBounce/BitmapBounce.ino)
{: .fs-1 }

#### STEMMA QT wiring

Starting in ~2017, many Adafruit and SparkFun breakout boards began including standardized connectors to more easily connect multiple electronic devices without soldering or working with lots of individual wires. The Sparkfun connection standard for I<sup>2</sup>C devices, called [Qwicc](https://www.sparkfun.com/qwiic), was later adopted by Adafruit, which they call [STEMMA QT](https://learn.adafruit.com/introducing-adafruit-stemma-qt/what-is-stemma-qt).

Adafruit sells a variety of STEMMA QT cables, including this [female-to-female](https://www.adafruit.com/product/4210) version (for ~$0.95) and this [female-to-male](https://www.adafruit.com/product/4209) jumper cable version ($0.95). You can use the female-to-female cable to daisy chain multiple devices together.

| STEMMA QT / Qwiic Female-to-Female Cable | STEMMA QT / Qwiic Female-to-Male Jumper Cable |
|:------------------------------------:|:--------------------------------:|
| ![](assets/images/Adafruit_STEMMA-QT_FemaleToFemale.png) | ![](assets/images/Adafruit_STEMMA-QT_FemaleToMale_Cable.png) |

The video below shows the OLED display hooked up to a STEMMA QT [female-to-male jumper cable](https://www.adafruit.com/product/4209):

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/AdafruitSTEMMAQT_IMG_6163-TrimmedAndCropped720p.mov" type="video/mp4" />
</video>

**Video** Running the demo [`ssd1306_128x64_i2c`](https://github.com/adafruit/Adafruit_SSD1306/blob/master/examples/ssd1306_128x64_i2c/ssd1306_128x64_i2c.ino) with a STEMMA QT cable.
{: .fs-1 }

### Testing the OLED display

Once you've wired the OLED display, let's test it!

We will run one of the examples that ships with the [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306) library called [`ssd1306_128x64_i2c`](https://github.com/adafruit/Adafruit_SSD1306/blob/master/examples/ssd1306_128x64_i2c/ssd1306_128x64_i2c.ino). This example iterates through a variety of drawing demonstrations, including: drawing lines, outlining and filling rectangles, circles, rounded rectangles, and triangles, rendering text with different styles, and drawing and animating bitmaps. You can view the [source code here](https://github.com/adafruit/Adafruit_SSD1306/blob/master/examples/ssd1306_128x64_i2c/ssd1306_128x64_i2c.ino).

To open and run the example, follow these steps.

#### Step 1: Open the example

In the Arduino IDE, go to `File -> Examples -> Adafruit SSD1306` and select `ssd1306_128x64_i2c`. You might have to scroll down in the `Examples` file menu to see it.

![](assets/images/ArduinoIDE_SelectingSSD1306ExampleFromFileMenu.png)

#### Step 2: Compile and upload the example

Now, compile and upload the example.

![](assets/images/ArduinoIDE_CompileAndUploadSSD1306Example.png)

#### Step 3: Watch the demo

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/AdafruitOLEDOfficialDemo0x3D-IMG_6160-Rotated-TrimmedAndSpedUp720p-Optimized.mp4" type="video/mp4" />
</video>

**Video** Running the demo [`ssd1306_128x64_i2c`](https://github.com/adafruit/Adafruit_SSD1306/blob/master/examples/ssd1306_128x64_i2c/ssd1306_128x64_i2c.ino). Parts of this video are sped up 4x.
{: .fs-1 }


## The Adafruit GFX Library

To provide a common API for drawing across all Adafruit LCD and OLED displays, Adafruit created a general-purpose graphics rendering library, called [Adafruit GFX](https://learn.adafruit.com/adafruit-gfx-graphics-library/overview). Put simply, rather than having to individually turn on/off LEDs in the OLED matrix—which would be tedious (though perhaps a useful learning exercise)—the Adafruit GFX library provides higher level drawing routines to do this for you, like drawing rectangles, circles, text, and bitmaps.

### Coordinate system and pixels

If you're familiar with graphics APIs in other programming frameworks—like C#'s [System.Drawing library](https://docs.microsoft.com/en-us/dotnet/api/system.drawing.graphics.drawline), [Processing's Java drawing library](https://processing.org/), [p5js' JavaScript drawing library](https://p5js.org/), *etc.*—the Adafruit GFX library works much the same.

The black-and-white OLED consists of a matrix of LEDS, called pixels, which can be individually addressed to turn on/off (or, in the case of colored displays, to control individual RGB LEDs to create colors). As with all other drawing libraries, the coordinate system for these pixels places the origin `(0,0)` at the top-left corner with the `x-axis` increasing to the right and the `y-axis` increasing down.  

![](assets/images/AdafruitOLEDDisplay_CoordinateSystemAndPixels_ByJonFroehlich.png)
**Figure** An overview of the 128x64 matrix of LEDs—we call each LED a "pixel". Image created in PowerPoint and uses images from Fritzing and the [Adafruit GFX](https://learn.adafruit.com/adafruit-gfx-graphics-library/coordinate-system-and-units) tutorial.
{: .fs-1 }

Thus, to turn "on" the LED at pixel `(18, 6)` using [Adafruit GFX](https://learn.adafruit.com/adafruit-gfx-graphics-library/overview), we would write: `drawPixel(18, 6, SSD1306_WHITE)`. For black-and-white displays, the last argument can be either `SSD1306_WHITE` to draw a white pixel or `SSD1306_BLACK` to draw a black pixel (these constants are defined in [Adafruit_SSD1306.h](https://github.com/adafruit/Adafruit_SSD1306/blob/master/Adafruit_SSD1306.h)). For color displays, you can instead pass in a unsigned 16-bit value representing RGB colors (see [docs](https://learn.adafruit.com/adafruit-gfx-graphics-library/coordinate-system-and-units)).

### Drawing subsystem

Below, we describe how to draw shapes, text, and bitmaps. Importantly, when you call any of the drawing routines—from `drawLine` to `drawTriangle`—you are **not** drawing directly to the OLED display. Instead, you are drawing to an offscreen buffer handled by the SSD1306 driver. So, after you call your drawing routines, you must then call the `void Adafruit_SSD1306::display()` function to push the data from RAM to the display.

### Drawing shapes

The Adafruit GFX library current supports drawing lines, rectangles, circles, rounded rectangles, and triangles. For all shapes, you can draw an outlined version (*e.g.,* `drawRect`) or a filled version (*e.g.,* `fillRect`).

| Shape and API call | Output |
|-------|:--------:| 
|**Lines**<br> `void drawLine(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint16_t color);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/268/large1024/lcds___displays_line.png) `drawLine(5, 10, 3, 19, SSD1306_WHITE)` |
|**Rectangles**<br>  `void drawRect(uint16_t x0, uint16_t y0, uint16_t w, uint16_t h, uint16_t color);` <br><br> `void fillRect(uint16_t x0, uint16_t y0, uint16_t w, uint16_t h, uint16_t color);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/270/large1024/lcds___displays_rect.png) `drawRect(3, 2, 13, 10, SSD1306_WHITE)` |
|**Circles**<br> `void drawCircle(uint16_t x0, uint16_t y0, uint16_t r, uint16_t color);` <br><br> `void fillCircle(uint16_t x0, uint16_t y0, uint16_t r, uint16_t color);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/272/large1024/lcds___displays_circle.png) `drawCircle(14, 8, 7, SSD1306_WHITE)` |
|**Rounded Rectangles**<br> `void drawRoundRect(uint16_t x0, uint16_t y0, uint16_t w, uint16_t h, uint16_t radius, uint16_t color);` <br><br> `void fillRoundRect(uint16_t x0, uint16_t y0, uint16_t w, uint16_t h, uint16_t radius, uint16_t color);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/274/large1024/lcds___displays_roundrect.png) `drawRoundRect(3, 1, 17, 12, 5, SSD1306_WHITE)` |
|**Triangles**<br> `void drawTriangle(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t color);` <br><br> `void fillTriangle(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2, uint16_t color);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/275/large1024/lcds___displays_triangle.png) `drawTriangle(6, 13, 9, 2, 18, 9, SSD1306_WHITE)` |

For more information and examples, see the [Basic Drawing section](https://lastminuteengineers.com/oled-display-arduino-tutorial/#arduino-code-basic-drawings) of Last Minute Engineer's OLED display tutorial.

### Drawing text

There are two methods to render text: drawing a single character with `drawChar` and using the `print` rendering subsystem, which mimics the familiar [`Serial.print()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) functionality, which we covered in our Intro to Arduino series [here](../arduino/serial-print.md).

#### Method 1: drawChar

To draw a single character, you specify a `(x, y)` location, the character, the foreground and background color, and a size. By default, characters are 5x8 pixels but an optional size parameter (the last argument) can be passed to scale the font (*e.g.,* a size of 2 will render 10x16 pixels per character).

| Text API call | Output |
|-------|:--------:| 
|**Char**<br> `void drawChar(uint16_t x, uint16_t y, char c, uint16_t color, uint16_t bg, uint8_t size);` | ![](https://cdn-learn.adafruit.com/assets/assets/000/001/276/large1024/lcds___displays_char.png) `drawChar(3, 4, 'A', SSD1306_WHITE, SSD1306_BLACK, 1)` |

#### Method 2: Print rendering

The more common and feature-rich method to draw text is via the `print` subsystem. Interestingly, the [Adafruit_GFX class](https://github.com/adafruit/Adafruit-GFX-Library/blob/master/Adafruit_GFX.h) actually extends the [Print class](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/Print.h) from the Arduino core library. Rather than call `Serial.print("Hello World")`, however, with the OLED display and Adafruit GFX library, you would call `oledDisplay.print("Hello World")`. Here, `oledDisplay` is the `Adafruit_SSD1306` object.

To use the OLED's print functionality, you can first set optional parameters such as the text color, size, and wrapping:

{% highlight C++ %}
void setTextColor(uint16_t color);
void setTextColor(uint16_t color, uint16_t backgroundcolor);
void setTextSize(uint8_t size);
void setTextWrap(boolean w);
{% endhighlight C++ %}

Then, to position the text, you set the print cursor with:
{% highlight C++ %}
void setCursor(uint16_t x0, uint16_t y0);
{% endhighlight C++ %}

Finally, to print the text at that cursor position, you can call any of the standard [`Serial.print`](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/Print.h) methods, including this subset:

{% highlight C++ %}
size_t print(const String &);
size_t print(const char[]);
size_t print(char);

size_t println(const String &s);
size_t println(const char[]);
size_t println(char);
{% endhighlight C++ %}

See the [Serial.print() docs](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) or the [Print.h](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/Print.h) library for more on the `print` API or read on for an example.

##### Centering text

In creative coding, visualization, and game dev, we often want to center or otherwise align text. To do so, we need to **measure** it. Fortunately, the [Adafruit GFX](https://github.com/adafruit/Adafruit-GFX-Library/blob/master/Adafruit_GFX.h) library has a method called `getTextBounds` that does just that!

{% highlight C++ %}
/**************************************************************************/
/*!
    @brief  Helper to determine size of a string with current font/size.
            Pass string and a cursor position, returns upper-left corner and width and height
    @param  str  The ASCII string to measure
    @param  x    The current cursor X
    @param  y    The current cursor Y
    @param  x1   The boundary X coordinate, returned by function
    @param  y1   The boundary Y coordinate, returned by function
    @param  w    The boundary width, returned by function
    @param  h    The boundary height, returned by function
*/
/**************************************************************************/
void getTextBounds(String &str, int16_t x, int16_t y, int16_t *x1, int16_t *y1, uint16_t *w, uint16_t *h);
{% endhighlight C++ %}

For example, in our [HelloWorld.ino](https://github.com/makeabilitylab/arduino/blob/master/OLED/HelloWorld/HelloWorld.ino) example, we center the text "Hello Makers!" both vertically and horizontally on the OLED screen. The key excerpt is here:

{% highlight C++ %}
int16_t x, y;
uint16_t textWidth, textHeight;
const char strHello[] = "Hello Makers!";

// Setup text rendering parameters
_display.setTextSize(1);
_display.setTextColor(WHITE, BLACK);

// Measure the text with those parameters. Pass x, y, textWidth, and textHeight
// by reference so that they are set within the function itself.
_display.getTextBounds(strHello, 0, 0, &x, &y, &textWidth, &textHeight);

// Center the text on the display
_display.setCursor(_display.width() / 2 - textWidth / 2, _display.height() / 2 - textHeight / 2);

// Print out the string
_display.print(strHello);

// Render the graphics buffer to screen
_display.display(); 
{% endhighlight C++ %}

##### Inverting text

We can also invert the text simply by switching the colors in `setTextColor(uint16_t color, uint16_t backgroundcolor)`. So, to draw black text on a white background, we would write `_display.setTextColor(BLACK, WHITE);`

| setTextColor(WHITE, BLACK) | setTextColor(BLACK, WHITE) |
|----------------------------|----------------------------|
| ![](assets/images/OLED_setTextColor_WhiteBlack.png) | ![](assets/images/OLED_setTextColor_BlackWhite.png) |

#### Loading custom fonts

In addition to the default fixed-size, mono-spaced font, you can also load and render an alternative font. See the ["Loading Fonts"](https://learn.adafruit.com/adafruit-gfx-graphics-library/using-fonts) section of the [Adafruit GFX tutorial](https://learn.adafruit.com/adafruit-gfx-graphics-library/overview). 

### Drawing bitmaps

Finally, you can load and render custom bitmaps on the display. See ["Displaying Bitmaps"](https://lastminuteengineers.com/oled-display-arduino-tutorial/#arduino-code-displaying-bitmap) on Last Minute Engineers.

### Resources

Before moving forward, we strongly encourage you to read the official [Adafruit GFX](https://learn.adafruit.com/adafruit-gfx-graphics-library/graphics-primitives) tutorial and the "Last Minute Engineers" [OLED tutorial](https://lastminuteengineers.com/oled-display-arduino-tutorial/)—both offer great overviews of the Adafruit GFX library and how to [display text](https://lastminuteengineers.com/oled-display-arduino-tutorial/#arduino-code-displaying-text), [draw shapes](https://lastminuteengineers.com/oled-display-arduino-tutorial/#arduino-code-basic-drawings), and [load and display bitmaps](https://lastminuteengineers.com/oled-display-arduino-tutorial/#arduino-code-displaying-bitmap). 

In addition, you can:

- View the Adafruit GFX library source code [here](https://github.com/adafruit/Adafruit-GFX-Library), including the [Adafruit_GFX.h](https://github.com/adafruit/Adafruit-GFX-Library/blob/master/Adafruit_GFX.h), which shows the available API. Yes, depending on your familiarity with C++ and reading .h files, this might be intimidating or overwhelming—but it's important to demystify these libraries. They are just source code that devs wrote. And, with experience, you could too!

- Examine our own OLED examples [here](https://github.com/makeabilitylab/arduino/tree/master/OLED), including the [Hello World](https://github.com/makeabilitylab/arduino/blob/master/OLED/HelloWorld/HelloWorld.ino) example mentioned above, a simple animation example called [BallBounce](https://github.com/makeabilitylab/arduino/blob/master/OLED/BallBounce/BallBounce.ino), an [object-oriented version](https://github.com/makeabilitylab/arduino/blob/master/OLED/BallBounceObjectOriented/BallBounceObjectOriented.ino) of this animation using the [Shape.hpp](https://github.com/makeabilitylab/arduino/blob/master/MakeabilityLab_Arduino_Library/src/Shape.hpp) class from the [Makeability Lab Arduino library](https://github.com/makeabilitylab/arduino/tree/master/MakeabilityLab_Arduino_Library), and simple games such as a [collision test](https://github.com/makeabilitylab/arduino/blob/master/OLED/CollisionTest/CollisionTest.ino), [Pong](https://github.com/makeabilitylab/arduino/blob/master/OLED/Pong/Pong.ino), and [Flappy Bird](https://github.com/makeabilitylab/arduino/blob/master/OLED/FlappyBird/FlappyBird.ino).

## Let's make stuff!

In this part of the lesson, we are going to make a variety of OLED-based creations. Most of the source code that we reference is [here](https://github.com/makeabilitylab/arduino/tree/master/OLED).

### Activity: draw shapes and text

First, to get a feel for and experience with the Adafruit GFX API and the coordinate system, let's simply draw some text and shapes to the screen.

Remember, in `loop()`, you need to:

{% highlight C++ %}
// Clear the display
_display.clearDisplay();

// Put in drawing routines
drawStuff();

// Render graphics buffer to screen
_display.display();
{% endhighlight C++ %}

I made a version, [called SimpleDrawingDemo.ino](https://github.com/makeabilitylab/arduino/blob/master/OLED/SimpleDrawingDemo/SimpleDrawingDemo.ino) that draws shapes of random sizes and locations on **each frame** but you could do something even simpler (or more complex)!

#### Prototyping journals

For your prototyping journals, create your own drawing playground demo, record a short video or animated gif, link to the code, and reflect on what you learned.

### Activity: draw a bouncing ball

For this activity, we will learn a bit about animation. We are going to draw a simple bouncing ball around the screen. Bouncing or reflecting objects are one of the key components of many games, including [Pong](https://github.com/makeabilitylab/arduino/blob/master/OLED/Pong/Pong.ino), [Arkanoid](https://en.wikipedia.org/wiki/Arkanoid), *etc.*.

To create a bouncing ball, we need to:
- Track the x,y location of the ball across frames
- Set a x,y speed in pixels per frame—that is, how much the does the ball move per frame? For smoother animation, we could track x,y speed in terms of time; however, this is slightly more complicated (*e.g.,* it requires tracking timestamps in the code, computing time deltas, *etc.*). For our purposes, tracking x,y speed in terms of pixels/frame is fine.
- Check for **collisions** when the ball collides with the ceiling, floor, or walls of the screen. When a collision occurs, simply reverse the direction of the ball.

Here's a [demo of a bouncing ball](https://makeabilitylab.github.io/p5js/Animation/BallBounce2D/) we made in [p5js](https://p5js.org/). Sometimes, it's useful to prototype a visualization or game idea in a rapid programming environment like [p5js](https://p5js.org/) or [Processing](https://processing.org/) before coding it up in C++ for Arduino (and it's easier to debug in those environments as well). In this case, we had already created a bouncing ball demo in the past but linking it here allows you to draw parallels between the two implementations. You can edit and play with this demo in your browser [here](https://editor.p5js.org/jonfroehlich/sketches/KpUirYrAk) using the p5js online editor.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/BallBouncing_p5js.mp4" type="video/mp4" />
</video>

**Video** A video of the Ball Bounce demo created in p5js. You can edit the source code and run it live in the p5js online editor [here](https://editor.p5js.org/jonfroehlich/sketches/KpUirYrAk) or [view the source](https://github.com/makeabilitylab/p5js/blob/master/Animation/BallBounce2D/sketch.js) in our [p5js GitHub repo](https://github.com/makeabilitylab/p5js).
{: .fs-1 }

For the C++ implementation using the Adafruit GFX library and Arduino, the key code is:

{% highlight C++ %}

// Create the display object
Adafruit_SSD1306 _display(128, 64, &Wire, 4);

// Ball global variables
const int _ballRadius = 5;
int _xBall = 0;
int _yBall = 0;
int _xSpeed = 0;
int _ySpeed = 0;

void setup() {
  // Initialize the display
  _display.begin(SSD1306_SWITCHCAPVCC, 0x3D)

  // Gets a random long between min and max - 1
  // https://www.arduino.cc/reference/en/language/functions/random-numbers/random/
  _xSpeed = random(1, 4);
  _ySpeed = random(1, 4);
}

void loop() {
  // Clear the display
  _display.clearDisplay();
  
  // Update ball based on speed location
  _xBall += _xSpeed;
  _yBall += _ySpeed;

  // Check for ball bounce. First check for going off left or right side of screen
  if(_xBall - _ballRadius <= 0 || _xBall + _ballRadius >= _display.width()){
    _xSpeed = _xSpeed * -1; // reverse x direction
  }
  
  // Now check for bouncing on floor or ceiling
  if(_yBall - _ballRadius <= 0 || _yBall + _ballRadius >= _display.height()){
    _ySpeed = _ySpeed * -1; // reverse y direction
  }

  // Draw circle
  _display.drawCircle(_xBall, _yBall, _ballRadius, SSD1306_WHITE);
  
  // Render buffer to screen
  _display.display();
}
{% endhighlight C++ %}

You can find the full code, called [BallBounce.ino](https://github.com/makeabilitylab/arduino/blob/master/OLED/BallBounce/BallBounce.ino), [here](https://github.com/makeabilitylab/arduino/blob/master/OLED/BallBounce/BallBounce.ino). We also have a similar "bounce" demo, called [BitmapBounce.ino](https://github.com/makeabilitylab/arduino/blob/master/OLED/BitmapBounce/BitmapBounce.ino), that uses a bitmap rather than a graphic primitive. 

<!-- TODO: add video of ballbounce.ino and bitmapbounce.ino -->

#### Prototyping journals

For your prototyping journals, create your animation demo, record a short video or animated gif, link to the code, and reflect on what you learned. As one simple example, change the object bouncing around from a circle to a rectangle. If you want something more challenging, try bouncing a triangle around the screen and using the entry angle and triangle angles to calculate the reflection. Or you could use the `drawLine` method to animate rain fall similar to this [Purple Rain video](https://youtu.be/KkyIDI6rQJI) by the [Coding Train](https://thecodingtrain.com/). While this was made for p5js, it would fairly straightforward to translate to Arduino and the Adafruit GFX library.

<!-- TODO: add interaction -->
<!-- ### Adding interaction

- Draw analog input value centered
- Ball that changes size depending on analog input
- Switch to FSR -->

<!-- 
Activity outline:

- Animation with ball
- Ball that changes speed depending on analog input
- Switch to FSR

- Make analog input line graph visualization
- Link to scrolling version of analog graph

- Advanced OLED
- Where do we talk about using the Makeability_Lab_Library and drawing methods?
- Multiple i2c devices: accel + OLED
- Multiple OLED displays

- POSSIBLE TODO: hook up multiple OLED displays
  - You can hook up multiple OLED displays. But each will need a different address. By default, the address is 0x3D (show picture of back). The Adafruit breakout board makes it easy to set the address to 0x3C simply by tying `SA0` to `GND`.
  - Show ball bounce two screens? -->

## Resources

### OLED

- [OLED Display Arduino Tutorial](https://lastminuteengineers.com/oled-display-arduino-tutorial/), Last Minute Engineers

- [Monochrome OLED Breakouts](https://learn.adafruit.com/monochrome-oled-breakouts), Adafruit

- [Adafruit_GFX Library](https://learn.adafruit.com/adafruit-gfx-graphics-library/overview), Adafruit

### Serial communication protocols

- [I2C](https://learn.sparkfun.com/tutorials/i2c/all), Sparkfun.com

- [SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi), Sparkfun.com

<!-- ## Next lesson

In the next lesson, we TODO -->