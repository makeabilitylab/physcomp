---
layout: default
title: L4&#58; Bidirectional Serial
nav_order: 4
parent: Communication
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

OK, now we're really rolling! We learned about [serial communication](serial-intro.md), then how to use serial in our browsers ([web serial!](web-serial.md)), and then how to do this with [p5.js](p5js-serial.md). And we've already made some cool proof-of-concept demos.

Let's take this growing knowledge and momentum to create slightly more sophisticated programs. First, we'll cover the case of using p5.js to control something on our Arduino (`Computer → Arduino`) then we'll introduce bidirectional communication (`Computer ↔ Arduino`) where the computer + Arduino work together to create a holistic interactive experience.

## p5.js to Arduino

To begin, we'll build a simple p5.js demo app that draws and resizes a selected shape (a circle, triangle, or rectangle) based on the mouse's x position and sends this shape data as a text-encoded comma-separated string over web serial: (`"shapeType, shapeSize"`). On the Arduino side, we'll parse this string and draw the current shape and size on the OLED. Because the p5.js canvas size and the OLED screen size do not match, we'll use a normalized size value between [0,1] where 0 is the smallest size and 1 is the maximum size. Shape type is encoded as 0 for circle, 1 for square, and 2 for rectangle.

Here's a small sneak preview of what the final interactive experience will look like.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/DisplayShapeIn.ino-DisplayShapeOut-Trimmed-Optimized.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of the p5.js app DisplayShapeOut (live page, code) and Arduino sketch DisplayShapeIn.ino. The p5.js app sends a `shapeType` and a `shapeSize` as a comma-separated text string to Arduino via web serial. The DisplayShapeIn.ino program parses this text and draws a shape with the appropriate size to the OLED. I did not use my regular recording setup for this because OBS Studio + my document camera have a noticeable lag. See this video. TODO add in that video.
{: .fs-1 }

TODO: add links to DisplayShapeOut above

### Creating DisplayShapeOut in p5.js

As with our [previous lesson](p5js-serial.md), we'll begin with our [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate). If you're using VSCode, copy [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) and rename the folder to `DisplayShapeOut`. If you're using the p5.js online editor, simply open this project, [Serial Template](https://editor.p5js.org/jonfroehlich/sketches/vPfUvLze_C), and rename your project to `DisplayShapeOut`.

#### Overview of DisplayShapeOut functionality

Let's go over some of DisplayShapeOut's primary functionality. We want the user to:

- **Select a current shape (circle, triangle, or rectangle)**. We'll do this by enumerating through them in order via a mouse press action

- **Change the size of the shape**. We'll do this by tracking the mouse's x position and mapping it to size

- **Send shape data over serial.** Each time either the current shape or size changes, we need to send an update over serial. We'll do this using [our web serial class](web-serial.md#our-web-serial-class)

#### Draw and dynamically resize shape

We'll build this up piece-by-piece. First, we'll focus on the p5.js shape drawing code and then add in web serial. Let's start by supporting a single shape type and adding in the resizing via x mouse position (similar to [this part of our previous lesson](p5js-serial.md#make-circle-dynamically-sized)).

Add in the following top-level variables:

{% highlight JavaScript %}
const MIN_SHAPE_SIZE = 10;   // minimum shape size in pixels
const MAX_SHAPE_MARGIN = 10; // when shape is at max size, the margin to edge of canvas
let maxShapeSize = -1;       // the maximum shape size
let curShapeSize = 10;       // the current shape size
{% endhighlight JavaScript %}

We use the prefix [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) to indicate read-only variables and [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) for block-scoped variables that change.

Now initialize the `maxShapeSize` based on the canvas width/height in `setup()`:

{% highlight JavaScript %}
function setup(){
  ...
  maxShapeSize = min(width, height) - MAX_SHAPE_MARGIN;
  ...
}
{% endhighlight JavaScript %}

Now we need to update the `draw()` function to actually draw our shape (a circle, for now).

{% highlight JavaScript %}
function draw() {
  background(100);

  fill(250);
  noStroke();
  const xCenter = width / 2;
  const yCenter = height / 2;
  circle(xCenter, yCenter, curShapeSize);
}
{% endhighlight JavaScript %}

