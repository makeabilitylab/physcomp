---
layout: default
title: Sensors
nav_order: 2
has_toc: false # on by default
nav_exclude: true
---

From an early age, we are taught of the five basic human senses: touch, sight, hearing, smell, and taste. But we don't often think about just how sophisticated and wonderfully complex the human sensing system is from our largest organ, our skin, which can sense temperature and various tactile stimuli (pressure, texture, vibration) to our eyes and optic nerves, which can dynamically focus, adapt to lighting levels, and even help preattentively identify moving objects and other shapes. And this interconnected network of sensors function in real-time, transmitting information to the brain for processing and analysis. Amazing!

Still, we can't sense everything. Dolphins and bats use [echolocation](https://en.wikipedia.org/wiki/Animal_echolocation) to navigate and forage using high-frequency sound pulses, some fish use [electrolocation](https://en.wikipedia.org/wiki/Passive_electrolocation_in_fish) to navigate murky waters by generating electric fields and detecting distortions in these fields [using electroreceptor organs](https://en.wikipedia.org/wiki/Electroreception), some snakes have infrared vision allowing them to see at night, and other animals have the ability to sense and detect a magnetic field to perceive direction, altitude, or location (called [magnetoreception](https://en.wikipedia.org/wiki/Magnetoreception)).

<!-- maybe include some creative commons or wikimedia pictures here? -->

Even for the senses that we do have—as remarkable as they are—our senses will never be as precise or refined as a hawk's vision, a wolf's smell, or a cat's hearing. And, even then, there are far more things to sense in the world than there are biological sensors.

For computing, sensors provide a way to access information about the world, human activity, and beyond. And electronic sensors are not limited to biology—as amazing and diverse as it is—but rather to our own ingenuity in coming up with ways to capture the world. This is an incredibly exciting challenge!

With advances in sensing technology like [MEMs](https://en.wikipedia.org/wiki/Microelectromechanical_systems), computing (storage, networking, wearables), and in processing and machine learning, now is a fascinating time to think about and study the role of sensing in an increasingly computational society.

How can new sensing and processing systems help identify cancer cells, find new life-supporting planets, or change how we fundamentally interact with computing itself (ala capacitive touchscreens on tablets and phones!)?

<!-- primary learning goals: expose to certain types of sensors, how to use them, how to process them? how to make some yourself? -->

## Sensors

Humans have invented thousands of sensors. How should we organize them? There are typically three key characteristics: (1) **what** a sensor does (its function), (2) **how** a it senses (passive or active), (3) and the **output** it provides. 

### Characterizing sensors by function

Perhaps the most intuitive and important organizing scheme is by function. Wikipedia lists [hundreds of sensors](https://en.wikipedia.org/wiki/List_of_sensors), sorted by "function", including:

1. Acoustic, sound, and vibration
2. Moisture and humidity
3. Flow and fluid velocity
4. Optical, light, and imaging
5. Thermal, heat, and temperature
6. Position, angle, displacement, distance, and more. 

But other categorizations are also possible: Platt's 3rd volume of ["Encyclopedia of Electronic Components"](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307), for example, categorizes sensors into spatial, mechanical, fluid, radiation, and electricity. 

<!-- Regardless of functional categorization, we will only cover a small fraction here.

But first, let's break sensors down by **how** they sense and **what** output they provide. -->

### Passive vs. active sensing

**Active** sensors require external power and often actively transmit a signal and then analyze some property of that signal (*e.g.,* distortion or reflection) for sensing. For example, an infrared (IR) proximity sensor like the [Sharp GP2Y0A21YK](https://www.sparkfun.com/products/242) contains both an IR transmitter and IR receiver. Distance is calculated via triangulation of the IR beam and its reflection angle back on the IR receiver. Similarly, an ultrasonic distance sensor like the [HC-SR04](https://www.sparkfun.com/products/15569) transmits ultrasonic pings and listens for reflected waves. The speed of sound through air is then used to calculate the distance between the sensor to the reflected object.

In contrast, a **passive** sensor generates an output signal based on some external stimulus and does not require external power. For example, a [photoresistor](https://en.wikipedia.org/wiki/Photoresistor) changes its resistance in response to light, a [thermistor](https://en.wikipedia.org/wiki/Thermistor) in response to temperature, and a [force-sensitive resistor](https://en.wikipedia.org/wiki/Force-sensing_resistor) in response to pressure. Of course, we may need to design a powered circuit to "retrieve" information from the sensor but the underlying sensor is responding to environmental phenomena regardless of its external power state.

### Sensor output

Sensors output either analog, binary (on/off), or digital signals (*e.g.,* [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface)). Pure analog sensors include resistive sensors, like the aforementioned thermistors and photoresistors, which **change their resistance** based on some stimuli as well as ratiometric sensors like the [ADXL335](https://learn.adafruit.com/adafruit-analog-accelerometer-breakouts/overview) accelerometer or the [DRV5055 Hall Effect](https://www.ti.com/product/DRV5055) sensor, both which **vary their voltage output** linearly in response to some stimuli—in this case, acceleration and magnetic fields, respectively.

Many modern sensors are chip-based and include some on-board processing, which processes and converts the raw analog signals to digital output. This digital output is stored in a memory location (called a register) on the sensor chip itself and accessed by a microcontroller via a communication protocol like [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface).

Finally, some "sensors" are either on or off (which could be construed as a type of simple digital output but not one specifically encoded for a microcontroller so does not qualify as "digital signal" in our taxonomy). For example, [reed switches](https://en.wikipedia.org/wiki/Reed_switch) close in the presence of a magnetic field and [tilt ball switches](https://www.adafruit.com/product/173) are hollow tubes with an enclosed conductive ball, which closes internal contacts in certain orientations.

[Platt](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307) provides an even deeper breakdown of sensor output types, including open collector and current. See his book for details.

### Signal acquisition pipeline

Let's examine the entire signal acquisition pipeline from raw physical signal to the digitized representation.

First, there exists some physical phenomena that exists in the world (Stage 1). We need to develop and/or utilize a method to sense that phenomena and output an electrical signal (Stage 2). Some sensor chips process this electrical signal (*e.g.,* apply smoothing)—(an optional) Stage 3. Fourth, an analog-to-digital converter (ADC) converts this electrical signal to bits (a process called quantization). Finally, we can process and analyze the signal using digital signal processing and machine learning, woohoo!

![Signal acquisition pipeline going from physical signal to sensor to signal conditioning to ADC to computer](assets/images/SignalAcquisitionPipeline_Wikipedia.png)
Block diagram from Wikipedia ["Data acquisition"](https://en.wikipedia.org/wiki/Data_acquisition) article. [Direct link](https://en.wikipedia.org/wiki/File:DigitalDAQv2.pdf).
{: .fs-1 }

Some key questions you 

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