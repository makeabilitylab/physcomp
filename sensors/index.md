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

<!-- TODO: in future add in a sub-section on MEMS because it's so AWESOME! : -->

### Sensor output

Sensors output either analog, binary (on/off), or digital signals (*e.g.,* [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface)). 

#### Analog output

Pure analog sensors include resistive sensors, like the aforementioned thermistors and photoresistors, which **change their resistance** based on some stimuli as well as ratiometric sensors like the [ADXL335](https://learn.adafruit.com/adafruit-analog-accelerometer-breakouts/overview) accelerometer or the [DRV5055 Hall Effect](https://www.ti.com/product/DRV5055) sensor, both which **vary their voltage output** linearly in response to some stimuli—in this case, acceleration and magnetic fields, respectively.

#### Digital output

Many modern sensors are chip-based and include some on-board processing, which processes and converts the raw analog signals to digital output. This digital output is stored in a memory location (called a register) on the sensor chip itself and accessed by a microcontroller via a communication protocol like [I2C](https://en.wikipedia.org/wiki/I%C2%B2C) and [SPI](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface). 

For example, in contrast to the [ADXL335](https://learn.adafruit.com/adafruit-analog-accelerometer-breakouts/overview) accelerometer, which outputs a voltage proportional to acceleration on each axis on pins X, Y, and Z, the [LIS3DH](https://www.adafruit.com/product/2809) accelerometer communicates over either I2C or SPI. We often supply one or the other in our hardware kits. 

Because the LIS3DH supports a digital communication protocol (both I2C and SPI), so you can configure the sensor hardware via code (*e.g.,* set the [acceleration range](https://learn.adafruit.com/adafruit-lis3dh-triple-axis-accelerometer-breakout/arduino) from +-2g to +-16g)

| ADXL335 Accelerometer | LIS3DH Accelerometer |
| --------------------- | -------------------- |
| ![Picture of ADXL335 - 5V ready triple-axis accelerometer (+-3g analog out)](assets/images/ADXL335_Accelerometer_Adafruit.png) | 
| ![Adafruit LIS3DH Triple-Axis Accelerometer (+-2g/4g/8g/16g)](assets/images/LIS3DH_Accelerometer_Adafruit.png) |

#### Binary output

Finally, some "sensors" are either on or off (which could be construed as a type of simple digital output but not one specifically encoded for a microcontroller so does not qualify as "digital signal" in our taxonomy). For example, [reed switches](https://en.wikipedia.org/wiki/Reed_switch) close in the presence of a magnetic field and [tilt ball switches](https://www.adafruit.com/product/173) are hollow tubes with an enclosed conductive ball, which moves to close internal contacts in certain tube orientations.

[Platt](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307) provides an even deeper breakdown of sensor output types, including open collector and current. See his book for details.

## Signal acquisition pipeline

Let's examine the entire signal acquisition pipeline from raw physical signal to the digitized representation.

First, there exists some physical phenomena that exists in the world (Stage 1). We need to develop and/or utilize a method to sense that phenomena and output an electrical signal (Stage 2). Some sensor chips process this electrical signal (*e.g.,* smooth, filter, amplify)—Stage 3. In Stage 4, an analog-to-digital converter (ADC) converts the electrical signal to bits (a process called quantization). Finally, in Stage 5, we can process and analyze the digitized signal using digital signal processing (DSP) techniques and machine learning, woohoo!

![Signal acquisition pipeline going from physical signal to sensor to signal conditioning to ADC to computer](assets/images/SignalAcquisitionPipeline_Wikipedia.png)
Block diagram from Wikipedia ["Data acquisition"](https://en.wikipedia.org/wiki/Data_acquisition) article. [Direct link](https://en.wikipedia.org/wiki/File:DigitalDAQv2.pdf).
{: .fs-1 }

### Some signal acquisition considerations

When selecting sensors and a data processing pipeline, there are multiple considerations, including:

- **Sampling rates.** How often does the target physical signal change? How quickly can your sensor respond? Does this response rate matter? A photoresistor, for example, takes several milliseconds to respond to bright light and can require more than one second to regain its dark resistance while a phototransitor and photodiode are far more responsive (see [Platt](https://learning.oreilly.com/library/view/encyclopedia-of-electronic/9781449334307/ch20.html#SECTION_PHOTORESISTOR)). 
- **ADC conversion rates** How fast can your microcontroller sample the signal and perform the analog-to-digital conversion?
- **ADC precision** What precision of ADC do you need? The ATmega328 microcontroller uses a 10-bit ADC. So, by default, the voltage range of 0-5V is mapped to 0-1023 $$2^10$$ and, thus, the resolution between readings is 5V / 1024 or 0.0049 volts (4.9 mV). If you require greater precision—that is, changes in sensor output < 0.0049V are important—then you either need to change the [`analogReference`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogreference/) or you need a different ADC.

### Nyquist sampling theorem

One of the most important (and interesting!) theorems in DSP is the [*Nyquist-Shannon Sampling Theorem*](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem), which states that a continuous time signal (the raw physical signal) can be sampled and perfectly reconstructed (!) if the sampling rate is over twice as fast as the raw signal's highest frequency component. That is, the minimum sampling frequency > $$2 \cdot max(signal_{freq})$$.

For example, a common digital audio sampling rate is [44,100Hz](https://en.wikipedia.org/wiki/44,100_Hz) (44.1 kHz). This sampling rate was chosen, in part, because the human hearing range is ~20 Hz to 20kHz. Hence, according to the above theorem, the minimum sampling frequency needed to be at least $$2 * 20kHz$$ or 40kHz. 

### ATmega328 ADC conversion rate

The ATmega328 ADC requires an input clock frequency between 50kHz and 200kHz (Section 24.4 of [datasheet](http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061A.pdf)). A normal conversion takes 13 ADC clock cycles (though the very first conversion takes 25 ADC clock cycles to initialize the analog circuitry)

The ATmega328 CPU and ADC share the same clock; however, the microcontroller clock is too fast (16MHz) on the Uno so you can adjust a "prescaler" to divide the CPU clock into an acceptable range (divisors are 2, 4, 8, 16, 32, 64, 128). By default, the Arduino library sets the prescaler to 128 (16MHz/128 = 125 KHz) in `wiring.c`. Since a conversion takes 13 ADC clocks, the sample rate is about 125KHz/13 or **9600 Hz**.

It's possible, however, to sample faster but at a cost of ADC accuracy. The ATmega328 datasheet warns that if the ADC input clock frequency exceeds 200kHz then not all 10 bits of conversion may be ready (perhaps just the first 8 bits or less). 

If you want to learn more about faster analog reads on the Arduino, Open Music Labs has explored the speed/quality tradeoffs of the ATmega328 ADC [here](http://www.openmusiclabs.com/learning/digital/atmega-adc/index.html) and [here](http://www.openmusiclabs.com/learning/digital/atmega-adc/in-depth/index.html). In addition, this [blog post ](http://yaab-arduino.blogspot.com/2015/02/fast-sampling-from-analog-input.html) talks about using the "ADC Free Running mode" with interrupts to get a 76.8 KHz sampling rate (and also links [here](https://sites.google.com/site/qeewiki/books/avr-guide/analog-input))

<!-- See also: http://ee-classes.usc.edu/ee459/library/documents/ADC.pdf -->

### Changing the analog conversion range

The Arduino library also supports changing the ADC range from the default of $$0-5V$$ to $$0-X$$ where $$X$$ is any value between 1.0V and $$V_{cc}$$ (which is 5V on the Uno). You can do this via the `[analogReference](https://www.arduino.cc/reference/en/language/functions/analog-io/analogreference/)` function. This may be useful, for example, if you know that your sensors output voltages between 0-3.3V, then setting `analogRerence(EXTERNAL)` and applying 3.3V to the `AREF` pin on the Arduino improves the ADC resolution from 4.9mV to 3.2mV.  

## Let's make stuff!

With that, let's make some stuff with sensors.

<!-- ### Human related I/O
For human related I/O, human reaction time to an external stimulus is ~150-300ms (try a [human benchmark](https://www.humanbenchmark.com/tests/reactiontime)) and modern monitors refresh at 60Hz

See: https://gamedev.stackexchange.com/a/30289 -->


<!-- ## Lesson possibilities
- Force: FSR
- Light: photocell
- Movement: Accel
- Distance: Ultrasonic
- Magnetic field: hall effect
- Sound: microphone -->