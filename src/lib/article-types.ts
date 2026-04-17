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
};

export type Article = ArticleMeta & {
  html: string;
};

export function formatArticleDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day} · ${year}`;
}
