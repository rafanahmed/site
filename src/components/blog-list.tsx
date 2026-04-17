"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/article-types";
import { formatArticleDate } from "@/lib/article-types";

type Props = {
  articles: ArticleMeta[];
};

export default function BlogList({ articles }: Props) {
  const [tab, setTab] = useState<"newest" | "oldest">("newest");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? articles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.subtitle.toLowerCase().includes(q),
        )
      : articles;
    return [...filtered].sort((a, b) =>
      tab === "newest"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  }, [articles, query, tab]);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
        <div className="flex items-center gap-1">
          <TabButton active={tab === "newest"} onClick={() => setTab("newest")}>
            Newest
          </TabButton>
          <TabButton active={tab === "oldest"} onClick={() => setTab("oldest")}>
            Oldest
          </TabButton>
        </div>

        {searchOpen ? (
          <div className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-foreground/50" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              placeholder="Search articles…"
              className="w-48 bg-transparent font-mono text-sm text-foreground placeholder:text-foreground/40 focus:outline-none sm:w-64"
            />
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Close search"
              className="text-foreground/50 transition hover:text-foreground"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-foreground/60 transition hover:text-foreground"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <ul className="divide-y divide-foreground/10">
        {visible.length === 0 ? (
          <li className="py-10 text-center font-mono text-sm text-foreground/50">
            {query
              ? `no results for "${query}"`
              : "no articles published yet."}
          </li>
        ) : (
          visible.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex items-center justify-between gap-6 py-6 sm:gap-10"
              >
                <div className="min-w-0 flex-1">
                  <h2
                    style={{
                      fontFamily: '"Times New Roman", Times, serif',
                    }}
                    className="text-xl font-semibold leading-snug tracking-tight text-foreground transition group-hover:text-foreground sm:text-2xl"
                  >
                    {article.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-snug text-foreground/65 sm:text-[15px]">
                    {article.subtitle}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 sm:text-[11px]">
                    {formatArticleDate(article.date)}
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="h-16 w-24 flex-none rounded-md bg-linear-to-br from-foreground/15 to-foreground/5 sm:h-20 sm:w-32"
                  style={
                    article.cover
                      ? {
                          backgroundImage: `url(${article.cover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm transition ${
        active
          ? "bg-foreground/10 text-foreground"
          : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
