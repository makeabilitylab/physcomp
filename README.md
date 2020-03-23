---
layout: default
title: Home
nav_order: 0
usemathjax: true
description: "This is a description! UPDATE!!!"
permalink: /
---
> Joy is a well-made object, equaled only to the joy of making it.
{: .v-align-bottom}

- A Canadian Native American tribe saying, as quoted by Mark Fraunfelder (author, co-founder of [BoingBoing](https://boingboing.net/), & former editor of MAKE Magazine)
{: .fs-2 .pl-8}

<!-- including other markdown pages: https://stackoverflow.com/a/41966993/388117>
<!-- {% include_relative tutorials/index.md %} -->

## About this website

## Acknowledgments
Diagrams, animations, pictures, and videos are by Jon E. Froehlich unless otherwise noted and were created using [Tinkercad Circuits](https://www.tinkercad.com/circuits), [Fritzing](http://fritzing.org/), and [Autodesk Eagle](https://www.autodesk.com/products/eagle/overview).

## TODO
- [Done] Update format for blockquote in "just the docs" to https://codepen.io/cliftwalker/pen/XJaEXY
  - Need to modify the css style:
  - See: https://aregsar.com/blog/2019/how-to-customize-your-github-pages-blog-style-in-five-minutes/
  - https://pmarsceill.github.io/just-the-docs/docs/customization/#override-styles
  - Here's miminimal mistakes version: https://raw.githubusercontent.com/mmistakes/minimal-mistakes/master/docs/_posts/2013-01-11-markup-html-tags-and-formatting.md
    - And the scss: https://github.com/mmistakes/minimal-mistakes/blob/0cf1a2e1144336b5e026d13b5fd87dc2af02fe8c/_sass/minimal-mistakes/_base.scss
- Possible to add last modified date into file?
- [Done] Embedding code from github repo into jekyll post
  - https://blog.revathskumar.com/2012/08/embed-files-from-github-repository-into-webpage.html
  - https://flowerinthenight.com/blog/2017/11/28/embed-github-code
- Electronic prototyping kits section
- Have citation manager for references on each page?
  - https://www.amirasiaee.com/dailyreport/jekyll-scholar/
  - https://github.com/inukshuk/jekyll-scholar
  - Unfortunately, Jekyll Scholar plugin is not compatible with GitHub Pages
- Maybe have a top-level link for UW Courses?
- How to hide headers in tables in markdown?
  - https://stackoverflow.com/questions/17536216/create-a-table-without-a-header-in-markdown
- Make Next/Previous buttons same size like in Minimal Mistakes

## Possible H1 Content
- Motors
- Power
- Sensors
- [Programming microcontrollers](https://itp.nyu.edu/physcomp/lessons/programming/programming-terms-and-programming-environments/)

## Markdown Tips

### Make a Note (Call Out Box)
- https://stackoverflow.com/questions/25654845/how-can-i-create-a-text-box-for-a-note-in-markdown

### Option 1

---

**NOTE**

It works with almost all markdown flavours (the below blank line matters). This is from [link](https://stackoverflow.com/a/41449789/388117).

---

### Option 2

> **_NOTE:_**  You could also try a block quote format from [link](https://stackoverflow.com/a/43120795/388117).

### Option 3

    Start on a fresh line
    Hit tab twice, type up the content
    Your content should appear in a box. However, doesn't appear to now support markdown. For example, **this** should be bold. However, I can still use html it appears? For example, <b>this</b> is bold? Or maybe not! So, perhaps this is treated as a code block or something...

# Static Site Generator Options

## Jekyll
- Minimal Mistakes
- "Just the Docs"

## Just the Docs

### Better support for grandchildren
Looks like it was addressed here:
- https://pdmosses.github.io/test-nav/docs/utilities
- https://github.com/pmarsceill/just-the-docs/pull/192
- See also: https://github.com/pmarsceill/just-the-docs/pull/252?

### To Build with Jekyll
To build the docs with Jekyll,
- Open iTerm in /physcomp/docs
- `> bundle`
- `> bundle exec jekyll serve`
- Follow directions for web addie

## Python
- [mkdocs.org](https://mkdocs.org).

## Rust
- [mdbook](https://rust-lang.github.io/mdBook/). Examples below:
  - [Intro to Reverse Engineering](https://guyinatuxedo.github.io/)

## Notes
- To crop animated gifs, I use: https://ezgif.com/

### Code highlighting
<!-- Code snippet highlighting: https://jekyllrb.com/docs/liquid/tags/#code-snippet-highlighting -->

#### Using Jekyll's `highlight` functionality
This is a test.
{% highlight C %}
void loop() {
  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);               // wait for a second
  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);               // wait for a second
}
{% endhighlight C %}

#### Using Markdown's ` ```C``` `
```C
void loop() {
  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);               // wait for a second
  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);               // wait for a second
}
```

### Using `gist-it.appspot.com` to embed code directly from GitHub
<!-- <script src="http://gist-it.appspot.com/http://github.com/$file"></script> -->
This is awesome! Can embed code directly!
<script src="http://gist-it.appspot.com/https://github.com/jonfroehlich/arduino/blob/master/Basics/digitalWrite/Blink/Blink.ino?footer=minimal"></script>

### Adding LaTeX support
After a bit of experimentation, I got LaTeX to work using a **remote** Jekyll template and GitHub Pages. Steps:
1. I largely followed the advice from this [blog post](https://alan97.github.io/random/mathjax/)
2. Since I'm currently using `remote_theme: pmarsceill/just-the-docs`, I was a bit confused about how to make local configuration changes since most online blogs, forum posts talk about editing content in the `_includes` folder; however, I didn't have this in my local dev environment. So, what to do?
3. I manually made a `_includes` folder with the filename `head_custom.html` and put in there:

```Jekyll
{% if page.usemathjax %}
<script type="text/javascript" async
 src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
  </script>
{% endif %}
```

4. Still need to test that this works when deployed on GitHub.

5. Because I'm forever a LaTeX n00b, I found this online WYSIWYG LaTeX math editor: https://www.mathcha.io/editor. See: https://tex.stackexchange.com/questions/57068/wysiwyg-latex-editor-for-maths

Here's a test LaTeX equation. If it works, this should render correctly.

$$\frac{\partial f(y)}{\partial x} = \frac{\partial f}{\partial y} \times \frac{\partial y}{\partial x}$$

<!--
## Ideas to Call This Repo and Site?
- Physical Computing (or physcomp)
- Ubiquitous Computing (or ubicomp)
- Interactive Device Design (Bjoern's name)
- Tangible Interactive Computing (name of my UMD course)
- Prototyping Interactive Systems (name of my UW 599)-->