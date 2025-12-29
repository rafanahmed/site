import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm debug-mono">
          <Link
            href="/about"
            className="text-foreground hover:text-foreground/70 transition-colors"
          >
            About
          </Link>
          <span className="text-foreground/20">|</span>
          <Link
            href="/projects"
            className="text-foreground hover:text-foreground/70 transition-colors"
          >
            Projects
          </Link>
          <span className="text-foreground/20">|</span>
          <Link
            href="/blog"
            className="text-foreground hover:text-foreground/70 transition-colors"
          >
            Blog
          </Link>
          <span className="text-foreground/20">|</span>
          <Link
            href="/music"
            className="text-foreground hover:text-foreground/70 transition-colors"
          >
            Music
          </Link>
        </nav>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-5">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/youtube-app-white-icon.svg"
              alt="YouTube"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/x-social-media-white-icon.svg"
              alt="X"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/instagram-white-icon.svg"
              alt="Instagram"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/linkedin-app-white-icon.svg"
              alt="LinkedIn"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/github-white-icon.svg"
              alt="GitHub"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </main>
  );
}

