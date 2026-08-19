"use client";

import { useSyncExternalStore } from "react";
import { DatePicker } from "@/components/DatePicker";
import { DayView } from "@/components/DayView";
import { dayBySlug, days, defaultSlug, trip } from "@/data/trip";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function slugFromLocation() {
  const fromHash = window.location.hash.replace(/^#/, "");
  if (days.some((day) => day.slug === fromHash)) return fromHash;
  return defaultSlug();
}

export function TripApp() {
  const slug = useSyncExternalStore(subscribe, slugFromLocation, () => days[0].slug);

  function selectDay(next: string) {
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const day = dayBySlug(slug);

  return (
    <div className="min-h-full bg-cream text-ink">
      <DatePicker value={slug} onChange={selectDay} />
      <DayView key={day.slug} day={day} />
      <footer className="mx-auto max-w-xl px-4 pb-10 pt-4 text-center text-xs text-muted">
        {trip.members.join(" · ")}
      </footer>
    </div>
  );
}
