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
  settle,
  onDone,
}: {
  from: DayPlan;
  to: DayPlan;
  direction: "next" | "prev";
  fromScroll: number;
  settle: "start" | "end";
  onDone: () => void;
}) {
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const goingNext = direction === "next";

  useLayoutEffect(() => {
    if (outRef.current) outRef.current.scrollTop = fromScroll;
    if (inRef.current && settle === "end") {
      inRef.current.scrollTop = inRef.current.scrollHeight;
    }
  }, [fromScroll, settle]);

  useEffect(() => {
    const timer = window.setTimeout(() => onDoneRef.current(), DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      <div
        ref={outRef}
        className={`absolute inset-0 overflow-y-auto overscroll-none ${
          goingNext ? "day-fade-out-up" : "day-fade-out-down"
        }`}
      >
        <DayPane day={from} />
      </div>
      <div
        ref={inRef}
        className={`absolute inset-0 overflow-y-auto overscroll-none ${
          goingNext ? "day-fade-in-up" : "day-fade-in-down"
        }`}
      >
        <DayPane day={to} />
      </div>
    </div>
  );
}
