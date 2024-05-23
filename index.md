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

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/HenryTapeManWelcome_HandWaverDemo-Optimized.mp4" type="video/mp4" />
</video>
**Video.** Welcome to our Physical Computing virtual learning space! We're so glad you are here. Please feel free to explore, play, make, iterate, and learn. In this video, we are demonstrating using real-time computer vision to track the user's hand, which is then transmitted to Arduino to control a cardboard-crafted person with a servo motor. You can learn how to make this in our [HandPose Serial](communication/handpose-serial.md) lesson. The cardboard person and mountain background scene was created in partnership with two of my favorite makers: a kindergartner and preschooler!
{: .fs-1 }

Welcome 👋!

This website is a place to **learn**, to **invent**, and to have **fun** as we explore concepts related to [physical computing](https://en.wikipedia.org/wiki/Physical_computing) and interaction device design. We'll learn about [electronics](./electronics/index.md), [Arduino](./arduino/index.md), [communicating with computers](./communication/index.md), [designing custom input controllers](./cpx/cpx-keyboard.md), [basic signal processing](./signals/index.md), and more.

Hi 🙋🏽‍♂️, I'm [Jon E. Froehlich](https://jonfroehlich.github.io/), a professor in computer science and human-computer interaction at the University of Washington and the author of this website—which we lovingly call an interactive textbook because you'll learn through animations, movies, embedded code, and simulation. I started building this site during the pandemic as a way of remotely teaching interaction device design. Over time, it's grown far beyond my original intent!

Since our launch in Spring 2020, we have received **nearly 600k views** from over **209 countries** (according to Google Analytics). 🚀

From personal communication, we know that our materials have been used in university courses and maker workshops across the globe 🌎, including at CMU, Stanford, UW ECE, UW HCDE, Purdue, OCAD, Wayne State Univ., Univ. of Victoria, [UDIT](https://girardin.medium.com/teaching-emerging-technologies-to-ux-designers-c2d329ff83cd), Sussex, Dundee, and beyond.

As one example, I received the following note from a professor:

> Your [teaching website](https://makeabilitylab.github.io/physcomp/) is just fantastic. My students and I are grateful to your intuitive explanations, animations, and step-by-step problem-solving approaches. Your site is exactly what I was looking for.
{: .block-quote--small }

We receive similarly glowing notes from students.

<!-- It was originally built to complement the physical and ubiquitous computing courses at the [University of Washington](resources/uw-courses.md) but has proved more broadly useful. -->

So, what are you waiting for? Join us in learning and making together! 🚀

## Why learn physical computing?
<!-- TODO add a video or image here from my teaching or projects to capture the wonder -->

This is a particularly interesting time to survey and explore physical computing because of three, interrelated technology and social trends:

- **The DIY/Makers movement**, which has led to widespread opportunities to interface and work with hardware that has rather low barriers of entry (*e.g.,* the Arduino), provides new opportunities for coupling form with computation (*e.g.,* through digital fabrication), and provides countless online materials/tutorials to help us along (see a resource list [here](resources/index.md)).
- **The pervasiveness of powerful mobile computers and IoT devices** that are constantly on and nearly constantly with us (or around us) and imbued with a rich array of sensors such as accelerometers, gyroscopes, and location-sensing that allow for new types of off-the-desktop interaction
- **Advancements in machine learning and computer vision and maturing ML/CV toolkits/APIs** that enable us to process and use sensor data in new ways for human-computer interaction (without being experts in ML or CV ourselves!) Taken together, we can no longer simply consider the GUI and WIMP interfaces as primary interaction models for computing. 

Enabled by the above three points, our goal is to explore new human-computer interaction possibilities. We will use materials to help us think and to push our own boundaries of what interactive computing is and could be.

And we are not alone, the content here is inspired by a rich set of courses, including [NYU's ITP Physical Computing](https://itp.nyu.edu/physcomp/), UC Berkeley's [Critical Making](http://make.berkeley.edu/) and [Interactive Device Design](http://web.archive.org/web/20150712080846/http://husk.eecs.berkeley.edu/courses/cs294-84-fall14/index.php/Main_Page). See [Inspirations](resources/inspirations.md) and the [Resource list](resources/index.md) for more.

## Learning prerequisites

We assume the following background about our learners:

- **Some coding experience.** For the [introductory lessons](arduino/index.md), we assume comfort and familiarity with basic coding concepts such as functions, loops, variables, and conditionals. We'll be using `C/C++` to program our microcontrollers; however, no previous `C/C++` experience is expected and, indeed, the language itself is rather unimportant (at least at first). If you've programmed in a typed, compiled language like Java, Processing, C#, or other similar languages, you should be fine. If you've programmed in a dynamically-typed language like JavaScript, Python, or Ruby, then `C/C++` may take some getting used to but the overall structure of coding is not that different. Later lessons require more advanced programming concepts such as memory management, library development, classes, *etc.*

- **No previous experience with hardware.** In contrast, we assume no previous experience with electronics or microcontrollers.

As physical and ubiquitous computing are inherently multidisciplinary fields spanning electrical engineering, computer science, signal processing, human-computer interaction, machine learning, and more (*e.g.,* applied anthropology) there are many diverse topic areas—and too many to cover in one course or website. The content here reflects what we teach to graduate and upper-level bachelor students (typically with engineering and/or computer science backgrounds).

{: .note }
If you have limited (or no) experience in electronics and coding, then we have a [new(ish) lesson series using the Circuit Playground Express](./cpx/index.md) and the drag-and-drop visual programming language MakeCode. Check it out [here](./cpx/index.md)! We use these materials in our Prototyping Studio course with HCI+design students.

The [Intro to Arduino](arduino/index.md) lessons were written for a more general audience and should be suitable for interaction design courses in information science or design fields (but again, do assume some coding experience).

## Learning philosophy: learn by doing

A key pedagogical philosophy underlying our teaching is **learn by doing**. From years of experience, we've found that the best way to teach physical computing is via hands-on exercises. So, we we expect that you will build along with our guides and lessons.

![Example projects from some physical computing-related courses taught by Jon E. Froehlich]({{ site.baseurl }}/assets/images/ExampleAssignmentsAndProjects.jpg)
Example projects from our courses.
{: .fs-1 }

## Example Hardware Kits

Here are some example hardware kits that we provide students in our classes.

- CSE493F Prototyping Interactive Systems with AI: [Spring'24](https://docs.google.com/spreadsheets/d/1JK4UFWCBNOjAkROK0xIcQqoCxdTe6ltC_HgbnESMkwE/edit#gid=0)
- CSE490 Physical Computing: [Spring'21](https://docs.google.com/spreadsheets/d/1R2JqlGt5uzvqELevAIm99jlwRd08RPa6LtFQGwu32eM/edit#gid=0)
- CSE590 Ubiquitous Computing: [Spring'20](https://docs.google.com/spreadsheets/d/177bLxoFWkBTETf0IBI6YSj0D7ARB_cDI5G91fDpNaeg/edit?usp=sharing)
- HCID521 Prototyping Studio: [Winter'20](https://docs.google.com/spreadsheets/d/1KeoEjHCCumzPbEeb42TR2nPVxbmhVrfT0AzasvnKFPU/edit?usp=sharing)
- CSE599 Prototyping Interactive Systems: [Spring'19](https://docs.google.com/spreadsheets/d/15ltWMcmYbSrWlz8ajt5TZfj8ZXctMJVueplwYYdZKdc/edit?usp=sharing)

## About this website

This website, which we call an "interactive textbook", began as a response to teaching physical computing remotely due to Covid-19. My original (humble) goal was simply to translate my lectures slides to more readable online versions; however, I have continued to work on it post COVID as a resource to complement my in-person teaching.

All code on this website is open source, including the [website itself](https://github.com/makeabilitylab/physcomp). If you'd like to contribute, please read the [web dev setup guide here](website-install.md), start coding, and make a pull request!

### Use of this website in your courses/workshops

In short, we ♥ it when others use and benefit from this material!

If you incorporate or use any pieces of this website in your teaching or workshops, we'd love to hear from you! Please email jonf@cs.uw.edu. I love hearing about the ways that our materials have helped you learn and/or teach!

### Code links

For our tutorials, we often link to example code in the following repositories:

- [The Makeability Lab Arduino repository](https://github.com/makeabilitylab/arduino)
- [The Makeability Lab p5js repository](https://github.com/makeabilitylab/p5js)

### Acknowledgments

Diagrams, animations, pictures, and videos are by Jon E. Froehlich unless otherwise noted and were created using [Tinkercad Circuits](https://www.tinkercad.com/circuits), [Fritzing](http://fritzing.org/), [Autodesk Eagle](https://www.autodesk.com/products/eagle/overview), and [Microsoft PowerPoint](https://products.office.com/en-us/powerpoint). For some Fritzing diagrams, we use the [Adafruit Fritzing Library](https://learn.adafruit.com/using-the-adafruit-library-with-fritzing?view=all).

As noted, for course and content inspirations, see our [Resources](resources/index.md) page and our [Inspirations](resources/inspirations.md) page.

This website site is built in [Jekyll](https://jekyllrb.com/) with the [Just the Docs](https://github.com/pmarsceill/just-the-docs) theme.

<!--
## Ideas to Call This Repo and Site?
- Physical Computing (or physcomp)
- Ubiquitous Computing (or ubicomp)
- Interactive Device Design (Bjoern's name)
- Tangible Interactive Computing (name of my UMD course)
- Prototyping Interactive Systems (name of my UW 599)-->
