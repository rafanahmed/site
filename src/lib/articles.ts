import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import type {
  Article,
  ArticleFrontmatter,
  ArticleMeta,
} from "./article-types";

export type { Article, ArticleFrontmatter, ArticleMeta } from "./article-types";
export { formatArticleDate, formatReadingTime } from "./article-types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

type HastElement = {
  type: "element";
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type HastNode = HastElement | { type: string; children?: HastNode[] };

function rehypeLinksOpenInNewTab() {
  const visit = (node: HastNode) => {
    if (
      node.type === "element" &&
      (node as HastElement).tagName === "a"
    ) {
      const el = node as HastElement;
      const props = (el.properties ??= {});
      props.target = "_blank";
      const existingRel = props.rel;
      const rels = new Set<string>(
        Array.isArray(existingRel)
          ? (existingRel as string[])
          : typeof existingRel === "string"
            ? existingRel.split(/\s+/).filter(Boolean)
            : [],
      );
      rels.add("noopener");
      rels.add("noreferrer");
      props.rel = Array.from(rels);
    }
    if (node.children) {
      for (const child of node.children) visit(child);
    }
  };
  return (tree: HastNode) => visit(tree);
}

const WORDS_PER_MINUTE = 220;

function computeReadingTime(body: string): number {
  const stripped = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~\-]/g, " ");

  const words = stripped.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function isMarkdownFile(name: string) {
  return name.endsWith(".md") && !name.startsWith("_") && name !== "GUIDELINES.md";
}

function normalizeArticleDate(value: unknown, slug: string): string {
  let iso: string;

  if (value instanceof Date) {
    iso = value.toISOString().slice(0, 10);
  } else if (typeof value === "string") {
    iso = value;
  } else {
    throw new Error(`Article "${slug}" has an invalid frontmatter date.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(
      `Article "${slug}" has an invalid frontmatter date. Expected YYYY-MM-DD.`,
    );
  }

  return iso;
}

async function readArticleFile(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;

  if (!data.title || !data.subtitle || !data.date) {
    throw new Error(
      `Article "${slug}" is missing required frontmatter (title, subtitle, date).`,
    );
  }

  const frontmatter: ArticleFrontmatter = {
    title: data.title,
    subtitle: data.subtitle,
    date: normalizeArticleDate(data.date, slug),
    cover: data.cover,
    description: data.description,
    tags: data.tags,
    draft: data.draft,
  };

  const readingTime = computeReadingTime(parsed.content);

  return { slug, frontmatter, body: parsed.content, readingTime };
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const entries = await fs.readdir(ARTICLES_DIR);
  return entries
    .filter(isMarkdownFile)
    .map((name) => name.replace(/\.md$/, ""));
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const slugs = await getAllArticleSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter, readingTime } = await readArticleFile(slug);
      return { slug, ...frontmatter, readingTime } satisfies ArticleMeta;
    }),
  );

  const includeDrafts = process.env.NODE_ENV !== "production";
  return articles
    .filter((a) => includeDrafts || !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { frontmatter, body, readingTime } = await readArticleFile(slug);
    const html = await renderMarkdown(body);
    return { slug, ...frontmatter, readingTime, html } satisfies Article;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "ENOENT"
    ) {
      return null;
    }
    throw err;
  }
}

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeLinksOpenInNewTab)
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark-dimmed",
        light: "github-light",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(md);

  return String(file);
}
