import SiteHeader from "@/components/site-header";
import BlogList from "@/components/blog-list";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: siteConfig.description,
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8">
        <SiteHeader />
        <div className="mx-auto w-full max-w-5xl">
          <BlogList articles={articles} />
        </div>
      </div>
    </main>
  );
}
