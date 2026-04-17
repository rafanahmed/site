export const siteConfig = {
  name: "rafan.dev",
  title: "rafan.dev",
  description:
    "Abstracted computer and financial mathematics enjoyer and practitioner.",
  author: "Rafan Ahmed",
  email: "",
  language: "en-us",
  url: "https://rafan.dev",
  feedPath: "/rss.xml",
  githubUsername: "rafanahmed",
} as const;

export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return siteConfig.url;
}
