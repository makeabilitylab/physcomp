---
layout: default
title: Website Dev Notes
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

## Website TODO
- [Done] Update format for blockquote in "just the docs" to https://codepen.io/cliftwalker/pen/XJaEXY
  - Need to modify the css style:
  - See: https://aregsar.com/blog/2019/how-to-customize-your-github-pages-blog-style-in-five-minutes/
  - https://pmarsceill.github.io/just-the-docs/docs/customization/#override-styles
  - Here's miminimal mistakes version: https://raw.githubusercontent.com/mmistakes/minimal-mistakes/master/docs/_posts/2013-01-11-markup-html-tags-and-formatting.md
    - And the scss: https://github.com/mmistakes/minimal-mistakes/blob/0cf1a2e1144336b5e026d13b5fd87dc2af02fe8c/_sass/minimal-mistakes/_base.scss
- Add in 'info box` support like minimal mistakes
- Add in auto-TOC (Table of contents) with sticky support: https://tscanlin.github.io/tocbot/
- Add in figure captioning support (minimal mistakes also has this)
- Possible to add last modified date into file?
- Update all arduino code in github to include link back to website
- [Done] Embedding code from github repo into jekyll post
  - https://blog.revathskumar.com/2012/08/embed-files-from-github-repository-into-webpage.html
  - https://flowerinthenight.com/blog/2017/11/28/embed-github-code
- Have citation manager for references on each page?
  - https://www.amirasiaee.com/dailyreport/jekyll-scholar/
  - https://github.com/inukshuk/jekyll-scholar
  - Unfortunately, Jekyll Scholar plugin is not compatible with GitHub Pages
- Maybe have a top-level link for UW Courses?
- How to hide headers in tables in markdown?
  - https://stackoverflow.com/questions/17536216/create-a-table-without-a-header-in-markdown
- Make Next/Previous buttons same size like in Minimal Mistakes?
- Make it so if you left-click on an image, it shows up as a pop-up with a description below?

## Markdown Tips

### Embedding markdown content on a page

Including other markdown pages: https://stackoverflow.com/a/41966993/388117.

<!-- {percent sign include_relative tutorials/index.md percent sign} -->

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

## Notes
- To crop animated gifs, I use: https://ezgif.com/

# Static Site Generator Options

## Python
- [mkdocs.org](https://mkdocs.org).

## Rust
- [mdbook](https://rust-lang.github.io/mdBook/). Examples below:
  - [Intro to Reverse Engineering](https://guyinatuxedo.github.io/)

## Jekyll

### Installation

#### Mac
- Follow the [official installation guide](https://jekyllrb.com/docs/installation/)

#### Windows
- I used the Chocolatey Windows package manager ([installation instructions here](https://chocolatey.org/install)). Fastest way to open PowerShell with admin privilages is `Windows-X`
- Then I followed the instructions [here](https://learn.cloudcannon.com/jekyll/install-jekyll-on-windows/) and [here](https://malekbenz.com/blog/2017/09/05/Install-Jekyll-on-Windows-with-Chocolatey).
- Note: I still haven't gotten Jekyll to run on Windows...


### Templates
- Minimal Mistakes
- "Just the Docs"

### Just the Docs
Probably my favorite template that I've evaluated so far

#### Better support for grandchildren
Looks like it was addressed here:
- https://pdmosses.github.io/test-nav/docs/utilities
- https://github.com/pmarsceill/just-the-docs/pull/192
- See also: https://github.com/pmarsceill/just-the-docs/pull/252?

### To Build with Jekyll
To build the docs with Jekyll,
- Open iTerm in /physcomp/docs
- `> bundle`
- `> bundle exec jekyll serve` (actually, use `> bundle exec jekyll serve --baseurl ''`)
- Follow directions for web address, typically: `https://127.0.0.1:4000`

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

4. Still need to test that this works when deployed on GitHub. Update: it does!

5. Because I'm forever a LaTeX n00b, I found this online WYSIWYG LaTeX math editor: https://www.mathcha.io/editor. See: https://tex.stackexchange.com/questions/57068/wysiwyg-latex-editor-for-maths

Here's a test LaTeX equation. If it works, this should render correctly.

$$\frac{\partial f(y)}{\partial x} = \frac{\partial f}{\partial y} \times \frac{\partial y}{\partial x}$$

## Disqus

I tried to get Disqus working with Jekyll by following their official instructions; however, it *just* wouldn't work and I didn't have significant time to try and troubleshoot/debug. I kept getting the non-help error printed out in Chrome's dev tool console:

```
Uncaught SyntaxError: Unexpected end of input   led-on.html:1
```

And in FireFox:

```
SyntaxError: missing } after function body led-on.html:1:754
note: { opened at line 1, column 287  led-on.html:1:287
```

But I thought I'd try once more and I came across a [blog posting](https://disqus.com/home/discussion/channel-discussdisqus/why_does_the_disqus_not_work_in_jekyll/) that had the solution The "Universal Code" that Disqus has you embed on your website includes `// single line` comments and `/* multi-line */` comments. However, when Jekyll builds the website, it places the entire produced html on one line (read: not beautified), so the single-line comments disrupt the code. Here's the code that **doesn't work**.

{% highlight HTML %}
<div id="disqus_thread"></div>
<script>
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC 
     *  VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: 
     * https://disqus.com/admin/universalcode/#configuration-variables */
    
    var disqus_config = function () {
        this.page.url = document.location.href;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = document.location.pathname; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    
    (function () { // DON'T EDIT BELOW THIS LINE
        var d = document,
            s = d.createElement('script');
        s.src = 'https://physical-computing.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by
        Disqus.</a></noscript>
</div>
{% endhighlight HTML %}

And here's the code that **does** work with the single line comments replaced with multi-line comments:

{% highlight HTML %}
<div id="disqus_thread"></div>
<script>
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC 
     *  VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: 
     * https://disqus.com/admin/universalcode/#configuration-variables */
    
    var disqus_config = function () {
        this.page.url = document.location.href;  /* Replace PAGE_URL with your page's canonical URL variable */
        this.page.identifier = document.location.pathname; /* Replace PAGE_IDENTIFIER with your page's unique identifier variable */
    };
    
    (function () { /* DON'T EDIT BELOW THIS LINE */
        var d = document,
            s = d.createElement('script');
        s.src = 'https://physical-computing.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by
        Disqus.</a></noscript>
</div>
{% endhighlight HTML %}


## VS Code
I've been using [VS Code](https://code.visualstudio.com/) with some popular markdown extensions to develop the website. 

### Extensions
I have the following extensions installed for VS Code:
- Code Spell Check 1.8.0 (1.1m downloads)
- Markdown All in One 2.7.0 (1.2m downloads)
- markdownlint 0.34.0 (1.5, downloads)
- Paste Image 1.0.4 (45K): Allows user to paste images in clipboard using `alt-cmd-v` (Mac) and `ctrl-alt-v` (Windows)