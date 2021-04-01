---
layout: default
title: Website Content Ideas
has_toc: false # on by default
nav_exclude: true
usetocbot: true
search_exclude: true
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
- Add in design and design thinking books like Sketching User Experiences?
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
  - Anthony Chen's course at UCLA: https://www.notion.so/2019-Fall-ECE-209AS-Human-Computer-Interaction-82df29ed1b1f49c4bcb245550133f3f8
- Places of inspiration
  - Hackaday
  - Instructables
- What content to add?
  - Logic gates: https://youtu.be/cdMJvFT-Afc
  - IMU 9 DOF with bunny 3D orientation: https://www.adafruit.com/product/2472
- [Beginners guide to ESP8266](https://tttapa.github.io/ESP8266/Chap01%20-%20ESP8266.html)
- Photocell dinosaur game in Chrome: https://twitter.com/null4bl3/status/1247032404990210053
  - Another version: https://www.instagram.com/p/B8ZNyarlrDt/?igshid=6mhgrkmbxpje
  - Wonder if same thing could be used for playing guitar hero (or variants) by sticking on multiple photocells on screen and pressing buttons
  - In fact, you don't need the servo motor--you can just use like a Leonardo or anything that can mount as a joystick to press keys virtually (though not as interesting to watch)
- How to start a lecture: https://twitter.com/davidklaing/status/1280730027361832961
- How to speak: https://vimeo.com/101543862
- Recommended Arduino IDE is Code + PlatformIO: https://www.reddit.com/r/esp8266/comments/fwtxtp/recommended_c_ide_for_arduino_on_linuxdebian/
- AskElectronics FAQ page: https://www.reddit.com/r/AskElectronics/wiki/design
- Online Python course published on GitHub with ipynb files and recommends Jupyter Lab: https://github.com/webartifex/intro-to-python
- Intro to JavaScript codeacademy course: https://www.codecademy.com/learn/introduction-to-javascript 

## Content to add
- How to debug Arduino
  - Evil of using String: https://hackingmajenkoblog.wordpress.com/2016/02/04/the-evils-of-arduino-strings/ (but obviously, fine to use for quick prototypes)
- Filtering
  - Window filters: mean filter, median filter
  - Kalman filtering
    - Kalman filter on ESP32: http://www.iotsharing.com/2019/06/how-to-apply-kalman-filter-to-esp.html
- Electricity primer series
  - http://people.cs.georgetown.edu/~squier/Teaching/ComputerSystemsArchitecture/520-2013-CourseDocuments/Lec-1-electricityPrimer.pdf

## Other Online Physical Computing (or Related) Courses
- RoboGrok at Arizona State: http://www.robogrok.com/index.html
- Teaching Machine Learning resources: https://github.com/kierisi/teaching_ml/blob/master/teaching_ml_resources.md

## HCI + AI
- Real-time sketching + GAN to make sketch interactive: https://twitter.com/dhaakon/status/1237059398175870976
- Face and hand pose tracking in real-time: https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html?linkId=83993617

### Arduino + AI
- Gesture recognition in real-time on Arduino: https://eloquentarduino.github.io/2019/12/how-to-do-gesture-identification-on-arduino/
- TensorFlowLite: how to train tensorflowlite micro speech models: https://learn.adafruit.com/how-to-train-new-tensorflow-lite-micro-speech-models?view=all

## HCI History
- Touchscreen-based gesture controlled Casio watch 1984: https://www.techeblog.com/gesture-controlled-touchscreen-casio-calculator-watch/
- 1986 Puma shoe, RS computer shoe, had a microprocessor built into the heel to record your run and download the data on an Apple III or an IBM PC or a C64. https://twitter.com/Rainmaker1973/status/1189291805004750848?s=20. Puma shoe photo gallery and manual: https://imgur.com/gallery/NfsMIlp

## Fabrication

### 3D Printing
- Removing printed object from plate (funny fail): https://www.reddit.com/r/3Dprinting/comments/g2syhq/when_you_just/
- Physical visualization of Iron Man routes: https://www.reddit.com/r/3Dprinting/comments/g8oqt5/gift_for_a_friend_to_celebrate_his_first_ironman/
- 3D printing a boat: https://twitter.com/Rainmaker1973/status/1188929553294680064?s=20
- Nice poster summarizing key 3d printing tips: https://twitter.com/BillieRubenMake/status/1218496270836256769?s=20

### Laser cutting
- Etching hot dog: https://www.reddit.com/r/lasercutting/comments/fyu6vq/hot_dog/

## Touch/pen/mouse gesture recognizers
- http://depts.washington.edu/acelab/proj/dollar/index.html
- Datasets: https://sites.google.com/site/adriendelaye/home/pen-and-touch-datasets

## Fun with LEDs
- Motion-triggered LED strip shoes: https://www.youtube.com/watch?v=Olgea6h25ug&feature=youtu.be

## ESP32
- ESP32 video series: https://www.youtube.com/playlist?list=PLB-czhEQLJbWMOl7Ew4QW1LpoUUE7QMOo

## Embedded systems/embedded programming
- FastBit Courses on Udemy: https://www.udemy.com/user/kiran-nayak-2/ covering embedded C, timers, RTC, PWM, low power, RTOS, 
- https://www.reddit.com/r/embedded/comments/f4wta3/i_am_looking_for_knowledge_i_am_interested_in/fhw24lh/

## Motors
- Different motor types: servo, DC, stepper
- DC motor torque/speed
- 

## Machine Learning
- Dive into Deep Learning book: http://d2l.ai/
- Introduction to Reinforcement Learning by David Silver from DeepMind: https://www.youtube.com/watch?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ&time_continue=5&v=2pWv7GOvuf0
- Grokking Deep Learning by Andrew Trask: https://www.manning.com/books/grokking-deep-learning?a_aid=grokkingdl&a_bid=32715258
- Math Basics for ML from UPenn: http://www.cis.upenn.edu/~jean/math-basics.pdf 

### Computer Vision
- https://github.com/microsoft/computervision-recipes/blob/master/README.md. "Our target audience for this repository includes data scientists and machine learning engineers with varying levels of Computer Vision knowledge as our content is source-only and targets custom machine learning modelling. The utilities and examples provided are intended to be solution accelerators for real-world vision problems."

## Prototyping

### Cardboard prototyping
- Cardboard prototype xylophone instrument: https://twitter.com/MrsBissonSF/status/1215056588358111232?s=20

## Projects

### Examples from hci lit
Would be cool to assign homework or show examples pulled directly from HCI/UbiComp lit:
- Could do hydrosense (need to find logs though)
- Scratchput
- $1 recognizer

### From the Interwebs
- Mega Tiny Time Watch: watch made using ATtiny: http://www.technoblogy.com/show?2OKF
  - I've previous thought of an assignment to make a wearable LED bracelet with an ATTiny; somewhat similar to this. Could be an interesting first PCB exercise too; I noticed OSHPark does flex PCBs
- Use standard TV remote control and IR to control servo motor: https://www.youtube.com/watch?v=NqXu7SScVIg&feature=youtu.be
- Future of table tennis training: https://twitter.com/ronald_vanloon/status/1246549503987126280?s=11
- IoT touchscreen translated to LED ring position: https://www.reddit.com/r/ArduinoProjects/comments/fpjlei/amazing_how_responsive_the_led_positioning_data/
- Energy lamp shows whether electricity comes from renewable energy sources: https://www.reddit.com/r/arduino/comments/fo4yon/energy_lamp_shows_whether_the_electricity_used/
- Example use of a gyro/IMO to self-level a pool table on a cruise ship: https://twitter.com/rainmaker1973/status/1236660586232102912?s=11
- FlappyBird on Arduino Nano + OLED: https://gitlab.com/richardathome/nano-bird. Could easily adapt my flappy bird clone for this.

## Possible H1 Content
- Motors
- Power
- Sensors
- [Programming microcontrollers](https://itp.nyu.edu/physcomp/lessons/programming/programming-terms-and-programming-environments/)
- Electronic prototyping kits section

## Deep Learning
- Pytorch vs. Keras: https://deepsense.ai/keras-or-pytorch/
- Tensorflow.js: https://www.tensorflow.org/js/

## Designing PCBs
- https://docs.oshpark.com/
- Making first PCB: https://youtu.be/wJXMZybXftk

## Video games
- Create expressive video games: https://www.futurelearn.com/courses/create-expressive-video-games

### Sensors

If we do a sensors subsection:

#### Distance
- [HC-SR04 Ultrasonic guide](https://www.makerguides.com/hc-sr04-arduino-tutorial/) by Makerguides is quite good
- [Sharp IR Distance Sensor](https://www.makerguides.com/sharp-gp2y0a21yk0f-ir-distance-sensor-arduino-tutorial/)--also by Makerguides and also quite good

## Intro to Output TODOs
TODO: 
- [Done in led-blink.md] blink no delay (where to put this?). We do have a fade with no delay at end of led-fade.md
  - [Done in led-blink3.md] But a blink no delay could also show how to blink multiple LEDs at different rates.
- how to hook up multiple LEDS per port with Arduino (in parallel and why). But maybe this belongs in core electronics?
- Where to put breadboard stuff? This should probably go in the basic electronics series but for now my focus is on Arduino stuff...

## Sound

### Making Sound
- https://www.programmingelectronics.com/an-easy-way-to-make-noise-with-arduino-using-tone/
- https://www.cuidevices.com/blog/buzzer-basics-technologies-tones-and-driving-circuits#application-circuit-for-piezo-transducer
- https://learn.adafruit.com/adafruit-arduino-lesson-10-making-sounds/overview
- The Singing Road: america the beautiful via rumble strips: http://thesingingroad.com/

### Sound Responsive
- https://www.instructables.com/id/Arduino-Audio-Input/
- https://www.reddit.com/r/arduino/comments/hfmwjp/_/
- https://www.reddit.com/r/arduino/comments/f2daed/i_built_an_infinity_mirror_musicvisualizer_that/

### Sound processing
- Source separation: https://deezer.io/releasing-spleeter-deezer-r-d-source-separation-engine-2b88985e797e
- Interactive distortion: cool javascript website: https://benmosheron.gitlab.io/blog/2020/04/26/distortion.html
- Sound level meter and spectrum analyzer with Arduino: https://blog.yavilevich.com/2016/08/arduino-sound-level-meter-and-spectrum-analyzer/

<!--  https://www.exploringarduino.com/resources/ -->

## Interactive Book
If we were to treat this as an interactive book. What would it look like? This is just a very drafty (**very drafty**) look with some possible content and flow.

### Chapter 1: Intro to Electronics
- Circuit theory: Ohm's Law, kirchhoffs voltage law, voltage dividers
- Parallel vs. series circuits
- Components: LEDs, resistors, conductors (wires), breadboards
- Make own variable resistor out of lo-fi materials
- (More advanced) components: capacitors, transistors (could also bring this up later)
- What about tools: multimeters, soldering, oscilliscope, wire strippers, etc.

### Chapter 2: Intro to microcontrollers (and Arduino)
- Quick chapter on the basics of microcontrollers?
- Microcontrollers vs. computers
- What is the Arduino?

### Chapter 3: Intro to Output
- Digital output, source and sinking current
- Analog output, PWM, DACs
  - For more on PWM: https://provideyourown.com/2011/analogwrite-convert-pwm-to-voltage/. Currently, we don't have a specific PWM section. Maybe we should? Could go in a Microcontroller section with PWM and Interrupts as sub-sections
- (Maybe include some things about human psychology and interpreting sound, displays, etc?)

### Chapter 4: Intro to Input
- Digital input, debouncing, interrupts
- Analog input, voltage dividers (revisited)
- Maybe something about how fast humans move, etc.

### Chapter 5: Advanced output
- Transistors / motors
- Sound

### Chapter 6: Advanced input
Go through various sensors

### Chapter 5: Sensors
- Sensors: characteristics, taxonomies
- Digital communication protocols like I2C and SPI
- Example sensors including accel, photoresistor, fsr, and more
- IR receivers
  - Why are they often in metal cages: https://electronics.stackexchange.com/questions/295629/why-are-many-ir-receivers-in-metal-cages/295689#295689

### Chapter 6: Signals (or Applied DSP)
- Processing signals
- Time vs. frequency analysis
- Filters
- Noise?
  - Phase noise fundamentals: https://imgur.com/a/T44q4P3
- Features to describe time series signals
  - Why use root mean square rather than absolute average: https://www.researchgate.net/publication/283085046_Sensors_and_Signal_Processing_-_Draft_version_unedited_and_before_final_revision_of_Chapter_5_of_the_book_Mechatronics_Fundamentals_and_Applications/link/5629de9008ae518e347eecc6/download
- Nice plot of quantization error here (Section 4.2): https://www.researchgate.net/publication/283085046_Sensors_and_Signal_Processing_-_Draft_version_unedited_and_before_final_revision_of_Chapter_5_of_the_book_Mechatronics_Fundamentals_and_Applications/link/5629de9008ae518e347eecc6/download
- Fourier analysis leakage and windowing and possible ways to address with filters (Section 4.3): https://www.researchgate.net/publication/283085046_Sensors_and_Signal_Processing_-_Draft_version_unedited_and_before_final_revision_of_Chapter_5_of_the_book_Mechatronics_Fundamentals_and_Applications/link/5629de9008ae518e347eecc6/download
- Convolution (Section 4.4): https://www.researchgate.net/publication/283085046_Sensors_and_Signal_Processing_-_Draft_version_unedited_and_before_final_revision_of_Chapter_5_of_the_book_Mechatronics_Fundamentals_and_Applications/link/5629de9008ae518e347eecc6/download

### Chapter 7: Applied ML
- Classifying these signals!

### Possible additions
- Chapter on motors (or other advanced output). Maybe this is analogous to Chapter 5: Sensors but for Output
- Chapter on ESP32: Moving to a more sophisticated micro
- Chapter on sound: making and listening
- Chapter on tools like soldering, multimeters, etc.
  - Great post by Jeff Glass on setting up an electronics workbench: https://jeff.glass/2019/12/01/electronics-lab-tools/
- Chapter on making PCBs?

Throughout the microcontroller, sensors, signals, and ML parts, we should try to refer to examples from HCI and ubicomp literature as much as possible (and possibly more broadly as well!)
