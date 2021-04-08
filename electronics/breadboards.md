---
layout: default
title: Breadboards
nav_order: 2
parent: Intro to Electronics
has_toc: false # on by default
nav_exclude: true
search_exclude: true
---

## Outline

- Why use breadboards?
- How to use a breadboard
- Correct and incorrect wirings
- Tips

## Video tutorial

*Science Buddies* offers a great video tutorial of breadboards. If you're feeling lost, we recommend it!

<iframe width="736" height="414" src="https://www.youtube.com/embed/6WReFkfrUIk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**Video** This video tutorial ["How to use a breadboard"](https://youtu.be/6WReFkfrUIk) by Science Buddies offers a great introduction to breadboards. 
{: .fs-1 }

## Breadboard voltage and current specifications

Generally, breadboards are designed to work with digital circuits (0-5V) and low amperages (0-1A). The breadboards we purchase for our courses ([link](https://www.amazon.com/Breadboards-Solderless-Breadboard-Distribution-Connecting/dp/B07DL13RZH/ref=sxin_2_ac_d_rm?ac_md=2-2-YnJlYWRib2FyZA%3D%3D-ac_d_rm&cv_ct_cx=perf+board&keywords=perf+board&pd_rd_i=B07DL13RZH&pd_rd_r=a9be70ad-f0e7-4956-b683-f1266bde56b4&pd_rd_w=mD02O&pd_rd_wg=faDF0&pf_rd_p=de19e82a-2d83-4ae8-9f5c-212586b8b9a0&pf_rd_r=H52F2FG970MN56W91230&psc=1&qid=1583787088)) specify a "300V/3-5A" rating. I'm highly incredulous. If you need to prototype a circuit with ~12V and greater than 500mA - 1A, it's better to use a [perfboard](https://learn.adafruit.com/collins-lab-breadboards-and-perfboards/learn-more) and a soldering iron. 

## Limitations

Breadboards have a number of limitations. First, their connections can wear over time (as you push in and pull out components) leading to unreliable contact points. Second, the internal metal clips and contact points add resistance and capacitance. I've seen estimates of about 0.1Ω and a stray capacitance of 2-20 picofarads (pFs) per connection ([link](https://www.circuitspecialists.com/blog/common-breadboard-specifications/), [link](https://www.baldengineer.com/electronics-introduction-to-breadboards.html)). Finally, due to these factors, high-frequency digital circuits—that switch on/off voltages at ~16 Mhz and beyond—won't work as well.

In physical computing, breadboards are often the perfect rapid prototyping board.

## Activity

For your prototyping journals, come up with four LED-based circuits and build them in Tinkercad circuits (they can be minor variations—the goal is to get comfortable with breadboards). Play around. What do you observe? Take screenshots, provide a brief description, and include a link in your prototyping journal.

Then, select your two favorite ideas and actually build them using the components in your hardware kits (*e.g.,* breadboard, 9V battery, resistors, LEDs). Using manual calculations for current draw, estimate how long your circuit will last on a 9V battery—assume 500 mAh at a 25mA discharge rate and ~400mAh at a 50mA discharge rate down to 4.8 volts ([9V Energizer Datasheet](https://data.energizer.com/PDFs/522.pdf)).

Note that you'll need to use the alligator clips on the 9V battery to supply power your breadboard rails. I suggest using the black alligator clip for the battery's negative terminal, the red alligator clip for the battery's positive terminal, and matching jumper wires to connect to your breadboard.

<!-- https://www.baldengineer.com/9v-batteries-suck.html -->

- [NYU ITP's Setting Up a Breadboard](https://itp.nyu.edu/physcomp/labs/labs-electronics/breadboard/)

<!-- https://www.baldengineer.com/electronics-introduction-to-breadboards.html -->

## Resources
