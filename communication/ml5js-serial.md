---
layout: default
title: L6&#58; ml5.js Serial
nav_order: 5
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

In this lesson, we will extend our learning on [web serial](web-serial.md) and [p5.js](p5js-serial.md) to incorporate a machine learning (ML) framework called [ml5.js](https://ml5js.org/). While incorporating machine learning into our designs may *seem* intimidating, just as p5.js makes it easier to play and experiment with interactive graphics in JavaScript so too do ML frameworks like [ml5.js](https://ml5js.org/) make it easier to play and experiment with machine learning. 

## Machine learning frameworks

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/RealTimeGestureRecognizer-EditedAndOptimized.mp4" type="video/mp4" />
</video>
**Video.** In our MS course on *Ubiquitous Computing*, students build a real-time gesture recognizer using an LIS3DH accelerometer, Arduino, and Python. We use the machine learning framework called [scikit-learn](https://scikit-learn.org/stable/). Full [YouTube video](https://youtu.be/nnTyqCwYVbA).
{: .fs-1 }

In our Computer Science and Engineering Master's course on *Ubiquitous Computing*, we teach a ~4-week module on filtering, interpreting, and classifying sensor data. Students learn and experience the full classification pipeline: collecting data, writing code to process and visualize that data, identifying and extracting unique features for classification, and writing code to classify those features. For example, students build custom [accelerometer-based step trackers](https://makeabilitylab.github.io/physcomp/signals/StepTracker/index.html) and [3D-gesture recognizers](https://youtu.be/nnTyqCwYVbA) using Arduino and Python. See video above.

<!-- TODO: insert diagram of this pipeline -->

To get there, we cover topics in [digital signal processing](https://makeabilitylab.github.io/physcomp/signals/) and [signal classification](https://makeabilitylab.github.io/physcomp/signals/classification.html), including [cross-correlation](https://makeabilitylab.github.io/physcomp/signals/ComparingSignals/index.html), [dynamic time warping](https://makeabilitylab.github.io/physcomp/signals/ComparingSignals/index.html), and [frequency analysis](https://makeabilitylab.github.io/physcomp/signals/FrequencyAnalysis/index.html) before diving into [heuristic-based classification](https://makeabilitylab.github.io/physcomp/signals/step-tracker.html), [template matching](https://makeabilitylab.github.io/physcomp/signals/gesturerec/shapebased/index.html), and supervised learning (*e.g.,* [support-vector machines](https://makeabilitylab.github.io/physcomp/signals/gesturerec/featurebased/index.html)). These topics alone are wide-ranging, dense, and worthy of their own courses—indeed, engineering departments typically offer multiple courses in DSP and machine learning. While our MS course provides a rapid tour with an applied perspective—as is typical in the [HCI](http://chi.acm.org/) and [UbiComp](https://dl.acm.org/journal/imwut) communities—there are still significant barriers to entry such as building familiarity with mathematical notation, technical nomenclature, and learning relevant toolkits/libraries.

For example, in our 4-week module alone, we use [Python3](https://www.python.org/downloads/), [Jupyter Notebook](https://jupyter.org/) and a variety of incredibly powerful but not particularly approachable signal processing and machine learning frameworks including [NumPy](https://numpy.org/), [SciPy](https://www.scipy.org/), [pandas](https://pandas.pydata.org/), [sci-kit learn](https://scikit-learn.org/stable/), and [matplotlib](https://matplotlib.org/). Whew! While these frameworks provide comprehensive libraries for processing, classifying, and visualizing data, they have a relatively high bar for entry. As [Daniel Shiffman](https://medium.com/ml5js/ml5-friendly-open-source-machine-learning-library-for-the-web-e802b5da3b2) emphasizes:

> Machine learning frameworks are commonly geared for people with advanced knowledge of calculus, linear algebra, statistics, data science, and several years of programming in a language like python or C++. While important for research and development of new machine learning models and architectures, starting from this point can turn away newcomers with other backgrounds. Rather than thinking creatively about how to use machine learning as an artistic platform, beginners may be overwhelmed by fine distinctions between scalars, vectors, matrices, operations, inputs layers, outputs, and more.
{: .fs-4 }

And what if we don't need (or want) to train our own classifiers or deeply engage with signal analysis? What if we just want to play and experiment with pre-trained models and/or state-of-the-art classification techniques to create new interactive experiences? Fortunately, there are many possibilities!

### Making machine learning accessible

Since its inception, researchers have worked to make machine learning more accessible to creators such as musicians, artists, designers, and hobbyists. For example, in 2009, Fiebrink and colleagues created the *[Wekinator](https://ualresearchonline.arts.ac.uk/id/eprint/16687/1/FiebrinkTruemanCook_NIME2009.pdf)* to allow "*musicians, composers, and new instrument designers to interactively train and modify many standard machine learning algorithms in real-time.*" Six years prior, Jerry Fails and Dan Olsen Jr. introduced [*Crayons*](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.14.8362&rep=rep1&type=pdf), an interactive machine-learning model that enabled artists to train, classify, and correct pixel-based classifications (see Figure below).

![](assets/images/CrayonsScreenShot_ByJerrFailsAndDanOlsenJr.png)
**Figure.** The Crayons' interactive machine learning process for auto-segmenting pixel "blobs" in images. Users rapidly sketch over pixels to include and exclude from classification—in this case, segmenting a human hand—immediately see the ML model's response (highlighted pixels) and then make corrections. See full [video demo here](https://youtu.be/GtW-7YsiQdI).
{: .fs-1 }

As machine learning techniques have matured, so too have libraries to make them more accessible, including [Google's Teachable Machine](https://teachablemachine.withgoogle.com/), [Runway ML](https://runwayml.com/), and [ml5.js](https://ml5js.org/)—all which run in the web browser and work with JavaScript! 

As a testament to these toolkits, machine learning is increasingly becoming another *prototyping material.* Just as we prototype with code, electronics, and crafts so too can we prototype with ML, unlocking new opportunities for computational creativity and new applications! However powerful, ML can also be dangerous and nefariously applied—[governments using facial recognition](https://epic.org/state-policy/facialrecognition/#:~:text=Facial%20recognition%20can%20be%20used,%2C%20misuse%2C%20and%20mission%20creep.) to surveil without consent, models furthering [systemic racial or gender bias](http://proceedings.mlr.press/v81/buolamwini18a/buolamwini18a.pdf), and/or technologists over-inflating ML's abilities, endangering end-users and possibly [leading to death](https://www.washingtonpost.com/technology/2021/05/14/tesla-california-autopilot-crash/). 

> With great power comes great responsibility

Though this lesson will not dive deeply into ML, our hope is that it will serve as an accessible pathway to advance your understanding of how ML works, the importance of data and model training, the opportunities for algorithmic bias, and the socio-technical implications of creating ML-reliant technology. So, let's get started!

## Friendly machine learning on the web: ml5.js

<video autoplay loop muted playsinline style="margin:0px">
  <source src="assets/videos/PoseNet_TensorFlow-Optimized.mp4" type="video/mp4" />
</video>
**Video.** ml5.js's [PoseNet](https://learn.ml5js.org/#/reference/posenet) is a machine learning model for real-time pose estimation built on [TensorFlow](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5).
{: .fs-1 }

In this lesson, we will be using [ml5.js](https://www.tensorflow.org/js/), which provides an easy-to-use wrapper library around Google's [TensorFlow.js](https://www.tensorflow.org/js/) and is designed to work well with [p5.js](https://p5js.org/). As the [About Page](https://ml5js.org/about/) states:

> ml5 is not just about developing machine learning software, it is about making machine learning approachable for a broad audience of artists, creative coders, and students. The library provides access to machine learning algorithms and models in the browser, building on top of TensorFlow.js with no other external dependencies
{: .fs-4 }

You can read more about ml5's history [here](https://medium.com/ml5js/ml5-friendly-open-source-machine-learning-library-for-the-web-e802b5da3b2). ml5.js is open sourced on [GitHub](https://github.com/ml5js/ml5-library).

![](assets/images/ml5js_DiagramRelationToTensorFlow.png)
{: .mx-auto .align-center }

**Figure.** ml5.js is built on top of Google's [TensorFlow.js](https://www.tensorflow.org/js/). It uses TensorFlow models, layers, and data API but abstracts them into a novice-friendly programming interface. Diagram from Yining Shi's "Machine Learning for the Web" course at ITP, NYU ([link](https://docs.google.com/presentation/d/1s0iT382Pl1DMGKb5xhk7_V3DlW1QQHfHs4snNoS_sIU/edit#slide=id.g953c8caacd_0_2))
{: .fs-1 }

### Why not embedded machine learning?

As this is a physical computing course, one may rightly ask: why not teach *embedded* machine learning where the ML model runs locally on the Arduino or IoT device rather than on a computer or in the cloud. This is a great question with a multifold response:

- First, when initially learning ML—even in the applied sense—we think the desktop provides a more approachable learning environment. The tools are more mature, it's easier to visualize and understand the data and the ML model, and it's easier to debug and iterate. 
- While new ML frameworks like [TensorFlow Lite](https://www.tensorflow.org/lite) are designed specifically for mobile and low-resource devices, the community is still small with commensurately few examples. And, again, running a model directly on Arduino increases training, testing, and iterating complexity. We should start simply and grow outward!
- Even "smart" IoT or wearable devices, which use machine learning often rely on cloud-based APIs for classification. The device itself might preprocess the data or extract features for the cloud but the full classifier runs off-device. For example, our [SoundWatch](https://makeabilitylab.cs.washington.edu/project/soundwatch/) system classifies and visualizes sounds in real-time on a smartwatch for people who are d/Deaf or hard of hearing. In our [ASSETS'20 paper](https://makeabilitylab.cs.washington.edu/media/publications/Jain_SoundwatchExploringSmartwatchBasedDeepLearningApproachesToSupportSoundAwarenessForDeafAndHardOfHearingUsers_ASSETS2020.pdf), we explore four different classification architectures: *watch-only*, *watch+phone*, *watch+phone+cloud*, and *watch+cloud*. There are many possibilities for how to architect embedded/IoT ML systems depending on power, computation, and latency requirements.

Finally, and most relevantly for this specific lesson, we will not be classifying sensor streams off the Arduino but rather combining the Arduino with ml5.js over [web serial](web-serial.md).

<!-- TODO: why not run classifiers on the microcontroller?
See: https://experiments.withgoogle.com/tfmicrochallenge -->

<!-- Pacman web cam controller: https://storage.googleapis.com/tfjs-examples/webcam-transfer-learning/dist/index.html -->

### Getting started with ml5.js

To get started with [ml5.js](https://ml5js.org/), we recommend reading the official ml5.js ["Getting Started" page](https://learn.ml5js.org/#/) and watching some of Daniel Shiffman's Coding Train YouTube series on a ["Beginner's Guide to Machine Learning with ml5.js"](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y), which includes wonderful videos on [image classification](https://www.youtube.com/watch?v=yNkAuWz5lnY&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=3), [object detection](https://www.youtube.com/watch?v=QEzRxnuaZCk&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=5&t=211s), [sound classification](https://www.youtube.com/watch?v=cO4UP2dX944&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=19&t=766s), [doodle classification](https://www.youtube.com/watch?v=ABN_DWnM5GQ&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=30), and more! Shiffman also shows you how to train your own models, including for a JavaScript-based Snake game ([link](https://www.youtube.com/watch?v=kwcillcWOg0&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=13&t=66s)) or to [classify your own sounds](https://www.youtube.com/watch?v=TOrVsLklltM&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=20).

<iframe width="736" height="414" src="https://www.youtube.com/embed/jmznx0Q1fP0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
**Video.** The first video in Shiffman's Coding Train YouTube series on ["Beginner's Guide to Machine Learning with ml5.js"](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y). We highly recommend all [Coding Train videos](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw)!
{: .fs-1 }

<!-- TODO: in future flesh out ml5.js library section and provide screenshots, etc.
### ml5.js library

The [ml5.js](https://learn.ml5js.org/#/reference/index) library provides image, sound, and text classification. Please see the Reference page for details. We will survey a few common models below.

#### Image

## Other libraries -->

<!-- - face-api.js https://github.com/justadudewhohacks/face-api.js -->

## Recognizing human poses with PoseNet

Pose estimation uses computer vision to detect human body parts in images or video streams. Importantly, pose estimation does **not** recognize *who* is in an image or video, it simply identifies whether there are humans and, if so, provides data about their body parts (*e.g.,* an `x,y` position of an ankle or nose). This has long-been a challenging computer vision problem. Prior work often relied on specialized cameras, like the [Microsoft Kinect](https://www.microsoft.com/en-us/research/project/human-pose-estimation-for-kinect/), to capture and identify human poses.

In May 2018, Google Creative Lab [announced](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) PoseNet, a TensorFlow.js-based real-time human pose estimator for the web browser. This was an incredible achievement: now, anyone with a web browser and web cam could use and/or build pose-based applications. TensorFlow.js runs locally in the browser using pre-trained data. Thus, all recognition and pose data is local—none is sent up to the cloud (unless an application built around PoseNet transmits this information).

Where does the training data come from? According to [this article](https://medium.com/ml5js/ml5-friendly-open-source-machine-learning-library-for-the-web-e802b5da3b2), the pose detection models were trained using the [Cambridge Landmarks](http://mi.eng.cam.ac.uk/projects/relocalisation/) and [7-Scenes Datasets](https://www.microsoft.com/en-us/research/project/rgb-d-dataset-7-scenes/).

#### PoseNet models

PoseNet actually has two different trained models: a single-pose estimator for when you only need (or expect) one human figure in a frame and a multiple-pose detector for detecting multiple people. While the single-pose model is faster, if there is a possibility of multiple persons in a frame, use the multi-pose model. Otherwise, the single-pose model may conflate body parts across people (*e.g.,* person 1's left elbow is part of person 2).

<!-- Example:
https://storage.googleapis.com/tfjs-models/demos/posenet/camera.html -->

#### The PoseNet data structure

Both the [TensorFlow.js PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) implementation and the [ml5.js wrapper ](https://learn.ml5js.org/#/reference/posenet) use the same pose data structure.

![](assets/images/PoseNet_PosesAndKeypoints_FromMediumArticle.png)
**Figure.** Overview of PoseNet data. Images from "[Real-time Human Pose Estimation in the Browser with TensorFlow.js](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5)".
{: .fs-1 }

PoseNet returns an array of objects—one object per human detected in a frame. For each human, we receive: 
1. a `pose` object, which includes an overall confidence score and an array of 17 keypoints, and 
2. a `skeleton` object, which includes the same keypoint data but with joint connectivity information (*e.g.,* the `rightElbow` and `rightShoulder` are connected). 

Each keypoint comes with a `position` (the x,y pixel position of the keypoint), a confidence `score` (ranging between 0-1), and a `part` name. As the figure above shows, there are [17 keypoints](https://github.com/tensorflow/tfjs-models/tree/master/posenet#keypoints) in total: `nose`, `leftEye`, `rightEye`, `leftEar`, `rightEar`, `leftShoulder`, `rightShoulder`, `leftElbow`, `rightElbow`, `leftWrist`, `rightWrist`, `leftHip`, `rightHip`, `leftKnee`, `rightKnee`, `leftAnkle`, `rightAnkle`.

The array structure looks like this:

{% highlight JavaScript %}
[
  {
    pose: {
      score: { confidence },
      keypoints: [{ position: { x, y }, score, part }, { position: { x, y }, score, part }, ...],
      leftAngle: { x, y, confidence },
      leftEar: { x, y, confidence },
      leftElbow: { x, y, confidence },
      ...
    },
    skeleton: [
        [{ part, position: { x, y }, score }, { part, position: { x, y }, score }],
        [{ part, position: { x, y }, score }, { part, position: { x, y }, score }],
        ...
    ],
  },
  {
    score: { confidence },
    pose: {
      keypoints: [{ position: { x, y }, score, part }, { position: { x, y }, score, part }, ...],
      leftAngle: { x, y, confidence },
      leftEar: { x, y, confidence },
      leftElbow: { x, y, confidence },
      ...
    },
    skeleton: [
        { part, position: { x, y }, score }, { part, position: { x, y }, score }, ...
    ],
  },
  ...
];
{% endhighlight JavaScript %}

To make this more clear, here's a screenshot with Chrome's dev tools showing a pose and skeleton object.

![](assets/images/TempPoseNetDataStructure.png)
**Figure.** TODO: UPDATE THIS FIGURE
{: .fs-1 }
<!-- TODO: video or screenshot examining these points in Chrome? -->

### Example p5.js + ml5.js PoseNet demo

To demonstrate the [ml5.js PoseNet API](https://learn.ml5js.org/#/reference/posenet), we created a simple application called [Skeleton](https://makeabilitylab.github.io/p5js/ml5js/PoseNet/Skeleton/) that renders:
- a bounding box around each detected human with a confidence `score`
- all 17 keypoints with `x,y` position and keypoint-specific confidence `scores`
- the `skeleton` data for each pose.

TODO: record video and insert here.

You can try out the application [here](https://learn.ml5js.org/#/reference/posenet) ([live page](https://learn.ml5js.org/#/reference/posenet), [code](https://github.com/makeabilitylab/p5js/tree/master/ml5js/PoseNet/Skeleton)). TODO: also put in a version in p5.js online editor.

Now, let's start building a ml5.js + Arduino application together!

## Building our first ml5.js + Arduino app: NoseTracker

For our first exercise, we will build a simple but fun toy application: tracking a person's nose using [ml5.js' PoseNet](https://learn.ml5js.org/#/reference/posenet) to move around an object on the Arduino OLED display. As this is part of our [web serial](web-serial.md) series, we will transmit information from our JavaScript app to Arduino via serial communication.

Here's a quick sneak preview:

TODO: insert video.
**Video.** Our p5.js application is loosely based on this Coding Train "[Hour of Code with p5.js and PoseNet](https://youtu.be/EA3-k9mnLHs)" video.
{: .fs-1 }

### Building the p5.js + ml5.js NoseTracker

First, let's start by building the p5.js + ml5.js NoseTracker. As we've done in previous lessons, begin by copying [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate). If you're using VSCode, copy [`SerialTemplate`](https://github.com/makeabilitylab/p5js/tree/master/WebSerial/p5js/SerialTemplate) and rename the folder to `NoseTracker`. If you're using the p5.js online editor, simply open this project, [Serial Template](https://editor.p5js.org/jonfroehlich/sketches/vPfUvLze_C), and rename your project to `NoseTracker`.

#### Add in ml5.js' PoseNet

Now, let's add in ml5.js' PoseNet. The `ml5.poseNet` object has [two primary constructors](https://learn.ml5js.org/#/reference/posenet?id=initialize)—one which uses a live `video` feed, like from a webcam and the other which does not. Both constructors use *optional* arguments (indicated by the `?` prefix in the function's parameter list):

{% highlight JavaScript %}
// Initialize with video, options and callback
const poseNet = ml5.poseNet(?video, ?options, ?callback);

// Initialize WITHOUT video. Just options and callback here
const poseNet = ml5.poseNet(?callback, ?options);
{% endhighlight JavaScript %}

The parameters are:
* `video`: An optional [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement). This is easy to acquire in p5.js, we simply call [`createCapture(VIDEO)`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement).

* `callback`: An optional reference to a callback function, which is called when the model is loaded.

* `options`: An optional object of PoseNet configuration properties. See below.

The *options* object is formatted as follows. If no options object is passed, the given defaults below are used. For more on what these properties mean, please see this [TensorFlow PoseNet article](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) (scroll to the section called "Part 2a: Single-person Pose Estimation").

{% highlight JavaScript %}
{
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'multiple',
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2,
};
{% endhighlight JavaScript %}

So, to initialize ml5 PoseNet with the web camera video stream, we write:

{% highlight JavaScript %}
let video;
let poseNet;
function setup(){
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  poseNet = ml5.poseNet(video, onPoseNetModelReady);

  ...
}

function onPoseNetModelReady() {
  print("The PoseNet model is ready...");
}
{% endhighlight JavaScript %}

If we want to pass in some configuration options—for example, to specify the single-pose estimator with a minimum pose confidence of 0.3—we can modify this slightly to:

{% highlight JavaScript %}
function setup(){
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  const poseNetOptions = { detectionType: "single", minConfidence: 0.3 };
  poseNet = ml5.poseNet(video, poseNetOptions, onPoseNetModelReady);

  ...
}
{% endhighlight JavaScript %}

Outline:
- Show Elmo
- Show elmo face track + Arduino
- Adapt code for flappy bird


<!-- Physcomp + ml:
- https://experiments.withgoogle.com/objectifier-spatial-programming
- https://experiments.withgoogle.com/tfmicrochallenge -->

## Resources

- [Machine Learning for the Web](https://github.com/yining1023/machine-learning-for-the-web), Yining Shi's course at ITP, NYU

- [Beginner's Guide to Machine Learning with ml5.js](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y), Daniel Shiffman's Coding Train YouTube series

