"use client";

import { useEffect, useState } from "react";
import { navItems, trip } from "@/data/trip";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(navItems[0].id);

  useEffect(() => {
    const ids = navItems.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#top" className="font-serif text-lg tracking-tight">
          {trip.englishTitle}
        </a>
        <button
          className="rounded-full border border-ink/15 px-3 py-1 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? "닫기" : "목차"}
        </button>
        <nav className="hidden gap-6 text-sm md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                active === item.id
                  ? "text-ember"
                  : "text-muted transition-colors hover:text-ink"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-ink/10 px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-2 py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
