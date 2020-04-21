---
layout: default
title: Sensors
nav_order: 2
has_toc: false # on by default
nav_exclude: true
---

Sensors are powerful and fascinating. From an early age, we are taught of the five basic human senses: touch, sight, hearing, smell, and taste. But we don't often think about just how sophisticated and wonderfully complex the human sensing system is from our largest organ, our skin, which can sense temperature and various tactile stimuli to our eyes, which can dynamically focus, adapt to lighting levels, and help preattentively identify moving objects and other shapes—not to mention this network of sensors functioning in real-time, transmitting information to the brain for processing and analysis. Amazing!

Still, we can't sense everything. Dolphins and bats use [echolocation](https://en.wikipedia.org/wiki/Animal_echolocation) to navigate and forage using high-frequency sound pulses, some fish use electrolocation to navigate murky waters by generating electric fields and detecting distortions in these fields [using electroreceptor organs](https://en.wikipedia.org/wiki/Electroreception), some snakes have infrared vision allowing them to see at night, and some animals have the ability to sense and detect a magnetic field to perceive direction, altitude, or location (called [magnetoreception](https://en.wikipedia.org/wiki/Magnetoreception)).

Even for the senses that we do have—as remarkable as they are—our senses will never be as precise or refined as a hawk's vision, a wolf's smell, or a cat's hearing. And, even then, there are far more things to sense in the world than there are biological sensors.

For computing, sensors provide a way to access information about the world, human activity, and beyond. And we are not limited to biology—as amazing and diverse as it is—but rather to our own ingenuity in coming up with ways to capture and process the diverse physical and behavioral phenomena of the world. To us, this is an incredibly exciting challenge!

With advances in sensing technology like [MEMs](https://en.wikipedia.org/wiki/Microelectromechanical_systems), computing (storage, networking, wearables), and in processing and machine learning, now is a fascinating time to study sensing and applied signal processing. 

How can new sensing and processing systems help identify cancer cells, find new life-supporting planets, or change how we fundamentally interact with computing itself (ala capacitive touchscreens on tablets and phones!).

<!-- primary learning goals: expose to certain types of sensors, how to use them, how to process them? how to make some yourself? -->

## Sensors

Wikipedia lists [hundreds of sensors](https://en.wikipedia.org/wiki/List_of_sensors), sorted by "function", including: (1) acoustic, sound, and vibration, (2) moisture and humidity, (3) flow and fluid velocity, (4) optical, light, and imaging, (5) thermal, heat, and temperature, (6) position, angle, displacement, distance, and more. Other categorizations are also possible: Platt's 3rd volume of ["Encyclopedia of Electronic Components"](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307), for example, categorizes sensors into spatial, mechanical, fluid, radiation, and electricity. Regardless of functional categorization, we will only cover a small fraction here.

But first, let's break sensors down by **how** they sense and **what** output they provide.

### Passive vs. active sensing

**Active** sensors require external power and often actively transmit a signal and then analyze some property of that signal (*e.g.,* distortion or reflection) for sensing. For example, an infrared (IR) proximity sensor like the [Sharp GP2Y0A21YK](https://www.sparkfun.com/products/242) contains both an IR transmitter and IR receiver. Distance is calculated via triangulation of the IR beam and its reflection angle back on the IR receiver. Similarly, an ultrasonic distance sensor like the popular and inexpensive [HC-SR04](https://www.sparkfun.com/products/15569) transmits ultrasonic pings and listens for reflected waves. The speed of sound through air is then used to calculate the distance between the sensor to the reflected object.

In contrast, a **passive** sensor generates an output signal based on some external stimulus and does not require external power. For example, a [photoresistor](https://en.wikipedia.org/wiki/Photoresistor) changes its resistance in response to light, a [thermistor](https://en.wikipedia.org/wiki/Thermistor) in response to temperature, and a [force-sensitive resistor](https://en.wikipedia.org/wiki/Force-sensing_resistor) in response to pressure. 

### Sensor output

Sensors output either analog or digital signals. 



## Outline
- Overview of sensor + transducer pipeline
- Overview of different kinds of sensors

## Lesson possibilities
- Force: FSR
- Light: photocell
- Movement: Accel
- Distance: Ultrasonic
- Magnetic field: hall effect
- Sound: microphone