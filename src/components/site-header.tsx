import ThemeToggle from "@/components/theme-toggle";

// links
const links = [
  {name: "GitHub", href: "https://github.com/rafanahmed", icon: GitHubIcon},
  {name: "LinkedIn", href: "https://www.linkedin.com/in/rafan-ahmed/", icon: LinkedInIcon},
  {name: "X", href: "https://x.com/rafawwn", icon: XIcon},
  {name: "YouTube", href: "https://www.youtube.com/@rafawwn", icon: YouTubeIcon},
  {name: "RSS", href: "/rss.xml", icon: RssIcon},
];
const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function SiteHeader() {
  return (
    <header className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-4 pb-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-0 md:gap-y-0">
      <a
        href="/"
        tabIndex={-1}
        className="justify-self-start self-center font-mono text-base tracking-[0.2em] text-foreground/90 transition hover:text-foreground sm:text-lg"
      >
        rafan
      </a>
      <nav
        aria-label="Primary"
        className="col-span-2 row-start-2 flex justify-center md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-foreground/60 sm:gap-x-6 sm:gap-y-0">
          {navLinks.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                tabIndex={-1}
                className="inline-block py-1 transition hover:text-foreground"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 self-center text-foreground/60 sm:gap-3 md:col-start-3 md:gap-4">
        <ThemeToggle />

        <nav aria-label="Social links">
          <ul className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {links.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  aria-label={name}
                  tabIndex={-1}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center p-0.5 transition hover:text-foreground sm:p-0"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current sm:h-5 sm:w-5"
    >
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.7-.22.7-.5v-1.76c-2.85.62-3.45-1.21-3.45-1.21-.47-1.17-1.14-1.48-1.14-1.48-.93-.63.07-.62.07-.62 1.03.08 1.57 1.05 1.57 1.05.92 1.54 2.41 1.1 3 .84.09-.65.36-1.1.66-1.35-2.28-.25-4.68-1.12-4.68-4.98 0-1.1.4-1.99 1.04-2.7-.1-.26-.45-1.3.1-2.7 0 0 .86-.27 2.82 1.03A9.87 9.87 0 0 1 12 6.84c.88 0 1.77.12 2.6.35 1.96-1.3 2.81-1.03 2.81-1.03.57 1.4.22 2.44.11 2.7.65.71 1.03 1.6 1.03 2.7 0 3.87-2.4 4.73-4.7 4.98.37.31.7.92.7 1.86v2.76c0 .27.19.6.71.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current sm:h-5 sm:w-5"
    >
      <path d="M5.07 8.87H1.92V22h3.15V8.87Zm.2-4.06A1.81 1.81 0 0 0 3.45 3a1.8 1.8 0 0 0 0 3.61 1.8 1.8 0 0 0 1.82-1.8Zm16.81 9.1c0-3.95-2.1-5.79-4.9-5.79-2.26 0-3.27 1.24-3.84 2.12V8.87h-3.14V22h3.14v-7.31c0-1.93.37-3.8 2.76-3.8 2.35 0 2.38 2.2 2.38 3.92V22h3.16l-.01-8.09Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current sm:h-5 sm:w-5"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.45L6.4 22H3.3l7.24-8.28L.8 2h6.4l4.43 5.88L18.9 2Zm-1.1 18h1.72L6.27 3.9H4.42L17.8 20Z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current sm:h-5 sm:w-5"
    >
      <path d="M23 12.01s0-3.12-.4-4.62a2.9 2.9 0 0 0-2.04-2.05C19.05 5 12 5 12 5s-7.05 0-8.56.34A2.9 2.9 0 0 0 1.4 7.4C1 8.89 1 12.01 1 12.01s0 3.12.4 4.61a2.9 2.9 0 0 0 2.04 2.05C4.95 19 12 19 12 19s7.05 0 8.56-.33a2.9 2.9 0 0 0 2.04-2.05c.4-1.5.4-4.61.4-4.61ZM9.08 15.59V8.43l6.25 3.58-6.25 3.58Z" />
    </svg>
  );
}
function RssIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current sm:h-5 sm:w-5"
    >
      <path d="M5 17.5A2.5 2.5 0 1 0 5 22a2.5 2.5 0 0 0 0-4.5ZM2 9v3c5.52 0 10 4.48 10 10h3c0-7.18-5.82-13-13-13Zm0-7v3c9.39 0 17 7.61 17 17h3C22 10.4 13.6 2 2 2Z" />
    </svg>
  );
}
