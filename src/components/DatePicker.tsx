"use client";

import { days } from "@/data/trip";

type DatePickerProps = {
  value: string;
  onChange: (slug: string) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export function DatePicker({
  value,
  onChange,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: DatePickerProps) {
  return (
    <div className="absolute inset-x-0 top-0 z-40 border-b border-ink/10 bg-cream/40 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-xl items-end justify-between gap-4 px-4 pb-2 pt-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-muted">MONGOLIA 2026</p>
          <p className="font-serif text-xl leading-none">일정</p>
        </div>
        <p className="pb-0.5 text-xs text-muted">8.23 – 8.28</p>
      </div>
      <div className="mx-auto flex max-w-xl items-center gap-1 px-3 pb-1.5">
        <button
          type="button"
          aria-label="이전 날"
          disabled={!hasPrev}
          onClick={onPrev}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg leading-none disabled:opacity-25"
        >
          ‹
        </button>
        <div className="no-scrollbar flex min-w-0 flex-1 justify-between gap-0.5 overflow-x-auto">
          {days.map((day) => {
            const selected = day.slug === value;
            return (
              <button
                key={day.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(day.slug)}
                className={`flex h-9 min-w-9 flex-1 flex-col items-center justify-center rounded-lg ${
                  selected ? "bg-sky-deep text-cream" : "text-muted"
                }`}
              >
                <span className="text-[9px] leading-none">{day.weekday}</span>
                <span className="font-serif text-base leading-none">{day.dayNum}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="다음 날"
          disabled={!hasNext}
          onClick={onNext}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg leading-none disabled:opacity-25"
        >
          ›
        </button>
      </div>
    </div>
  );
}
