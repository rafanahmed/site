---
title: "The Road to Convolutional Neural Networks"
subtitle: "An Oversimplified Explanation of Classicial to Deep Learning in Computer Vision"
date: "2026-03-16"
cover: "/articles/the-road-to-convolutional-neural-networks/cnn-hero.jpg"
description: "An Oversimplified Explanation of Classicial to Deep Learning in Computer Vision"
tags: ["computer-vision", "deep-learning", "cnn", "history"]
draft: false
---

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/cnn-hero.jpg"
    alt="Image from this website"
  />
  <figcaption>
    Image from <a href="https://atai.fi/sanasto/cnn" target="_blank" rel="noreferrer">this website</a>
  </figcaption>
</figure>


> **Disclaimer:** These are **rough** notes based on lecture slides from the
> Computer Vision course I am currently enrolled in as of March 2026.
> Permission to share this material was obtained before publishing this
> article.
>
> In-text hyperlinks throughout this article serve as contextual and
> prerequisite learning resources. They are included for readers to explore
> underlying concepts but are not part of the formal reference list, as they
> were not directly used in the derivation of the material presented.

## Computer Vision before Convolutional Neural Networks (CNNs)

Before the rise of [deep learning](https://en.wikipedia.org/wiki/Deep_learning)
in machine learning and computer vision, most systems relied on
hand-designed (or [hand-crafted](https://en.wikipedia.org/wiki/Feature_engineering))
features instead of learning features directly from images.

An engineer would manually define methods for a computer to detect useful
patterns, such as applying manual
[edge detection](https://en.wikipedia.org/wiki/Edge_detection) or using
algorithms like [SIFT](https://www.geeksforgeeks.org/machine-learning/sift-interest-point-detector-using-python-opencv/)
or [HOG](https://www.geeksforgeeks.org/computer-vision/histogram-of-oriented-gradients/).

Within our traditional pipeline:

1. Take an input image.
2. Run the input through the hand-crafted feature extraction phase.
3. Feed the resulting feature vectors into a separate, trainable classifier.
   - These classifier models include
     [Support Vector Machines (SVMs)](https://www.geeksforgeeks.org/machine-learning/support-vector-machine-algorithm/),
     or [nearest neighbor algorithms](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm).
4. Output prediction based on the classifier.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(7).jpg"
    alt="A visualization illustrating the step-by-step flow of a traditional computer vision pipeline: image input, hand-crafted feature extraction, and separate classifier."
    style="max-width: 100%; height: auto;"
  />
</figure>

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/384b7b0f-5fd6-4035-85aa-c1d0a56388f8_1425x356.jpg"
    style="max-width: 100%; height: auto;"
    alt="Visualization of the convolutional neural network pipeline"
  />
</figure>


This old pipeline, however, had glaring limitations. The performance of the
outputs/predictions was completely dependent on human ingenuity. This means
that performance depended heavily on the manually designed features. These
systems were often less flexible and less powerful than the modern deep
learning approach.

## Feature Learning Revolution

The shift in modern computer vision from manual to automatic feature
engineering changed our approach to CV pipeline construction. The
breakthrough moment came in 2012 with
[AlexNet](https://en.wikipedia.org/wiki/AlexNet), which demonstrated that
deep convolutional neural networks trained on GPUs could dramatically
outperform classical vision pipelines.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(8).jpg"
    alt=""
    style="max-width: 100%; height: auto;"
  />
</figure>


In our old systems, which we designate as **shallow architecture**:

1. They typically used a small number of processing stages.
2. Was reliant, as stated earlier, on human-designed features.
3. Did not use and learn from rich hierarchical representations from raw
   pixels.

Within our new systems, which we will call **deep architecture**:

1. It stacks many layers of processing units on top of one another.
2. Instead of relying on a human-engineered definition of what constitutes a
   shape or pattern, the networks are trained
   "end-to-end" to learn a feature hierarchy jointly from raw pixels all the way to the
   final classifier.
   - The lower layers learn simple patterns.
   - The middle layers learn more complex structures.
   - Higher layers learn more abstract, object-level features.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(9).jpg"
    alt=""
    style="max-width: 100%; height: auto;"
  />
</figure>


## CNN Building Blocks

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(10).jpg"
    alt="Building blocks of a Convolutional Neural Network, showing convolutional layers, activation functions (ReLU), and pooling layers arranged in sequence."
    style="max-width: 100%; height: auto;"
  />
</figure>



There are 3 main / core components for a Convolutional Neural Network
(CNN):

### 1. Convolution

- The [convolutional layer](https://en.wikipedia.org/wiki/Convolutional_neural_network#Convolutional_layer)
  uses learnable filters to scan across the image spatially, computing the
  dot products.
- These learnable filters operate on the scanning of the image via
  [local connectivity](https://cs231n.github.io/convolutional-networks/#conv),
  which means that a neuron within the neural network only looks at a small
  chunk of the previous layer.
- Then, the learnable filters are applied and reused across the whole image
  in different parts, which is called
  [shared weights](https://cs231n.github.io/convolutional-networks/#conv).
- Thus, the network can detect local patterns within images, such as
  edges, corners, textures, and simple shapes.
- This is important because convolution helps detect patterns regardless
  of where they appear in the image, greatly reducing the number of
  parameters needed in the pipeline compared to fully connected approaches,
  which makes feature detection more efficient and scalable.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(11).jpg"
    alt=""
    style="max-width: 100%; height: auto;"
  />
</figure>


### 2. [Rectified Linear Unit (ReLU)](https://www.geeksforgeeks.org/deep-learning/relu-activation-function-in-deep-learning/)

ReLU is a simple nonlinear activation function in which, mathematically, it
turns all negative values into $0$ while keeping the positive values
unchanged:

$$
\mathrm{ReLU}(z) \;=\; \max(0, z)
$$

Adding nonlinearity allows a network to approximate highly complex
functions:

- This simplifies
  [backpropagation](https://www.geeksforgeeks.org/machine-learning/backpropagation-in-neural-network/) and
  speeds up learning, which is especially helpful when training deep
  networks.
- And, it combats the
  [vanishing gradient problem](https://www.geeksforgeeks.org/deep-learning/vanishing-and-exploding-gradients-problems-in-deep-learning/),
  which is when the gradients used for updating the weights in a neural
  network shrink exponentially during the backpropagation process, which
  makes the early layers stop learning from the inputs.
  - Older activation functions like
    [sigmoid](https://www.geeksforgeeks.org/machine-learning/derivative-of-the-sigmoid-function/)
    and [tanh](https://www.geeksforgeeks.org/deep-learning/tanh-activation-in-neural-network/)
    are prone to the vanishing gradient issue, hence why ReLU is the
    superior activation function to hedge against this.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(12).jpg"
    alt=""
    style="max-width: 100%; height: auto;"
  />
</figure>

### 3. Pooling

- [Pooling](https://en.wikipedia.org/wiki/Convolutional_neural_network#Pooling_layer)
  is a spatial downsampling technique, with the most common variant being
  max pooling.
  - This means taking the maximum value from a small local region (like a
    $2 \times 2$ grid).
- This reduces the size of the feature map, which reduces the computational
  cost of the network.
  - This, in turn, helps the model focus on the most important features of
    the input and introduces a degree of
    [translation invariance](https://en.wikipedia.org/wiki/Translational_symmetry),
    which is the robustness to small shifts in the input image.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(13).jpg"
    alt=""
    style="max-width: 100%; height: auto;"
  />
</figure>


## Pixels to Objects

Inspired by biological
[visual cortex](https://en.wikipedia.org/wiki/Visual_cortex) models, deep
learning models build a progressive hierarchical feature representation.
This means computer vision systems gradually go from raw input data to
meaningful object understanding.

The progression is as follows:

> Pixels → Edges → Shapes / Parts → Objects

1. The first layer acts similarly to manual edge detectors by extracting
   local edges, which are the fundamental boundaries in visual data.
2. The second layer will then combine these edges into corners or object
   parts.
3. Finally, the higher layers compute more global, abstract, and invariant
   features capable of recognizing entire objects.

Edge detection in this context is important for visual understanding in
CNNs and deep architectures, as it highlights meaningful boundaries in
images that correspond to objects.

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(14).jpg"
    alt="Layer 1: Extraction of local edge features from input pixels in a convolutional neural network."
    style="max-width: 100%; height: auto;"
  />
  <figcaption>
    Example output of <b>Layer 1</b> in a convolutional neural network—local edge features are extracted from raw input pixels.
  </figcaption>
</figure>

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(15).jpg"
    alt="Layer 2: Combination of edge features into shapes or object parts in a convolutional neural network."
    style="max-width: 100%; height: auto;"
  />
  <figcaption>
    Example output of <b>Layer 2</b> in a convolutional neural network—edge features from earlier layers are combined into corners, curves, or object parts, enabling the network to recognize higher-level shapes.
  </figcaption>
</figure>

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(16).jpg"
    alt="Layer 3: Abstraction of features into recognizable objects in a convolutional neural network."
    style="max-width: 100%; height: auto;"
  />
  <figcaption>
    Example output of <b>Layer 3</b> in a convolutional neural network—features from previous layers are combined into abstract, high-level concepts that correspond to whole objects.
  </figcaption>
</figure>

<figure>
  <img
    src="/articles/the-road-to-convolutional-neural-networks/image%20(17).jpg"
    alt="Layers 4 and 5: Complex, high-level features representing detailed object compositions in a convolutional neural network."
    style="max-width: 100%; height: auto;"
  />
  <figcaption>
    Example output of <b>Layers 4 and 5</b> in a convolutional neural network—these layers combine previous abstractions to form mature, task-specific representations capable of supporting very precise recognition and reasoning over complex visual patterns.
  </figcaption>
</figure>





## Training and Transfer

CNNs are supervised learning models that compute classification error using
an algorithm called
[backpropagation](https://www.geeksforgeeks.org/machine-learning/backpropagation-in-neural-network/), which
updates the network's weights through
[gradient descent](https://www.youtube.com/watch?v=IHZwWFHWa-w).

Training deep networks from scratch requires massive amounts of data,
time, and compute, which is why they rely on what is called
[transfer learning](https://www.tensorflow.org/tutorials/images/transfer_learning).

Transfer learning means reusing a neural network trained on a large
dataset (such as [ImageNet](https://www.image-net.org/)) and adapting it to
a new task.

1. The earlier layers of a CNN learn foundational visual features such as
   edges and textures, which are useful across many different visual
   tasks.
2. When we take a pre-trained network and
   ["fine-tune"](https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning))
   the last few layers on a new, smaller dataset, practitioners can save
   significant training time and achieve better performance compared to
   when they try to relearn it all from scratch.

## Tl;dr

**Old CV**

- Relied on hand-crafted features designed by engineers.
- Used techniques like manual edge detection.
- Built on shallow systems with a small number of processing stages.

**New CV / CNNs**

- Built using deep architectures.
- Designed to learn features automatically from data.
- Extracts higher-level representations from raw images without human
  feature engineering.

**CNN building blocks**

- **Convolution** — detects local patterns with shared filters.
- **ReLU** — adds nonlinearity, turns negatives into $0$.
- **Pooling** — downsamples and helps with translation robustness.

**Vision hierarchy**

- Processes data sequentially: Pixels → edges → shapes and object parts
  → objects.

**Transfer learning**

- Allows you to reuse a pre-trained network for a new task.
- This strategy saves time and often improves performance.

## References

1. Das, S. *Deep Learning — Convolutional Neural Networks (Lectures 8–10).*
   ITCS-4152 / ITCS-5010 Computer Vision course lecture slides.
2. AtAI.fi. [*CNN (Convolutional Neural Network).*](https://atai.fi/sanasto/cnn)
   AI glossary. Last reviewed Jan 17, 2026.

## Further Reading

- [*The Geometry of Prediction*](/blog/the-geometry-of-prediction)
