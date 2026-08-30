"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/article-types";
import { formatArticleDate, formatReadingTime } from "@/lib/article-types";

type Props = {
  articles: ArticleMeta[];
};

const sections = [
  { id: "top", label: "top", color: "bg-foreground/35" },
  { id: "yap", label: "yap", color: "bg-red-500" },
  { id: "archive", label: "archive", color: "bg-orange-300" },
  { id: "all", label: "all", color: "bg-foreground/35" },
] as const;

type SectionFilter = (typeof sections)[number]["id"];
const sectionIds = new Set<string>(sections.map((section) => section.id));

function readInitialState() {
  if (typeof window === "undefined") {
    return {
      tab: "newest" as const,
      section: "top" as SectionFilter,
      tag: "all",
      query: "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const urlSection = params.get("section");
  const urlTab = params.get("sort");
  return {
    tab: urlTab === "oldest" ? "oldest" : "newest",
    section: sectionIds.has(urlSection ?? "")
      ? (urlSection as SectionFilter)
      : "top",
    tag: params.get("tag") || "all",
    query: params.get("q") || "",
  } as const;
}

export default function BlogList({ articles }: Props) {
  const initialState = useMemo(() => readInitialState(), []);
  const [tab, setTab] = useState<"newest" | "oldest">(initialState.tab);
  const [section, setSection] = useState<SectionFilter>(initialState.section);
  const [tag, setTag] = useState(initialState.tag);
  const [tagQuery, setTagQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<"section" | "tags" | null>(null);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialState.query));
  const [query, setQuery] = useState(initialState.query);

  const tags = useMemo(() => {
    return Array.from(
      new Set(articles.flatMap((article) => article.tags ?? [])),
    ).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const filteredTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    return q ? tags.filter((articleTag) => articleTag.includes(q)) : tags;
  }, [tagQuery, tags]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = articles.filter((article) => {
      const articleSection = article.section ?? "top";
      const matchesSection =
        section === "all" ||
        (section === "top" && articleSection !== "archive") ||
        articleSection === section;
      const matchesTag = tag === "all" || article.tags?.includes(tag);
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.tags?.some((articleTag) => articleTag.toLowerCase().includes(q));

      return matchesSection && matchesTag && matchesQuery;
    });
    return [...filtered].sort((a, b) =>
      tab === "newest"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  }, [articles, query, section, tab, tag]);

  const filterQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (section !== "top") params.set("section", section);
    if (tag !== "all") params.set("tag", tag);
    if (tab !== "newest") params.set("sort", tab);
    if (query.trim()) params.set("q", query.trim());
    return params.toString();
  }, [query, section, tab, tag]);

  const articleHref = (slug: string) =>
    `/blog/${slug}${filterQuery ? `?${filterQuery}` : ""}`;

  useEffect(() => {
    const nextUrl = filterQuery ? `/blog?${filterQuery}` : "/blog";
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [filterQuery]);

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-foreground/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenu(openMenu === "section" ? null : "section")
              }
              className="rounded-md border border-foreground/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/70 transition hover:text-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`h-3 w-5 rounded-[2px] ${
                    sections.find((item) => item.id === section)?.color
                  }`}
                />
                {section}
                <ChevronIcon
                  className={`h-3 w-3 transition ${
                    openMenu === "section" ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            {openMenu === "section" ? (
              <div className="absolute left-0 z-10 mt-2 w-44 rounded-md border border-foreground/10 bg-background p-2 shadow-2xl shadow-black/20">
                {sections.map((item) => (
                  <FilterButton
                    key={item.id}
                    active={section === item.id}
                    onClick={() => {
                      setSection(item.id);
                      setOpenMenu(null);
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-3 w-5 rounded-[2px] ${item.color}`}
                    />
                    {item.label}
                  </FilterButton>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "tags" ? null : "tags")}
              className="rounded-md border border-foreground/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/70 transition hover:text-foreground"
            >
              <span className="inline-flex items-center gap-2">
                {tag === "all" ? "tags" : `#${tag}`}
                <ChevronIcon
                  className={`h-3 w-3 transition ${
                    openMenu === "tags" ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            {openMenu === "tags" ? (
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-foreground/10 bg-background p-2 shadow-2xl shadow-black/20">
                <label className="sr-only" htmlFor="tag-search">
                  Search tags
                </label>
                <input
                  id="tag-search"
                  type="search"
                  value={tagQuery}
                  onChange={(event) => setTagQuery(event.target.value)}
                  placeholder="search tags..."
                  className="mb-2 w-full rounded-sm border border-foreground/10 bg-transparent px-2 py-1.5 font-mono text-[11px] text-foreground placeholder:text-foreground/35 focus:outline-none"
                />
                <div className="max-h-48 overflow-auto">
                  <TagOption
                    active={tag === "all"}
                    onClick={() => {
                      setTag("all");
                      setTagQuery("");
                      setOpenMenu(null);
                    }}
                  >
                    all tags
                  </TagOption>
                  {filteredTags.length === 0 ? (
                    <p className="px-2 py-2 font-mono text-[11px] text-foreground/40">
                      no tags
                    </p>
                  ) : (
                    filteredTags.map((articleTag) => (
                      <TagOption
                        key={articleTag}
                        active={tag === articleTag}
                        onClick={() => {
                          setTag(articleTag);
                          setTagQuery("");
                          setOpenMenu(null);
                        }}
                      >
                        #{articleTag}
                      </TagOption>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <TabButton
              active={tab === "newest"}
              onClick={() => setTab("newest")}
            >
              Newest
            </TabButton>
            <TabButton
              active={tab === "oldest"}
              onClick={() => setTab("oldest")}
            >
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
                placeholder="Search articles..."
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
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[8rem_minmax(0,1fr)]">
        <aside className="hidden pt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/45 lg:block">
          {section}
        </aside>

        <ul className="divide-y divide-foreground/10">
          {visible.length === 0 ? (
            <li className="py-10 text-center font-mono text-sm text-foreground/50">
              {query ? `no results for "${query}"` : ""}
            </li>
          ) : (
            visible.map((article) => (
              <li key={article.slug}>
                <article className="group flex items-center justify-between gap-6 py-6 sm:gap-10">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <SectionBadge section={article.section ?? "top"} />
                      {article.tags?.map((articleTag) => (
                        <button
                          key={articleTag}
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setTag(articleTag);
                            setSection("all");
                          }}
                          className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/45 transition hover:text-foreground"
                        >
                          #{articleTag}
                        </button>
                      ))}
                    </div>
                  <Link href={articleHref(article.slug)}>
                      <h2 className="font-(family-name:--font-space-mono) text-xl font-bold leading-snug tracking-tight text-foreground transition group-hover:text-foreground sm:text-2xl">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="mt-1.5 text-sm leading-snug text-foreground/65 sm:text-[15px]">
                      {article.subtitle}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 sm:text-[11px]">
                      {formatArticleDate(article.date)} ·{" "}
                      {formatReadingTime(article.readingTime)}
                    </p>
                  </div>
                  <Link
                    href={articleHref(article.slug)}
                    aria-label={`Read ${article.title}`}
                    className="h-16 w-24 flex-none rounded-md bg-foreground/5 sm:h-20 sm:w-32"
                  >
                    {article.cover ? (
                      <div
                        className="h-full w-full rounded-md bg-cover bg-center transition group-hover:opacity-90"
                        style={{ backgroundImage: `url(${article.cover})` }}
                      />
                    ) : null}
                  </Link>
                </article>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

function FilterButton({
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
      className={`inline-flex w-full items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
        active
          ? "bg-foreground/10 text-foreground"
          : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function TagOption({
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
      className={`block w-full rounded-sm px-2 py-1.5 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition ${
        active
          ? "bg-foreground/10 text-foreground"
          : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SectionBadge({ section }: { section: "top" | "archive" | "yap" }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/60">
      <span
        aria-hidden="true"
        className={`h-3 w-5 rounded-[2px] ${
          section === "yap"
            ? "bg-red-500"
            : section === "archive"
              ? "bg-orange-300"
              : "bg-foreground/35"
        }`}
      />
      {section}
    </span>
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

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
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
