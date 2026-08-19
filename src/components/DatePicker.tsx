"use client";

import { days } from "@/data/trip";

type DatePickerProps = {
  value: string;
  onChange: (slug: string) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-end justify-between gap-4 px-4 pb-3 pt-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-muted">MONGOLIA 2026</p>
          <p className="font-serif text-xl leading-none">일정</p>
        </div>
        <p className="pb-0.5 text-xs text-muted">8.23 – 8.28</p>
      </div>
      <div className="no-scrollbar mx-auto flex max-w-xl gap-1 overflow-x-auto px-4 pb-3">
        {days.map((day) => {
          const selected = day.slug === value;
          return (
            <button
              key={day.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(day.slug)}
              className={`flex min-w-[3.35rem] flex-col items-center rounded-2xl px-3 py-2 transition-colors ${
                selected
                  ? "bg-sky-deep text-cream"
                  : "bg-paper text-muted hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <span className="text-[10px] tracking-wide">{day.weekday}</span>
              <span className="font-serif text-2xl leading-none">{day.dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
