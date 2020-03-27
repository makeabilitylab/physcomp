---
layout: default
title: Arduino IDE
parent: Intro to Arduino
nav_order: 15
has_toc: true # (on by default)
nav_exclude: true
---
# Arduino
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

## Download and install the Arduino IDE
Download and install the [Arduino IDE](https://www.arduino.cc/en/main/software). Do not use the Arduino Web Editor, instead download and install the version that runs locally on your machine.

![Arduino IDE download screenshot](assets/images/ArduinoIDEDownloadScreenshot.png)


## Install custom theme

To use a dark theme in the Arduino IDE, [follow these steps](https://create.arduino.cc/projecthub/konradhtc/one-dark-arduino-modern-dark-theme-for-arduino-ide-2fca81). Note: I started investigating this when I noticed that the default Arduino theme was difficult to read over Zoom.

![Screenshot of dark theme](assets/images/ArduinoIDE_DarkTheme.png)

## Troubleshooting

### Arduino Leonardo port doesn't show up

First, check to ensure that your USB cable provides both power + data. Some cheaper cables are power only.

Second, I've found (frustratingly) that sometimes the com software on the Leonardo can get confused. The only way I've figured out how to solve it is by following these [directions](https://www.dfrobot.com/forum/viewtopic.php?t=216). In short:

> Open a "Blink" sketch on Arduino IDE, select "Leonardo". Now there is no COM port. Press "RESET" and select the COM port in the Arduino IDE immediately. Wait a minute, the COM port will disappear again. Now, click "Upload". After IDE has completed verifying, press "RESET" on the Leonardo (physical button). If everything is OK, the COM port has been fixed after uploading.

Fortunately, if this solution works, the Leonardo will be 'fixed' and you can upload normally again.

Why does this happen? Read the official Arduino guide [here](https://www.arduino.cc/en/Guide/ArduinoLeonardoMicro#toc6):

> In general, you upload code to the Leonardo or Micro as you would with the Uno or other Arduino boards. Click the upload button in the Arduino IDE and your sketch will be automatically uploaded onto the board and then started. This works more or less the same way as with the Uno: the Arduino software initiates a reset of the board, launching the bootloader - which is responsible for receiving, storing, and starting the new sketch.
>
> However, because the serial port is virtual, it disappears when the board resets, the Arduino software uses a different strategy for timing the upload than with the Uno and other boards. In particular, after initiating the auto-reset of the Leonardo, Leonardo ETH or Micro (using the serial port selected in the Tools > Serial Port menu), the Arduino software waits for a new virtual (CDC) serial / COM port to appear - one that it assumes represents the bootloader. It then performs the upload on this newly-appeared port.
>
> These differences affect the way you use the physical reset button to perform an upload if the auto-reset isn't working. Press and hold the reset button on the Leonardo or Micro, then hit the upload button in the Arduino software. Only release the reset button after you see the message "Uploading..." appear in the software's status bar. When you do so, the bootloader will start, creating a new virtual (CDC) serial port on the computer. The software will see that port appear and perform the upload using it. Again, this is only necessary if the normal upload process (i.e. just pressing the uploading button) doesn't work. (Note that the auto-reset is initiated when the computer opens the serial port at 1200 baud and then closes it; this won't work if something interferes with the board's USB communication - e.g. disabling interrupts.)
