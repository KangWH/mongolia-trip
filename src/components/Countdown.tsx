"use client";

import { useSyncExternalStore } from "react";
import { trip } from "@/data/trip";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getNow() {
  return Date.now();
}

function getServerNow() {
  return 0;
}

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  const start = new Date(trip.startAt).getTime();
  const end = new Date("2026-08-28T12:00:00+09:00").getTime();

  if (!now) {
    return <p className="text-sm text-cream/70">출발까지 계산 중</p>;
  }

  if (now > end) {
    return <p className="text-sm tracking-wide text-cream/80">여행이 끝났습니다</p>;
  }

  if (now >= start) {
    return <p className="text-sm tracking-wide text-cream/80">지금 몽골에 있는 일정입니다</p>;
  }

  const diff = start - now;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div className="flex flex-wrap gap-3 font-serif">
      {[
        [days, "일"],
        [hours, "시간"],
        [minutes, "분"],
        [seconds, "초"],
      ].map(([value, unit]) => (
        <div key={String(unit)} className="min-w-16">
          <div className="text-3xl leading-none md:text-4xl">{pad(Number(value))}</div>
          <div className="mt-1 text-xs tracking-widest text-cream/70">{unit}</div>
        </div>
      ))}
    </div>
  );
}
