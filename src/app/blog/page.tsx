import SiteHeader from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: siteConfig.description,
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 pb-16 pt-6 sm:px-8">
        <SiteHeader />
      </div>
    </main>
  );
}
