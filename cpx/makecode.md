---
layout: default
title: L2&#58; Making with MakeCode
image: /cpx/assets/og/makecode.jpg
description: "Write your first CPX program, Blinky, using MakeCode's visual block editor. Learn the workspace, toolbox, and simulator, then flash NeoPixels and play a startup sound."
parent: Circuit Playground Express
has_toc: true # (on by default)
comments: true
nav_exclude: false
usetocbot: true
---
# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

In this lesson, we will make our first MakeCode+CPX program—called Blinky—which will play a sound effect at the start and then repeatedly flash lights. As we build, we will learn about the MakeCode programming environment, the simulator, and how to load our program on to the CPX.

## The MakeCode Programming Environment

<video aria-label="Rapidly building a simple rainbow NeoPixel animation program by dragging blocks in MakeCode" autoplay loop muted playsinline>
  <source src="assets/videos/Making_SimpleFastAnimationProgram_MakeCode_ScreenRecording.mp4" type="video/mp4" />
</video>
**Video.** Rapidly creating a full program with MakeCode: a simple rainbow animation. [Code link](https://makecode.com/_8uY3D8Fc8A5t).
{: .fs-1 }

MakeCode is a visual programming language—like [Scratch](https://scratch.mit.edu/)—built on [Blockly](https://developers.google.com/blockly). As the video above shows, to program the CPX, you simply drag-and-drop "puzzle pieces." We call these pieces *blocks.* As you fit blocks together, you can create interactive programs!

<!-- Some of you may be familiar with similar languages like [Scratch](https://scratch.mit.edu/) or to the intro programming interfaces used by [code.org](https://code.org/student/elementary).  -->

### The MakeCode interface

![Annotated MakeCode editor with the workspace, toolbox, and simulator areas numbered](assets/images/MakeCode_ProgrammingInterface.png)
**Figure.** An annotated screenshot of the MakeCode interface highlighting the (1) programming workspace, (2) toolbox, and (3) the simulator.
{: .fs-1 }

The MakeCode editor has three primary user interface areas: (1) programming workspace, (2) toolbox, and (3) simulator. Use the:

1. **Programming workspace** to build your program by dragging-and-dropping the puzzle pieces
2. **Toolbox** to retrieve the puzzle pieces (aka blocks)
3. **Simulator** to test your program before downloading it to your CPX

## Our first program: Blinky

Let's make our first program: Blinky! To start, we'll make Blinky flash all ten of the CPX's NeoPixel LEDs on and off. Then we'll add in a special "startup" sound to introduce other programmable elements.

<video aria-label="The Blinky program running in the MakeCode simulator with NeoPixels flashing red for 500ms then off" autoplay loop muted playsinline>
  <source src="assets/videos/Making_Blinky_MakeCode_FinalLoop.mp4" type="video/mp4" />
</video>
**Video.** The initial Blinky program: notice how the simulator's lights (the NeoPixels) are flashing red for 500ms then off for 500ms and repeating.
{: .fs-1 }

As you build your program, observe how the simulator on the left shows it's behavior in real-time—notice the flashing LEDs in the video above. As you make changes in MakeCode, the simulator will automatically restart.

### Step 1: Creating a new project

To start, go to [https://makecode.adafruit.com/](https://makecode.adafruit.com) and click the "New Project" button.

![The MakeCode website home page with the New Project button highlighted](assets/images/MakingBlinky_StartingANewProject.png)
**Figure.** On the [MakeCode website](https://makecode.adafruit.com), click the "New Project" button.
{: .fs-1 }

After clicking, you should see the MakeCode editor interface with a largely empty workspace (see screenshot below). You might observe that MakeCode pre-populates the workspace with a [`forever`](https://makecode.adafruit.com/reference/loops/forever) block, which starts automatically and runs repeatedly in a loop *forever.*

![A new MakeCode workspace pre-populated with an empty forever loop block](assets/images/MakingBlinky_TheForeverBlock.png)
**Figure.** The [`forever`](https://makecode.adafruit.com/reference/loops/forever) block starts automatically and runs repeatedly in a loop *forever.* Remember, you can always right click on these images and select "Open image in new tab" to see larger versions.
{: .fs-1 }

For Blinky, we'll put our program inside this [`forever`](https://makecode.adafruit.com/reference/loops/forever) block; however, it's not always needed (as we'll see in future lessons).

### Step 2: Add in a light block

Now let's add our first block: a [`LIGHT`](https://makecode.adafruit.com/reference/light) block to turn on the lights—that is, the 10 NeoPixels. There are lots of different [`LIGHT`](https://makecode.adafruit.com/reference/light) block possibilities but, for now, let's use the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block, which will set all 10 NeoPixels to the same color.

From the [`LIGHT`](https://makecode.adafruit.com/reference/light) menu inside the toolbox, drag-and-drop the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block to the workspace. 

![Dragging the set all pixels to block out of the LIGHT toolbox menu in MakeCode](assets/images/MakingBlinky_TheFirstLightBlock.png)
**Figure.** Drag-and-drop the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block from the [`LIGHT`](https://makecode.adafruit.com/reference/light) menu.
{: .fs-1 }

Place the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block inside the [`forever`](https://makecode.adafruit.com/reference/loops/forever) block in the workspace. Your program should now look like this:

![The set all pixels to red block placed inside the forever block, with the simulator NeoPixels glowing red](assets/images/MakingBlinky_TheSetAllPixelsToBlock.png)
**Figure.** The [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block sets all 10 CPX lights (the NeoPixels) to the same color. In this case, we'll set them to red.
{: .fs-1 }

Notice too how the NeoPixels are now glowing red in the simulator—neat!

### Step 3: Add in a pause block

To make the light **blink**, we need to add in a [`pause`](https://makecode.adafruit.com/reference/loops/pause) block, which is somewhat hidden away in the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) toolbox menu. Click on the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) menu button and drag-and-drop the [`pause`](https://makecode.adafruit.com/reference/loops/pause) block to the workspace.

![Dragging the pause block out of the LOOPS toolbox menu in MakeCode](assets/images/MakingBlinky_AddingTheFirstPauseBlock.png)
**Figure.** Drag-and-drop the [`pause`](https://makecode.adafruit.com/reference/loops/pause) block from the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) toolbox menu.
{: .fs-1 }

Let's set the red light to stay on for half-a-second (500 milliseconds) before moving on to the next puzzle piece.

![A pause block set to 500 milliseconds added after the red light block in the Blinky program](assets/images/MakingBlinky_DescribingThePauseBlock.png)
**Figure.** The [`pause`](https://makecode.adafruit.com/reference/loops/pause) block pauses your program for a specified time. In this case, let's set it to half-a-second (500ms) so that the red light is shown for 500ms.
{: .fs-1 }

### Step 4: Turn off light

Finally, to complete the blinking effect, we need to turn off the lights. Again, we can use the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block.

![Dragging a second set all pixels to block from the LIGHT menu to turn the lights off](assets/images/MakingBlinky_AddingSecondLightBlock.png)
**Figure.** To turn off the light, we need another light block. Drag-and-drop a second [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block from the [`LIGHT`](https://makecode.adafruit.com/reference/light) menu.
{: .fs-1 }

This time we will set the light color to black. In MakeCode, setting lights to black is equivalent to turning them off. You could choose a different color, if you'd like.

![Choosing black from the color pop-up menu in the second set all pixels to block to turn the lights off](assets/images/MakingBlinky_SettingSecondLightBlockToBlack.png)
**Figure.** To change the light colors in the [`set all pixels to`](https://makecode.adafruit.com/reference/light/set-all) block, click on the colored oval and select a color from the pop-up menu.
{: .fs-1 }

### Step 5: Add final pause block
As before, we also need to add in a [`pause`](https://makecode.adafruit.com/reference/loops/pause) block, which will control how long the lights are off before looping back to the beginning of our program.

![Dragging a second pause block from the LOOPS menu to keep the lights off before the loop repeats](assets/images/MakingBlinky_AddingFinalPauseBlock.png)
**Figure.** Drag-and-drop the [`pause`](https://makecode.adafruit.com/reference/loops/pause) block from the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) toolbox menu.
{: .fs-1 }

Our final program should look like this. Because our code sits within a [`forever`](https://makecode.adafruit.com/reference/loops/forever) block, it will loop forever thereby creating a neverending on-off flashing of red lights.

![The completed Blinky program: two light blocks and two pauses nested inside the forever loop](assets/images/MakingBlinky_LoopingBackToTheBeginning.png)
**Figure.** Because our code sits within a [`forever`](https://makecode.adafruit.com/reference/loops/forever) block, it will loop forever thereby creating a neverending on-off flashing of red lights.
{: .fs-1 }

### Video of building Blinky

Here's a full walkthrough video of building Blinky from start-to-finish in MakeCode in only 30 seconds. This really demonstrates how quickly we can prototype electronic behaviors with MakeCode+CPX.

<video aria-label="A 30-second full walkthrough of building the Blinky program from start to finish in MakeCode" autoplay loop muted playsinline>
  <source src="assets/videos/Making_Blinky_MakeCode_ScreenRecording.mp4" type="video/mp4" />
</video>
**Video.** A full walkthrough video of building Blinky from start-to-finish in only 30 seconds. Feel free to pause the video or open it in a new tab for full screen (right click on the video and select "Open video in new tab").
{: .fs-1 }

## Adding sound to Blinky

Before downloading Blinky on to the physical CPX board, let's make one more addition: a "startup" sound, which plays when the CPX is first turned on (or reset).

<video aria-label="Adding a power-up startup sound to the Blinky program in MakeCode" autoplay loop muted playsinline>
  <source src="assets/videos/Making_BlinkyWithPowerUp_ScreenRecording.mp4" type="video/mp4" />
</video>
**Video.** Adding a "startup" sound to Blinky. Now, when Blinky is turned on, it will play a sound.
{: .fs-1 }

### Step 1: Add "on start" block

In addition to the [`forever`](https://makecode.adafruit.com/reference/loops/forever) block, which runs repeatedly, MakeCode also has an [`on start`](https://makecode.adafruit.com/blocks/on-start) block that runs when the program first starts. This is a perfect place to put "startup sound" code!

Open the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) toolbox menu and drag-and-drop the [`on start`](https://makecode.adafruit.com/blocks/on-start) block into your workspace.

![Dragging the on start block from the LOOPS toolbox menu into the MakeCode workspace](assets/images/MakingBlinkyWithSound_AddingInOnStart.png)
**Figure.** Drag-and-drop the [`on start`](https://makecode.adafruit.com/blocks/on-start) block from the [`LOOPS`](https://makecode.adafruit.com/blocks/loops) toolbox menu.
{: .fs-1 }

Now your Blinky program should look like this. I've arbitrarily placed the [`on start`](https://makecode.adafruit.com/blocks/on-start) block next to the [`forever`](https://makecode.adafruit.com/blocks/on-start) block—you can put it wherever you want. Regardless of its position in the editor, the [`on start`](https://makecode.adafruit.com/blocks/on-start) block will always run before the [`forever`](https://makecode.adafruit.com/blocks/on-start) block.

![The Blinky workspace showing an empty on start block placed beside the forever block](assets/images/MakingBlinkyWithSound_OnStartDescription.png)
**Figure.** The [`on start`](https://makecode.adafruit.com/blocks/on-start) block runs automatically when the program first starts.
{: .fs-1 }

### Step 2: Adding sound

Thus far, we have only programmed one type of output, [light](https://makecode.adafruit.com/reference/light), but there is also sound! For sound, we can use the [`MUSIC`](https://makecode.adafruit.com/reference/music) toolbox menu.

Let's use the [`play sound`](https://makecode.adafruit.com/reference/music/play-sound) block, which plays a preprogrammed sound like "power up" or "jump up" (these sounds may be familiar to you as some come from Super Mario!).

![Dragging the play sound block from the MUSIC toolbox menu in MakeCode](assets/images/MakingBlinkyWithSound_TheMusicMenu.png)
**Figure.** Drag-and-drop the [`play sound`](https://makecode.adafruit.com/reference/music/play-sound) block from the [`MUSIC`](https://makecode.adafruit.com/reference/music) toolbox menu.
{: .fs-1 }

You are welcome to select any sound option. We're going to use "power up." As soon as you add this block, you should hear the sound play in the simulator (assuming your sound is on and you have speakers/headphones).

![The play sound block set to power up placed inside the on start block](assets/images/MakingBlinkyWithSound_ThePlaySoundBlock.png)
**Figure.** The [`play sound`](https://makecode.adafruit.com/reference/music/play-sound) block plays the selected sound.
{: .fs-1 }

### Step 3: The final program

You did it! The final program should look like this:

![The finished Blinky with Sound program showing the on start sound block and the forever blinking loop](assets/images/MakingBlinkyWithSound_TheFinalProgram.png)
**Figure.** The final ["Blinky with Sound" program](https://makecode.com/_2iL2xkVKa7Dh) in MakeCode. You can edit and play with our code [here](https://makecode.com/_2iL2xkVKa7Dh)—we changed the color from red to blue. 
{: .fs-1 }

## Transferring our program to the CPX

Thus far, we've used the simulator to test and run Blinky. But the true power and fun of physical computing and the CPX is working with *physical materials.* So, we need to transfer Blinky from your laptop to the CPX. 

<!-- Once the CPX is programmed, you can detach it from your computer and power it from a battery. Your MakeCode program "lives" inside the CPX! -->

There are two ways of transferring MakeCode programs to CPX: 

1. **Manual download.** By manually downloading the program and copying it over to the CPX (as if the CPX is a USB thumb drive). 
2. **Direct download.** By using an experimental WebUSB feature to directly download your program to the CPX. When it works, this feels very seamless. However, because this feature is experimental, it is a bit inconsistent—which can lead to frustration.

We'll cover both below. We recommend at least trying the "direct download" approach and falling back on manual download when it doesn't work.

### Manual download

<video aria-label="Downloading a MakeCode program and copying the .uf2 file onto the CPX using a Mac" autoplay loop muted playsinline>
  <source src="assets/videos/CopyingProgramToCPXFromMac_NoSound.mp4" type="video/mp4" />
</video>
**Video.** Downloading a MakeCode program and transferring it to the CPX using a Mac.
{: .fs-1 }

Manually downloading your MakeCode program to the CPX is a 4-step process:

1. **Download.** Click on the pink 'Download' button, which will download a `.uf2` file to your downloads folder; 
2. **Plug in CPX.** Plug in your CPX to your laptop/computer using a USB micro cable. 
3. **Put CPX into programmable state.** Click the 'Reset' button on the CPX. The CPX should glow green and mount a new "thumb drive" folder called CPLAYBOOT; 
4. **Move .uf2 file onto CPLAYBOOT** Drag-and-drop the downloaded `.uf2` file onto CPLAYBOOT. When the file finishes copying, the CPX will auto-reset and begin running your program—which will also disconnect the CPX from your laptop/computer.

![The MakeCode three-stage prompt for downloading the .uf2 file and copying it onto the CPX](assets/images/ThreeStepProcessForManuallyProgrammingCPX.png)

**Figure.** After you click the pink 'Download' button in MakeCode, the MakeCode interface shows this three-stage prompt for transferring the downloaded `.uf2` file to the CPX.
{: .fs-1 }

We will show you how to do this for both Windows and Mac.

#### Manual download with Mac

<video aria-label="Walkthrough of downloading a MakeCode program and transferring it to the CPX on a Mac" playsinline controls>
  <source src="assets/videos/CopyingProgramToCPXFromMac.mp4" type="video/mp4" />
</video>
**Video.** Downloading a MakeCode program and transferring it to the CPX using a Mac.
{: .fs-1 }

#### Manual download with Windows

<div class="iframe-container">
  <iframe src="https://www.youtube.com/embed/Y_jkUylGe4E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

**Video.** Manually downloading and transferring your MakeCode program onto the CPX using Windows ([YouTube link](https://youtu.be/Y_jkUylGe4E))
{: .fs-1 }

### Direct download using WebUSB

In this video, we walk you through how to directly download your MakeCode program onto the CPX using WebUSB. This is a far more ideal and seamless way to program the MakeCode but doesn't always work reliably. You must use either Chrome or Microsoft Edge web browsers and should work for either Mac or Windows.

<div class="iframe-container">
  <iframe src="https://www.youtube.com/embed/7FjYEJhVeLY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

**Video.** Directly downloading your MakeCode program to the CPX using WebUSB ([YouTube link](https://youtu.be/7FjYEJhVeLY))
{: .fs-1 }

## Sharing our MakeCode program

If you want to share your program with others, click on the Share button in the navbar and copy/paste the provided URL. See the video below.

<video aria-label="Sharing a MakeCode program by clicking the Share button and copying the generated URL" loop muted playsinline controls>
  <source src="assets/videos/MakeCode_SharingYourProject2.mp4" type="video/mp4" />
</video>
**Video.** To share your MakeCode program with others, click on the Share button in the navbar and copy/paste the url link. [Code link](https://makecode.com/_JdPfj8VrmWV3).
{: .fs-1 }

## Design Activity

We did it! We successfully built our first program in MakeCode, ran it in the simulator, and then downloaded it to our actual CPX hardware. We also learned about adding sound and sharing our program with others.

For this lesson's design challenge, try seeing how many different ways you can build interesting light patterns with MakeCode using commands such show animation, photon, and more! Below, we've included a simple example but you can do so much more!

<video aria-label="A playground of different built-in NeoPixel animations running in MakeCode on the CPX" autoplay loop muted playsinline>
  <source src="assets/videos/MakeCode_SimpleNeoPixelFun_Optimized.mp4" type="video/mp4" />
</video>
**Video.** A very simple playground of different NeoPixel animations built in to MakeCode [Code link](https://makecode.com/_AxFigA8KX82K). We are also using console out commands to help us reference the various animations.
{: .fs-1 }

## Next Lesson

In the [next lesson](button-piano.md), we'll make our first interactive program: a button piano!

<nav class="lesson-nav" aria-label="Lesson navigation">
  <a href="cpx.html" class="nav-prev">
    <div class="nav-label">&larr; Previous Lesson</div>
    <div class="nav-title">Intro the CPX</div>
  </a>
  <a href="button-piano.html" class="nav-next">
    <div class="nav-label">Next Lesson &rarr;</div>
    <div class="nav-title">Button Piano</div>
  </a>
</nav>

<!-- TODO:
- Add in saving and sharing projects 
- Add in design challenge about using more lights? Show holiday light example from kids
- Add in notion that once you download your program, it runs on the CPX
- -->
