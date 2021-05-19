---
layout: default
title: L3&#58; p5.js Serial
nav_order: 3
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

We've only started to scratch the surface of what's possible in combining Arduino+Computers. In this lesson (and the next), we're going to use [p5.js](https://p5.js.org/) to help demonstrate this potential. It should be fun!

<!-- TODO: consider showing one of our earlier p5.js videos we made for HCID with a controller? -->

<!-- - p5.js demos (I've made three: one output only, one input only, one bidirectional).

## From Arduino to p5.js

- Could walk through them both in p5.js editor and in vscode

Simple ball size demo

EtchaSketch Demo
 -- Not just with pots but also FSRs, maybe the SharpIR sensor?
 -- Then show another version with pretty colors and ball sizes getting bigger? Kind of like that YouTube video version I have.
AccelBallDemo

## From p5.js to Arduino
- 

## Bidirectional
TODO: just generally need to add more screenshots or screen captures. -->

## Processing and p5.js

![](assets/images/ProcessingSketches_CollatzVariations.png)
**Figure.** Variations on the Collatz Conjecture by user [/u/ideology_boi](https://www.reddit.com/r/processing/comments/dy5z5h/collatz_variations/) on Reddit. Coded in ~200 lines in Processing ([code link](https://dailygenerative.art.blog/2019/11/17/reflections/)). Inspired by the Coding Train walkthrough video ["Collatz Conjecture"](https://www.youtube.com/watch?v=EYLWxwo1Ed8).
{: .fs-1 }

[Processing](https://processing.org/) was started by [Casey Reas](https://en.wikipedia.org/wiki/Casey_Reas) and [Ben Frey](https://en.wikipedia.org/wiki/Ben_Fry) at MIT in 2001 to provide an accessible programming tool for combining art+technology. From the Processing website:

>  Since 2001, Processing has promoted software literacy within the visual arts and visual literacy within technology. There are tens of thousands of students, artists, designers, researchers, and hobbyists who use Processing for learning and prototyping.
{: .fs-3 }

Processing includes both an IDE and a Java-based library to allow designers, artists, makers, and engineers to *sketch with code*. The idea is to create a safe, accessible, and easy-to-use coding sandbox to prototype, experiment, and play. Think of Processing like a creative canvas for coders!

When you write code in Processing, you don't even need to know that you're using Java! The Processing framework simplifies the graphical programming experiences and abstracts away this complexity. This design decision for a programming environment may feel familiar! Indeed, the Arduino framework similarly abstracts away complexity and often beginners don't even know they are writing `C/C++`. This similarity is not by accident: the Arduino IDE and programming paradigm is based on Processing!.

It is hard to overemphasize the impact Processing has had on digital artists, creative coders, and even CS education. Processing is now used by professionals and hobbyists alike and has produced work featured in music videos (*e.g.,* [Radiohead's House of Cards](http://www.aaronkoblin.com/work/rh/index.html)), exhibited at art galleries, and featured in movies, TV, and other media. Processing is open source and there is an ethos of sharing work and learning from others. See the [Reddit Processing community](https://www.reddit.com/r/processing/), for example. Read more about the Processing mission at the [Processing Foundation](https://processingfoundation.org/).

<iframe width="736" height="414" src="https://www.youtube.com/embed/8nTFjVm9sTQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**Video.** The music video for Radiohead's House of Cards was coded in Processing. See Aaron Koblin's writeup [here](http://www.aaronkoblin.com/work/rh/index.html). View all of Koblin's work [here](http://www.aaronkoblin.com/) and be inspired!
{: .fs-1 }

<!-- Space simulation in 35 lines of code: https://www.reddit.com/r/processing/comments/dswnx6/a_galaxy_in_35_lines_of_code/ 
https://www.reddit.com/r/processing/comments/gye5sd/platonic_waves_octahedron/
https://www.reddit.com/r/processing/comments/e12eg3/waves/
https://www.reddit.com/r/processing/comments/du2ewt/tree_generator/
-->

### p5.js

In 2008, [John Resig](https://en.wikipedia.org/wiki/John_Resig) (the creator of jQuery) ported Processing to JavaScript, which allowed creators to use Processing without a Java plugin ([Wikipedia](https://en.wikipedia.org/wiki/Processing_(programming_language)#Processing.js)). While an early success—and adopted by teaching programs such as [Khan Academy](https://www.khanacademy.org/)—the port may have come out just a bit early in HTML+JavaScript history.

In 2013, Lauren McCarthy (media artist + professor at UCLA) created [p5.js](https://p5.js.org/), which is now the officially supported JavaScript-based library for Processing and renders natively to the [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element. Similar to the original Processing mission, p5.js is:

>  a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else! p5.js is free and open-source because we believe software, and the tools to learn it, should be accessible to everyone.
{: .fs-3 }

p5.js also has a convenient [online editor](https://editor.p5.js.org/) to easily write and share code. It's quite cool! 

Like Processing, the key overarching concept here is to *sketch with code*—to play, to experiment, to iterate, to rapidly prototype ideas. I find it very intellectually freeing.

<!-- ### p5.js examples -->

<!-- Circle of rings: https://codepen.io/Mamboleoo/pen/JjGZBqL -->

### p5.js examples written in the online editor

Here are some examples that we've written directly in the p5.js editor. You can click on these links to see, edit, and run the code. Note that many of these examples were written while we were still learning p5.js ourselves (and, of course, our learning journey never ends!).

- [Sound Visualizations](https://editor.p5.js.org/jonfroehlich/sketches/d2euV09i)
- [Santa Landscape Generator](https://editor.p5.js.org/jonfroehlich/sketches/KFDQe5sbQ)
- [Cookie Monster Game](https://editor.p5.js.org/jonfroehlich/sketches/oUIeXC9sS)
- [Basic Slider Scroller Game](https://editor.p5.js.org/jonfroehlich/sketches/JwvvVJlNi)
- [Falling Star FFT Game](https://editor.p5.js.org/jonfroehlich/sketches/UvFAcoUgu)
- [Flappy Bird](https://editor.p5.js.org/jonfroehlich/sketches/shtF6XFeY)

## Learning p5.js

After conquering the [OLED display](../advancedio/oled.md) and graphics rendering, p5.js will feel both familiar and infinitely more expressive and accessible. [Processing](https://processing.org/) (for Java) and [p5.js](https://p5.js.org/) (for JavaScript) are some of our favorite programming environments, and we can't wait to share p5.js with you!

There are some **amazing** p5.js learning resources on the web. So, rather than replicate them, we'll simply share them with you!

- Johannes Preis' [Introduction to p5.js](https://medium.com/comsystoreply/introduction-to-p5-js-9a7da09f20aa), an excellent introduction to p5.js, the coding editor, basic graphic rendering, and interactivity.

- The official p5.js [Getting Started](https://p5.js.org/get-started/) guide, which parallels some of the Preis content but still worth a look.

- The plethora of official [p5.js examples](https://p5.js.org/examples/)

- The Coding Train's [Programming with p5.js](https://thecodingtrain.com/beginners/p5.js/) by Daniel Shiffman who probably produces the best, most interesting, fun, and accessible creative coding videos.

- The creator of p5.js, Lauren McCarthy, wrote a book called [Getting started with p5.js : making interactive graphics in JavaScript and Processing](https://alliance-primo.hosted.exlibrisgroup.com/permalink/f/kjtuig/CP71274969160001451), which is available as an e-book via the UW library.

We will also cover parts of p5.js in lecture and in the next few lessons but we assume you've read at least Preis' [Introduction to p5.js](https://medium.com/comsystoreply/introduction-to-p5-js-9a7da09f20aa) and the official p5.js [Getting Started](https://p5.js.org/get-started/) guide.

### Developing p5.js

You can develop p5.js projects either in the [online editor](https://editor.p5.js.org/) or in your favorite web dev environment—we strongly recommend [VS Code](https://code.visualstudio.com). We often switch between using the [online editor](https://editor.p5.js.org/)—to sketch out or easily share quick ideas—and VSCode for larger or more complicated projects. 

#### Setting up p5.js in VSCode

By now, hopefully you've downloaded [Visual Studio Code (VS Code)](https://code.visualstudio.com/) and installed the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension. If not, follow [these instructions](web-serial.md#web-dev-tools) and do so now!

##### Using a p5.js VSCode extension

The easiest way to setup VSCode for p5.js is to install an extension like [p5.vcode](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode) by Sam Lavigne. This extension:
- Auto-creates an empty folder with required HTML/CSS/JavaScript files. To create a new project, open the VSCode Command Palette with `ctrl-shift-p` on Windows or `cmd-shift-p` on Mac and type `Create p5.js Project` then select a new empty folder to put your project in.
- Hooks up autocompletion and documentation for p5.js keywords and functions using TypeScript definitions
- Supplies a local version of p5.js libraries so you and your project can work offline
- Comes bundled with other useful extensions like Live Server to easily launch and test projects with a web server.

If you're a VSCode or web dev novice, we recommend this solution!

##### Manually setting up VSCode for p5.js

Though I've used the above extension, I typically configure VSCode manually for web dev. There is nothing magic about p5.js. It's just a JavaScript library!

The key difficulty is in trying to get VSCode to support autocompletion for p5.js keywords and functions. p5.js is written in vanilla JavaScript rather than [TypeScript](https://www.typescriptlang.org/)—and there is no official build of p5.js TypeScript definition files ([read more here](https://stackoverflow.com/questions/54581512/make-vscode-understand-p5js)).

Thankfully, there are some [great blog posts ](https://breaksome.tech/p5js-editor-how-to-set-up-visual-studio-code/)about how to get this to work.

## p5.js, Web Serial, and Arduino

OK, let's get started making stuff! We'll begin with Arduino sending data to p5.js via serial (`Arduino → Computer`).

<!-- TODO: make circuit diagram -->

### Circle size app

Let's build a simple `Arduino → Computer` p5.js web app that reads in a single floating point number between [0, 1] (as text-encoded data) and draws an appropriately sized circle. For this demonstration, we will be using the Arduino program AnalogOut.ino and the web app called CircleSizeIn (live page, code). The full app experience will look like this:

TODO: insert video

#### The Arduino code: AnalogOut.ino

The Arduino simply needs to read in an analog value using [`analogRead` ](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/) and convert this value to a fraction between [0, 1] (inclusive). To do this, we simply need to divide the `analogVal` by the maximum analog input (which is 1023 on the Arduino Uno and Leonardo because of 10-bit ADCs and 4095 on microcontrollers like the ESP32 that have 12-bit ADCs).

Importantly, we need to set the baud rate to the same value as our web app. In this case, let's use 115200. So, the full program looks like this:

{% highlight C %}
const int DELAY_MS = 5;

const int ANALOG_INPUT_PIN = A0;
const int MAX_ANALOG_INPUT = 1023;

int _lastAnalogVal = -1;

void setup() {
  Serial.begin(115200);
}

void loop() {

  // Get the new analog value
  int analogVal = analogRead(ANALOG_INPUT_PIN);

  // If the analog value has changed, send a new one over serial
  if(_lastAnalogVal != analogVal){
    float sizeFrac = analogVal / (float)MAX_ANALOG_INPUT;
    Serial.println(sizeFrac, 4); // 4 decimal point precision
  }

  _lastAnalogVal = analogVal;
  delay(DELAY_MS);
}
{% endhighlight C %}

There is nothing new here. We've been doing this since the very early [Intro to Arduino](../arduino/index.md) lessons.

#### The p5.js code: CircleSizeIn

Start with a brand new blank project with `index.html`, `css\style.css`, and `sketch.js` files.

The index.html should look like:

{% highlight HTML %}
<!DOCTYPE html>
<html>

<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.js"></script>
  <link rel="stylesheet" type="text/css" href="css\style.css">
  <meta charset="utf-8">
</head>

<body>
  <script src="https://cdn.jsdelivr.net/gh/makeabilitylab/p5js/_libraries/serial.js"></script>    
  <script src="sketch.js"></script> 
</body>

</html>
{% endhighlight HTML %}

The `css\style.css` file:

{% highlight CSS %}
html, body {
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
}
{% endhighlight CSS %}

And the `sketch.js` file:

{% highlight JavaScript %}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(100);
}
{% endhighlight JavaScript %}
