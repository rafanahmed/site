"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  disabled?: boolean;
}

interface TypewriterNavProps {
  items: NavItem[];
  linkClassName?: string;
  onComplete?: () => void;
}

export default function TypewriterNav({
  items,
  linkClassName = "text-foreground hover:text-foreground/70 transition-colors",
  onComplete,
}: TypewriterNavProps) {
  const pathname = usePathname();

  const itemsSig = useMemo(
    () => items.map((i) => `${i.href}:${i.label}`).join("|"),
    [items]
  );

  const [visibleChars, setVisibleChars] = useState<number[]>(() =>
    items.map(() => 0)
  );
  const [comingSoonChars, setComingSoonChars] = useState(0);

  const runIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    runIdRef.current += 1;
    const runId = runIdRef.current;

    setVisibleChars(items.map(() => 0));
    setComingSoonChars(0);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion && process.env.NODE_ENV !== "development") {
      setVisibleChars(items.map((item) => item.label.length));
      const disabledItem = items.find((item) => item.disabled);
      if (disabledItem) {
        setComingSoonChars(14); 
      }
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const startDelayMs = 200;
    const charMinMs = 40;
    const charMaxMs = 80;
    const wordPauseMs = 150;
    const finalPauseMs = 200;

    const getCharDelay = () =>
      Math.floor(Math.random() * (charMaxMs - charMinMs + 1)) + charMinMs;

    let wordIdx = 0;
    let charIdx = 0;
    let typingComingSoon = false;
    const comingSoonText = " (Coming soon)";

    const step = () => {
      if (runId !== runIdRef.current) return;

      if (typingComingSoon) {
        const disabledItem = items.find((item) => item.disabled);
        if (disabledItem && charIdx < comingSoonText.length) {
          charIdx += 1;
          setComingSoonChars(charIdx);
          timerRef.current = setTimeout(step, getCharDelay());
          return;
        } else {
          if (onComplete) {
            onComplete();
          }
          return;
        }
      }

      const label = items[wordIdx]?.label ?? "";

      if (wordIdx < items.length) {
        if (charIdx < label.length) {
          charIdx += 1;
          setVisibleChars((prev) => {
            const next = prev.slice();
            next[wordIdx] = charIdx;
            return next;
          });
          timerRef.current = setTimeout(step, getCharDelay());
          return;
        }

        const isLast = wordIdx === items.length - 1;
        const currentItem = items[wordIdx];
        const pause = isLast ? finalPauseMs : wordPauseMs;

        timerRef.current = setTimeout(() => {
          if (runId !== runIdRef.current) return;

          if (currentItem?.disabled) {
            typingComingSoon = true;
            charIdx = 0;
            timerRef.current = setTimeout(step, wordPauseMs);
            return;
          }

          wordIdx += 1;
          charIdx = 0;

          if (wordIdx < items.length) {
            timerRef.current = setTimeout(step, getCharDelay());
          } else {
            if (onComplete) {
              onComplete();
            }
          }
        }, pause);
      }
    };

    timerRef.current = setTimeout(step, startDelayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pathname, itemsSig]);

  return (
    <>
      {items.map((item, i) => {
        const typed = item.label.slice(0, visibleChars[i] ?? 0);
        const widthCh = item.label.length + 1;

        return (
          <span key={item.href} className="inline-flex items-baseline">
            {item.disabled ? (
              <span className="text-foreground/30 cursor-default">
                <span
                  className="inline-block"
                  style={{ width: `${widthCh}ch` }}
                >
                  {typed}
                </span>
                {visibleChars[i] === item.label.length && (
                  <span className="text-foreground/20">
                    {" (Coming soon)".slice(0, comingSoonChars)}
                  </span>
                )}
              </span>
            ) : (
              <Link href={item.href} className={linkClassName}>
                <span
                  className="inline-block"
                  style={{ width: `${widthCh}ch` }}
                >
                  {typed}
                </span>
              </Link>
            )}
            {i < items.length - 1 && <span className="w-[0.6ch]" />}
          </span>
        );
      })}
    </>
  );
}

