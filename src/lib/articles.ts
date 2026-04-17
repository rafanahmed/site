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
import rehypeStringify from "rehype-stringify";
import type {
  Article,
  ArticleFrontmatter,
  ArticleMeta,
} from "./article-types";

export type { Article, ArticleFrontmatter, ArticleMeta } from "./article-types";
export { formatArticleDate } from "./article-types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function isMarkdownFile(name: string) {
  return name.endsWith(".md") && !name.startsWith("_") && name !== "GUIDELINES.md";
}

async function readArticleFile(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Partial<ArticleFrontmatter>;

  if (!data.title || !data.subtitle || !data.date) {
    throw new Error(
      `Article "${slug}" is missing required frontmatter (title, subtitle, date).`,
    );
  }

  const frontmatter: ArticleFrontmatter = {
    title: data.title,
    subtitle: data.subtitle,
    date: data.date,
    cover: data.cover,
    description: data.description,
    tags: data.tags,
    draft: data.draft,
  };

  return { slug, frontmatter, body: parsed.content };
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
      const { frontmatter } = await readArticleFile(slug);
      return { slug, ...frontmatter } satisfies ArticleMeta;
    }),
  );

  const includeDrafts = process.env.NODE_ENV !== "production";
  return articles
    .filter((a) => includeDrafts || !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { frontmatter, body } = await readArticleFile(slug);
    const html = await renderMarkdown(body);
    return { slug, ...frontmatter, html } satisfies Article;
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
    .use(remarkRehype)
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
