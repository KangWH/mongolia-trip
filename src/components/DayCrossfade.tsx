"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { DayPane } from "@/components/DayPane";
import type { DayPlan } from "@/data/trip";

const DURATION = 460;

export function DayCrossfade({
  from,
  to,
  direction,
  fromScroll,
  headerH,
  settle,
  onDone,
}: {
  from: DayPlan;
  to: DayPlan;
  direction: "next" | "prev";
  fromScroll: number;
  headerH: number;
  settle: "start" | "end";
  onDone: () => void;
}) {
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const goingNext = direction === "next";

  useLayoutEffect(() => {
    window.scrollTo(
      0,
      settle === "end" ? document.documentElement.scrollHeight : 0,
    );
  }, [settle]);

  useEffect(() => {
    const timer = window.setTimeout(() => onDoneRef.current(), DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div
        className={`pointer-events-none fixed inset-0 z-20 overflow-hidden bg-cream ${
          goingNext ? "day-fade-out-up" : "day-fade-out-down"
        }`}
      >
        <div style={{ transform: `translateY(${-fromScroll}px)` }}>
          <div style={{ height: headerH }} />
          <DayPane day={from} />
        </div>
      </div>
      <div className={goingNext ? "day-fade-in-up" : "day-fade-in-down"}>
        <DayPane day={to} />
      </div>
    </div>
  );
}
