"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TypewriterNav from "@/components/TypewriterNav";

export default function Home() {
  const [showSocials, setShowSocials] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm debug-mono">
          <TypewriterNav
            items={[
              { href: "/about", label: "About" },
              { href: "/projects", label: "Projects" },
              { href: "/blog", label: "Blog" },
              { href: "/music", label: "Music" },
              { href: "/terminal", label: "Terminal", disabled: true },
            ]}
            onComplete={() => setShowSocials(true)}
          />
        </nav>

        {/* Social Links */}
        <div
          className={`flex items-center justify-center gap-5 transition-opacity duration-700 ${
            showSocials ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="https://youtube.com/@gnosticboy"
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
            href="https://x.com/gnosismaxxing"
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
            href="https://linkedin.com/in/rafan-ahmed"
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
            href="https://github.com/rafanahmed"
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

