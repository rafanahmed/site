import "server-only";
import type { Article, ArticleMeta } from "./article-types";

export type { Article, ArticleFrontmatter, ArticleMeta } from "./article-types";
export { formatArticleDate, formatReadingTime } from "./article-types";

export async function getAllArticleSlugs(): Promise<string[]> {
  return [];
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  return [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  void slug;
  return null;
}

export async function renderMarkdown(md: string): Promise<string> {
  void md;
  return "";
}
