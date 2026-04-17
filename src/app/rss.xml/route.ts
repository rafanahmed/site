import { getAllArticles } from "@/lib/articles";
import { siteConfig, siteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toUTCString();
}

export async function GET() {
  const base = siteUrl();
  const articles = await getAllArticles();
  const feedUrl = `${base}${siteConfig.feedPath}`;
  const latest = articles[0]?.date;
  const lastBuildDate = latest ? toRfc822(latest) : new Date().toUTCString();

  const items = articles
    .map((article) => {
      const link = `${base}/blog/${article.slug}`;
      const summary =
        article.description?.trim() || article.subtitle.trim() || "";
      const categories = (article.tags ?? [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822(article.date)}</pubDate>`,
        `      <dc:creator>${escapeXml(siteConfig.author)}</dc:creator>`,
        `      <description>${escapeXml(summary)}</description>`,
        categories || null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.language)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <generator>rafan.dev</generator>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
