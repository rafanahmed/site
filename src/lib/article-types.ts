export type ArticleFrontmatter = {
  title: string;
  subtitle: string;
  date: string;
  cover?: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
};

export type ArticleMeta = ArticleFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Article = ArticleMeta & {
  html: string;
};

export function formatReadingTime(minutes: number) {
  const m = Math.max(1, Math.round(minutes));
  return `${m} MIN READ`;
}

export function formatArticleDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day} · ${year}`;
}
