---
layout: default
title: L3&#58; p5js Serial
nav_order: 3
parent: Communication
has_toc: true # (on by default)
comments: true
usemathjax: true
usetocbot: true
nav_exclude: true
search_exclude: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

We've only started to scratch the surface of what's possible in combining Arduino+Computers. In this lesson (and the next), we're going to use [p5js](https://p5js.org/) to help demonstrate this potential. It should be incredibly fun.

<!-- - p5js demos (I've made three: one output only, one input only, one bidirectional).
- Could walk through them both in p5js editor and in vscode

TODO: just generally need to add more screenshots or screen captures. -->

## Processing and p5js

[Processing](https://processing.org/) was started by [Casey Reas](https://en.wikipedia.org/wiki/Casey_Reas) and [Ben Frey](https://en.wikipedia.org/wiki/Ben_Fry) at MIT in 2001 to provide an accessible programming tool for combining art+technology. From the Processing website:

>  Since 2001, Processing has promoted software literacy within the visual arts and visual literacy within technology. There are tens of thousands of students, artists, designers, researchers, and hobbyists who use Processing for learning and prototyping.
{: .fs-3 }

Processing includes both an IDE and a library around Java to allow designers, artists, makers, and engineers to *sketch with code*. The code is open source. Processing IDE and programming paradigm forms the basis of the Arduino IDE.

It is hard to overemphasize the impact Processing has had on digital artists and creative coders.

### p5js

In 2008, [John Resig](https://en.wikipedia.org/wiki/John_Resig) (the creator of jQuery) ported Processing to JavaScript, which allowed creators to use Processing without a Java plugin. While an early success—and adopted by teaching programs such as Khan Academy—the port may have come out just a bit early in HTML+JavaScript history.

In 2013, Lauren McCarthy (media artist + professor at UCLA) created [p5.js](https://p5js.org/), which is now the officially supported JavaScript-based library for Processing and renders natively to the [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) element. Similar to the original Processing mission, p5js is:

>  a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else! p5.js is free and open-source because we believe software, and the tools to learn it, should be accessible to everyone.
{: .fs-3 }

p5js also has a convenient [online editor](https://editor.p5js.org/) to easily write and share code. It's quite cool! 

### p5.js examples written in the online editor

Here are some examples that we've written directly in the p5.js editor. You can click on these links to see and run the code:

- [Sound Visualizations](https://editor.p5js.org/jonfroehlich/sketches/d2euV09i)
- [Santa Landscape Generator](https://editor.p5js.org/jonfroehlich/sketches/KFDQe5sbQ)
- [Cookie Monster Game](https://editor.p5js.org/jonfroehlich/sketches/oUIeXC9sS)
- [Basic Slider Scroller Game](https://editor.p5js.org/jonfroehlich/sketches/JwvvVJlNi)
- [Falling Star FFT Game](https://editor.p5js.org/jonfroehlich/sketches/UvFAcoUgu)
- [Flappy Bird](https://editor.p5js.org/jonfroehlich/sketches/shtF6XFeY)


## p5js Resources

After conquering the [OLED display](../advancedio/oled.md) and graphics rendering, p5js will feel both familiar and infinitely more expressive and accessible. [Processing](https://processing.org/) (for Java) and [p5.js](https://p5js.org/) (for JavaScript) are some of our favorite programming environments, and we can't wait to share p5.js with you!

There are some **amazing** p5js learning resources on the web. So, rather than replicate them, we'll simply share them with you!

- Johannes Preis' [Introduction to p5.js](https://medium.com/comsystoreply/introduction-to-p5-js-9a7da09f20aa), an excellent introduction to p5js, the coding editor, basic graphic rendering, and interactivity.

- The official p5js [Getting Started](https://p5js.org/get-started/) guide, which parallels some of the Preis content but still worth a look.

- The plethora of official [p5js examples](https://p5js.org/examples/)

- The Coding Train's [Programming with p5.js](https://thecodingtrain.com/beginners/p5js/) by Daniel Shiffman who probably produces the best, most interesting, fun, and accessible creative coding videos.

- The creator of p5js, Lauren McCarthy, wrote a book called [Getting started with p5.js : making interactive graphics in JavaScript and Processing](https://alliance-primo.hosted.exlibrisgroup.com/permalink/f/kjtuig/CP71274969160001451), which is available as an e-book via the UW library.

