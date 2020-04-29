---
layout: default
title: L5&#58; Internet of Things
nav_order: 5
parent: ESP32
has_toc: true # (on by default)
usemathjax: true
comments: true
nav_exclude: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

The ESP32 is exciting not just because of its speed, memory, and GPIO capabilities but also because it is truly a modern Internet of Things (IoT) board with Wi-Fi and Bluetooth support. And it's never been easier to get data off of these Internet-connected devices and into "the cloud" (for better or worse). :)

## IoT Platforms

There are a **ton** of IoT platforms—significantly more than even a few years ago—including [Adafruit IO](https://learn.adafruit.com/welcome-to-adafruit-io), [Blynk](https://blynk.io/), [ThingsSpeak](https://thingspeak.com/), and [Losant](https://www.losant.com/). See [Hackaday](https://hackaday.com/2017/10/31/review-iot-data-logging-services-with-mqtt/) and [bigmessowires](https://www.bigmessowires.com/2017/06/29/esp8266-freeboard-io-blynk-and-iot/) for reviews.

If you don't want to dev out your own backend or you simply want a platform to rapidly prototype an idea, then these IoT sites are convenient, easy-to-use, flexible, and fairly feature rich. You can get real-time displays of your data, control and interact with this data and Internet-connected devices, connect your projects to web services like Twitter, *etc.* Many of the IoT platforms also connect with services like IFTTT and/or offer their own event triggering to, for example, email you when an anomaly is detected.

And many of these platforms support both REST APIs—which you're likely familiar with if you've done any web dev—as well as the Message Queuing Telemetry Transport ([MQTT](https://en.wikipedia.org/wiki/MQTT)) protocol, which is an open standard for lightweight, publish-subscribe networking. See [MQTT](http://mqtt.org/).

## Adafruit IO

For our lesson, we'll be using [Adafruit.io](https://learn.adafruit.com/welcome-to-adafruit-io), which greatly simplifies interfacing with a cloud backend from the ESP32 and provides a rich array of features. The free tier provides 10 feeds, 5 dashboards, an upload rate limit of 30 data points/minute, 30 day storage, and privacy controls. The paid tier, called [Adafruit IO Plus,](https://io.adafruit.com/plus) is $99/year and provides unlimited feeds, unlimited dashboards, 60 data points/minute, and 60 days of storage.

You must register for Adafruit IO on their website. Follow their step-by-step instructions [here](https://learn.adafruit.com/welcome-to-adafruit-io/overview).

### Install Adafruit IO in Arduino IDE

To install the Adafruit IO library for Arduino, open the Arduino IDE and go to Tools -> Library -> Manage Libraries. When the Library Manager opens, search for "Adafruit IO Arduino" and scroll to find the match:

![Screenshot of Library Manager showing Adafruit IO Arduino](assets/images/ArduinoIDE_InstallAdafruitIOLibrary.png)

When asked to install dependencies, click on "Install All"

![Screenshot showing "Install All" as option when asked to install dependencies](assets/images/ArduinoIDE_InstallAllAdafruitIODependencies.png)

### Using Adafruit IO

Adafruit has published a 7-step guide that covers everything from uploading [sensor data](https://learn.adafruit.com/adafruit-io-basics-analog-input) and viewing it on a dashboard (took us ~5 minutes to setup) to sending data from Adafruit IO to control an [RGB LED](https://learn.adafruit.com/adafruit-io-basics-color) or [servo motor](https://learn.adafruit.com/adafruit-io-basics-servo).

