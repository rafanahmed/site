import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home",
  description: "Personal archive",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const storedTheme = localStorage.getItem("theme");
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = storedTheme === "light" || storedTheme === "dark"
                  ? storedTheme
                  : systemPrefersDark
                    ? "dark"
                    : "light";

                document.documentElement.dataset.theme = theme;
              } catch {}
            })();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
