
Outline:
- Show Elmo
- Show elmo face track + Arduino
- Adapt code for flappy bird

## Machine Learning Frameworks

In our Computer Science and Engineering Master's course on *Ubiquitous Computing*, we teach a ~4-week module on filtering, interpreting, and classifying sensor data. Students learn and experience the full classification pipeline: collecting data, writing code to process and visualize that data, identifying and extracting unique features for classification, and writing code to classify those features (*e.g.,* through template matching or supervised learning). For example, students build [accelerometer-based step trackers](https://makeabilitylab.github.io/physcomp/signals/StepTracker/index.html) and [3D-gesture recognizers](https://youtu.be/nnTyqCwYVbA).

<!-- TODO: insert diagram of this pipeline -->

To get there, we cover topics in [digital signal processing](https://makeabilitylab.github.io/physcomp/signals/) and [signal classification](https://makeabilitylab.github.io/physcomp/signals/classification.html), including [cross-correlation](https://makeabilitylab.github.io/physcomp/signals/ComparingSignals/index.html), [dynamic time warping](https://makeabilitylab.github.io/physcomp/signals/ComparingSignals/index.html), and [frequency analysis](https://makeabilitylab.github.io/physcomp/signals/FrequencyAnalysis/index.html) before diving into [heuristic-based classification](https://makeabilitylab.github.io/physcomp/signals/step-tracker.html), [template matching](https://makeabilitylab.github.io/physcomp/signals/gesturerec/shapebased/index.html), and supervised learning,  including [feature-based classification](https://makeabilitylab.github.io/physcomp/signals/gesturerec/featurebased/index.html) and [feature selection and parameter tuning](https://makeabilitylab.github.io/physcomp/signals/FeatureSelectionAndHyperparameterTuning/index.html)).

These topics alone are wide-ranging, dense, and worthy of their own courses (and, indeed, engineering departments typically offer multiple courses in DSP and machine learning). While our own MS course provides a rapid tour through an applied perspective—as is typical in the [HCI](http://chi.acm.org/) and [UbiComp](https://dl.acm.org/journal/imwut) communities—there are still significant barriers to entry such as building familiarity with mathematical notation, technical nomenclature, and relevant toolkits/libraries.

For example, for our 4-week module alone, we use [Python3](https://www.python.org/downloads/), [Jupyter Notebook](https://jupyter.org/) and a variety of incredibly powerful but not particularly approachable signal processing and machine learning frameworks including [NumPy](https://numpy.org/), [SciPy](https://www.scipy.org/), [pandas](https://pandas.pydata.org/), [sci-kit learn](https://scikit-learn.org/stable/), and [matplotlib](https://matplotlib.org/). Whew!

While these frameworks provide comprehensive libraries for processing, classifying, and visualizing data, they have a relatively high bar for entry. As [Daniel Shiffman](https://medium.com/ml5js/ml5-friendly-open-source-machine-learning-library-for-the-web-e802b5da3b2) emphasizes:

> Machine learning frameworks are commonly geared for people with advanced knowledge of calculus, linear algebra, statistics, data science, and several years of programming in a language like python or C++. While important for research and development of new machine learning models and architectures, starting from this point can turn away newcomers with other backgrounds. Rather than thinking creatively about how to use machine learning as an artistic platform, beginners may be overwhelmed by fine distinctions between scalars, vectors, matrices, operations, inputs layers, outputs, and more.
{: .fs-4 }

And what if we don't need (or want) to train our own classifiers or deeply engage with signal analysis? What if we just want to play and experiment with pre-trained models and/or state-of-the-art classification techniques to create new interactive experiences? Fortunately, people are working on this!

### Machine learning frameworks (maybe rename)

Since its inception, researchers have worked to make machine learning more accessible to creators—musicians, artists, designers, and hobbyists. For example, in 2009, Fiebrink and colleagues created the *[Wekinator](https://ualresearchonline.arts.ac.uk/id/eprint/16687/1/FiebrinkTruemanCook_NIME2009.pdf)* to allow "*musicians, composers, and new instrument designers to interactively train and modify many standard machine learning algorithms in real-time.*" Six years prior, Jerry Fails and Dan Olsen Jr. introduced [*Crayons*](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.14.8362&rep=rep1&type=pdf), an interactive machine-learning model that enabled artists to train, classify, and correct pixel-based classifications (see Figure below).

![](assets/images/CrayonsScreenShot_ByJerrFailsAndDanOlsenJr.png)
**Figure.** The Crayons' interactive machine learning process for auto-segmenting pixel "blobs" in images. Users rapidly sketch over pixels to include and exclude from classification—in this case, segmenting a human hand—immediately see the ML model's response (highlighted pixels) and then make corrections.
{: .fs-1 }

As machine learning techniques have matured, so too have libraries to make them more accessible, including [Google's Teachable Machine](https://teachablemachine.withgoogle.com/), [Runway ML](https://runwayml.com/), and [ml5js](https://ml5js.org/). 

Indeed, machine learning is increasingly becoming a *prototyping material*—just as we prototype with code, electronics, and crafts so too can we prototype with ML. However powerful, ML can also be dangerous and nefariously applied—[governments using facial recognition](https://epic.org/state-policy/facialrecognition/#:~:text=Facial%20recognition%20can%20be%20used,%2C%20misuse%2C%20and%20mission%20creep.) to surveil without consent, models furthering [systemic racial or gender bias](http://proceedings.mlr.press/v81/buolamwini18a/buolamwini18a.pdf), or users not understanding the [limitations of ML causing death](https://www.washingtonpost.com/technology/2021/05/14/tesla-california-autopilot-crash/). 

> With great power comes great responsibility

Though this lesson will not dive deeply into ML, our hope is that it will serve as an accessible pathway to advance your understanding of how ML works, the importance of data and model training, the opportunities for algorithmic bias, and the socio-technical implications of creating ML-reliant technology. So, let's get started!
