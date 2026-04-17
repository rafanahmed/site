import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import {
  formatArticleDate,
  getAllArticleSlugs,
  getArticleBySlug,
} from "@/lib/articles";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found — rafan.dev" };
  return {
    title: `${article.title} — rafan.dev`,
    description: article.description ?? article.subtitle,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-24 pt-6 sm:px-8">
        <SiteHeader />

        <article className="mt-10">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55 transition hover:text-foreground"
          >
            ← back to blog
          </Link>

          <header className="mt-8 border-b border-foreground/10 pb-8">
            <h1
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              {article.title}
            </h1>
            <p className="mt-3 text-base leading-snug text-foreground/70 sm:text-lg">
              {article.subtitle}
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
              {formatArticleDate(article.date)}
            </p>
          </header>

          <div
            className="prose-article mt-10"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </article>
      </div>
    </main>
  );
}
