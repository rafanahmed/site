---
title: What Happens Below a Machine Learning Framework?
subtitle: Tensors, autodiff, and Compiler Representations on a High-level
date: 2026-09-04
cover: /articles/what-happens-below-a-machine-learning-framework/cover.png
description: A high-level guide to tensors, autodiff, and compiler representations beneath two familiar lines of machine learning (ML) code
section: AI/ML
tags:
  - deep-learning
  - neural-networks
draft: false
---
<figure>
  <img
    src="/articles/what-happens-below-a-machine-learning-framework/cover.png"
    alt="Image from ML Frameworks and Abstractions slideshow"
  />
  <figcaption>
    Image from <a href="https://catalyst.cs.cmu.edu/15-884-mlsys-sp21/slides/1-MLSys-MLFrameworkAbstraction.pdf" target="_blank" rel="noreferrer">Tianqi Chen's slides on ML Frameworks and Abstractions from Carnegie Mellon School of Computer Science</a>
  </figcaption>
</figure>

> Prerequisite knowledge is required to understand every part of this article in full. Fret not, as I will do my best to provide in-text links and citations for much of the information within this article, including the prerequisite knowledge, which some won’t formally be in the references section. The in-text citations may be broad or vague regarding the definition of the hyperlinked word, but are connected to the context clues within this article when researched. All notation shown is original unless cited otherwise.

