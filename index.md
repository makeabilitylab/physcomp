---
layout: default
title: Home
nav_order: 0
usemathjax: true
description: "Website Overview"
usetocbot: true
permalink: /
---

> Joy is a well-made object, equaled only to the joy of making it.
{: .v-align-bottom .margin-zero }

\- A [Haida](https://en.wikipedia.org/wiki/Haida_people) saying
{: .fs-2 .mt-1 .text-right}

<video autoplay loop muted playsinline style="margin:0px" aria-label="A cardboard-crafted person waves its hand, controlled by a servo motor tracking a user's real hand via computer vision.">
  <source src="assets/videos/HenryTapeManWelcome_HandWaverDemo-Optimized.mp4" type="video/mp4" />
</video>
**Video.** Welcome to our **Physical Computing virtual learning space**! In this video, we are using real-time computer vision to track the user's hand, which is then transmitted to Arduino to control a cardboard-crafted person with a servo motor. The cardboard person and mountain background scene was created in partnership with two of my favorite makers: a kindergartner and preschooler! You can learn how to make this in our [HandPose Serial](communication/handpose-serial.md) lesson.
{: .fs-1 }

Welcome 👋!

We’re so glad you are here. This interactive textbook is a place to **learn**, to **invent**, and to have **fun** exploring [physical computing](https://en.wikipedia.org/wiki/Physical_computing) and interaction device design. Join us in exploring, playing, making, iterating, and learning!  

Hi 🙋🏽‍♂️, I'm [Jon E. Froehlich](https://jonfroehlich.github.io/), a professor in computer science and human-computer interaction at the University of Washington. I originally built this site to help teach my **physical computing courses** at UW but it's grown beyond my imagination! The website is designed to help you learn through animations, movies, embedded code, and simulation.

## What you'll learn
By following along with our lessons and guides, you will explore:
* ⚡**[Intro to Electronics](./electronics/index.md):** The fundamentals of electricity (voltage, current, resistance), circuit schematics, and safely building circuits with LEDs and resistors.
* 🤖 **[Intro to Arduino](./arduino/index.md):** Programming microcontrollers in `C/C++` to read analog/digital inputs, control actuators, and build your first interactive devices.
* 📡 **[Sensors](./sensors/index.md) & [Advanced I/O](./advanced-io/index.md):** Deep dives into how sensors capture the world (force, light, distance, motion) and how to control advanced outputs like OLED displays and haptic vibromotors.
* 💻 **[Computer Communication](./communication/index.md):** Bridging hardware and software using Web Serial, [p5.js](https://p5js.org/), and [ml5.js](https://ml5js.org/) for browser-based interactions and applied machine learning.
* ☁️ **[Internet of Things (IoT) with ESP32](./esp32/index.md):** Building wireless, internet-connected projects using the powerful ESP32 microcontroller.
* 📈 **[Signals & Data Science](./signals/index.md):** Using Python and Jupyter Notebooks for digital signal processing, frequency analysis, and building machine-learning gesture recognizers.
* 🕹️ **[Circuit Playground Express (CPX)](./cpx/index.md):** An accessible, beginner-friendly introduction to physical computing using Adafruit's CPX and drag-and-drop visual programming (MakeCode).

## Why learn physical computing?

This is a particularly exciting time to explore physical computing, driven by three interrelated trends:
* **The Maker Movement:** Low barriers to entry for hardware interfacing and digital fabrication have made it easier than ever to couple physical form with computation.
* **Pervasive IoT & Mobile:** Ubiquitous, sensor-rich devices allow us to break away from traditional keyboards and mice, exploring off-the-desktop interaction models.
* **AI & Computer Vision:** Maturing toolkits allow us to process complex sensor data for human-computer interaction without needing to be machine learning experts.

## Learning prerequisites

We assume the following background:
* **Some coding experience:** For the [introductory Arduino lessons](arduino/index.md), we assume familiarity with basic concepts like functions, loops, variables, and conditionals. We use `C/C++`, but previous experience with it is not required. If you know Java, Python, or JavaScript, you will be fine.
* **No hardware experience:** We assume zero previous experience with electronics or microcontrollers.

{: .note }
If you have limited coding experience, [explore our Circuit Playground Express (CPX) lessons](./cpx/index.md)! We use the visual drag-and-drop language MakeCode, which is excellent for introductory interaction design.

## Learning philosophy: learn by doing

Our core pedagogical philosophy is **learn by doing**. The best way to understand physical computing is through hands-on practice. We expect you to build along with our guides, make mistakes, iterate, and experiment.

![A collage of physical computing projects created by university students, featuring custom game controllers, interactive light displays, and accessible hardware interfaces.]({{ site.baseurl }}/assets/images/ExampleAssignmentsAndProjects.jpg)
Example projects from our courses.
{: .fs-1 }

## Example Hardware Kits

Here are some example hardware kits that we provide students in our classes:

* CSE493F Physical Computing: [Spring '26](https://docs.google.com/spreadsheets/d/1jOJdXD4a39GWbcveDMml3thYMrI1AKAaDv6IGnH6jXU/edit?gid=0#gid=0)
* CSE493F Prototyping Interactive Systems with AI: [Spring '24](https://docs.google.com/spreadsheets/d/1JK4UFWCBNOjAkROK0xIcQqoCxdTe6ltC_HgbnESMkwE/edit#gid=0)
* CSE490 Physical Computing: [Spring '21](https://docs.google.com/spreadsheets/d/1R2JqlGt5uzvqELevAIm99jlwRd08RPa6LtFQGwu32eM/edit#gid=0)
* CSE590 Ubiquitous Computing: [Spring '20](https://docs.google.com/spreadsheets/d/177bLxoFWkBTETf0IBI6YSj0D7ARB_cDI5G91fDpNaeg/edit?usp=sharing)
* HCID521 Prototyping Studio: [Winter '20](https://docs.google.com/spreadsheets/d/1KeoEjHCCumzPbEeb42TR2nPVxbmhVrfT0AzasvnKFPU/edit?usp=sharing)

## Global Impact & Testimonials

Since our launch in Spring 2020, we have received **over 700k views** from **209+ countries** (via Google Analytics). 🚀

Our materials have been used in university courses and maker workshops **across the globe**, including at CMU, Stanford, UW ECE, Purdue, OCAD, Wayne State, NYU Shanghai, Univ. of Victoria, [UDIT in Madrid](https://girardin.medium.com/teaching-emerging-technologies-to-ux-designers-c2d329ff83cd), Sussex, Dundee, and beyond.

> "Your site is exactly what I was looking for. My students and I are grateful to your intuitive explanations, animations, and step-by-step problem-solving approaches."
> — *University Professor*
{: .block-quote--small }

> "I'd highly recommend taking this class; it was one of my favorites at UW. I don't come from too much of a tinkering, embedded, hardware background. This class helped me think about HCI in a really different way."
> — *UW Student*
{: .block-quote--small }

## Use This Website In Your Courses/Workshops

We ❤️ it when others use and benefit from this material! If you incorporate or use any pieces of this website in your teaching or workshops, please let me know at `jonf@cs.uw.edu`. I love hearing about the ways our materials help you learn and teach!

For our tutorials, we often link to example code in the following repositories:

* [The Makeability Lab Arduino repository](https://github.com/makeabilitylab/arduino)
* [The Makeability Lab p5js repository](https://github.com/makeabilitylab/p5js)

## Website Code

All code on this website is open source, including the [website itself](https://github.com/makeabilitylab/physcomp). If you'd like to contribute, please read the [web dev setup guide](website-install.md), start coding, and make a pull request!

### Acknowledgments

Diagrams, animations, pictures, and videos are by Jon E. Froehlich unless otherwise noted, created using [Tinkercad Circuits](https://www.tinkercad.com/circuits), [Fritzing](http://fritzing.org/), [Autodesk Eagle](https://www.autodesk.com/products/eagle/overview), and Microsoft PowerPoint. Fritzing diagrams often use the [Adafruit Fritzing Library](https://learn.adafruit.com/using-the-adafruit-library-with-fritzing?view=all).

The content here is inspired by a rich set of courses, including [NYU's ITP Physical Computing](https://itp.nyu.edu/physcomp/), UC Berkeley's [Critical Making](http://make.berkeley.edu/) and [Interactive Device Design](http://web.archive.org/web/20150712080846/http://husk.eecs.berkeley.edu/courses/cs294-84-fall14/index.php/Main_Page). See [Inspirations](resources/inspirations.md) and the [Resource list](resources/index.md) for more.

This website is built in [Jekyll](https://jekyllrb.com/) with the [Just the Docs](https://github.com/pmarsceill/just-the-docs) theme.
