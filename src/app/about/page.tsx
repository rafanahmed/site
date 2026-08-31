import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8">
        <SiteHeader />
        <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-foreground/55 sm:text-base">
            coming soon
          </p>
        </section>
      </div>
    </main>
  );
}