If you have ever navigated and implemented the process of building, training, and subsequent deployment of a [deep learning](https://www.geeksforgeeks.org/deep-learning/introduction-deep-learning/) model or [neural network](https://www.geeksforgeeks.org/deep-learning/neural-networks-a-beginners-guide/), one of the most accessible and common ways is to utilize what are called [general libraries](https://www.ibm.com/think/topics/machine-learning-libraries), which are programming libraries that one can import into their codebase that provide pre-made and ready-for-use code.[1](#ref-1) Examples of ML frameworks include [PyTorch](https://docs.pytorch.org/docs/2.14/index.html), [TensorFlow](https://www.tensorflow.org/learn), and [JAX](https://docs.jax.dev/en/latest/). These frameworks provide a common toolset for the user and programmer to express mathematical intention, since the AI tasks, algorithms, and models are pre-built, without having to manage the actual machinery needed to do the math on the hardware directly.[2](#ref-2)

To demonstrate these abstractions, we will construct a simple neural network’s [forward propagation](https://telnyx.com/learn-ai/forward-propogation-ai) and [backpropagation](https://telnyx.com/learn-ai/back-propogation) mechanisms:

If we want to take an input of data $x$ and a set of learned knobs and configurations, i.e., weights $W$ that control how the input $x$ is transformed, we can then yield the neural network’s prediction, $y$.[^1] This is denoted as

$$
y = x \times W
$$

For matrix multiplication to occur, the dimensions of two matrices must align. From linear algebra fundamentals, this means [the number of columns in the first matrix must match the number of rows in the second.](https://www.mathwords.com/c/compatible_matrices.htm)

So, with the data $x$ and the weight $W$ possessing the attribute of being an $m \times k$-sized matrix and a $k \times n$-sized matrix, respectively, this expression can be extended to

$$
x \in \mathbb{R}^{m \times k}, \qquad W \in \mathbb{R}^{k \times n}, \qquad y \in \mathbb{R}^{m \times n}
$$

Thus, if we fully expand the notation of these matrices out, the multiplication actually looks like

$$
\underbrace{
\begin{bmatrix}
y_{11} & y_{12} & \cdots & y_{1n} \\
y_{21} & y_{22} & \cdots & y_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
y_{m1} & y_{m2} & \cdots & y_{mn}
\end{bmatrix}
}_{y \in \mathbb{R}^{m \times n}}
=
\underbrace{
\begin{bmatrix}
x_{11} & x_{12} & \cdots & x_{1k} \\
x_{21} & x_{22} & \cdots & x_{2k} \\
\vdots & \vdots & \ddots & \vdots \\
x_{m1} & x_{m2} & \cdots & x_{mk}
\end{bmatrix}
}_{x \in \mathbb{R}^{m \times k}} \times
\underbrace{
\begin{bmatrix}
W_{11} & W_{12} & \cdots & W_{1n} \\
W_{21} & W_{22} & \cdots & W_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
W_{k1} & W_{k2} & \cdots & W_{kn}
\end{bmatrix}
}_{W \in \mathbb{R}^{k \times n}}
$$

> More accurately, in ML frameworks and fundamentals, the arbitrarily sized data matrix $x$, weight matrix $W$, and output/prediction matrix $y$ are better understood as [tensors](https://www.w3schools.com/ai/ai_tensors.asp) (which serves as an important definition and semantic backbone later on, as you will see). The number of dimensions in a tensor is called the [rank](https://www.doitpoms.ac.uk/tlplib/tensors/what_is_tensor.php#:~:text=rank%20(or%20order)%20of%20a%20tensor%20is%20defined%20by%20the%20number%20of%20directions%20(and%20hence%20the%20dimensionality%20of%20the%20array)%20required%20to%20describe%20it.).
>
> In our previous matrices $x \in \mathbb{R}^{m \times k}$, $W \in \mathbb{R}^{k \times n}$, and $y \in \mathbb{R}^{m \times n}$, since there were two dimensions — $m \times k$, $k \times n$ and $m \times n$ — per matrix, these matrices would be categorized as rank-2 tensors.
>
> And, since tensors can have arbitrarily sized dimensions, we can use $r$, $s$, and $t$ to denote the individual tensor ranks for $x$, $W$, and $y$, respectively, and $d$, $w$, and $e$ to denote some assigned value/size of each dimension, also respectively. Therefore,
>
> $$
x \in \mathbb{R}^{d_1 \times d_2 \times \cdots \times d_r}, \qquad W \in \mathbb{R}^{w_1 \times w_2 \times \cdots \times w_s}, \qquad y \in \mathbb{R}^{e_1 \times e_2 \times \cdots \times e_t}
 $$
>
> [^2]

In Python-based ML frameworks, this is commonly written using the `@` operator, which signifies matrix multiplication operations and tensor contractions/manipulations.

```python
y = x @ W
```

This is our linear transformation used in this simplified **forward propagation** mechanism.[^3]

Now we have our prediction value from forward propagation, $y$, at our disposal. However, we want our neural network to be able to learn things, so ideally, we would want to compare the value of the prediction $y$ to the correct answer of whatever the neural network is trying to learn, which we will instantiate as $y_{\text{true}}$. This very comparison is called a [loss function](https://www.ibm.com/think/topics/loss-function), which can be denoted as

$$
\mathcal{L} = \text{loss}(y,y_{\text{true}})
$$

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original left-to-right diagram showing input tensor x and weight tensor W entering x @ W, producing prediction y, which is then compared with y_true by the loss function to produce L.
Learning purpose: Make the forward dependency path and the role of the loss value visible before the article begins tracing derivatives backward.
Preferred source: An original diagram.
Caption direction: The forward pass transforms x with W to produce y, and the loss function compares y with y_true to produce L.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Flow diagram from x and W through matrix multiplication to prediction y and then through the loss function with y_true to loss L.
-->

Fundamentally, you can think of backpropagation as moving backwards from a forward propagation. We are trying to figure out which learned knobs contributed to how off the prediction $y$ was. This means we want to figure out how wrong the neural network’s prediction was and subsequently which learned knobs caused the network to be wrong and by how much.

So, we want to know how sensitive the loss function result $\mathcal{L}$ is to changes in the weight matrix $W$ by taking the partial derivative of $\mathcal{L}$ with respect to $W$:

$$
\frac{\partial \mathcal{L}}{\partial W}
$$

And, if $W \in \mathbb{R}^{k \times n}$, this can be visualized as a rank-2 tensor (matrix) collection of partial derivatives, denoted as what can be referred to as the [gradient of the loss](https://www.geeksforgeeks.org/machine-learning/gradient-descent-algorithm-and-its-variants/)[^4]:

One way is to denote a single entry of the loss $\mathcal{L}$'s local sensitivity to one particular weight $W_{i,j}$, inside the gradient, such that $$\frac{\partial \mathcal{L}}{\partial W_{i,j}} \in \mathbb{R}$$where $i$ denotes the row number of the matrix and $j$ denotes the column number. This makes $W_{i,j}$ a scalar value; a rank-0 tensor.

To articulate multiple $\frac{\partial \mathcal{L}}{\partial W_{i,j}}$ entries within the gradient that follows an assumption of $W \in \mathbb{R}^{k \times n}$, then $$\frac{\partial \mathcal{L}}{\partial W} \in \mathbb{R}^{k \times n}$$
A complete gradient containing the derivatives with respect to (w.r.t.) every component of $W$ is formalized in notation in a way that distinguishes generalizability regardless of the rank of $W$, given the loss $\mathcal{L}$ is scalar-valued: $$\nabla_W \mathcal L$$
Thus, in this $W \in \mathbb{R}^{k \times n}$ paradigm, there exists an equivalence, such that $$\frac{\partial \mathcal{L}}{\partial W_{ij}} \equiv \left(\nabla_W \mathcal{L}\right)_{ij} \in \mathbb{R} \quad \wedge \quad \frac{\partial \mathcal{L}}{\partial W} \equiv \nabla_W \mathcal{L} \in \mathbb{R}^{k \times n}$$
Therefore,

$$
\nabla_W \mathcal L =  \begin{bmatrix} \frac{\partial \mathcal{L}}{\partial W_{11}} & \frac{\partial \mathcal{L}}{\partial W_{12}} & \cdots & \frac{\partial \mathcal{L}}{\partial W_{1n}} \\ \frac{\partial \mathcal{L}}{\partial W_{21}} & \frac{\partial \mathcal{L}}{\partial W_{22}} & \cdots & \frac{\partial \mathcal{L}}{\partial W_{2n}} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial \mathcal{L}}{\partial W_{k1}} & \frac{\partial \mathcal{L}}{\partial W_{k2}} & \cdots & \frac{\partial \mathcal{L}}{\partial W_{kn}} \end{bmatrix}
$$

Remember that the loss $\mathcal{L}$ is not only yielded from changes in the weight matrix $W$. In order for the prediction $y$, it requires $W$ (forward propagation), and the prediction $y$ is important for computing $\text{loss}(y, y_{\text{true}})$. If you want to understand how $W$ influences $\mathcal{L}$, the dependency path backwards could be thought of as

$$
W \rightarrow y \rightarrow \mathcal{L}
$$

Following the line of dependencies — $\mathcal{L}$ depends on $y$ which depends on $W$ — we can invoke the [chain rule from calculus](https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-2-new/ab-3-1a/a/chain-rule-review), such that

$$
\frac{\partial \mathcal{L}}{\partial W_{ij}} = \sum_{a=1}^{m} \sum_{b=1}^{n} \frac{\partial \mathcal{L}}{\partial y_{ab}} \frac{\partial y_{ab}}{\partial W_{ij}}
$$

Where $a$ indexes the $m$ rows of $y$, and $b$ indexes the $n$ columns of $y$.

To put it all together, if we take our forward propagation mechanism, $y = x \times W$, and we want to back-propagate/find the gradient of the loss w.r.t. $W$, we will take the [transpose](https://mathinsight.org/matrix_transpose) of $x$ so that we maintain the matrix dimensions and align it for matrix multiplication, such that

$$
x^T \in \mathbb{R}^{k \times m}
$$

So when

$$
\nabla_y \mathcal{L} \in \mathbb{R}^{m \times n}
$$

then

$$
\nabla_W \mathcal{L} = x^T \nabla_y \mathcal{L}
$$

And if we wanted to find the gradient of the loss w.r.t. data input $x$, then it works the same way:

$$
\nabla_x \mathcal{L} = \nabla_y \mathcal{L} W^T
$$

In PyTorch, this entire backward mechanism is triggered using a very simple line of code:

```python
loss.backward()
```

In TensorFlow,

```python
tf.GradientTape
```

And in JAX,

```python
jax.grad
```

This is our **backpropagation** mechanism.

Already, off the bat, we can see how `y = x @ W` and `loss.backward()` are simple lines of code that act, in and of themselves, as an abstraction of the mathematics in formal articulation. For these lines of code, sprawling software-to-hardware relationships with foundational robustness must exist; `y = x @ W` can perform a forward pass with ease, and `loss.backward()` can elegantly trigger a series of backward-chained derivatives in a neural network. This is where the even deeper abstractions reside.

### Underneath `y = x @ W`

As mentioned earlier, the data input $x$, weight $W$, and prediction $y$ are best represented as tensors. A tensor differs from abstract matrix representations because, within an ML framework, it has additional attributes and is treated as an object carrying both data and [metadata](https://developer.mozilla.org/en-US/docs/Glossary/Metadata). This is crucial for interpreting and utilizing the [underlying values](https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html).

For example, PyTorch stores information like the [data type](https://docs.pytorch.org/docs/2.14/tensor_attributes.html), [device](https://docs.pytorch.org/docs/2.14/tensor_attributes.html), and [layout](https://docs.pytorch.org/docs/2.14/tensor_attributes.html) when defining a tensor.[3](#ref-3) Intuitively, the tensor’s shape tells the framework the dimensions of the data, and the layout and related metadata signal how that tensor is arranged and accessed in memory.

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original two-part diagram pairing a flat linear memory buffer with a tensor object whose metadata labels identify shape, data type, device, and layout.
Learning purpose: Show how the same stored values are interpreted through metadata rather than appearing to hardware as an abstract mathematical matrix.
Preferred source: An original diagram informed by official PyTorch tensor documentation.
Caption direction: Tensor metadata tells the framework how a linear collection of stored values should be interpreted and accessed.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Linear memory cells connected to a tensor metadata panel listing shape, data type, device, and layout.
-->

This is important when we analyze the perspective in which a piece of hardware takes upon a tensor’s presence: a $x \in \mathbb{R}^{m \times k}$ matrix and a $W \in \mathbb{R}^{k \times n}$ matrix have their values stored ultimately within a hardware system’s [memory locations](https://technav.ieee.org/topic/address/). This means that before an operation like `@` can be validated and executed, a computer system must know whether the tensors are on a [CPU](https://www.ibm.com/think/topics/central-processing-unit), on an [accelerator card](https://ciq.com/glossary/accelerator-cards), or in some other memory space. Within these constraints, the system must know a tensor’s dimensionality compatibility, [memory layout](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/labs/matmul/lab1/lab1.html#row-major-memory-layout), and whether it is [suitable for the operation requested](https://docs.pytorch.org/docs/stable/generated/torch.matmul.html).

So, within the software-to-hardware dynamic, when `y = x @ W` is invoked, a framework must resolve what kind of tensor operation is being requested and choose an implementation based on it; a process that can be broadly understood as an [operation dispatch](https://docs.pytorch.org/devlogs/dispatcher/2026-04-16-how-does-the-dispatcher-work/). Depending on different tensor attributes, this operation dispatch can look different across the board.

We can get even lower than this; this was merely the software side of the hardware boundary here. There exists even more concreteness within the `y = x @ W` expression. As mentioned earlier, the matrix multiplication operation needs [memory allocation](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/advanced_topics/memory_for_kernel_developers.html), layout conversion, scheduling the processes and tasks around the operation, and [hardware-specific kernels](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/examples/matmul_single_core.html). As mentioned earlier, a great example is Tenstorrent’s open software stack, which separates the higher-level compiler and operation interfaces from the low-level programming and metal through the [TT-Metalium](https://github.com/tenstorrent/tt-metal) repository.[2](#ref-2), [4](#ref-4)

As a wrap-up, not every ML framework adheres to the same philosophy, you could say, on how it handles something like Python code all the way down to hardware execution. For a system to turn `y = x @ W` into a concrete plan, it must understand the tensors and validate the operation invoked upon them. Then it chooses an implementation, manages the memory space, and then it finally performs the real work on the metal.

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original layered execution-path diagram tracing y = x @ W through tensor validation, operation dispatch, backend selection, runtime scheduling, memory allocation, a device-specific matrix-multiplication kernel, and CPU or accelerator hardware.
Learning purpose: Reveal the sequence of hidden software and hardware decisions compressed into one high-level tensor operation.
Preferred source: An original diagram informed by official framework and hardware-runtime documentation.
Caption direction: A high-level tensor expression is interpreted, dispatched, scheduled, and executed by backend-specific kernels over device memory.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Layered path from y equals x at W through dispatch and runtime components to a kernel operating on CPU or accelerator memory.
-->

### Underneath `loss.backward()`

The result of `y = x @ W` is a prediction value $y$. Within a neural network, and its structure as previously stated, a comparison between the prediction and the correct answer $y_{\text{true}}$ is made via the loss $\mathcal{L}$, yielded from the loss function $\text{loss}(y,y_{\text{true}})$. The process of backpropagation is to determine how changes in the learned weight values $W$ affect the loss, which is crucial for how a neural network actually learns; it tries to understand how much the internal learned knobs of the model contributed to the error of the output, and compute the gradients needed for the optimization step needed to update the weights $W$.

Recall that when `loss.backward()` is invoked, the abstraction is actually the backwards computation of partial derivatives through the chain rule from calculus. ML frameworks must know which intermediate values the operations depend on, and how and in what order [gradient information](https://machinelearningmastery.com/gradient-in-machine-learning/#:~:text=Mini%2DCourse%20now!-,What%20Is%20a%20Gradient%3F,of%20taking%20a%20small%20step%20from%20a%20point%20in%20any%20direction.,-%E2%80%94%20Page%2021%2C) should be organized and subsequently propagated backwards through the network. This is where the concept of [automatic differentiation](https://huggingface.co/blog/andmholm/what-is-automatic-differentiation), or autodiff, comes from.

Take [micrograd](https://github.com/karpathy/micrograd) as an example. Micrograd is a small, scalar-valued, [reverse automatic differentiation engine](https://rufflewind.com/2016-12-30/reverse-mode-automatic-differentiation#:~:text=rust%2Dad%20library.-,Reverse%2Dmode%20automatic%20differentiation,-The%20implementation%20simplicity) (autograd) developed by [Andrej Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy) as an educational implementation of what lies underneath an ML framework during backpropagation. A [dynamically constructed directed acyclic graph (DAG)](https://www.databricks.com/blog/what-is-dag) is instantiated, which helps the engine remember the operations that produced the values from forward propagation, which previous values existed/depended on, and what local backward rule should be applied. In simpler terms, this all leaves a trail/record of how the loss value came to be.

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original micrograd-style dynamic DAG in which scalar value nodes record the ordinary forward operations that produce a final loss node, with each edge labeled by its dependency direction.
Learning purpose: Make visible how forward execution leaves a dependency record that reverse-mode autodiff can later traverse.
Preferred source: An original diagram informed by the micrograd implementation.
Caption direction: During the forward computation, connected value objects record the dynamic DAG that explains how the final loss was produced.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Dynamic directed acyclic graph of scalar values and operations leading from inputs and weights to a final loss node.
-->

This record-keeping structure can, at times, demonstrate that one value within this chain can affect the [final loss value](https://developers.google.com/machine-learning/crash-course/linear-regression/loss) through multiple computational paths. The same weight $W$ can be used in multiple later operations, which means several downstream pieces can be affected when it comes to contributing toward that said weight’s [final gradient](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent). Before gradients are propagated backwards, the system has to traverse the DAG in an order that respects how each value was used. In Karpathy’s micrograd, it builds this [topological ordering of a DAG](https://geeksforgeeks.org/dsa/topological-sorting/) before it applies the backward chain rules.

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original two-panel DAG diagram showing reverse topological traversal in the first panel and multiple downstream gradient contributions converging and accumulating at one shared weight in the second.
Learning purpose: Distinguish traversal order from gradient accumulation and show why a reused value may receive contributions through several paths.
Preferred source: An original diagram informed by reverse-mode autodiff and micrograd.
Caption direction: Reverse-mode autodiff follows reverse topological order while accumulating every gradient contribution that reaches a shared value.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Two-panel graph showing backward traversal order and several gradient arrows adding together at a shared weight node.
-->

If we scale this ML framework infrastructure — to the size of PyTorch — the autograd mechanics follow the same broad idea. As tensor operations execute, PyTorch will construct this graph of backward `Function` objects. These intermediate values are saved and called upon when needed for future derivative calculations. Then, upon calling `loss.backward()`, autograd uses these operation history records to compute gradients. Ultimately, the goal is to preserve enough information during the forward pass so that the backwards pass can later apply the chain rule correctly.

In this sense, you could say that `loss.backward()` sits just one layer above the execution machinery that was discussed earlier. If you think of autograd as deciding what gradient work must happen, and the ML framework deciding how that work will run, on an accelerator-oriented stack, one could imagine it also eventually involving intimate tinkering with runtime execution, memory allocation, device-specific kernels, and the movement of tensor data through memory, just like forward pass operations require as well! [4](#ref-4), [2](#ref-2)

### Compiler Representations - High Level

Fundamentally, operation dispatch and [execution models](https://www.tensorflow.org/guide/intro_to_graphs#graph_execution_vs_eager_execution) are related, but are separate decisions; operation dispatch selects an implementation for an operation, while execution models determine whether operations are issued immediately or captured into a larger representation.

Frameworks like PyTorch and TensorFlow, along with their compiler/runtime stacks, vary widely in how they handle the same line of `y = x @ W` code due to operation dispatch/implementation choices. Broadly, this means that the way PyTorch, TensorFlow, JAX, [tinygrad](https://docs.tinygrad.org/developer/developer/), some [TVM](https://tvm.apache.org/) or [MLIR](https://mlir.llvm.org/)-based systems, or hardware-specific stacks like [Tenstorrent](https://docs.tenstorrent.com/software/index.html)’s systems handle code, regarding operations and their subsequent implementations, is, unsurprisingly, different from one another.

For example, two different handling styles — [eager execution systems](https://www.tensorflow.org/guide/intro_to_graphs#graph_execution_vs_eager_execution) and [graph/compiler-oriented systems](https://www.tensorflow.org/guide/intro_to_graphs) — represent two different execution styles:

- In an eager execution system, an operation is issued when the program reaches it. This style is useful, intuitive, makes the program feel more direct, and can be debugged relatively easily. Simply: write an operation, run the operation, receive the result.

  - PyTorch is an example of a framework that uses this style by default; however, it also has graph/compiler-oriented systems as an option.

- In graph/compiler-oriented systems, an operation may be captured into a larger representation before it is executed. This is because some systems retain a [larger region of computation](https://docs.jax.dev/en/latest/201/jit.html#:~:text=JAX%20executes%20operations,optimize%20across%20operations.) before an operation executes. This allows [scheduling](https://docs.tinygrad.org/developer/developer/#scheduling) and [lowering high-level tensor operations into lower-level representations and target-specific programs](https://docs.tinygrad.org/developer/developer/#lowering).

  - tinygrad is an example of a framework: they show documentation and an example of a system that moves from an abstracted [Tensor API/frontend](https://docs.tinygrad.org/developer/developer/#frontend) into [UOps](https://portal.nacad.ufrj.br/online/intel/vtune2017/help/GUID-B77569D0-7E69-11E6-9D1F-28D24465DA3C.html), scheduling, lowering, [compilation](https://docs.tinygrad.org/developer/runtime/#compiler), and [runtime execution](https://docs.tinygrad.org/developer/developer/#execution).

  - As an extension, there are broader compiler examples as well regarding retaining computation in [intermediate representations (IR)](https://cs.lmu.edu/~ray/notes/ir/), which makes operations easier to analyze, transform, and subsequently optimize before it reaches the hardware.[5](#ref-5), [6](#ref-6)

In the exploratory pursuit of software-to-hardware dynamics, there exists a distinction between the gradient computation graphs and compiler IRs. You could think of an autograd graph as asking *“how was this loss $\mathcal{L}$ produced, and how should the gradient $\nabla_W \mathcal L$ be computed?”* The compiler IR would ask, *“Well, how would this computation be represented, conditioned to the fact that it needs to be optimized and subsequently mapped into a target execution system?”*

These roles are distinct, but they are not mutually exclusive: some systems perform automatic differentiation as a transformation over an intermediate representation, and computations produced by autodiff may later be captured and compiled.

<!--
VISUAL PLACEHOLDER
Placement: After the paragraph or equation above.
Suggested visual: An original side-by-side comparison in which an autograd graph emphasizes value dependencies and local backward rules while a compiler IR emphasizes operations, values, transformations, scheduling, and target mapping.
Learning purpose: Prevent readers from conflating two graph-like representations that answer different questions and may exist at different stages of a system.
Preferred source: An original diagram informed by official autograd and compiler documentation.
Caption direction: An autograd graph records how to propagate derivatives, while compiler IR represents computation for transformation and execution planning.
Verification: Confirm that the final image supports the surrounding claim and that its license permits reuse.
Alt text: Side-by-side comparison of an autograd dependency graph and a compiler intermediate representation with their distinct purposes labeled.
-->

As we descend deeper into the abstractions, and into the compiler representation side of things — i.e., intermediate representations — it is important to note that reverse-mode autodiff does not require the representation known as [Static Single Assignment (SSA)](https://www.geeksforgeeks.org/compiler-design/static-single-assignment-with-relevant-examples/). In many compiler tasks, SSA can be useful; however, it is not a prerequisite for autodiff specifically. Micrograd is an example of this, since its reverse-mode autodiff is actually implemented via ordinary Python objects connected through the dynamic DAG rather than this compiler IR approach.[7](#ref-7)

## Conclusion
To keep this article epistemically grounded, avoid scope creep, and not get too ahead of ourselves with the series of future articles succeeding this one — foundations for a much larger project — I want to conclude this piece. Already, our rudimentary instantiation of a basic forward and backward pass reveals the hidden layers of tensors, operation dispatch, compiler stuff, and autograd. Not every ML framework implements forward propagation or backpropagation the same way, with the same internal machinery.


# References

## Main References

<a id="ref-1"></a>
1. D. Zax, “Top Machine Learning Libraries,” *IBM Think*. [Online]. Available: <https://www.ibm.com/think/topics/machine-learning-libraries>. Accessed: Sep. 2, 2026.
<a id="ref-2"></a>
2. Tenstorrent, “Software Overview,” *Tenstorrent Documentation*. [Online]. Available: <https://docs.tenstorrent.com/software/index.html>. Accessed: Sep. 2, 2026.
<a id="ref-3"></a>
3. PyTorch, “Tensor Attributes,” *PyTorch Documentation*, ver. 2.13. [Online]. Available: <https://docs.pytorch.org/docs/2.13/tensor_attributes.html>. Accessed: Sep. 2, 2026.
<a id="ref-4"></a>
4. Tenstorrent, “TT-Metalium Documentation,” *Tenstorrent Documentation*. [Online]. Available: <https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/index.html>. Accessed: Sep. 2, 2026.
<a id="ref-5"></a>
5. C. Lattner, M. Amini, U. Bondhugula, A. Cohen, A. Davis, J. Pienaar, R. Riddle, T. Shpeisman, N. Vasilache, and O. Zinenko, “MLIR: Scaling compiler infrastructure for domain specific computation,” in *2021 IEEE/ACM International Symposium on Code Generation and Optimization (CGO)*, 2021, pp. 2–14, doi: [10.1109/CGO51591.2021.9370308](https://doi.org/10.1109/CGO51591.2021.9370308).
<a id="ref-6"></a>
6. T. Chen, T. Moreau, Z. Jiang, L. Zheng, E. Yan, H. Shen, M. Cowan, L. Wang, Y. Hu, L. Ceze, C. Guestrin, and A. Krishnamurthy, “TVM: An automated end-to-end optimizing compiler for deep learning,” in *13th USENIX Symposium on Operating Systems Design and Implementation (OSDI 18)*, Carlsbad, CA, USA, 2018, pp. 578–594. [Online]. Available: <https://www.usenix.org/system/files/osdi18-chen.pdf>.
<a id="ref-7"></a>
7. A. Karpathy, “micrograd: A tiny scalar-valued autograd engine and a neural net library on top of it with PyTorch-like API,” *GitHub*. [Online]. Available: <https://github.com/karpathy/micrograd>. Accessed: Sep. 2, 2026.

## Additional Sources

- T. Chen, “ML Frameworks and Abstractions,” *15-884: Machine Learning Systems*, Carnegie Mellon University, Spring 2021. [Online]. Available: <https://catalyst.cs.cmu.edu/15-884-mlsys-sp21/slides/1-MLSys-MLFrameworkAbstraction.pdf>. Accessed: Sep. 7, 2026.

## In-Text Links

- [Deep learning — introductory definition](https://www.geeksforgeeks.org/deep-learning/introduction-deep-learning/)
- [Neural network — beginner’s guide](https://www.geeksforgeeks.org/deep-learning/neural-networks-a-beginners-guide/)
- [General libraries — machine-learning libraries](https://www.ibm.com/think/topics/machine-learning-libraries)
- [PyTorch documentation](https://docs.pytorch.org/docs/2.14/index.html)
- [TensorFlow learning resources](https://www.tensorflow.org/learn)
- [JAX documentation](https://docs.jax.dev/en/latest/)
- [Forward propagation](https://telnyx.com/learn-ai/forward-propogation-ai)
- [Backpropagation](https://telnyx.com/learn-ai/back-propogation)
- [Compatible matrices — dimension requirements](https://www.mathwords.com/c/compatible_matrices.htm)
- [Tensors](https://www.w3schools.com/ai/ai_tensors.asp)
- [Tensor rank](https://www.doitpoms.ac.uk/tlplib/tensors/what_is_tensor.php#:~:text=rank%20(or%20order)%20of%20a%20tensor%20is%20defined%20by%20the%20number%20of%20directions%20(and%20hence%20the%20dimensionality%20of%20the%20array)%20required%20to%20describe%20it.)
- [Loss function](https://www.ibm.com/think/topics/loss-function)
- [Gradient of the loss](https://www.geeksforgeeks.org/machine-learning/gradient-descent-algorithm-and-its-variants/)
- [Chain rule from calculus](https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-2-new/ab-3-1a/a/chain-rule-review)
- [Matrix transpose](https://mathinsight.org/matrix_transpose)
- [Metadata](https://developer.mozilla.org/en-US/docs/Glossary/Metadata)
- [Underlying tensor values](https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html)
- [Tensor attributes — data type, device, and layout](https://docs.pytorch.org/docs/2.14/tensor_attributes.html)
- [Memory locations](https://technav.ieee.org/topic/address/)
- [Central processing unit](https://www.ibm.com/think/topics/central-processing-unit)
- [Accelerator cards](https://ciq.com/glossary/accelerator-cards)
- [Row-major memory layout](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/labs/matmul/lab1/lab1.html#row-major-memory-layout)
- [PyTorch matrix multiplication](https://docs.pytorch.org/docs/stable/generated/torch.matmul.html)
- [PyTorch operation dispatch](https://docs.pytorch.org/devlogs/dispatcher/2026-04-16-how-does-the-dispatcher-work/)
- [Memory allocation for kernel developers](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/advanced_topics/memory_for_kernel_developers.html)
- [Hardware-specific matrix-multiplication kernel](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/examples/matmul_single_core.html)
- [TT-Metalium repository](https://github.com/tenstorrent/tt-metal)
- [Gradient information](https://machinelearningmastery.com/gradient-in-machine-learning/#:~:text=Mini%2DCourse%20now!-,What%20Is%20a%20Gradient%3F,of%20taking%20a%20small%20step%20from%20a%20point%20in%20any%20direction.,-%E2%80%94%20Page%2021%2C)
- [Automatic differentiation](https://huggingface.co/blog/andmholm/what-is-automatic-differentiation)
- [micrograd](https://github.com/karpathy/micrograd)
- [Reverse-mode automatic differentiation](https://rufflewind.com/2016-12-30/reverse-mode-automatic-differentiation#:~:text=rust%2Dad%20library.-,Reverse%2Dmode%20automatic%20differentiation,-The%20implementation%20simplicity)
- [Andrej Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy)
- [Dynamically constructed directed acyclic graph](https://www.databricks.com/blog/what-is-dag)
- [Final loss value](https://developers.google.com/machine-learning/crash-course/linear-regression/loss)
- [Final gradient](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent)
- [Topological ordering of a DAG](https://geeksforgeeks.org/dsa/topological-sorting/)
- [tinygrad developer documentation](https://docs.tinygrad.org/developer/developer/)
- [TVM](https://tvm.apache.org/)
- [MLIR](https://mlir.llvm.org/)
- [Tenstorrent software overview](https://docs.tenstorrent.com/software/index.html)
- [Eager execution systems](https://www.tensorflow.org/guide/intro_to_graphs#graph_execution_vs_eager_execution)
- [Graph/compiler-oriented systems](https://www.tensorflow.org/guide/intro_to_graphs)
- [JAX computation capture](https://docs.jax.dev/en/latest/201/jit.html#:~:text=JAX%20executes%20operations,optimize%20across%20operations.)
- [tinygrad scheduling](https://docs.tinygrad.org/developer/developer/#scheduling)
- [tinygrad lowering](https://docs.tinygrad.org/developer/developer/#lowering)
- [tinygrad Tensor API/frontend](https://docs.tinygrad.org/developer/developer/#frontend)
- [UOps](https://portal.nacad.ufrj.br/online/intel/vtune2017/help/GUID-B77569D0-7E69-11E6-9D1F-28D24465DA3C.html)
- [tinygrad compilation](https://docs.tinygrad.org/developer/runtime/#compiler)
- [tinygrad runtime execution](https://docs.tinygrad.org/developer/developer/#execution)
- [Intermediate representations](https://cs.lmu.edu/~ray/notes/ir/)
- [Static Single Assignment](https://www.geeksforgeeks.org/compiler-design/static-single-assignment-with-relevant-examples/)
- [Bias term](https://www.geeksforgeeks.org/machine-learning/what-is-the-role-of-the-bias-in-neural-networks/)
- [Tensor contractions](https://en.wikipedia.org/wiki/Tensor_contraction)
- [Activation function](https://www.geeksforgeeks.org/machine-learning/activation-functions-neural-networks/)

---

[^1]: In the demonstration of abstraction for forward propagation, we are not assuming any added [bias term](https://www.geeksforgeeks.org/machine-learning/what-is-the-role-of-the-bias-in-neural-networks/) $+ b$ in this case. In a pragmatic and full linear layer of a neural network, the bias $b$ is a learned shift applied to the output after the matrix multiplication $x \times W$ is computed.

[^2]: Expanding this notation would lead down a rabbit hole of what are known as [tensor contractions](https://en.wikipedia.org/wiki/Tensor_contraction), which would take far too long to detail here.

[^3]: This is our forward propagation method, for now, scoped down to be relatively rudimentary for demonstration purposes. Realistically, in applied neural network layers, the matrix multiplication $x \times W$ is followed by an [activation function](https://www.geeksforgeeks.org/machine-learning/activation-functions-neural-networks/). You can think of it as something like $f(x \times W)$, as these activation functions introduce a necessary non-linearity to the neural network; these networks, if they realistically want to solve real-world problems, can not mathematically always collapse into straight lines (not everything in our world is modeled in that way, obviously). Rather than expanding on the math and all the different kinds of activation functions, we'll assume it as another operation in the forward propagation.

[^4]: Please note that I use the terms “loss” and “gradient” somewhat loosely throughout this article. For epistemic clarity, note that these are NOT interchangeable terms. This is because the loss is the **scalar** value measuring prediction error. At the same time, the gradient is the collection of derivatives of that loss with respect to model parameters, i.e., a **vector**, **matrix,** and/or **tensor**.
