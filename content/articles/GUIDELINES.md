# Article Authoring Guidelines

This document is the single source of truth for how articles on `rafan.dev` are
authored, stored, and rendered. Every blog post must follow it.

## 1. File Location & Naming

- All articles live under `content/articles/`.
- Each article is a single Markdown file: `content/articles/<slug>.md`.
- The file's basename (without the `.md` extension) **is** the slug and maps
  directly to the URL at `/blog/<slug>`.
- Slugs must be lowercase, hyphen-separated, ASCII only, and stable once
  published (changing a slug breaks existing links).

Example:

```
content/articles/the-geometry-of-prediction.md   →   /blog/the-geometry-of-prediction
```

## 2. Frontmatter

Every article starts with a YAML frontmatter block. The blog index at `/blog`
reads only frontmatter — the article page reads frontmatter + body.

```yaml
---
title: "The Geometry of Prediction"
subtitle: "Forward Propagation Mathematics in Neural Networks"
date: "2026-03-18"
cover: "/articles/the-geometry-of-prediction/cover.png"
description: "A short summary used for OpenGraph/Twitter cards and feeds."
tags: ["neural-networks", "mathematics", "deep-learning"]
draft: false
---
```

Field reference:

| field         | type       | required | notes                                                         |
| ------------- | ---------- | -------- | ------------------------------------------------------------- |
| `title`       | string     | yes      | Rendered in Times New Roman on the index and article page.    |
| `subtitle`    | string     | yes      | Secondary line under the title. Sans-serif, lighter weight.   |
| `date`        | ISO date   | yes      | `YYYY-MM-DD`. Controls ordering and the `MAR 18 · 2026` line. |
| `cover`       | path       | no       | Thumbnail on the blog index and hero on the article page.     |
| `description` | string     | no       | SEO/meta description. Falls back to `subtitle`.               |
| `tags`        | string[]   | no       | Lowercase, hyphenated. Used for filtering later.              |
| `draft`       | boolean    | no       | If `true`, excluded from the public list.                     |

## 3. Body: Markdown Conventions

Articles are written in GitHub-Flavored Markdown (GFM). The following features
are supported and rendered with consistent styling:

- **Headings**: `##` through `####`. Do not use a top-level `#` — the `title`
  from frontmatter is the page `<h1>`.
- **Paragraphs**: plain text separated by blank lines.
- **Emphasis**: `*italic*`, `**bold**`, `***bold italic***`.
- **Links**: `[label](https://example.com)`. External links open in a new tab.
- **Lists**: ordered and unordered, nested allowed.
- **Blockquotes**: `> …` for quoted text or asides.
- **Tables**: GFM pipe tables.
- **Task lists**: `- [ ]` / `- [x]`.
- **Strikethrough**: `~~text~~`.
- **Horizontal rules**: `---`.
- **Footnotes**: `[^1]` with `[^1]: note text` at the bottom.

### Heading style

Use sentence case. Keep heading depth shallow — `##` for sections, `###` for
subsections. Avoid `####` unless absolutely necessary.

## 4. Math (LaTeX)

Math is rendered with KaTeX via `remark-math` + `rehype-katex`.

- **Inline math**: wrap in single dollar signs.

  ```md
  The loss is $\mathcal{L}(\theta) = \mathbb{E}_{x \sim p}[\ell(f_\theta(x), y)]$.
  ```

- **Display math**: wrap in double dollar signs on their own lines.

  ```md
  $$
  \nabla_\theta \mathcal{L} = \mathbb{E}_{x \sim p}\left[\nabla_\theta \ell(f_\theta(x), y)\right]
  $$
  ```

- Use `\begin{aligned} … \end{aligned}` inside `$$ … $$` for multi-line
  derivations. Do not use `\begin{equation}`; numbering is off by design.
- Escape literal dollar signs in prose as `\$`.
- Macros: prefer KaTeX-supported commands. If a symbol doesn't render, it is
  likely an unsupported LaTeX package — find the KaTeX equivalent rather than
  inlining raw HTML.

## 5. Code

Fenced code blocks with a language tag are syntax-highlighted via Shiki.

````md
```python
def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)
```
````

- Always tag the language (`python`, `ts`, `rust`, `bash`, `json`, …).
- Inline code uses single backticks: `` `np.ndarray` ``.
- Keep lines under ~100 characters so they don't overflow on mobile.

## 6. Images & Assets

- Article-specific assets live under
  `public/articles/<slug>/` and are referenced by absolute path from the
  article:

  ```md
  ![A forward pass through a 2-layer MLP](/articles/the-geometry-of-prediction/forward-pass.png)
  ```

- Always provide alt text. Decorative-only images use empty alt (`![](…)`).
- Prefer `.svg` for diagrams, `.png` for screenshots, `.webp` or `.avif` for
  photographs.
- The `cover` image in frontmatter is used as the thumbnail on `/blog` and as
  the hero image on the article page.

## 7. Callouts / Asides

Use blockquotes prefixed with a bold label for asides:

```md
> **Note.** The Jacobian is transposed because gradients flow backward.

> **Aside.** This mirrors the structure of reverse-mode autodiff.
```

Do not invent custom container syntaxes — stick to Markdown primitives.

## 8. Typography & Voice

- Lowercase-leaning titles are allowed but not required; match the personal
  voice established on the home page.
- Prose is sentence-case, not title-case.
- Em dashes are `—` (not `--`), ellipses are `…` (not `...`).
- Use `×` for multiplication in prose (`2 × 10⁻⁵`), not `x`.
- Keep paragraphs tight — long essays should still breathe.

## 9. Minimal Template

Copy this when starting a new article:

```md
---
title: "Article Title"
subtitle: "A short secondary line."
date: "2026-04-17"
cover: "/articles/<slug>/cover.png"
description: "One-sentence summary for link previews."
tags: ["tag-one", "tag-two"]
draft: true
---

Opening paragraph that sets up the question the piece answers.

## First section

Prose, with inline math like $a^2 + b^2 = c^2$ and a display equation:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

### A subsection

More prose. A code block:

```python
print("hello")
```

> **Note.** Any aside worth pulling out.

## Closing

Wrap-up and pointers to further reading.
```

## 10. Rendering Pipeline (Implementation Notes)

These notes describe how the files above are turned into pages. They're
informative for the renderer, not the author.

- Articles are read at build time from `content/articles/*.md`.
- Parsing: `gray-matter` splits frontmatter from body.
- Markdown → HTML uses the `unified` pipeline:
  - `remark-parse`
  - `remark-gfm`
  - `remark-math`
  - `remark-rehype`
  - `rehype-katex`
  - `rehype-shiki` (or `rehype-pretty-code`)
  - `rehype-stringify`
- KaTeX CSS is loaded globally (`katex/dist/katex.min.css`) so math renders
  with correct metrics on first paint.
- The article route is `app/blog/[slug]/page.tsx` and uses
  `generateStaticParams` over the slug list so all posts are statically
  generated.
- The blog index at `/blog` reads only the frontmatter of each file and sorts
  by `date` descending; `draft: true` entries are filtered out in production.

Any change to this pipeline must be reflected in this document.
