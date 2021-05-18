---
layout: default
title: L2&#58; Web Serial
nav_order: 2
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

In our [previous lesson](serial-intro.md) we dove deeper into asynchronous serial communication, Arduino's [Serial functionality](https://www.arduino.cc/reference/en/language/functions/communication/serial/), and how we can write computer programs, like [serial_demo.py](https://github.com/makeabilitylab/arduino/blob/master/Python/Serial/serial_demo.py), to bidirectionally communicate with Arduino.

In this lesson, we will apply our growing serial knowledge to a new context: the web! Now, it may seem a bit weird to use a web browser to communicate with a locally connected device. But, if you think about it, we actually do this all the time using video chat in our web browsers: the w3c [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) provides regulated access to media input devices like cameras and microphones.

More recently, the w3c spec'd out an API for securely providing access to Universal Serial Bus (USB) devices from web pages called [WebUSB](https://wicg.github.io/webusb/#security-and-privacy). Just like the [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices), security and privacy is paramount. Web pages requesting access to local USB devices must seek explicit user permission, which is handled through the web browser. Chrome added support for WebUSB in late 2017.

However, WebUSB did not include support for USB-to-serial devices like Arduino. Thus, the [Web Serial API](https://wicg.github.io/serial/) was proposed and launched in Chrome 89 (in March 2021). This is what we will be using for the next few lessons.

## Why Web Serial?

While we've previously taught computer-Arduino serial communication using [Processing](https://processing.org/) and [Python](https://www.python.org/), using Web Serial let's us combine Arduino with a creative, fast-changing context: the Web. Web Serial also lets us utilize all of the wonderful web-based tools and APIs like [p5js](https://p5js.org/), [ml5js](https://ml5js.org/), [paper.js](http://paperjs.org/), [three.js](https://threejs.org/), [matter.js](https://brm.io/matter-js/), and more!

Of course, if your Arduino board has built-in WiFi, you can communicate directly with web servers (as we explore a bit in the [ESP32 IoT lesson](../esp32/iot.md)); however, in this case, we assume either a tethered connection via serial over USB or a local wireless connection via serial over Bluetooth.

Much of what we do with Web Serial could be translated to a WiFi context. 

## The Web Serial API

In the words of [François Beaufort](https://web.dev/serial/), the Web Serial API:

> bridges the web and the physical world by allowing websites to communicate with serial devices, such as microcontrollers and 3D printers
{: .fs-3 }

Web Serial is already being used in web tools like [Microsoft's MakeCode](https://makecode.adafruit.com/), which lets you program microcontrollers via a drag-and-drop visual programming language and [Arduino's Web Editor](https://create.arduino.cc/editor), which lets you write code from the browser, store work in the cloud, and upload sketches directly from the web.

### Does my web browser support Web Serial?

From what I can tell at the time of  writing (May 2021), **Chrome version 89+** is the only browser to support Web Serial but more should be coming soon! To check if the Web Serial API is supported, open your dev tool console on your web browser (on Windows, type `ctrl-shift-i` in Chrome or Firefox; on Mac, type `cmd-alt-i`).

{% highlight JavaScript %}
> "serial" in navigator
true
{% endhighlight JavaScript %}

### How to use the Web Serial API

[François Beaufort](https://web.dev/serial/) provides a nice overview of how to use the Web Serial API. Please read [their website](https://web.dev/serial/) for detailed information.

But, in short. The Web Serial API is asynchronous and event based. This prevents websites from blocking when awaiting input from Web Serial.

#### Requesting permission to communicate with a serial device

To open a serial port, we must first request a port. For security, this call is managed by the browser and pops-up a dialog box asking the user to select a serial port and grant the website permission. Code based on François Beaufort's [blog post](https://web.dev/serial/).

{% highlight JavaScript %}
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();
{% endhighlight JavaScript %}

The [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword waits for the asynchronous `requestPort()` function to return.

Similar to [iPython](https://ipython.org/), one amazing feature of JavaScript is that we can dynamically program it in the developer console and even interact with the current website's variables, *etc.*

So, you can try the above command yourself. In the browser's dev tool console, type:

{% highlight JavaScript %}
> await navigator.serial.requestPort();
{% endhighlight JavaScript %}

If your Arduino is plugged in, you should see something like this:

![](assets/images/WebBrowserSerialDevicePermissionPrompt.png)
**Figure.** If I type `navigator.serial.requestPort()` into Chrome's dev console with my Arduino Leonardo plugged into my laptop's USB, I receive the prompt shown above.
{: .fs-1 }

#### Opening the serial port

To open the serial port, we call `port.open(SerialOptions)`. [SerialOptions](https://reillyeon.github.io/serial/#dom-serialoptions) is a dictionary with serial option parameters defined as:

{% highlight JavaScript %}
dictionary SerialOptions {
  required [EnforceRange] unsigned long baudRate;
  [EnforceRange] octet dataBits = 8;
  [EnforceRange] octet stopBits = 1;
  ParityType parity = "none";
  [EnforceRange] unsigned long bufferSize = 255;
  FlowControlType flowControl = "none";
};
{% endhighlight JavaScript %}

These options should look familiar. We have:
- `baudRate`: the only **required** option that must be an integer value like 9600 or 115200
- `dataBits`: The number of data bits per frame (either 7 or 8).
- `stopBits`: The number of stop bits at the end of a frame (either 1 or 2).
- `parity`: The parity mode (either "none", "even" or "odd").
- `bufferSize`: The size of the read and write buffers that should be created (must be less than 16MB).
- `flowControl`: The flow control mode (either "none" or "hardware").

So, to open a port with 9600 baud, we would write:

{% highlight JavaScript %}
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();

// Wait for the serial port to open.
await port.open({ baudRate: 9600 });
{% endhighlight JavaScript %}

#### Writing data

To write binary data, we use `getWriter()` and `write()`. We must call `releaseLock()` in order for the serial port to be closed later.

{% highlight JavaScript %}
const writer = port.writable.getWriter();

// Writing the ASCII values for the world 'h', 'e', 'l', 'l', 'o'
// as binary data
const data = new Uint8Array([104, 101, 108, 108, 111]);
await writer.write(data);

// Allow the serial port to be closed later.
writer.releaseLock();
{% endhighlight JavaScript %}

For text data, we use a `TextEncoderStream`:

{% highlight JavaScript %}
const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

const writer = textEncoder.writable.getWriter();

await writer.write("hello");

// Allow the serial port to be closed later.
writer.releaseLock();
{% endhighlight JavaScript %}

#### Reading data

Reading data is similar. We use `getReader()` and the `read()` methods. We'll describe the text reading solution below. You can learn about binary reading [here](https://web.dev/serial/#read-port).

{% highlight JavaScript %}
const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a string.
  console.log(value);
}
{% endhighlight JavaScript %}

## Our Web Serial class

To make it easier to work with Web Serial, we wrote a basic Web Serial JavaScript class called [`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js). 

To use our Web Serial class, you can clone our [p5js repo](https://github.com/makeabilitylab/p5js) and include `serial.js` from `_libraries/serial.js` or use the [jsDelivr](https://www.jsdelivr.com/) service, which turns any GitHub repo into a CDN and directly serves `serial.js` from our GitHub repo. 

For the latter, in the `<head>` or `<body>` of your html file, simply add:

{% highlight HTML %}
<script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>
{% endhighlight HTML %}

Currently, [`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js) supports just reading/writing text data (rather than binary data) but that shouldn't affect us!

### Event-based functions

[`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js) uses an event-based architecture with callback functions, which is common in web and UI programming (see: Mozilla's [Introduction to Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)). The Serial class has four events, which correspond to the connection opening, closing, receiving data, and errors.

{% highlight JavaScript %}
const SerialEvents = Object.freeze({
  CONNECTION_OPENED: Symbol("New connection opened"),
  CONNECTION_CLOSED: Symbol("Connection closed"),
  DATA_RECEIVED: Symbol("New data received"),
  ERROR_OCCURRED: Symbol("Error occurred"),
});
{% endhighlight JavaScript %}

To create a new Serial object and subscribe to the events, you would write:

{% highlight JavaScript %}
// Setup Web Serial using serial.js
const serial = new Serial();

// Subscribe to the events.
serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

// Called by Serial when an error occurs
function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
}

// Called by Serial when a serial connection opens
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
}

// Called by Serial when a connection closes
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
}

// Called by Serial when new data is received
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
}
{% endhighlight JavaScript %}

You need not subscribe to *all* the events—just the ones you need. However, subscribing to all of them does provide you with more information if something goes wrong.

### Opening the serial port

To open a serial port, you call `connect()` followed by `open()`. The method signatures are:

{% highlight JavaScript %}
async connect(existingPort = null, portFilters = null)
async open(serialOptions = { baudRate: 9600 }) {
{% endhighlight JavaScript %}

The `connect()` method takes two optional parameters:

- `existingPort`: a previously created serial port (*e.g.,* returned from `navigator.serial.requestPort()`). This will typically be null
- `portFilters`: a [SerialPortFilter](https://reillyeon.github.io/serial/#serialportfilter-dictionary) dictionary. This will also typically be null.

The `open()` method takes in the previously described [SerialOptions](https://reillyeon.github.io/serial/#dom-serialoptions) dictionary. If no parameter is passed, the dictionary defaults to `serialOptions = { baudRate: 9600 }`.

For convenience, there are two additional methods `connectAndOpen()` and `autoConnectAndOpenPreviouslyApprovedPort()`—we typically use these:

{% highlight JavaScript %}
// Prompts user for approval to connect to a serial device and opens the port to
// approved device 
async connectAndOpen(portFilters = null, serialOptions = { baudRate: 9600 })

// Automatically connects and opens the previously approved port
// If there are more than one, it takes the top port in the approved port list
async autoConnectAndOpenPreviouslyApprovedPort(serialOptions = { baudRate: 9600 })
{% endhighlight JavaScript %}

The `connectAndOpen()` method simply combines the two `connect()` and `open()` function calls. The auto-connect function takes advantage of the web browser's permission caching—you need only approve a device once per webpage.

## Let's make stuff

We'll begin by running the same Arduino code ([SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino)) with the same circuit as the [previous lesson](serial-intro.md). The circuit:

![](assets/images/SimpleSerialIn_LEDCircuit.png)
**Figure.** The corresponding circuit for [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino). Made in Fritzing and PowerPoint.
{: .fs-1}

Now, let's build a simple webpage using Web Serial to interact with ([SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino)).

### Web dev tools

We recommend developing web code in [Visual Studio Code (VSCode)](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) plugin. Because Web Serial requires device permissioning, you must run your webpage on a server rather than opening up `index.html` directly from your OS (in other words, doubling clicking on `index.html` in File Explorer or Finder won't work properly).

To install Live Server, open VSCode and click on `Extensions` in the left sidebar (or type `ctrl-shift-x`) then search for [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in the textbox. At the time of writing, the extension has nearly 12 million installs.

To use Live Server, open a `.html` page in VSCode. Then, you can either right-click on the file and select "Open with Live Server" or, in the bottom-right hand corner of VSCode, look for a blue 'Go Live' button. Click it and boom, you're running a web server, serving the webpage! By default, the server will reload whenever the html file or any of its dependencies change!

### Basic slider webpage

We're going to build a simple webpage with a slider that transmits a value between 0 and 255 as a text-encoded string via Web Serial. It should look like this:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/SimpleSerialIn-JavaScript-SliderOut-Snippet720p.mp4" type="video/mp4" />
</video>
**Video.** Running the SliderOut demo ([live page](https://makeabilitylab.github.io/p5js/WebSerial/Basic/SliderOut), [code](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/Basic/SliderOut)) with [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino) on the Arduino Leonardo.
{: .fs-1 }

#### Create folder and initial index.html page

To begin, create a folder called `SliderOut` and an empty `index.html` file within it. Then, in VSCode select `File->Open Folder` and select `SliderOut`. With the `Explorer` view open in VSCode's left sidebar (`ctrl-shift-e`), double click on the `index.html` file to open it. Now, VSCode should look something like this:

![](assets/images/VSCode_EmptyIndexHtmlFile.png)

In `index.html`, copy/paste this simple, minimalist html page:

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
    <title>Web Serial Demo</title>
  </head>

  <body>
    Content will go here!
  </body>
</html>
{% endhighlight HTML %}

Save the file (`ctrl-s`). Now, to make sure everything is working, launch it via Live Server.

There are three ways to launch Live Server—any will work! You can enlarge any of the screenshots below by right-clicking on them and selecting 'Open Image in New Tab'.

| 1. Right-click on file in Explorer View | 2. Right-click on file in Editor | 3. Click 'Go Live' Button |
|----|----|----|
| ![](assets/images/VSCode_LaunchLiveServer1-RightClickOnIndexHtml.png) | ![](assets/images/VSCode_LaunchLiveServer2-RightClickonFileInEditor.png) | ![](assets/images/VSCode_LaunchLiveServer3-ClickOnGoLiveButton.png) |

Once launched, your default web browser will open to a web server running at `127.0.0.1` on port 5500 (Live Server's defaults). The webpage should look like this:

![](assets/images/LiveServerLaunched_WebSerialDemoBlankPage.png)

Now, let's add in a title header in an `<h1>` block and some descriptive text:

{% highlight HTML %}
<!DOCTYPE html>
<html>
<head>
  <title>Web Serial Demo</title>
</head>

<body>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>
  <h1>Web Serial Demo</h1>
  This demo uses a slider to send a number between 0-255 to your connected serial device.
</body>
</html>
{% endhighlight HTML %}

If you hit `ctrl-s`, the website should automatically reload if you still have Live Server running. If not, just relaunch the webpage with Live Server (and keep it running as we build out).

![](assets/images/WebSerialDemo_NowWithSimpleText.png)

#### Add a connect button

Because Web Serial requires explicit user permission to connect to a local serial device, we need to add a "connect button". To do that, we'll use the HTML [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) element and specify a callback function called `onConnectButtonClick()` (we could name this anything we want but it will need to match the subsequent callback function that we write).

{% highlight HTML %}
<!DOCTYPE html>
<html>
<head>
  <title>Web Serial Demo</title>
</head>

<body>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>
  <h1>Web Serial Demo</h1>
  This demo uses a slider to send a number between 0-255 to your connected serial device.

  <p></p>
  <button id="connect-button" onclick="onConnectButtonClick()">Connect via Serial Port</button>

  <script>
    async function onConnectButtonClick() {
      console.log("Connect button clicked!")
    }
    </script>
</body>
</html>
{% endhighlight HTML %}

Reload the webpage and open the dev console (which you should almost always keep open when web developing). Click on the "Connect via Serial Port" button and you should see the message "Connect button clicked!" printed to console.

![](assets/images/WebSerialDemo_WithConnectButton.png)

#### Add and hook up serial.js

Now we need to add in and hook up Web Serial, which we'll do via the [`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js) library. In HTML, scripts can be placed in the `<body>`, `<head>`, or both. Pages load from top-to-bottom. In this case, we'll put it at the top of the `<body>`.

{% highlight HTML %}
<body>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>

   ...
{% endhighlight HTML %}

Now we need to create the Serial object and add in the callback functions. Add the following to the `<script>` block just above `async function onConnectButtonClick()`:

{% highlight HTML %}
<script>
  // Setup Web Serial using serial.js
  const serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  function onSerialErrorOccurred(eventSender, error) {
      console.log("onSerialErrorOccurred", error);
  }

  function onSerialConnectionOpened(eventSender) {
      console.log("onSerialConnectionOpened", eventSender);
  }

  function onSerialConnectionClosed(eventSender) {
      console.log("onSerialConnectionClosed", eventSender);
  }

  function onSerialDataReceived(eventSender, newData) {
      console.log("onSerialDataReceived", newData);
  }

  async function onConnectButtonClick() {
      console.log("Connect button clicked!");
  }
</script>
{% endhighlight HTML %}

While you could save and reload the webpage at this point, nothing noticeably will happen because we haven't actually hooked up the `Serial` object to the connect button yet. So, let's do that now. Update `onConnectButtonClick()` to connect and open the serial port. 

{% highlight JavaScript %}
async function onConnectButtonClick() {
  console.log("Connect button clicked!");

  if (navigator.serial) {
    if (!serial.isOpen()) {
      await serial.connectAndOpen();
    } else {
      console.log("The serial connection appears already open");
    }

  } else {
    alert('The Web Serial API does not appear supported on this web browser. Are you using Chrome? Did you remember to enable `experimental-web-platform-features` in Chrome? See https://web.dev/serial/');
  }
}
{% endhighlight JavaScript %}

Now save and reload. With your Arduino plugged into your computer, try clicking the `Connect via Serial Port` button. It should look something like this:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/SliderOutScreenRecording_ButtonJustHookedUp-Optimized.mp4" type="video/mp4" />
</video>

#### Add and hook up a slider

Finally, let's add and hook up an interactive slider to select and send values between 0 and 255 as text via serial. Slider widgets are specified as [`<input type="range">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) in HTML.

Below our `<button>` HTML in the `<body>`, add in the slider. We will specify a minimum, maximum, and initial value as well as a callback function for whenever the slider value changes.

{% highlight HTML %}
<button id="connect-button" onclick="onConnectButtonClick()">Connect via Serial Port</button>
<input id="slider" type="range" min="0" max="255" value="128" onchange="onSliderValueChanged(this, event)" />
{% endhighlight HTML %}

Now, in the `<script>` block, add in the `onSliderValueChanged()` method. In this function, we'll grab the new value (`src.value`) and transmit it as a string via `serial.writeLine(src.value)`.

{% highlight JavaScript %}
async function onSliderValueChanged(src, event) {
  console.log("Writing to serial: ", src.value.toString());
  serial.writeLine(src.value);
}
{% endhighlight JavaScript %}

And that's it! A fully working Web Serial demo, which should look something like this:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/SliderOutSuperBasic-Optimized.mp4" type="video/mp4" />
</video>

#### Polish the interface

We can make a few UI updates to polish the interface. First, let's **hide** the connect button after we successfully connect to serial. For this, we'll change the display style of our button to `none` in the `onSerialConnectionOpened()` function:

{% highlight JavaScript %}
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened", eventSender);
  document.getElementById("connect-button").style.display = "none";
}
{% endhighlight JavaScript %}

Second, let's display the value of the slider widget on the webpage. For this, we need to add the following to the HTML:

{% highlight HTML %}
<h1>Slider value: <span id="slider-value">0</span></h1>
{% endhighlight HTML %}

And then modify the `onSliderValueChanged()` method:

{% highlight JavaScript %}
async function onSliderValueChanged(src, event) {
  console.log("Writing to serial: ", src.value.toString());
  serial.writeLine(src.value);

  // Update the slider value text
  document.getElementById('slider-value').textContent = src.value;
}
{% endhighlight JavaScript %}

We should also initialize the `slider-value` textContent when the page first loads so that the slider widget and the text display are in sync. Somewhere at the top of the `<script>` block, add in:

{% highlight JavaScript %}
// Get current slider value and set it to the slider text output
let sliderVal = document.getElementById('slider').value;
document.getElementById('slider-value').textContent = sliderVal;
{% endhighlight JavaScript %}

Finally, let's wrap all of the interactive controls (except for the connect button) into their own `<div>` and only show this when we've successfully connected to serial. So, it starts hidden, which is set by `style="display:none"`.

{% highlight HTML %}
<div id="interactive-controls" style="display:none">
  <h1>Slider value: <span id="slider-value">0</span></h1>
  <input id="slider" type="range" min="0" max="255" value="128" onchange="onSliderValueChanged(this, event)" />
</div>
{% endhighlight HTML %}

Now programatically change the `interactive-controls` style to `display:block` when a connection is made:

{% highlight JavaScript %}
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened", eventSender);
  document.getElementById("connect-button").style.display = "none";
  document.getElementById("interactive-controls").style.display = "block";
}
{% endhighlight JavaScript %}

<!-- TODO: add in the debug html-message stuff? -->

#### Full slider video demo

Here's a full video demo of what it should look like:

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/SimpleSerialIn-JavaScript-SliderOut-TrimmedAndSpedUp720p.mp4" type="video/mp4" />
</video>
**Video.** Running the SliderOut demo ([live page](https://makeabilitylab.github.io/p5js/WebSerial/Basic/SliderOut), [code](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/Basic/SliderOut)) with [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino) on the Arduino Leonardo.
{: .fs-1 }

### Simple bidirectional text webpage

For our second and final example, let's build a simple bidirectional text webpage that sends and receives text via serial.

TODO: circuit
TODO: movies

## Resources

- [Web Serial API Living Document](https://wicg.github.io/serial/), w3c Community Group Draft Report

- [Read from and write to a serial port from the web](https://web.dev/serial/), François Beaufort

## Next Lesson

In the [next lesson](debouncing.md), we'll show how to use [p5js](https://p5js.org/) with Web Serial. It's gonna be great fun!

<span class="fs-6">
[Previous: Intro to Serial](serial-intro.md){: .btn .btn-outline }
<!-- [Next: Debouncing](debouncing.md){: .btn .btn-outline } -->
<!-- [Next: Using potentiometers](potentiometers.md){: .btn .btn-outline } -->
</span>