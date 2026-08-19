"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  mealsBySlug,
  selectedMealPlaces,
  slotLabel,
  type MealPlace,
  type MealSlot,
} from "@/data/meals";

const STORAGE = "mongolia-trip-meals";

type Picks = Record<string, Partial<Record<MealSlot, string>>>;

type MealPicksContextValue = {
  picks: Picks;
  placesFor: (slug: string) => MealPlace[];
  toggle: (slug: string, slot: MealSlot, id: string) => void;
};

const MealPicksContext = createContext<MealPicksContextValue | null>(null);

export function MealPicksProvider({ children }: { children: React.ReactNode }) {
  const [picks, setPicks] = useState<Picks>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Picks;
        if (parsed && typeof parsed === "object") setPicks(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE, JSON.stringify(picks));
  }, [hydrated, picks]);

  const toggle = useCallback((slug: string, slot: MealSlot, id: string) => {
    setPicks((current) => {
      const day = current[slug] ?? {};
      const next = { ...day, [slot]: day[slot] === id ? undefined : id };
      return { ...current, [slug]: next };
    });
  }, []);

  const placesFor = useCallback(
    (slug: string) => selectedMealPlaces(slug, picks[slug] ?? {}),
    [picks],
  );

  const value = useMemo(
    () => ({ picks, placesFor, toggle }),
    [picks, placesFor, toggle],
  );

  return (
    <MealPicksContext.Provider value={value}>{children}</MealPicksContext.Provider>
  );
}

export function useMealPicks() {
  const ctx = useContext(MealPicksContext);
  if (!ctx) throw new Error("MealPicksProvider");
  return ctx;
}

export function MealSlotBlock({
  slug,
  slot,
}: {
  slug: string;
  slot: MealSlot;
}) {
  const meals = mealsBySlug[slug];
  const { picks, toggle } = useMealPicks();
  if (!meals) return null;
  const items = slot === "street" ? meals.street : meals[slot];
  if (!items?.length) return null;
  const selected = picks[slug]?.[slot];
  const picked = items.find((item) => item.id === selected);

  return (
    <details className="group text-sm leading-relaxed">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span>
          <span className="text-[11px] tracking-[0.18em] text-muted">
            추천 {slotLabel[slot]}
          </span>
          <span className="mt-0.5 block tracking-normal group-open:hidden">
            {picked ? (
              <span className="text-ember">{picked.name}</span>
            ) : (
              <span className="text-muted">{items.length}곳</span>
            )}
          </span>
        </span>
        <span
          aria-hidden
          className="mt-1 inline-block text-[10px] text-muted transition-transform duration-200 group-open:rotate-180"
        >
          ▼
        </span>
      </summary>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((item) => {
          const on = selected === item.id;
          return (
            <li key={item.id} className="flex items-start gap-2.5">
              <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5">
                <input
                  type="radio"
                  name={`meal-${slug}-${slot}`}
                  checked={on}
                  onChange={() => {
                    if (!on) toggle(slug, slot, item.id);
                  }}
                  onClick={() => {
                    if (on) toggle(slug, slot, item.id);
                  }}
                  className="mt-0.5 size-4 shrink-0 accent-ember"
                />
                <span>
                  <span className={on ? "text-ember" : "text-ink"}>{item.name}</span>
                  {item.confirmed ? (
                    <span className="text-muted"> · 일정</span>
                  ) : null}
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {item.area} · {item.note}
                  </span>
                </span>
              </label>
              <a
                className="mt-0.5 shrink-0 text-muted underline decoration-ink/15 underline-offset-4"
                href={item.maps}
                rel="noreferrer"
                target="_blank"
              >
                지도
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
