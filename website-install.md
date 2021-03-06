---
layout: default
title: Website Dev Installation
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

This website is built in [Jekyll](https://jekyllrb.com/), which is a static site generator built in the [Ruby](https://www.ruby-lang.org/en/) language. You do not need to know Ruby to build sites with Jekyll but you do need to know [markdown](https://www.markdownguide.org/) and html/css.

## Jekyll Installation

### Mac
Simply follow the [official installation guide](https://jekyllrb.com/docs/installation/)

### Windows

I have tried to get Jekyll installed in Windows in the past and failed. It's unfortunately complicated. However, here's how I eventually got it to work.

**First**, although this documentation is old, I started with this [Run Jekyll on Windows](https://jekyll-windows.juthilo.com/) guide. The first step states to Install Ruby via the [rubyinstaller.org](http://rubyinstaller.org/downloads/) website and then to install the Ruby Devkit; however, the most recent versions of Ruby Installer for Windows also allows you to install the Devkit. So, that's what I did.
 
**Second**, I then opened `Windows Powershell` and typed `gem install jekyll`:

```
gem install jekyll
Fetching jekyll-4.1.1.gem
Fetching mercenary-0.4.0.gem
Successfully installed mercenary-0.4.0
Successfully installed jekyll-4.1.1
Parsing documentation for mercenary-0.4.0
Installing ri documentation for mercenary-0.4.0
Parsing documentation for jekyll-4.1.1
Installing ri documentation for jekyll-4.1.1
Done installing documentation for mercenary, jekyll after 16 seconds
2 gems installed
```

**Third**, I then tried to install `github-pages` via: `gem install github-pages` but failed with:

```
ERROR:  Error installing github-pages:
        The last version of nokogiri (>= 1.10.4, < 2.0) to support your Ruby & RubyGems was 1.10.9. Try installing it with `gem install nokogiri -v 1.10.9` and then running the current command again
        nokogiri requires Ruby version >= 2.3, < 2.7.dev. The current ruby version is 2.7.0.0.
```

So, I tried:

```
gem install nokogiri -v 1.10.9
ERROR:  Error installing nokogiri:
        The last version of nokogiri (= 1.10.9) to support your Ruby & RubyGems was 1.10.9. Try installing it with `gem install nokogiri -v 1.10.9`
        nokogiri requires Ruby version >= 2.3, < 2.7.dev. The current ruby version is 2.7.0.0.
```

But this also failed. And given that I have no idea how hard it would be to downgrade Ruby and whether that would wreck other dependences, I searched the Internet and found this [Issue](https://github.com/sparklemotion/nokogiri/issues/1961) on the Nokogiri GitHub. So, then I tried [this](https://github.com/sparklemotion/nokogiri/issues/1961#issuecomment-581851368):

```
gem inst nokogiri --pre
Fetching nokogiri-1.11.0.rc2-x64-mingw32.gem
Nokogiri is built with the packaged libraries: libxml2-2.9.10, libxslt-1.1.34, zlib-1.2.11, libiconv-1.15.
Successfully installed nokogiri-1.11.0.rc2-x64-mingw32
Parsing documentation for nokogiri-1.11.0.rc2-x64-mingw32
Installing ri documentation for nokogiri-1.11.0.rc2-x64-mingw32
Done installing documentation for nokogiri after 10 seconds
1 gem installed
```

This worked. Yay!

But I still couldn't install github pages, boo!

```
gem install github-pages
ERROR:  Error installing github-pages:
        The last version of nokogiri (>= 1.10.4, < 2.0) to support your Ruby & RubyGems was 1.10.9. Try installing it with `gem install nokogiri -v 1.10.9` and then running the current command again
        nokogiri requires Ruby version >= 2.3, < 2.7.dev. The current ruby version is 2.7.0.0.
```

So then I just tried `bundle install` and that worked. Whew.

#### Some possibly useful links:
- I used the Chocolatey Windows package manager ([installation instructions here](https://chocolatey.org/install)). Fastest way to open PowerShell with admin privilages is `Windows-X`
- Then I followed the instructions [here](https://learn.cloudcannon.com/jekyll/install-jekyll-on-windows/) and [here](https://malekbenz.com/blog/2017/09/05/Install-Jekyll-on-Windows-with-Chocolatey).
- Note: I still haven't gotten Jekyll to run on Windows...

## Running the website
Assuming you have the prerequisite libraries and software infrastructure (e.g., Jekyll), you can open terminal in VSCode and type:

```
> bundle exec jekyll serve 
```