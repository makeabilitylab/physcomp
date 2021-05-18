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

> the Web Serial API bridges the web and the physical world by allowing websites to communicate with serial devices, such as microcontrollers and 3D printers
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

To use our Web Serial class, you can clone our [p5js repo](https://github.com/makeabilitylab/p5js) and include `serial.js` from `_libraries/serial.js` or use [jsDelivr](https://www.jsdelivr.com/) service, which turns any GitHub repo into a CDN and directly serves `serial.js` from our GitHub repo. 

In the `<head>` of your html file, simply add:

{% highlight HTML %}
<script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>
{% endhighlight HTML %}

Currently, [`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js) supports just reading/writing text data (rather than binary data).

### Event-based functions

[`serial.js`](https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js) uses an event-based architecture with callback functions, which is common in web and UI programming (see: Mozilla's [Introduction to Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)). There are four events:

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

### Opening the serial port

To open a serial port, you must call `connect()` followed by `open()`. The method signatures are:

{% highlight JavaScript %}
async connect(existingPort = null, portFilters = null)
async open(serialOptions = { baudRate: 9600 }) {
{% endhighlight JavaScript %}

The `connect()` method takes two optional parameters:

- `existingPort`: a previously created serial port (*e.g.,* returned from `navigator.serial.requestPort()`). This will typically be null
- `portFilters`: a [SerialPortFilter](https://reillyeon.github.io/serial/#serialportfilter-dictionary) dictionary. This will also typically be null.

The `open()` method takes in the previously described [SerialOptions](https://reillyeon.github.io/serial/#dom-serialoptions) dictionary. If no parameter is passed, the dictionary defaults to `serialOptions = { baudRate: 9600 }`.

For convenience, there are two additional methods `connectAndOpen()` and `autoConnectAndOpenPreviouslyApprovedPort()`:

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

We'r

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