---
layout: default
title: L7&#58; HandPose Serial
nav_order: 7
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

In our [previous lesson](ml5js-serial.md), we introduced combining Arduino with machine learning (ML) libraries like [ml5.js](https://ml5js.org/), a web-based ML library built on [Google TensorFlow](https://www.tensorflow.org/js). Specifically, we built a [p5.js app](https://makeabilitylab.github.io/p5js/WebSerial/ml5js/NoseTracker/) that fed a real-time web cam stream into [ml5's PoseNet](https://learn.ml5js.org/#/reference/posenet) to identify and classify human body parts (keypoints) and sent identified keypoints to our Arduino to create new interactive experiences.

In this lesson, we will introduce a new ml5 model, called [Handpose](https://learn.ml5js.org/#/reference/handpose), which was ported from [Google's TensorFlow Handpose model](https://github.com/tensorflow/tfjs-models/tree/master/handpose), and use it to control a servo motor. This lesson should further advance your understanding of using [ml5](https://ml5js.org/) and inspire you to think about how we can combine real-time ML with Arduino.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/HandPose_Optimized_1200w.mp4" type="video/mp4" />
</video>
**Video.** A quick demonstration of [ml5's Handpose](https://learn.ml5js.org/#/reference/handpose) as implemented in our example app called [HandWaveDetector](https://makeabilitylab.github.io/p5js/ml5js/HandPose/HandWaveDetector) ([code](https://github.com/makeabilitylab/p5js/tree/master/ml5js/HandPose/HandWaveDetector)).
{: .fs-1 }

## Handpose

In March 2020, the Google TensorFlow.js team released face and hand tracking for the web browser, entitled [FaceMesh](https://www.npmjs.com/package/@tensorflow-models/facemesh) (now [face-landmarks-detection](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection)) and [HandPose](https://github.com/tensorflow/tfjs-models/tree/master/handpose), respectively. Here's the[TensorFlow blog announcement](https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html). Soon thereafter a [new feature request](https://github.com/ml5js/ml5-library/issues/823) was made to support these new packages with ml5 and by November 2020, it was implemented into ml5 by [Bomani Oseni McClendon](https://github.com/bomanimc) as part of the [ml5.js Fellows Program](https://medium.com/processing-foundation/announcing-our-2020-ml5-js-fellows-45f8f6ff378d)).

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/HandPoseFaceMesh_Optimized.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of TensorFlow.js' [FaceMesh](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection) and [HandPose](https://github.com/tensorflow/tfjs-models/tree/master/handpose) both which are available in ml5 as [Facemesh](https://learn.ml5js.org/#/reference/facemesh) and [Handpose](https://learn.ml5js.org/#/reference/handpose). Video from the [TensorFlow.js blog](https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html).
{: .fs-1 }

In this lesson, we will focus on [HandPose](https://learn.ml5js.org/#/reference/handpose) rather than [FaceMesh](https://learn.ml5js.org/#/reference/facemesh) (though both are available in ml5). You are welcome to use either the [TensorFlow.js implementation](https://github.com/tensorflow/tfjs-models/tree/master/handpose), [Google's MediaPipe version](https://google.github.io/mediapipe/solutions/hands), or [ml5's version](https://learn.ml5js.org/#/reference/handpose). All three implementations use the same underlying pre-trained ML model. For this lesson, we will use [ml5's HandPose](https://learn.ml5js.org/#/reference/handpose). Here are some example demos:

- [Google MediaPipe's Hand Tracking Demo](https://codepen.io/mediapipe/pen/RwGWYJw)
- [Google MediaPipe's Demo App: Hand Defrosting](https://codepen.io/mediapipe/pen/bGweWyR)
- [Google TensorFlow's HandPose Demo](https://storage.googleapis.com/tfjs-models/demos/handtrack/index.html)
- [ml5 HandPose Demo in p5.js web editor](https://editor.p5js.org/ml5/sketches/Handpose_Webcam)

### HandPose model

In 2019, research scientists Margaret Mitchell, Timnit Gebru, and colleagues published a paper entitled [*Model Cards for Model Reporting*](https://arxiv.org/pdf/1810.03993.pdf), which called for ML-based APIs to provide transparent information about *how* the underlying ML model was trained and expected usage contexts. The paper begins:

> Trained machine learning models are increasingly used to perform high-impact tasks in areas such as law enforcement, medicine, education, and employment. In order to clarify the intended use cases of machine learning models and minimize their usage in contexts for which they are not well suited, we recommend that released models be accompanied by documentation detailing their performance characteristics. In this paper, we propose a framework that we call model cards, to encourage such transparent model reporting. Model cards are short documents accompanying trained machine learning models that provide benchmarked evaluation in a variety of conditions, such as across different cultural, demographic, or phenotypic groups (*e.g.,* race, geographic location, sex, Fitzpatrick skin type [[15](https://pubmed.ncbi.nlm.nih.gov/3377516/)]) and intersectional groups (*e.g.,* age and race, or sex and Fitzpatrick skin type) that are relevant to the intended application domains. Model cards also disclose the context in which models are intended to be used, details of the performance evaluation procedures, and other relevant information.
{: .fs-4 }

This paper and those research scientists have made a significant impact on the ML community. As a testament, many of the Google ML APIs and models now provide "model cards". Here's the model card for [HandPose](https://drive.google.com/file/d/1sv4sSb9BSNVZhLzxXJ0jBv9DqD-4jnAz/view) ([local copy](../assets/datasheets/GoogleTensorFlow_ModelCard_HandPose.pdf))—notably, I could not find one for [PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet). 

We summarize a few important HandPose model notes below.

#### Model specifications

HandPose consists of two lightweight models, a palm detector and a hand landmark model, to detect and classify keypoints on the hand. The model inputs an image or video frame, resizes that input to 256x256 for recognition, and outputs: 
- a palm bounding box, 
- 21 3-dimensional hand landmarks (keypoints), and 
- an overall confidence score. 

The 21 keypoints include four each for the `thumb`, `indexFinger`, `middleFinger`, `ringFinger`, and `pinky` plus one more for the `palmBase`:

![](assets/images/HandPose_Keypoints_FromGoogleMediaPipe.png)
**Figure.** The HandPose keypoints from the [MediaPipe team](https://google.github.io/mediapipe/solutions/hands).
{: .fs-1 }

The actual keypoint indices from the TensorFlow implementation:

{% highlight TypeScript %}
export const MESH_ANNOTATIONS: {[key: string]: number[]} = {
  thumb: [1, 2, 3, 4],
  indexFinger: [5, 6, 7, 8],
  middleFinger: [9, 10, 11, 12],
  ringFinger: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
  palmBase: [0]
};
{% endhighlight TypeScript %}

**Code.** Source from [keypoints.ts](https://github.com/tensorflow/tfjs-models/blob/master/handpose/src/keypoints.ts) in the [TensorFlow models repo](https://github.com/tensorflow/tfjs-models).
{: .fs-1 }

According to the [TensorFlow team](https://github.com/tensorflow/tfjs-models/tree/master/handpose), HandPose is well-suited for real-time inference across a variety of devices, achieving 40 FPS on a 2018 MacBook Pro, 35 FPS on an iPhone11, and 6 FPS on a Pixel3.

#### Model limitations and ethical considerations

In terms of limitations and ethical considerations, [the HandPose model card](https://drive.google.com/file/d/1sv4sSb9BSNVZhLzxXJ0jBv9DqD-4jnAz/view) specifies that the HandPose models have been trained on a limited dataset and are not appropriate for counting the number of hands in a crowd, detecting hands with gloves or occlusions, or detecting hands that are far from the camera (greater than ~2 meters).

Moreover, the model card makes clear that the HandPose model is not intended for life-critical decisions and that performance will vary across skin tones, gender, age, and environmental conditions (*e.g.,* low light).

Importantly, just as [PoseNet](https://learn.ml5js.org/#/reference/posenet), which we used in the [previous lesson](ml5js-serial.md), **detects** body pose keypoints but does **not** attempt to **recognize** *who* is in an image, HandPose similarly performs detection but does not attempt recognition (that is, *who* owns the detected hand). There is a difference between *detection* and *recognition*.

<!-- The HandPose model detects hands in an input image or video stream and returns twenty-one 3-dimensional landmarks (keypoints) locating features within each hand. More specifically, the  -->

## ml5 HandPose

The ml5 HandPose model works similarly to the [TensorFlow.js](https://github.com/tensorflow/tfjs-models/tree/master/handpose) and [ MediaPipe](https://google.github.io/mediapipe/solutions/hands) versions; however, the ml5 model only supports **one** hand at a time.

### The HandPose Data Structure

Just like with [PoseNet](ml5js-serial.md#the-posenet-data-structure), the TensorFlow and ml5 HandPose APIs use the same data structure. We receive an array of objects describing each detected hand (always one in ml5's case, currently). Each "hand" object includes four things:
- a `handInViewConfidence`, which is the model's confidence that the hand actually exists
- a `boundingBox`, which provides the `topLeft` x,y and `bottomRight` x,y positions of the detected hand
- a `landmarks` array, which includes the 3D (x,y,z) coordinates of each hand landmark (keypoint)
- an `annotations` array, which provides the same 3D coordinates as `landmarks` but semantically grouped into `thumb`, `indexFinger`, `middleFinger`, `ringFinger`,  `pinky`, and `palmBase`

The array structure looks like this:

{% highlight JavaScript %}
[
  {
    handInViewConfidence: 1, // The probability of a hand being present.
    boundingBox: { // The bounding box surrounding the hand.
      topLeft: [162.91, -17.42],
      bottomRight: [548.56, 368.23],
    },
    landmarks: [ // The 3D coordinates of each hand landmark.
      [472.52, 298.59, 0.00],
      [412.80, 315.64, -6.18],
      ...
    ],
    annotations: { // Semantic groupings of the `landmarks` coordinates.
      thumb: [
        [412.80, 315.64, -6.18]
        [350.02, 298.38, -7.14],
        ...
      ],
      ...
    }
  }
]
{% endhighlight JavaScript %}

To make this more clear, here's a screenshot from Chrome's dev tools showing the `predictions` array (which, again, will always be size 1 because ml5 is currently limited to detecting one simultaneous hand). In the screenshot, I've expanded the predictions array, which shows you the aforementioned high-level structure of `handInViewConfidence`, `boundingBox`, `landmarks`, and `annotations`.

![](assets/images/HandPose_ChromeDevToolsScreenshot.png)
**Figure.** This figure shows a screenshot of the HandPose `predictions` array and underlying objects as shown in Chrome's dev tools. Right-click and select "Open Image in New Tab" to enlarge. The app running here is our [HandPoseDemo](https://makeabilitylab.github.io/p5js/ml5js/HandPose/HandPoseDemo/).
{: .fs-1 }

### Example p5.js + ml5.js HandPose demo

To demonstrate the ml5.js HandPose API and how to step through the data structure, we created a simple application called [HandPoseDemo](https://makeabilitylab.github.io/p5js/ml5js/HandPose/HandPoseDemo/) that renders:

- the `boundingBox` returned from the API along with a "tighter" version that we manually calculate based on keypoints
- the `handInViewConfidence` score, which we draw above the "tight" bounding box
- the 21 `landmarks` (keypoints) for the `thumb`, `indexFinger`, `middleFinger`, `ringFinger`,  `pinky`, and `palmBase` along with text labels

This data structure is similar but not identical to [PoseNet](ml5js-serial.md#the-posenet-data-structure)—one key difference is that unlike PoseNet, the individual keypoints do not include specific confidence scores.

TODO: record and show video like we did for PoseNet here

We put the HandPoseDemo up on the p5.js web editor ([link](https://editor.p5js.org/jonfroehlich/sketches/Nn4pXTpbu)). We encourage you to view the code, edit it, and play. The demo is also available on GitHub ([live page](https://makeabilitylab.github.io/p5js/ml5js/HandPose/HandPoseDemo), [code](https://github.com/makeabilitylab/p5js/tree/master/ml5js/HandPose/HandPoseDemo)).

## Building an ml5 HandPose + Arduino app: HandWaver

To help highlight the potential of real-time ML plus Arduino, let's build a simple robotic hand waver. We will use ml5's HandPose API to control a servo motor, which we will embed on a cardboard crafted figure.

TODO: sneak preview video

### Building the web app side

We'll begin by building the web app in [p5.js](https://p5js.org/) and [ml5](https://ml5js.org/). As usual, we'll start with the [web serial template](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate), as we'll communicate between ml5 and Arduino using web serial:

- If you're using VSCode, copy [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) and rename the folder to `HandWaver`.
- If you're using the p5.js online editor, simply open [Serial Template](https://editor.p5js.org/jonfroehlich/sketches/vPfUvLze_C) and rename your project to `HandWaver`.

#### Add in and initialize ml5's HandPose

The ml5 library generally aims to create consistency across their APIs. Thus, the ml5 HandPose API should feel familiar if you followed our previous [PoseNet lesson](ml5js-serial.md). Similar [PoseNet](https://learn.ml5js.org/#/reference/posenet), the `ml5.handpose` constructor takes in three optional arguments (indicated by the `?` prefix):

{% highlight JavaScript %}
const handpose = ml5.handpose(?video, ?options, ?callback);
{% endhighlight JavaScript %}

The three optional parameters are `video`, `options`, and `callback`:
- `video`: An optional [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement), which we can acquire in p5.js simply by calling [`createCapture(VIDEO)`](https://p5js.org/reference/#/p5/createCapture).

- `options`: An optional object of PoseNet configuration properties. See below.

- `callback`: An optional reference to a callback function, which is called when the model is loaded.

The configuration `options` include (with defaults shown). You can and should play with these options based on the needs of your application. These options are also described in the [TensorFlow documentation here](https://github.com/tensorflow/tfjs-models/tree/master/handpose#parameters-for-handposeload).

{% highlight JavaScript %}
const options = {
  flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
  maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector 
  detectionConfidence: 0.8, // [0, 1] threshold for discarding a prediction
  scoreThreshold: 0.75, // [0, 1] threshold for removing duplicate detections using "non-maximum suppression" 
  iouThreshold: 0.3, // [0, 1] threshold for deciding whether boxes overlap too much in non-maximum suppression
}
{% endhighlight JavaScript %}

So, to initialize and create a `ml5.handpose` object, we write:

{% highlight JavaScript %}
let handPoseModel;
let video;
let curHandPose = null;
let isHandPoseModelInitialized = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  handPoseModel = ml5.handpose(video, onHandPoseModelReady);
}

function onHandPoseModelReady() {
  console.log("HandPose model ready!");
  isHandPoseModelInitialized = true;
}
{% endhighlight JavaScript %}

Again, this should feel very familiar to our [PoseNet lesson](ml5js-serial.md#initialize-ml5s-posenet).

#### Subscribe to the new HandPose event

Also like [PoseNet](https://learn.ml5js.org/#/reference/posenet), we can subscribe to a "new pose event" via the `on` function by passing the `predict` event name:

{% highlight JavaScript %}
handpose.on('predict', callback);
{% endhighlight JavaScript %}

So, our full initialization + subscription HandPose code is:

{% highlight JavaScript %}
let handPoseModel;
let video;
let curHandPose = null;
let isHandPoseModelInitialized = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  // video.size(width, height);

  handPoseModel = ml5.handpose(video, onHandPoseModelReady);

  // Call onNewHandPosePrediction every time a new handPose is predicted
  handPoseModel.on("predict", onNewHandPosePrediction);

  // Hide the video element, and just show the canvas
  video.hide();

  boundingBoxColor = color(255, 0, 0);
  kpColor = color(0, 255, 0, 200);
  skeletonColor = color(kpColor);
}

function onHandPoseModelReady() {
  console.log("HandPose model ready!");
  isHandPoseModelInitialized = true;
}

function onNewHandPosePrediction(predictions) {
  if (predictions && predictions.length > 0) {
    curHandPose = predictions[0];
    // console.log(curHandPose);
  } else {
    curHandPose = null;
  }
}
{% endhighlight JavaScript %}

You can view, play with, and edit [this code](https://editor.p5js.org/jonfroehlich/sketches/7q-M3hpvrE) in the p5.js online editor. But there's not much there yet!

#### Add in drawing code

Now, the fun part! Let's render the 21 HandPose keypoints as circles (in a new function called `drawHand()`), a bounding box with overall hand confidence score (in a function called `drawBoundingBox()`), and some convenience text to tell the user about model initialization.

First, let's update the `draw()` function:

{% highlight JavaScript %}
function draw() {
  image(video, 0, 0, width, height);

  if(!isHandPoseModelInitialized){
    // Show user initialization text
    background(100);
    push();
    textSize(32);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text("Waiting for HandPose model to load...", width/2, height/2);
    pop();
  }

  if(curHandPose){
    drawHand(curHandPose);
    drawBoundingBox(curHandPose);
  }
}
{% endhighlight JavaScript %}

Now, let's add the `drawHand(handPose)` function. We will iterate through all 21 landmarks (keypoints) and draw a green circle at their x,y position (stored in `landmark` index 0 and 1 respectively).

{% highlight JavaScript %}
function drawHand(handPose) {

  // Draw keypoints. While each keypoints supplies a 3D point (x,y,z), we only draw
  // the x, y point.
  for (let j = 0; j < handPose.landmarks.length; j += 1) {
    const landmark = handPose.landmarks[j];
    fill(0, 255, 0, 200);
    noStroke();
    circle(landmark[0], landmark[1], 10);
  }
}
{% endhighlight JavaScript %}

Lastly, let's add a `drawBoundingBox(handPose)` function that renders a rectangle for the HandPose `boundingBox` object along with its `handInViewConfidence` score:

{% highlight JavaScript %}
function drawBoundingBox(handPose){
  // Draw hand pose bounding box
  const bb = handPose.boundingBox;
  const bbWidth = bb.bottomRight[0] - bb.topLeft[0];
  const bbHeight = bb.bottomRight[1] - bb.topLeft[1];
  noFill();
  stroke("red");
  rect(bb.topLeft[0], bb.topLeft[1], bbWidth, bbHeight);

  // Draw confidence
  fill("red");
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(20);
  text(nfc(handPose.handInViewConfidence, 2), bb.topLeft[0], bb.topLeft[1]);
}
{% endhighlight JavaScript %}

You can view, edit, and play with [this code](https://editor.p5js.org/jonfroehlich/sketches/YVRlHlR0I) in the p5.js online editor.

#### Add in web serial code

For the final step, we'll add in code to transmit the `palmBase` normalized x position [0, 1] via web serial. Update the `onNewHandPosePrediction` function to:

{% highlight JavaScript %}
function onNewHandPosePrediction(predictions) {
  if (predictions && predictions.length > 0) {
    curHandPose = predictions[0];
    if(serial.isOpen()){
      // Grab the palm's x-position and normalize it to [0, 1]
      let palmBase = curHandPose.landmarks[0];
      let palmXNormalized = palmBase[0] / width;
      let outputData = nf(palmXNormalized, 1, 4); 
      serial.writeLine(outputData); 
    }
  } else {
    curHandPose = null;
  }
}
{% endhighlight JavaScript %}

And that's it! Because our [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) already supports connecting to a serial device by clicking on the canvas (by default) and/or auto-connecting to previously approved web serial devices, we are all set.

The full code is [here](https://editor.p5js.org/jonfroehlich/sketches/vMbPOkdzu).

Now on to the Arduino side!

### Building the Arduino side

We're going to build up the Arduino side step-by-step. There are five main steps:

- Create an initial servo motor circuit and Arduino test program
- Create a simple p5.js + servo test app with web serial
- Create an interesting lo-fi form for our embedded servo motor
- Test the form and our servo motor circuit
- Create the end-to-end HandPose + Arduino system

#### Initial servo motor circuit and Arduino test program

This [Adafruit lesson](https://learn.adafruit.com/adafruit-arduino-lesson-14-servo-motors) by Simon Monk provides a nice brief introduction to servo motors.

TODO: circuit diagram

For the code, we'll read in the potentiometer value on Pin `A0` using [`analogRead()`](https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/), convert it to an angle between 0 - 180, and then write out the angle to the servo motor.

The code, in full, is:

{% highlight C++ %}
#include <Servo.h> 

const int POTENTIOMETER_INPUT_PIN = A0;  
const int SERVO_OUTPUT_PIN = 9;
const int MAX_ANALOG_VAL = 1023;
Servo _servo; 
 
void setup() 
{ 
  _servo.attach(SERVO_OUTPUT_PIN);  
} 
 
void loop() 
{ 
  // Read pot value
  int potVal = analogRead(POTENTIOMETER_INPUT_PIN); 

  // Servo motor can move between 0 - 180 degrees
  int servoAngle = map(potVal, 0, MAX_ANALOG_VAL, 0, 180);

  // Set servo angle
  _servo.write(servoAngle);  
}
{% endhighlight C++ %}

**Code.** This code is in our GitHub as [ServoPot.ino](https://github.com/makeabilitylab/arduino/blob/master/Basics/servo/ServoPot/ServoPot.ino).
{: .fs-1 }

Here's a video demonstration.

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/ServoMotorWithStick_TrimmedAndOptimized.mp4" type="video/mp4" />
</video>
**Video.** A demonstration of the servo circuit with potentiometer. The video is showing [ServoPotOLED.ino](https://github.com/makeabilitylab/arduino/blob/master/Basics/servo/ServoPotOLED/ServoPotOLED.ino), which is functionally equivalent to the code above ([ServoPot.ino](https://github.com/makeabilitylab/arduino/blob/master/Basics/servo/ServoPot/ServoPot.ino)) but just displays the output angle on the OLED.
{: .fs-1 }

#### Update code to accept serial input

TODO: lots of ways you could do this with accepting 0 - 180, 0 - 255, or 0-1. We'll do latter. Then test with serial monitor.

Show video.

#### Now add in basic p5.js test app

Test code with simple p5.js web serial app. Use mouse x-position on canvas.

Show video.

#### Test with HandPose p5.js app

Test and show video.

#### Create interesting form

In this case, I worked with a special kindergartner to create a form.

<!-- TODO: create a HandPoseDemo 3D? -->

<!-- TODO: with two hands, could control two different servo motors and have cardboard darth vader and cardboard luke duel each other -->

## References

- [ml5 HandPose](https://learn.ml5js.org/#/reference/handpose), ml5

- [TensorFlow HandPose](https://github.com/tensorflow/tfjs-models/tree/master/handpose), Google TensorFlow

- [Training a Hand Detector like the OpenPose one in TensorFlow](https://ortegatron.medium.com/training-a-hand-detector-like-the-openpose-one-in-tensorflow-45c5177d6679), Marcelo Ortega on Medium

- [On-Device, Real-Time Hand Tracking with MediaPipe](https://ai.googleblog.com/2019/08/on-device-real-time-hand-tracking-with.html), Valentin Bazarevsky and Fan Zhang, Google AI Blog

- [Face and Hand Tracking in the Browser with MediaPipe and TensorFlow.js](https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html), Ann Yuan and Andrey Vakunov, TensorFlow Blog