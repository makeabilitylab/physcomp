---
layout: default
title: Website Content Ideas
has_toc: false # on by default
nav_exclude: true
---

# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

## TODO:

- Look at my curriculum sheet
- Add in design and design thinking books like Sketching User Experiences.
- Look at my resources list from [CMSC838f](https://web.archive.org/web/20170605201324/http:/cmsc838f-s15.wikispaces.com/). [Direct link](https://web.archive.org/web/20150709105051/http://cmsc838f-s15.wikispaces.com/Resources)
- Look at: http://ladyada.net/learn/arduino/
- Berkeley's EECS16A course: https://www.eecs16a.org/
- Stanford's ENGR40m Arduino/making course:
  - https://web.stanford.edu/class/archive/engr/engr40m.1178/slides.html
- USC Ming Hsieh Embedded Systems Design Laboratory
  - http://ee-classes.usc.edu/ee459/library/
- Look at some related online courses:
  - EdX IOT: https://courses.edx.org/courses/course-v1:UPValenciaX+IOT101.1x+3T2019a/course/
  - https://www.coursera.org/specializations/iot
  - https://www.coursera.org/learn/arduino-platform
  - https://www.udemy.com/course/arduino-megacourse-learn-arduino-by-building-30-projects
  - [Done] https://www.instructables.com/class/Arduino-Class/
    - Lots of documentation, pictures, etc. Basically covers same thing as Blum book but also introduces NeoPixel strips.
- Look at related academic courses
  - E.g., Mayanks
  - High-Low Tech stuff: http://highlowtech.org/?cat=21
  - [Done, doesn't have lectures posted but some assignments] Daniel Ashbrook's classes at RIT
    - http://fetlab.io/722-spring18/index.html
    - http://fetlab.io/720-fall17/
  - Sean Follmer (couldn't find link to his teaching site)
  - Interesting, just found "Modern Mobile" course at UW: https://modernmobile.cs.washington.edu/
  - https://people.eecs.berkeley.edu/~boser/courses/49/
    - https://people.eecs.berkeley.edu/~boser/courses/49_sp_2019/index.html
    - https://people.eecs.berkeley.edu/~boser/courses/49_sp_2019/N_gpio.html#_analog_input_adc
- Places of inspiration
  - Hackaday
  - Instructables
- What content to add?
  - Logic gates: https://youtu.be/cdMJvFT-Afc
  - IMU 9 DOF with bunny 3D orientation: https://www.adafruit.com/product/2472
- Electricity primer
  - http://people.cs.georgetown.edu/~squier/Teaching/ComputerSystemsArchitecture/520-2013-CourseDocuments/Lec-1-electricityPrimer.pdf
- Kalman filter on ESP32: http://www.iotsharing.com/2019/06/how-to-apply-kalman-filter-to-esp.html
- [Beginners guide to ESP8266](https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html)

## Touch/pen/mouse gesture recognizers
- http://depts.washington.edu/acelab/proj/dollar/index.html
- Datasets: https://sites.google.com/site/adriendelaye/home/pen-and-touch-datasets

## Examples from hci lit
- Could do hydrosense (need to find logs though)
- Scratchput
- $1 recognizer

## Possible H1 Content
- Motors
- Power
- Sensors
- [Programming microcontrollers](https://itp.nyu.edu/physcomp/lessons/programming/programming-terms-and-programming-environments/)
- Electronic prototyping kits section

## Deep Learning
- Pytorch vs. Keras: https://deepsense.ai/keras-or-pytorch/
- 

### Sensors

If we do a sensors subsection:

#### Distance
- [HC-SR04 Ultrasonic guide](https://www.makerguides.com/hc-sr04-arduino-tutorial/) by Makerguides is quite good
- [Sharp IR Distance Sensor](https://www.makerguides.com/sharp-gp2y0a21yk0f-ir-distance-sensor-arduino-tutorial/)--also by Makerguides and also quite good

## Intro to Output TODOs
TODO: 
- [Done in led-blink.md] blink no delay (where to put this?). We do have a fade with no delay at end of led-fade.md
  - [Done in led-blink3.md] But a blink no delay could also show how to blink multiple LEDs at different rates.
- how to hook up multiple LEDS per port with Arduino (in parallel and why). But maybe this belongs in core electronics
- Where to put breadboard stuff? This should probably go in the basic electronics series but for now my focus is on Arduino stuff...
- Maybe add in sound?
  - https://www.programmingelectronics.com/an-easy-way-to-make-noise-with-arduino-using-tone/
  - https://www.cuidevices.com/blog/buzzer-basics-technologies-tones-and-driving-circuits#application-circuit-for-piezo-transducer
  - https://learn.adafruit.com/adafruit-arduino-lesson-10-making-sounds/overview

<!--  https://www.exploringarduino.com/resources/ -->

## Interactive Book
If we were to treat this as an interactive book. What would it look like? This is just a very drafty (**very drafty**) look.

### Chapter 1: Intro to Electronics
- Circuit theory: Ohm's Law, kirchhoffs voltage law, voltage dividers
- Components: LEDs, resistors, conductors (wires), breadboards
- (More advanced) components: capacitors, transistors (could also bring this up later)

### Chapter 2: Intro to microcontrollers (and Arduino)
- Quick chapter on the basics of microcontrollers?
- Microcontrollers vs. computers
- What is the Arduino?

### Chapter 3: Intro to Output
- Digital output, source and sinking current
- Analog output, PWM, DACs
- (Maybe include some things about human psychology and interpreting sound, displays, etc?)

### Chapter 4: Intro to Input
- Digital input, debouncing, interrupts
- Analog input, voltage dividers (revisited)
- Maybe something about how fast humans move, etc.

### Chapter 5: Sensors
- Sensors: characteristics, taxonomies
- Digital communication protocols like I2C and SPI
- Example sensors including accel, photoresistor, fsr, and more

### Chapter 6: Signals (or Applied DSP)
- Processing signals
- Time vs. frequency analysis
- Filters

### Chapter 7: Applied ML
- Classifying these signals!

### Possible additions
- Chapter on motors (or other advanced output). Maybe this is analogous to Chapter 5: Sensors but for Output
- Chapter on ESP32: Moving to a more sophisticated micro
- Chapter on sound: making and listening
- Chapter on tools like soldering, multimeters, etc.

Throughout the microcontroller, sensors, signals, and ML parts, we should try to refer to examples from HCI and ubicomp literature as much as possible (and possibly more broadly as well!)
