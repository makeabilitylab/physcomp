---
layout: default
title: L1&#58; Intro to Serial
nav_order: 1
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

## Serial communication with Arduino

Arduino uses a standard [asynchronous serial communication protocol](https://learn.sparkfun.com/tutorials/serial-communication/all) for serial communication. 

On Arduino, we initialize the serial port using [`Serial.begin()`](https://www.arduino.cc/en/Serial.Begin). We've done this since our first set of lessons on Arduino (*e.g.,* [L3: Serial Debugging](../arduino/serial-print.md)). The [`Serial.begin()`](https://github.com/arduino/ArduinoCore-avr/blob/master/cores/arduino/HardwareSerial.cpp) function has two overloaded options:

{% highlight C %}
begin(unsigned long baud)
begin(unsigned long baud, byte config)
{% endhighlight C %}

Once `Serial.begin()` is called, the Arduino Uno and Leonardo take over pins 1 and 0 for serial transmission and reception, respectively, and the RX and TX LEDs light up on the board.

Thus far, we have been using the first function, which sets the data rate in bits per second (baud). But what about the second function? We'll dig in to both below.

### Baud rate

The baud rate specifies how fast data is sent over serial, which is expressed in bits-per-second (bps). For communicating with a computer, the [Arduino docs](https://www.arduino.cc/en/Serial.Begin) recommend: 300 bps, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, or 115200. Thus far, we've only been using the serial port for debugging, so speed hasn't been a concern—and we've typically used 9600 bps (or 9.6 kbps). However, for higher bandwidth, try 115200 or 115.2 kbps (still slow by today's networking standards, of course) but 12x faster than 9600.  

![](assets/images/SerialMonitorShowingBaudRate.png)
{: .mx-auto .align-center }
**Figure.** The Arduino IDE's [Serial Monitor](../arduino/serial-print.md), which has a drop down for baud rate. The baud rate used in `Serial.begin(<baud>)` must match this drop down menu setting or Serial Monitor will not properly communicate with Arduino.
{: .fs-1 }

#### What's the fastest serial baud rate?

This will be microcontroller dependent. The Arduino Uno uses a ATmega328P, which states a maximum baud rate of 2,000,000 baud (2 Mbps). On [Stack Overflow](https://arduino.stackexchange.com/a/299/63793), Connor Wolf found that though the Uno was capable of communicating at 2Mpbs, the Arduino serial library was poorly optimized and resulted in only an effective 500 kbps communication rate. 

### The asynchronous serial communication frame

The second function, `begin(unsigned long baud, byte config)`, allows for an optional argument that configures the serial transmission packet or frame. A serial transmission frame consists of three pieces: **data**, **parity**, and **synchronization bits** (start and stop). 

![](assets/images/SerialFrame_FromSparkfun.png)

**Figure.** An asynchronous serial communication frame.
{: .fs-1 }

The [data bit](https://en.wikipedia.org/wiki/Asynchronous_serial_communication) is the length of the data portion of the transmission frame, the [parity bit](https://en.wikipedia.org/wiki/Parity_bit) is a simple form of error detecting code, and the synchronization bits help demarcate a frame. There is always only *one* start bit at the beginning of a frame but there can be one or two stop bits at the end (though one is most common). On Arduino, the default transmission frame configuration is: 8 data bits, no parity, one stop bit—this is a common configuration.

Importantly, if the baud and config settings do not match between the Arduino and the computer, communication will not work. This is the first thing to double check!

### Only one computer program can open a serial port at a time

Only one computer program can open a serial port at a time. For example, if you attempt to open Serial Monitor on the same COM port that has been opened by another program, you will receive an error like this: `Error opening serial port 'COM7'. (Port busy)`.

![](assets/images/SerialMonitorErrorOpeningSerialPort.png)
**Figure.** A demonstration of what happens if you try to open Serial Monitor on a COM port that is already opened by another program. The Arduino IDE shows an error stating `Error opening serial port 'COM7'. (Port busy)`.
{: .fs-1 }

Similarly, if we attempt to access a previously opened serial port with [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview), we receive `Access to the port 'COM7' is denied.`

![](assets/images/PowerShellAccessToPortIsDenied.png)
**Figure.** Only one software program can access a serial port at a time.
{: .fs-1 }

## Developing serial communication software applications

So, how can we design and implement a computer program to communicate with our Arduino via serial? To answer this, let's decompose serial communication into three high-level layers:

- **Hardware layer:** How is data communicated over hardware? How many wires are used? What does the voltage signal look like? Thankfully, Arduino handles this for us.
- **Serial protocol:** What is the format of a serial transmission packet (*e.g.,* the data and parity bits)? Again, we do not really need to worry about this. Arduino uses the standard [asynchronous serial protocol](https://learn.sparkfun.com/tutorials/serial-communication/all) and includes the software library [`Serial`](https://www.arduino.cc/reference/en/language/functions/communication/serial/) to support this. We just need to make sure that both communicating devices are using the same baud rate and data packet configuration.
- **Application layer:** How do applications communicate together using serial? Aha, this is the key question!

The answer—for better or worse—is completely up to you! If you're writing serial communication code for both devices (the application on Arduino and the application on your computer), you get to decide how these applications communicate. There are, however, some important considerations, including: binary vs. ASCII-encoded data, message formatting, handshaking, and message acknowledgment (call-and-response).

### Binary vs. ASCII-encoded data

With serial communication, we can either transmit/receive data as a series of bits (raw binary data) or as alphanumeric characters (ASCII-encoded data). Thus far, for our use-case of serial-based debugging, we've been using [`Serial.print`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) and [`Serial.println()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/println/), which transmits data via serial as human-readable ASCII text. For binary data, however, we use [`Serial.write()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/write/) and [`Serial.readBytes()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/readbytes/).

Why might we want to use **binary** *vs.* **text** **encodings**? Well, if we are trying to transmit binary data—like an image, video, or song—then communicating via binary is preferred. It's also more bandwidth efficient (uses fewer bits). However, in our courses, we're typically transmitting/receiving small amounts of data and it's beneficial for debugging purposes (and human understanding) to use an ASCII-encoded format.

#### Binary vs. ASCII example

Let's take a look at an example. Let's say we want to transmit a signal that ranges between 0 - 255 from our Arduino to our computer. Because the value only ranges from 0 to 255, we can encode this with 8 bits or a single byte (`0000 0000` to `1111 1111` or `0x00` and `0xFF` in hexadecimal). Sending via binary looks like:

{% highlight C %}
byte signalVal = getSignal();
Serial.write(signalVal)
{% endhighlight C %}

So, for example, if `getSignal()` returns 15, we would transmit `0000 1111` (or `0x0F`). If `getSignal()` returns 127, we would transmit `0111 1111` (`0x7`). If 255, then `1111 1111` (`0xFF`). And so on.

However, we could also transmit this using ASCII-encoded data with [`Serial.println()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/println/):

{% highlight C %}
byte signalVal = getSignal();
Serial.println(signalVal)
{% endhighlight C %}
 
However, now if `getSignal()` returns 15, we would need to transmit **four bytes** rather than just one byte. Using the [ASCII-encoding chart](https://www.asciichart.com/), we can see that the ASCII encoding for '1' is ASCII 49 or `0011 0001` (`0x31`) and '5' is ASCII 53 or `0011 0101` (`0x35`). Then, unlike [`Serial.print()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/), [`Serial.println()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/println/) adds in a carriage return character '\r', which is ASCII 13 or `0000 1101` (`0x0D`), and then a newline (or linefeed) character '\n', which is ASCII 10 or `0000 1010` (`0x0A`).

Similarly, if we wanted to transmit 127 or 255 using `Serial.println()`, we would need **five bytes**. For example, with 127, we would transmit '1' (ASCII 49 or `0011 0001`), '2' (ASCII 50 or `0011 0010`), '7' (ASCII 55 or `0011 0111`), '\r' (ASCII 13 or `0000 1101`), '\n' (ASCII 10 or `0000 1010`).

#### Both applications need to use same encoding

Note that the receiver needs to know whether data has been transmitted using binary or ASCII encodings. If the latter, the receiver can simply use a method like [`Serial.readStringUntil('\n');`](https://www.arduino.cc/reference/en/language/functions/communication/serial/readstringuntil/) and the data will be automatically transformed into an ASCII-encoded String. If the former, then a method like [`Serial.readBytes()`](https://www.arduino.cc/reference/en/language/functions/communication/serial/readbytes/) is necessary and the receiver must know how many bytes are being sent and how to decode them.

For our purposes, we almost always use the ASCII encoding because the benefit of human readability (*e.g.,* sending and receiving text) outweighs efficiency. However, you should consider this on a case-by-case basis depending on your application context, communication medium (wireless *vs.* wired), and power requirements (*e.g.,* low power applications should minimize transceiving).

### Formatting messages

The above example simply sent one value per transmission. That is, for binary, we sent one byte per new signal read; for ASCII-encoding, we sent one line per new signal read. However, it's likely that you'll want to transmit and receive *multiple* values. How do we do this?

Again, it's completely up to you! If you're using ASCII-encoded transceiving, you could use a [comma-separated value (CSV) format](https://en.wikipedia.org/wiki/Comma-separated_values), [JSON](https://en.wikipedia.org/wiki/JSON), or some other messaging format of your own design.

As you'll commonly see in our demo code, we use a simple CSV format like this:

{% highlight C %}
int sensorVal1 = analogRead(SENSOR1_INPUT_PIN);
int sensorVal2 = analogRead(SENSOR2_INPUT_PIN);
int sensorVal3 = analogRead(SENSOR3_INPUT_PIN);
Serial.print(sensorVal1);
Serial.print(",");
Serial.print(sensorVal1);
Serial.print(",");
Serial.println(sensorVal1);
{% endhighlight C %}

For example, if `sensorVal1` is 896, `sensorVal1` 943, and `sensorVal3` is 349, then the above code would send a text string that looks like `896, 943, 349\r\n`.

On the receiving end, we might use [regex](https://en.wikipedia.org/wiki/Regular_expression) for parsing or write our own parsing code like this:

{% highlight C %}

if(Serial.available() > 0){
    // If we're here, then serial data has been received
    // Read data off the serial port until we get to the endline delimeter ('\n')
    String rcvdSerialData = Serial.readStringUntil('\n');

    // Parse the comma separated string
    int startIndex = 0;
    int endIndex = rcvdSerialData.indexOf(','); // find first index of comma in the string
    if(endIndex != -1){

        // Parse out first sensor value
        String strSensorVal1 = rcvdSerialData.substring(startIndex, endIndex);
        int sensorVal1 = strSensorVal1.toInt();

        // Parse out the second sensor value
        startIndex = endIndex + 1;
        endIndex = rcvdSerialData.indexOf(',', startIndex);
        String strSensorVal2 = rcvdSerialData.substring(startIndex, endIndex);
        int sensorVal2 = strSensorVal2.toInt();

        // Parse out the third sensor value
        startIndex = endIndex + 1;
        endIndex = rcvdSerialData.length();
        String strSensorVal3 = rcvdSerialData.substring(startIndex, endIndex);
        int sensorVal3 = strSensorVal2.toInt();

        // Do stuff with sensor values
    } 
}
{% endhighlight C %}

This example assumes that data is in the order of `sensorVal1, sensorVal2, sensorVal3` and that each received line is the same. To make this communication scheme more flexible, you could transmit a modified CSV with variable names (like key,value pairs) or use JSON. Towards the former, you could transmit the key,value pairs as: "`sensorVal1=896, sensorVal2=943, sensorVal3=349`". The receiver would then parse both the variable names and their values.

In all of our examples, we use very simple CSV formatting with ASCII-encoded transceiving. But feel free to do things differently!

### Handshaking

When two devices begin communicating—whether via serial or some other protocol—it's common to [handshake](https://en.wikipedia.org/wiki/Handshaking). That is, to transmit and receive a small set of initial messages to establish parameters for communication and to synchronize statuses. For example, upon connection establishment, you might have your two devices exchange their current set of stored values.

### Acknowledging data

Similarly, if you want to ensure that data has arrived and been parsed correctly. You might decide to transmit back an 'OK' message after each line of receive data along with a hash (this hash can be used by the original transmitter to verify data arrival).

## Example serial programs

Below, we are going to show a few different examples using the command line, Python, and then JavaScript. To keep things simple, in this lesson, we are going to focus on **unidirectional communication** from the computer to the Arduino (`Computer → Arduino`). That is, the computer will send data and the Arduino will receive data. Later, we will cover `Arduino → Computer` and bidirectional (duplex) communication `Computer ↔ Arduino`.

And actually, in all of our serial lessons—including this one—we will have the Arduino transmit something back to the computer to aid with debugging and ensure the Arduino received what we expected. You'll see!

### Simple Arduino serial receiver program

For our examples below, we will be running a simple program on our Arduino that looks for ASCII-encoded data off of its serial port, parses that data into an integer, and uses `analogWrite` to output that integer to an output pin. In this case, we have hooked up a red LED with a current limiting resistor to the `OUTPUT_PIN`, which is set to `LED_BUILTIN` (Pin 13 on the Arduino Uno and Leonardo). The entire program looks like this:

{% highlight C %}
const int DELAY_MS = 5;
const int OUTPUT_PIN = LED_BUILTIN;

void setup() {
  Serial.begin(9600);
  pinMode(OUTPUT_PIN, OUTPUT);
}

void loop() {
  // Check to see if there is any incoming serial data
  if(Serial.available() > 0){
    // If we're here, then serial data has been received
    // Read data off the serial port until we get to the endline delimeter ('\n')
    // Store all of this data into a string
    String rcvdSerialData = Serial.readStringUntil('\n'); 

    // Convert string data into an integer
    int ledValue = rcvdSerialData.toInt();

    // Ensure value is between 0 and 255 (our maximum output values)
    ledValue = constrain(ledValue, 0, 255);
    analogWrite(OUTPUT_PIN, ledValue);
    
    // Just for debugging, echo the data back on serial
    Serial.print("Arduino received: '");
    Serial.print(rcvdSerialData);
    Serial.println("'");
  }

  delay(DELAY_MS);
}
{% endhighlight C %}

**Code.** This code is available as [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino) on GitHub. We will actually be using [SimpleSerialInOLED.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialInOLED/SimpleSerialInOLED.ino) in our videos.
{: .fs-1}

#### Demo circuit

And the corresponding circuit:

![](assets/images/SimpleSerialIn_LEDCircuit.png)
**Figure.** The corresponding circuit for [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino). Made in Fritzing and PowerPoint.
{: .fs-1}

### Using Serial Monitor

Let's begin simply by using our now very familiar Arduino IDE [Serial Monitor](../arduino/serial-print.md) tool. With [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino) loaded on your Arduino and your Arduino connected to our computer, open the Serial Monitor and send data to our Arduino. Make sure you've selected the same baud rate used in `Serial.begin(<baud rate>)`.

![](assets/images/ArduinoIDESerialMonitor_AnnotatedScreenShot.png)
**Figure** An annotated screenshot the Arduino IDE's [Serial Monitor](../arduino/serial-print.md) tool for sending and receiving serial data.
{: .fs-1}

#### Video demonstration of using Serial Monitor

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/SimpleSerialIn-NoTalking-TrimmedAndSpedUp720p.mp4" type="video/mp4" />
</video>
**Video.** A video demonstrating using the Arduino IDE [Serial Monitor](../arduino/serial-print.md) tool to communicate with the Arduino running [SimpleSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialIn/SimpleSerialIn.ino). For this video, we are using a slightly modified program called [SimpleSerialInOLED.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/SimpleSerialInOLED/SimpleSerialInOLED.ino) along with an [OLED display](../advancedio/oled.md). This allows you to more easily see the received values.
{: .fs-1 }

### Command lines tools

While we've thus far emphasized the Arduino IDE's [Serial Monitor](../arduino/serial-print.md), there is nothing special or unique about that tool. We can use any application or programming language with serial support. Below, we'll show how to use command line tools for both Windows and Mac/Linux.

<!-- https://itp.nyu.edu/physcomp/lab-intro-to-serial-communications/#Connecting_via_the_Command_Line
https://learn.sparkfun.com/tutorials/terminal-basics/command-line-windows-mac-linux -->

#### Windows

On Windows, we can use the [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7.1) terminal, which is built into Windows 10. To read and write data from the serial port with PowerShell, we'll follow the official [PowerShell blog](https://devblogs.microsoft.com/powershell/writing-and-reading-info-from-serial-ports/).

First, to find the available serial ports, we can use `getportnames()`.

```
PS> [System.IO.Ports.SerialPort]::getportnames()
COM7
```

Then, we'll create a `SerialPort` object, which takes the COM port, the baud rate, serial configuration parameters (parity bit, data bit length, and stop bit). We'll then open this port.

```
PS> $port= new-Object System.IO.Ports.SerialPort COM7,9600,None,8,one
PS> $port.open()
```

To write to the port using ASCII-encoded text, we'll use `WriteLine(<str>)`:

```
PS> $port.WriteLine(“Hello!")
```

Similarly, to read from the port, we can use `ReadLine()`:

```
PS> $port.ReadLine()
Arduino received: 'Hello!'
```

Finally, to close the port, we use `Close()`. 

```
PS> $port.Close()
```

Thus, the full program is simply:

```
PS> $port= new-Object System.IO.Ports.SerialPort COM7,9600,None,8,one
PS> $port.open()
PS> $port.WriteLine("Hello!")
PS> $port.ReadLine()
PS> $port.Close()
```

##### Video demo

TODO: insert video demo.

#### Mac and Linux

### Python

We're going to show you how to use Python...


## Resources

- [Intro to Asynchronous Serial Communications](https://itp.nyu.edu/physcomp/lab-intro-to-serial-communications/), NYU ITP Physical Computing course

- [Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all), Sparkfun.com


#### Demo Arduino serial program

For each, we will be running [DisplayTextSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/DisplayTextSerialIn/DisplayTextSerialIn.ino) on the Arduino, which reads text data off the Serial port, displays it on a connected [OLED](../advancedio/oled.md), and echos the data back on the Serial port.

Essentially, [DisplayTextSerialIn.ino](https://github.com/makeabilitylab/arduino/blob/master/Serial/DisplayTextSerialIn/DisplayTextSerialIn.ino) does this:

{% highlight C %}
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     4 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 _display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(9600);

  initializeOledScreen();
}

void loop(){
  // Check to see if there is any incoming serial data
  if(Serial.available() > 0){
    // If we're here, then serial data has been received
    // Read data off the serial port until we get to the endline delimeter ('\n')
    // Store all of this data into a string
    String rcvdSerialData = Serial.readStringUntil('\n'); 

    // Display the received data on the OLED
    _display.clearDisplay();
    _display.print(rcvdSerialData);
    _display.display();

    // Echo the data back on serial (for debugging purposes)
    Serial.print("Arduino received: '");
    Serial.print(rcvdSerialData);
    Serial.println("'");
}
{% endhighlight C %}
