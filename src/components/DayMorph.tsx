"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnchorCard,
  FollowingStops,
  LeadingStops,
} from "@/components/Stops";
import type { DayPlan } from "@/data/trip";

const FADE_MS = 180;
const MOVE_MS = 520;

export function DayMorph({
  from,
  to,
  direction,
  fromScroll,
  onDone,
}: {
  from: DayPlan;
  to: DayPlan;
  direction: "next" | "prev";
  fromScroll: number;
  onDone: () => void;
}) {
  const goingNext = direction === "next";
  const [phase, setPhase] = useState<"out" | "in">("out");
  const [entered, setEntered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstTop = useRef(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const sharedFrom = goingNext ? from.stops.at(-1)! : from.stops[0];
  const sharedTo = goingNext ? to.stops[0] : to.stops.at(-1)!;
  const cardSpaced = (phase === "out" && goingNext) || (phase === "in" && !goingNext);

  useLayoutEffect(() => {
    if (phase !== "out") return;
    window.scrollTo(0, fromScroll);
  }, [fromScroll, phase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      firstTop.current = cardRef.current?.getBoundingClientRect().top ?? 0;
      setPhase("in");
    }, FADE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (phase !== "in") return;
    const card = cardRef.current;
    if (!card) {
      onDoneRef.current();
      return;
    }

    const dy = firstTop.current - card.getBoundingClientRect().top;
    card.style.transition = "none";
    card.style.transform = `translate3d(0, ${dy}px, 0)`;

    const play = requestAnimationFrame(() => {
      card.style.transition = `transform ${MOVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      card.style.transform = "translate3d(0, 0, 0)";
      setEntered(true);
    });

    const done = window.setTimeout(() => onDoneRef.current(), MOVE_MS + 50);
    return () => {
      cancelAnimationFrame(play);
      window.clearTimeout(done);
    };
  }, [phase]);

  return (
    <div className="mx-auto max-w-xl px-4 pb-4">
      {phase === "out" ? (
        <>
          <div className="day-morph-out">
            {goingNext ? <LeadingStops stops={from.stops.slice(0, -1)} /> : null}
          </div>
          <div
            ref={cardRef}
            className={`relative z-10 ${cardSpaced ? "mt-3" : ""}`}
          >
            <AnchorCard stop={phase === "out" ? sharedFrom : sharedTo} />
          </div>
          {!goingNext ? (
            <div className="day-morph-out mt-3">
              <FollowingStops stops={from.stops.slice(1)} />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={`day-morph-in day-morph-in-above ${entered ? "is-in" : ""}`}
          >
            {!goingNext ? <LeadingStops stops={to.stops.slice(0, -1)} /> : null}
          </div>
          <div
            ref={cardRef}
            className={`relative z-10 ${cardSpaced ? "mt-3" : ""}`}
          >
            <AnchorCard stop={sharedTo} />
          </div>
          {goingNext ? (
            <div
              className={`day-morph-in day-morph-in-below mt-3 ${entered ? "is-in" : ""}`}
            >
              <FollowingStops stops={to.stops.slice(1)} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
