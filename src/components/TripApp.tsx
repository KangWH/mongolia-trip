"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { DayCrossfade } from "@/components/DayCrossfade";
import { DayMorph } from "@/components/DayMorph";
import { DayPane } from "@/components/DayPane";
import {
  dayBySlug,
  dayIndex,
  days,
  defaultSlug,
  sharedStay,
  type DayPlan,
} from "@/data/trip";

function slugFromLocation() {
  const fromHash = window.location.hash.replace(/^#/, "");
  if (days.some((day) => day.slug === fromHash)) return fromHash;
  return defaultSlug();
}

function atEdges(el: HTMLElement) {
  const top = el.scrollTop <= 1;
  const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  return { top, bottom };
}

type Transition = {
  from: DayPlan;
  to: DayPlan;
  direction: "next" | "prev";
  fromScroll: number;
  settle: "start" | "end";
  mode: "stay" | "jump";
};

export function TripApp() {
  const [slug, setSlug] = useState(days[0].slug);
  const [dragX, setDragX] = useState(0);
  const [caught, setCaught] = useState<"top" | "bottom" | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);

  const index = dayIndex(slug);
  const hasPrev = index > 0;
  const hasNext = index < days.length - 1;
  const paneRef = useRef<HTMLDivElement | null>(null);
  const settleTimer = useRef(0);
  const catchArmed = useRef(false);
  const transitionRef = useRef<Transition | null>(null);
  transitionRef.current = transition;

  const applyDay = useCallback((nextIndex: number, from: "start" | "end" = "start") => {
    const next = days[nextIndex];
    if (!next) return;
    catchArmed.current = false;
    setCaught(null);
    setDragX(0);
    setTransition(null);
    setSlug(next.slug);
    history.replaceState(null, "", `#${next.slug}`);
    requestAnimationFrame(() => {
      const col = paneRef.current;
      if (!col) return;
      col.scrollTop = from === "end" ? col.scrollHeight : 0;
    });
  }, []);

  const goTo = useCallback(
    (nextIndex: number, from: "start" | "end" = "start", swipe = false) => {
      if (transitionRef.current) return;
      if (nextIndex === index || nextIndex < 0 || nextIndex >= days.length) return;
      const current = days[index];
      const target = days[nextIndex];
      if (!swipe) {
        const direction = nextIndex > index ? "next" : "prev";
        const mode = sharedStay(current, target) ? "stay" : "jump";
        catchArmed.current = false;
        setCaught(null);
        setDragX(0);
        setSlug(target.slug);
        history.replaceState(null, "", `#${target.slug}`);
        setTransition({
          from: current,
          to: target,
          direction,
          fromScroll: paneRef.current?.scrollTop ?? 0,
          settle: mode === "stay" ? (direction === "next" ? "start" : "end") : from,
          mode,
        });
        return;
      }
      applyDay(nextIndex, from);
    },
    [applyDay, index],
  );

  const goPrev = useCallback(
    (from: "start" | "end" = "start", swipe = false) => {
      goTo(index - 1, from, swipe);
    },
    [goTo, index],
  );

  const goNext = useCallback(
    (from: "start" | "end" = "start", swipe = false) => {
      goTo(index + 1, from, swipe);
    },
    [goTo, index],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSlug(slugFromLocation()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (transition) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, transition]);

  useEffect(() => {
    const col = paneRef.current;
    if (!col || transition) return;

    const armCatch = (edge: "top" | "bottom") => {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        catchArmed.current = true;
        setCaught(edge);
      }, 200);
    };

    const clearCatch = () => {
      catchArmed.current = false;
      setCaught(null);
      window.clearTimeout(settleTimer.current);
    };

    const onScroll = () => {
      const { top, bottom } = atEdges(col);
      if (!top && !bottom) clearCatch();
    };

    const onWheel = (event: WheelEvent) => {
      const { top, bottom } = atEdges(col);
      if (event.deltaY > 0 && bottom && hasNext) {
        event.preventDefault();
        if (catchArmed.current) goNext("start");
        else armCatch("bottom");
        return;
      }
      if (event.deltaY < 0 && top && hasPrev) {
        event.preventDefault();
        if (catchArmed.current) goPrev("end");
        else armCatch("top");
        return;
      }
      clearCatch();
    };

    const touch = {
      x: 0,
      y: 0,
      axis: "" as "" | "x" | "y",
      atTop: false,
      atBottom: false,
    };

    const onTouchStart = (event: TouchEvent) => {
      const point = event.touches[0];
      const { top, bottom } = atEdges(col);
      touch.x = point.clientX;
      touch.y = point.clientY;
      touch.axis = "";
      touch.atTop = top;
      touch.atBottom = bottom;
    };

    const onTouchMove = (event: TouchEvent) => {
      const point = event.touches[0];
      const dx = point.clientX - touch.x;
      const dy = point.clientY - touch.y;

      if (!touch.axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        touch.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (touch.axis === "x") {
        event.preventDefault();
        const resisted =
          dx < 0 && !hasNext ? dx / 3 : dx > 0 && !hasPrev ? dx / 3 : dx;
        setDragX(resisted);
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const point = event.changedTouches[0];
      const dx = point.clientX - touch.x;
      const dy = point.clientY - touch.y;

      if (touch.axis === "x") {
        if (dx < -56 && hasNext) goNext("start", true);
        else if (dx > 56 && hasPrev) goPrev("start", true);
        else setDragX(0);
        return;
      }

      setDragX(0);

      if (touch.atBottom && dy < -28 && hasNext) {
        goNext("start");
        return;
      }
      if (touch.atTop && dy > 28 && hasPrev) {
        goPrev("end");
      }
    };

    col.addEventListener("scroll", onScroll, { passive: true });
    col.addEventListener("wheel", onWheel, { passive: false });
    col.addEventListener("touchstart", onTouchStart, { passive: true });
    col.addEventListener("touchmove", onTouchMove, { passive: false });
    col.addEventListener("touchend", onTouchEnd);

    return () => {
      col.removeEventListener("scroll", onScroll);
      col.removeEventListener("wheel", onWheel);
      col.removeEventListener("touchstart", onTouchStart);
      col.removeEventListener("touchmove", onTouchMove);
      col.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(settleTimer.current);
    };
  }, [goNext, goPrev, hasNext, hasPrev, transition, slug]);

  const finishTransition = useCallback((current: Transition) => {
    setTransition(null);
    requestAnimationFrame(() => {
      const col = paneRef.current;
      if (!col) return;
      col.scrollTop = current.settle === "end" ? col.scrollHeight : 0;
    });
  }, []);

  const day = dayBySlug(slug);
  const prev = days[index - 1];
  const next = days[index + 1];

  return (
    <div className="relative h-dvh overflow-hidden bg-cream text-ink">
      <DatePicker
        value={slug}
        onChange={(nextSlug) => goTo(dayIndex(nextSlug), "start")}
        onPrev={() => goPrev("start")}
        onNext={() => goNext("start")}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
      <div className="h-full overflow-hidden">
        {dragX > 0 && prev ? (
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{ transform: `translate3d(calc(${dragX}px - 100%), 0, 0)` }}
          >
            <DayPane day={prev} />
          </div>
        ) : null}
        {dragX < 0 && next ? (
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{ transform: `translate3d(calc(${dragX}px + 100%), 0, 0)` }}
          >
            <DayPane day={next} />
          </div>
        ) : null}

        <div
          className="h-full"
          style={{ transform: dragX ? `translate3d(${dragX}px, 0, 0)` : undefined }}
        >
          {transition?.mode === "stay" ? (
            <DayMorph
              from={transition.from}
              to={transition.to}
              direction={transition.direction}
              fromScroll={transition.fromScroll}
              onDone={() => finishTransition(transition)}
            />
          ) : transition?.mode === "jump" ? (
            <DayCrossfade
              from={transition.from}
              to={transition.to}
              direction={transition.direction}
              fromScroll={transition.fromScroll}
              settle={transition.settle}
              onDone={() => finishTransition(transition)}
            />
          ) : (
            <div ref={paneRef} className="h-full overflow-y-auto overscroll-none">
              <DayPane
                day={day}
                caught={caught}
                onPrev={() => goPrev("start")}
                onNext={() => goNext("start")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
