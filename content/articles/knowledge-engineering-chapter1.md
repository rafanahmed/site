---
title: "Knowledge Engineering - Chapter 1"
subtitle: "In Pursuit of Making Human Corpora Legible to Machines"
date: "2026-07-08"
cover: "/articles/knowledge-engineering-chapter1/e12ca5f4c733890e90a3bc5651c207c4.jpg"
description: "In Pursuit of Making Human Corpora Legible to Machines"
tags: ["knowledge-engineering", "genai", "data-systems"]
draft: false
---

<figure>
  <img
    src="/articles/knowledge-engineering-chapter1/e12ca5f4c733890e90a3bc5651c207c4.jpg"
    alt="Knowledge engineering illustration"
  />
  <figcaption>
    Image from <a href="https://www.pinterest.com/pin/511158626427399962/" target="_blank" rel="noreferrer">Pinterest</a>
  </figcaption>
</figure>


> ***Disclaimer:*** This article and the subsequent articles in the *Knowledge Engineering* series are based on my compiled notes from various sources, interpretations, and exercises from the Pluralsight course "*GenAI Data and Knowledge Layer"* by Larentiu Raducu, provided to me by Truist Financial Corporation. 
> 
>
> Mathematical notation used throughout the subsequent series of articles is my custom explanatory notation, derived from and influenced by the multitude of sources on everything regarding the handling of GenAI data systems and information layers. 
> 
>
> All informational synthesis, framing, sectioning, and interpretative emphasis are mine, with the technical concepts, implementation demos/code, and references following loosely from the Pluralsight course, alongside my own code, interpretations, and explanations.
> 
>
> I will not intentionally replicate the original course’s order of introducing the concepts mentioned in this article and throughout the series, as my goal is to treat the course as one of the many sources that will provide a backbone for a broader argument and informational framing.

I could start this article and the subsequent articles in this upcoming series by writing:

*“AI is now everywhere in systems around the world, interacting with and utilizing all sorts of data that affect our enterprises, nations, and personal lives!”*

But this is not only redundant information; it is also information that you, the reader, probably already deeply know exists in the world you live in. So I will present to you another angle to look at Applied AI systems in the context of pragmatic applications:

Capable Large Language Models (LLMs) have become a normalized tool, assistant, and much more for some. With the right amount of hardware and compute resources, it is possible to host, prompt, and create agents with these capable models to solve a myriad of real-world problems.

But do not mistake the capacity of intelligence for tangible and reliable model outputs. There exists a large undertaking in incorporating these Applied AI systems into enterprise or governance environments, which involves steering model outputs to relay high-quality and useful information regarding data that is proprietary, secret, unstructured, internal, multimodal, or domain-specific.  
  
Enterprises and nations face this burden when incorporating AI systems within their citadels. This is because all of the internal documents, client-customer records, technical files, knowledge bases, support logs, policies, and proprietary research do not automatically become usable through instantiating an intelligent LLM. Not only are there glaring [sovereignty and safety issues with this](https://assets.ctfassets.net/xrfr7uokpv1b/yF0AXklHQd7K3SqKICNTM/e9f9167d1b3c7cce56ab3b8c4cc572da/Palantir_-_Institutional_Sovereignty_in_the_Age_of_AI.pdf), but primarily, in order for this LLM to have an effective, purposeful output, the content of all of these documents, contemporary or legacy, needs to be fetched, split, represented, stored, retrieved, filtered, evaluated, and passed back into the model.  
  
This model needs to know what to do with this data first before the output even comes. This is not an intuitive challenge to face and solve; Knowledge Engineering provides us with an answer to this human-machine informational gap, as this is a field regarding [the art, science, and process of structuring and organizing human corpora into something mathematically parseable by AI systems](https://medium.com/@ayasc/knowledge-engineering-building-intelligent-systems-that-think-6c817f0dc844#:~:text=Knowledge%20engineering%20is,mirror%20human%20thinking.), so that decisions, actions, and interpretation can occur for an individual, enterprise, or nation. 

As with any mathematical process with a large number of moving parts, naturally, this knowledge problem is layered in a pipeline:

1. Raw information must be converted into a representation that the applied AI system can use.
2. That representation must then preserve enough meaning for the system to retrieve and reason over the correct pieces of information.
3. The system should be able to bring the right information back when a user, enterprise, or model requires it.
4. Scale, reliability, attribution, cost, latency, and domain-specific performance are iteratively engineered into the pipeline itself.

The following series of articles will go over the aspects of human-machine information legibility and the technical layers of making that legibility possible. To end this short chapter, I want to write that for as long as humanity has existed, information and knowledge, and their subsequent engineering, have been the moat in leveraging opportunities to produce desirable outcomes.

In a contemporary economic sense, this is reflected in the idea of the knowledge economy, in that knowledge, information, innovation, and institutional capacity are central engines of growth and development. In the era of intelligent machines, this is no different. In fact, it is far more crucial, as the scaling of outcomes and decisions that make an impact increases, while these same capabilities are in the hands of your nation’s enterprises and your opponents, too.

So, whether you are working at a bank, contributing to the first line of defense of a nation’s financial security against domestic and foreign adversaries (this is me), or working at a medical company conducting research and development on proprietary drugs for treatment, knowledge engineering shapes how humans and machines organize information, act on it, and produce meaningful outcomes.

### References:
1. Pluralsight. *[GenAI Data and Knowledge Layer](https://app.pluralsight.com/ilx/video-courses/gen-ai-data-knowledge-layer/course-overview).* Course by Larentiu Raducu, founder of BitHeap.ch.
2. Debenham, J. *[An Introduction to Knowledge Engineering](https://asolanki.co.in/wp-content/uploads/2019/01/KE-by-Simon.pdf).* Knowledge engineering textbook/chapter PDF.
3. Palantir. *[Institutional Sovereignty in the Age of AI](https://assets.ctfassets.net/xrfr7uokpv1b/yF0AXklHQd7K3SqKICNTM/e9f9167d1b3c7cce56ab3b8c4cc572da/Palantir_-_Institutional_Sovereignty_in_the_Age_of_AI.pdf).* Palantir report, 2026.
4. Chen, D. H. C., & Dahlman, C. J. *[The Knowledge Economy, the KAM Methodology and World Bank Operations](https://documents1.worldbank.org/curated/en/695211468153873436/pdf/358670WBI0The11dge1Economy01PUBLIC1.pdf).* World Bank Institute working paper.
5. National Security Commission on Artificial Intelligence. *[Final Report: National Security Commission on Artificial Intelligence](https://digital.library.unt.edu/ark:/67531/metadc1851188/).* Final report, Mar. 1, 2021.
6. National Institute of Standards and Technology. *[Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf).* NIST AI 100-1, Jan. 2023.
7. Lumina. *[Knowledge Engineering: Building Intelligent Systems That Think](https://medium.com/@ayasc/knowledge-engineering-building-intelligent-systems-that-think-6c817f0dc844).* Medium article, Oct. 1, 2025.
