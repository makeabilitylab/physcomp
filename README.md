---
layout: default
title: Home
nav_order: 0
description: "This is a description! UPDATE!!!"
permalink: /
---
> Joy is a well-made object, equaled only to the joy of making it.

- A Canadian Native American tribe saying, as quoted by Mark Fraunfelder (author, co-founder of [BoingBoing](https://boingboing.net/), & former editor of MAKE Magazine)

## UW Physical Computing Courses
There are a wide range of physical computing related courses at UW across many departments from Art to Engineering. Here's a sample (ordered alphabetically by course number).

### Undergrad

- [**CSE 466: Software for Embedded Systems**](http://courses.cs.washington.edu/courses/cse466/) taught by [Bruce Hemingway](https://www.cs.washington.edu/people/faculty/bruceh).
  
- [**CSE 474: Introduction to Embedded Systems**](http://courses.cs.washington.edu/courses/cse474/) taught by [Bruce Hemingway](https://www.cs.washington.edu/people/faculty/bruceh).

- [**CSE 475: Embedded Systems Capstone**](https://courses.cs.washington.edu/courses/cse475/) taught by [Bruce Hemingway](https://www.cs.washington.edu/people/faculty/bruceh).

- [**DESIGN 325: Physical Computing**](https://art.washington.edu/courses/2020/spring/design/325/a) taught by [Dominic Muren](https://art.washington.edu/people/dominic-muren) in the Schol of Art, Art History and Design.

- [**DXARTS 471 A: Mechatronic Art, Design, and Fabrication**](https://dxarts.washington.edu/courses/2020/winter/dxarts/471/a) taught by [Afroditi Psarra](https://dxarts.washington.edu/people/afroditi-psarra) in Digital Arts and Experimental Media.

- [**DXARTS 490A: E-Textiles & Wearables for Art & Design**](https://canvas.uw.edu/courses/1301821) taught by [Afroditi Psarra](https://dxarts.washington.edu/people/afroditi-psarra) in Digital Arts and Experimental Media.

- [**HCDE 439: Physical Computing**](https://www.washington.edu/students/crscat/hcde.html) taught by [Andy Davidson](https://www.hcde.washington.edu/davidson), [Brock Craft](http://www.brockcraft.com/), and [Tyler Fox](http://www.tylersfox.com/).

- [**HCDE 440: Advanced Physical Computing**](https://www.washington.edu/students/crscat/hcde.html) taught by [Brock Craft](http://www.brockcraft.com/).

### Graduate

- [**CSE 590: Ubiquitous Computing**](https://github.com/jonfroehlich/CSE590Sp2018) taught by [Jon Froehlich](https://homes.cs.washington.edu/~jonf)

- **CSE 599: Prototyping Interactive Systems** taught by [Jon Froehlich](https://homes.cs.washington.edu/~jonf)

- [**HCDE 539: Physical Computing**](https://www.washington.edu/students/crscat/hcde.html) taught by [Andy Davidson](https://www.hcde.washington.edu/davidson)

- **HCID521: Prototyping Studio** co-taught by a variety of faculty across Art, Design, and Engineering. This course is closed enrollment (only offered to [M+HCID students](https://mhcid.washington.edu/))

## TODO
- Update format for blockquote in "just the docs" to https://codepen.io/cliftwalker/pen/XJaEXY
  - Need to modify the css style:
  - See: https://aregsar.com/blog/2019/how-to-customize-your-github-pages-blog-style-in-five-minutes/
  - https://pmarsceill.github.io/just-the-docs/docs/customization/#override-styles
  - Here's miminimal mistakes version: https://raw.githubusercontent.com/mmistakes/minimal-mistakes/master/docs/_posts/2013-01-11-markup-html-tags-and-formatting.md
    - And the scss: https://github.com/mmistakes/minimal-mistakes/blob/0cf1a2e1144336b5e026d13b5fd87dc2af02fe8c/_sass/minimal-mistakes/_base.scss
- Possible to add last modified date into file?
- Embedding code from github repo into jekyll post
  - https://blog.revathskumar.com/2012/08/embed-files-from-github-repository-into-webpage.html
  - https://flowerinthenight.com/blog/2017/11/28/embed-github-code
- Electronic prototyping kits section
- Have citation manager for references on each page?
  - https://www.amirasiaee.com/dailyreport/jekyll-scholar/
  - https://github.com/inukshuk/jekyll-scholar
  - Unfortunately, Jekyll Scholar plugin is not compatible with GitHub Pages
- Maybe have a top-level link for UW Courses?

## Possible H1 Content
- Motors
- Power
- Sensors

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

### To Build with Jekyll
To build the docs with Jekyll,
- Open iTerm in /physcomp/docs
- `> bundle`
- `> bundle exec jekyll serve`
- Follow directions for web addie

## Python
- [mkdocs.org](https://mkdocs.org).

<!--
## Ideas to Call This Repo and Site?
- Physical Computing (or physcomp)
- Ubiquitous Computing (or ubicomp)
- Interactive Device Design (Bjoern's name)
- Tangible Interactive Computing (name of my UMD course)
- Prototyping Interactive Systems (name of my UW 599)-->