Finally, we need to change `curShapeSize` based on the x position of the mouse:

{% highlight JavaScript %}
function mouseMoved(){
  curShapeSize = map(mouseX, 0, width, MIN_SHAPE_SIZE, maxShapeSize);

  // mouseMoved() is called even when mouse not directly over our canvas
  // so make sure to constrain to just the min,max size. If you don't do this
  // your circle may grow larger than you expect. Try it out!
  curShapeSize = constrain(curShapeSize, MIN_SHAPE_SIZE, maxShapeSize);
}
{% endhighlight JavaScript %}

That's it! We made an initial interactive shape drawer. Save your work and try it out with VSCode's [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or simply hit the `play` button in the p5.js editor.

Here's [a live demo](https://editor.p5js.org/jonfroehlich/sketches/qh-E0BRaR) from the p5.js online editor:

<iframe width="736" height="400" scrolling="no" src="https://editor.p5js.org/jonfroehlich/embed/qh-E0BRaR"></iframe>
**Code.** The initial code skeleton for interactively sizing a shape based on the mouse's x position. You can view, edit, and play with the code [here](https://editor.p5js.org/jonfroehlich/sketches/qh-E0BRaR).
{: .fs-1 }

#### Add in support for multiple shapes

Now, let's add in support for rendering more shapes: the square and triangle. We need a variable to track the current shape type and a method for the user to switch between shapes:

To track the current shape type, we'll use a JavaScript [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)—a flexible, foundational [data type in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures). Anything that is not a[primitive data type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#data_and_structure_types) in JavaScript—*e.g.,* things that are not a [String](https://developer.mozilla.org/en-US/docs/Glossary/String), [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean), [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number), *etc.*—is a JavaScript [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object). In this case, we'll simply treat this Object as a key/value store, so let's call it `mapShapeTypeToShapeName` where the variable indicates "mapping" a shape type (0, 1, 2) to a shape name (circle, square, triangle). And we'll track the current shape type via `curShapeType`.

{% highlight JavaScript %}
const mapShapeTypeToShapeName = {
  0: "Circle",
  1: "Square",
  2: "Triangle"
};

let curShapeType = 0;        // track current shape type
{% endhighlight JavaScript %}

So, `mapShapeTypeToShapeName` defines the three shapes and their key/value relationship and `curShapeType` tracks the current shape as 0 (for circle), 1 (for square), and 2 (for triangle).

For selecting the shape type, there are many possibilities—we could draw small iconic representations of a circle, square, and triangle and switch shape types when these are clicked (like buttons). But we'll do something even simpler: increment `curShapeType` on each mouse click.

{% highlight JavaScript %}
function mouseClicked() {
  curShapeType++;
  if(curShapeType >= Object.keys(mapShapeTypeToShapeName).length){
    curShapeType = 0;
  }

  // Your template may have also had this code in mouseClicked()
  // Comment out for now.
  //if (!serial.isOpen()) {
  //  serial.connectAndOpen(null, serialOptions);
  //}
}
{% endhighlight JavaScript %}

Finally, we need to update our `draw()` function to draw the three shape types:
{% highlight JavaScript %}
function draw() {
  background(100);
  fill(250);
  noStroke();
  const xCenter = width / 2;
  const yCenter = height / 2;
  const halfShapeSize = curShapeSize / 2;

  switch(curShapeType){
    case 0: // draw circle
      circle(xCenter, yCenter, curShapeSize);
      break;
    case 1: // draw square
      rectMode(CENTER);  // See: https://p5js.org/reference/#/p5/rectMode
      square(xCenter, yCenter, curShapeSize);
      break;
    case 2: // draw triangle
      let x1 = xCenter - halfShapeSize;
      let y1 = yCenter + halfShapeSize;

      let x2 = xCenter;
      let y2 = yCenter - halfShapeSize;

      let x3 = xCenter + halfShapeSize;
      let y3 = y1;
     
      triangle(x1, y1, x2, y2, x3, y3)
  }
}
{% endhighlight JavaScript %}

For user friendliness, let's drop in some instructions as well. At the end of the draw() function, display some text that says "Mouse click to change the shape":

{% highlight JavaScript %}
function draw() {
  ...

  // Some instructions to the user
  noStroke();
  fill(255);
  const tSize = 14; // text size
  const strInstructions = "Mouse click to change the shape";
  textSize(tSize);
  let tWidth = textWidth(strInstructions);
  const xText = width / 2 - tWidth / 2;
  text(strInstructions, xText, height - tSize + 6);
}
{% endhighlight JavaScript %}

Alright, we did it! Now check out your work by loading it with Live Server or in the p5.js online editor. Here's [a live demo](https://editor.p5js.org/jonfroehlich/sketches/v3xWP3Np1):

<iframe width="736" height="400" scrolling="no" src="https://editor.p5js.org/jonfroehlich/embed/v3xWP3Np1"></iframe>
**Code.** Changing shapes by mouse clicking. Code [here](https://editor.p5js.org/jonfroehlich/sketches/v3xWP3Np1).
{: .fs-1 }

#### Add in web serial output

Finally, the last piece is to output shape type and shape size via web serial. To limit needless serial writes, we'll track the last shape type and size and only send out new data when these values have changed.

First, let's add a serial write function called `serialWriteShapeData(shapeType, shapeSize)`, which takes in a shape type and shape size and outputs them over web serial.

{% highlight JavaScript %}
async function serialWriteShapeData(shapeType, shapeSize) {
  if (serial.isOpen()) {
    // Convert the shape size into a fraction between [0, 1] inclusive
    let shapeSizeFraction = (shapeSize - MIN_SHAPE_SIZE) / (maxShapeSize - MIN_SHAPE_SIZE);

    // Format the text string to send over serial. nf simply formats the floating point
    // See: https://p5js.org/reference/#/p5/nf
    let strData = shapeType + ", " + nf(shapeSizeFraction, 1, 2);
    serial.writeLine(strData);
  }
}
{% endhighlight JavaScript %}

Notably, we convert the shape size, which is in pixels, to a normalized value between [0, 1] called `shapeSizeFraction`—this is what we'll transmit over serial and interpret on the Arduino side.

Now, let's update the `mouseClicked()` function to handle opening and connecting with web serial or, if a connection has been made, to increment `curShapeType` and send that new data over serial by calling our new `serialWriteShapeData()` function.

{% highlight JavaScript %}
function mouseClicked() {
  if (!serial.isOpen()) {
    // If the serial connection is not opened, begin open/connect sequence
    serial.connectAndOpen(null, serialOptions);
  }else{
    // Otherwise, increment shape type
    curShapeType++;
    if(curShapeType >= Object.keys(mapShapeTypeToShapeName).length){
      curShapeType = 0;
    }

    serialWriteShapeData(curShapeType, curShapeSize);
  }
}
{% endhighlight JavaScript %}

Let's also update the instructions to the user so they know that mouse clicking is state dependent:

{% highlight JavaScript %}
function draw(){
  ...
  // Some instructions to the user
  noStroke();
  fill(255);
  const tSize = 14;
  let strInstructions = "";
  if(serial.isOpen()){
    strInstructions = "Mouse click anywhere to change the shape";
  }else{
    strInstructions = "Click anywhere to connect with serial"
  }
  textSize(tSize);
  let tWidth = textWidth(strInstructions);
  const xText = width / 2 - tWidth / 2;
  text(strInstructions, xText, height - tSize + 6);
}
{% endhighlight JavaScript %}

Finally, we need to update the `mouseMoved()` method to call `serialWriteShapeData()` on a new shape size:

{% highlight JavaScript %}
function mouseMoved(){
  let lastShapeSize = curShapeSize;
  curShapeSize = map(mouseX, 0, width, MIN_SHAPE_SIZE, maxShapeSize);
  curShapeSize = constrain(curShapeSize, MIN_SHAPE_SIZE, maxShapeSize);
  
  if(lastShapeSize != curShapeSize){
    serialWriteShapeData(curShapeType, curShapeSize);
  }
}
{% endhighlight JavaScript %}

And we're done with the p5.js app! You can view, edit, play with the code in the [p5.js online editor ](https://editor.p5js.org/jonfroehlich/sketches/TfE1BjOX6) or from our GitHub ([live page](https://makeabilitylab.github.io/p5js/WebSerial/p5js/DisplayShapeOut/), [code](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/DisplayShapeOut)).

<!-- TODO: consider right clicking to disconnect? Then we could embed this full thing into the bidirectional serial webpage? But might get confusing if we have multiple examples on one page -->

### Arduino

When you're writing your own `Computer ↔ Arduino` apps, you'll want to co-design them together. At the very least, you need to determine how the two apps (p5.s and Arduino) will communicate over serial and the format of the text-encoded strings. You could start implementing your design either in p5.js or Arduino—and you'll likely iterate between them as you co-create both. Obviously, with the [DisplayShapeOut](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/DisplayShapeOut) example above, we started with p5.js.

On the Arduino side, you might begin simply by echo'ing the incoming data back on serial. Remember, you **cannot** use the Arduino IDE's [Serial Monitor](../arduino/serial-print.md) once your p5.js app connects with your Arduino over serial. So, instead, we need to program the p5.js app to read the incoming serial data and print it out. Essentially, serve as a web-based Serial Monitor program. Luckily, our p5.js [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) code already does that. In the template, we simply have:

{% highlight JavaScript %}
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  pHtmlMsg.html("onSerialDataReceived: " + newData);
}
{% endhighlight JavaScript %}

Which prints incoming data sent by Arduino to console and also updates the handy `pHtmlMsg` HTML element so you can see the info on your webpage (you could comment this out, of course).

So, the simplest Arduino program to start with could be something like:

{% highlight C++ %}
const long BAUD_RATE = 115200;
void setup() {
  Serial.begin(BAUD_RATE);
}

void loop() {
  // Check to see if there is any incoming serial data
  if(Serial.available() > 0){
    // Echo the data back on serial (for debugging purposes)
    Serial.print("Arduino Received: '");
    Serial.print(rcvdSerialData);
    Serial.println("'");
  }
}
{% endhighlight C++ %}

**Code.** Simple serial echo back program for Arduino ([EchoBackSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/EchoBackSerialIn/EchoBackSerialIn.ino) on GitHub).
{: .fs-1 }

It's important that you understand this "echo" technique and the fact that you can no longer use Serial Monitor for debugging (at least not in the same way [as before](../arduino/serial-print.md)) because only one program can open and use a serial port at a time (which will be your p5.js app).

Another debugging strategy is to use your [OLED](../advancedio/oled.md) displays—these are actually hugely advantageous for displaying intermediate debugging information as you create and iterate. You can then remove this debug printouts as your app progresses.

Finally, as you build out both apps, perhaps the most important strategy is to modularize and test, modularize and test, modularize and test. Build up your apps in pieces and test them each step of the way!

With that, let's begin making on the Arduino side!

#### A simple OLED circuit

TODO: make circuit

#### Writing the DisplayShapeSerialIn on Arduino

There are infinite possibilities for designing an interactive Arduino app that reads in `"shapeType, shapeSize"` off serial and does something interesting. For example, you could use this info to set the paddle size and ball type (circle, square, triangle) in an OLED-based [Breakout game](https://en.wikipedia.org/wiki/Breakout_(video_game)). For now, though, let's simple replicate the p5.js app visual experience on the Arduino. This might sound hard but you're [OLED](../advancedio/oled.md) experts by now—you got this!

#### Start with echo back

Let's begin by using that echo-back Arduino program [EchoBackSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/EchoBackSerialIn/EchoBackSerialIn.ino). This will ensure that we can properly connect with our p5.js app, listen for serial, echo back that data from serial, and display it in our p5.js app.

TODO: need video

#### Add in OLED and debug printlns

Now, let's add in the OLED and print out some debugging information. Add the following OLED-required declarations at the top:

{% highlight C++ %}
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 _display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
{% endhighlight C++ %}

In `setup()`, initialize the OLED and print out a "Waiting for serial..." message:

{% highlight C++ %}
const long BAUD_RATE = 115200;
void setup() {
  Serial.begin(BAUD_RATE);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!_display.begin(SSD1306_SWITCHCAPVCC, 0x3D)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  _display.clearDisplay();
  _display.setTextSize(1);      // Normal 1:1 pixel scale
  _display.setTextColor(SSD1306_WHITE); // Draw white text
  _display.setCursor(0, 0);     // Start at top-left corner
  _display.print("Waiting to receive\ndata from serial...");
  _display.println("\n");
  _display.print("Baud rate:");
  _display.print(BAUD_RATE);
  _display.print(" bps");
  _display.display();
}
{% endhighlight C++ %}

Now, in `loop()`, add in the OLED-based debug printouts, which complement the serial-based echo backs:

{% highlight C++ %}
void loop() {
  // Check to see if there is any incoming serial data
  if(Serial.available() > 0){
    // If we're here, then serial data has been received
    // Read data off the serial port until we get to the endline delimeter ('\n')
    // Store all of this data into a string
    String rcvdSerialData = Serial.readStringUntil('\n'); 

    // Display data on OLED for debugging purposes
    _display.clearDisplay();
    _display.setCursor(0, 0);
    _display.setTextSize(1);
    _display.println("RECEIVED:\n");
    _display.setTextSize(3);
    _display.println(rcvdSerialData);
    _display.display();

    // Echo the data back on serial (for debugging purposes)
    Serial.print("Arduino Received: '");
    Serial.print(rcvdSerialData);
    Serial.println("'");
  }
}
{% endhighlight C++ %}

Here's a video demo with the full DisplayShapeOut p5.js app (([live page](https://makeabilitylab.github.io/p5js/WebSerial/p5js/DisplayShapeOut/), [code](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/DisplayShapeOut)) running with an intermediate version of [DisplayShapeSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/DisplayShapeSerialIn-Intermediate1/DisplayShapeSerialIn-Intermediate1.ino).

TODO: insert video.

**Video.** Running the p5.js app DisplayShapeOut (([live page](https://makeabilitylab.github.io/p5js/WebSerial/p5js/DisplayShapeOut/), [code](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/DisplayShapeOut)) with an intermediate version of [DisplayShapeSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/DisplayShapeSerialIn-Intermediate1/DisplayShapeSerialIn-Intermediate1.ino)
{: fs.-1 }

#### Parse serial data and update OLED debug output

So far, so good. But now we actually need to **parse** the incoming serial text data into useful typed variables. Let's do that and update our OLED-based debug output.

#### Write drawing code

Now, let's pivot our focus from reading and parsing serial input to writing our OLED-based drawing code. Update the code inside of `if(Serial.available() > 0)` in `loop()`:

{% highlight C++ %}
String rcvdSerialData = Serial.readStringUntil('\n'); 

// Parse out the comma separated string
int indexOfComma = rcvdSerialData.indexOf(',');
if(indexOfComma != -1){
  String strShapeType = rcvdSerialData.substring(0, indexOfComma);
  int shapeType = strShapeType.toInt();

  String strShapeSize = rcvdSerialData.substring(indexOfComma + 1, rcvdSerialData.length());
  float curShapeSizeFraction = strShapeSize.toFloat();

  // Display data for debugging purposes
  _display.clearDisplay();
  _display.setCursor(0, 0);
  _display.println("RECEIVED:");
  _display.println(rcvdSerialData);
  _display.println("\nPARSED:");
  _display.print("Shape Type: ");
  _display.println(shapeType);
  _display.print("Shape Size: ");
  _display.print(curShapeSizeFraction);
  _display.display();
} 
{% endhighlight C++ %}

- TODO: show what happens when you use Serial Monitor and send ill-formed data. Also let's you easily test edge cases, etc. Show video of this.
- TODO: emphasize that we can test with serial monitor. Show video.

<!-- Show simple Computer to Arduino output
 -->

<!-- - Show computer communicating with Arduino
- Show simple bidirectional communication
- Make a simple drawing app
  -- First, two potentiometers as input. Now, let's switch these to accel
  -- Then, we can control the size of the brush with FSR
  ---- When not pressed, show as a crosshair or something
  -- Control "clearing" the display with a button
  -- Control color with color sensor

Another example:
 - One example could be using p5.js sound input to make either a FFT or just magnitude OLED output -->