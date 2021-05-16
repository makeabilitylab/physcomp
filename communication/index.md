---
layout: default
title: Communication
nav_order: 4
has_toc: false # on by default
has_children: true
comments: true
usetocbot: true
---
# {{ page.title }}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

Notes:

## Serial
- Serial communication. Maybe just have characters come up on OLED? Show serial monitor demo
  - Could transmit as binary, which is more efficient, but harder to debug. And we don't need high bandwidth for our applications
- L1: Output only: data from computer to Arduino
  - DisplayText
  - DisplayShapeOut
- L2: Input only: data from Arduino to computer
  - DisplayShapeIn
- L3: Bidirectional: data between both
  - Talk about handshaking protocol and acknowledgements. https://itp.nyu.edu/physcomp/labs/labs-serial-communication/

## Human-input devices
- Mouse
- Keyboard