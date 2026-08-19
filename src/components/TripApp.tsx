"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from "react";
import { DatePicker } from "@/components/DatePicker";
import { DayCrossfade } from "@/components/DayCrossfade";
import { DayMap } from "@/components/DayMap";
import { DayMorph } from "@/components/DayMorph";
import { DayPane } from "@/components/DayPane";
import { MealPicksProvider } from "@/components/MealPicks";
import { DayHeader } from "@/components/Stops";
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

function atDocumentEdges() {
  const top = window.scrollY <= 1;
  const bottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
  return { top, bottom };
}

const SWIPE_MS = 380;
const SWIPE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAP_PIN_KEY = "mongolia-trip-map-pin";

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
  const [swipeWidth, setSwipeWidth] = useState(0);
  const [swipeSettling, setSwipeSettling] = useState(false);
  const [caught, setCaught] = useState<"top" | "bottom" | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);
  const [headerH, setHeaderH] = useState(88);
  const [mapH, setMapH] = useState(208);
  const [pinned, setPinned] = useState(false);
  const [pinReady, setPinReady] = useState(false);

  const index = dayIndex(slug);
  const hasPrev = index > 0;
  const hasNext = index < days.length - 1;
  const headerRef = useRef<HTMLDivElement | null>(null);
  const mapChromeRef = useRef<HTMLDivElement | null>(null);
  const settleTimer = useRef(0);
  const catchArmed = useRef(false);
  const transitionRef = useRef<Transition | null>(null);
  const swipeCommit = useRef<"next" | "prev" | null>(null);
  const swipeSettlingRef = useRef(false);
  const dragXRef = useRef(0);
  transitionRef.current = transition;
  swipeSettlingRef.current = swipeSettling;
  dragXRef.current = dragX;

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderH(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pinned]);

  useLayoutEffect(() => {
    const el = mapChromeRef.current;
    if (!el) return;
    const update = () => setMapH(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pinned, slug]);

  useEffect(() => {
    try {
      setPinned(window.localStorage.getItem(MAP_PIN_KEY) === "1");
    } catch {
      /* ignore */
    }
    setPinReady(true);
  }, []);

  useEffect(() => {
    if (!pinReady) return;
    window.localStorage.setItem(MAP_PIN_KEY, pinned ? "1" : "0");
  }, [pinReady, pinned]);

  const togglePin = useCallback(() => {
    setPinned((current) => !current);
  }, []);

  const applyDay = useCallback((nextIndex: number, from: "start" | "end" = "start") => {
    const next = days[nextIndex];
    if (!next) return;
    catchArmed.current = false;
    swipeCommit.current = null;
    setCaught(null);
    setDragX(0);
    setSwipeSettling(false);
    setTransition(null);
    setSlug(next.slug);
    history.replaceState(null, "", `#${next.slug}`);
  }, []);

  const goTo = useCallback(
    (nextIndex: number, from: "start" | "end" = "start", swipe = false) => {
      if (transitionRef.current || swipeSettlingRef.current) return;
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
          fromScroll: window.scrollY,
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

  const settleSwipe = useCallback((commit: "next" | "prev" | null, fromX: number) => {
    const width = swipeWidth || window.innerWidth;
    const target = commit === "next" ? -width : commit === "prev" ? width : 0;
    if (Math.abs(target - fromX) < 1) {
      if (commit === "next") applyDay(index + 1, "start");
      else if (commit === "prev") applyDay(index - 1, "start");
      else {
        setDragX(0);
        setSwipeSettling(false);
      }
      return;
    }
    swipeCommit.current = commit;
    setSwipeSettling(true);
    requestAnimationFrame(() => setDragX(target));
  }, [applyDay, index, swipeWidth]);

  const onSwipeTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform") return;
      if (!swipeSettlingRef.current) return;
      const commit = swipeCommit.current;
      if (commit === "next") applyDay(index + 1, "start");
      else if (commit === "prev") applyDay(index - 1, "start");
      else {
        setDragX(0);
        setSwipeSettling(false);
      }
    },
    [applyDay, index],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSlug(slugFromLocation()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (transition || swipeSettling) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, swipeSettling, transition]);

  useEffect(() => {
    if (transition || swipeSettling) return;

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
      const { top, bottom } = atDocumentEdges();
      if (!top && !bottom) clearCatch();
    };

    const onWheel = (event: WheelEvent) => {
      const { top, bottom } = atDocumentEdges();
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
      lastX: 0,
      lastT: 0,
      vx: 0,
      ignore: false,
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-trip-header], [data-trip-map]")) {
        touch.ignore = true;
        return;
      }
      const point = event.touches[0];
      const { top, bottom } = atDocumentEdges();
      touch.ignore = false;
      touch.x = point.clientX;
      touch.y = point.clientY;
      touch.lastX = point.clientX;
      touch.lastT = event.timeStamp;
      touch.vx = 0;
      touch.axis = "";
      touch.atTop = top;
      touch.atBottom = bottom;
      setSwipeWidth(window.innerWidth);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touch.ignore || event.touches.length !== 1) return;
      const point = event.touches[0];
      const dx = point.clientX - touch.x;
      const dy = point.clientY - touch.y;
      const dt = event.timeStamp - touch.lastT;

      if (!touch.axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        touch.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (touch.axis === "x") {
        event.preventDefault();
        if (dt > 0) {
          touch.vx = (point.clientX - touch.lastX) / dt;
        }
        touch.lastX = point.clientX;
        touch.lastT = event.timeStamp;
        const resisted =
          dx < 0 && !hasNext ? dx / 3 : dx > 0 && !hasPrev ? dx / 3 : dx;
        setDragX(resisted);
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touch.ignore) {
        touch.ignore = false;
        return;
      }
      const point = event.changedTouches[0];
      const dx = point.clientX - touch.x;
      const dy = point.clientY - touch.y;
      const width = window.innerWidth;
      const vx = touch.vx;

      if (touch.axis === "x") {
        const toNext = hasNext && (dx < -width * 0.22 || vx < -0.55);
        const toPrev = hasPrev && (dx > width * 0.22 || vx > 0.55);
        settleSwipe(toNext ? "next" : toPrev ? "prev" : null, dragXRef.current);
        return;
      }

      setDragX(0);

      if (touch.atBottom && dy < -64 && hasNext) {
        goNext("start");
        return;
      }
      if (touch.atTop && dy > 64 && hasPrev) {
        goPrev("end");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(settleTimer.current);
    };
  }, [goNext, goPrev, hasNext, hasPrev, settleSwipe, swipeSettling, transition, slug]);

  const finishTransition = useCallback(() => {
    setTransition(null);
  }, []);

  const day = dayBySlug(slug);
  const prev = days[index - 1];
  const next = days[index + 1];
  const width = swipeWidth || (typeof window === "undefined" ? 0 : window.innerWidth);
  const swiping = dragX !== 0 || swipeSettling;

  const chromeH = pinned ? mapH : headerH;

  const swipeStyle = (offset: number): CSSProperties => ({
    transform: `translate3d(${offset}px, 0, 0)`,
    transition: swipeSettling ? `transform ${SWIPE_MS}ms ${SWIPE_EASE}` : "none",
  });

  return (
    <MealPicksProvider>
    <div className="bg-cream text-ink">
      <div
        ref={headerRef}
        data-trip-header=""
        className={pinned ? "hidden" : "sticky top-0 z-40"}
      >
        <DatePicker
          value={slug}
          onChange={(nextSlug) => goTo(dayIndex(nextSlug), "start")}
          onPrev={() => goPrev("start")}
          onNext={() => goNext("start")}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </div>

      {swiping && dragX > 0 && prev ? (
        <div
          className="fixed inset-0 z-0 overflow-y-auto bg-cream"
          style={{ ...swipeStyle(dragX - width), paddingTop: chromeH }}
        >
          <DayPane day={prev} />
        </div>
      ) : null}
      {swiping && dragX < 0 && next ? (
        <div
          className="fixed inset-0 z-0 overflow-y-auto bg-cream"
          style={{ ...swipeStyle(dragX + width), paddingTop: chromeH }}
        >
          <DayPane day={next} />
        </div>
      ) : null}

      <div
        className="relative z-10 bg-cream"
        style={swiping ? swipeStyle(dragX) : undefined}
        onTransitionEnd={onSwipeTransitionEnd}
      >
        <div className={`mx-auto max-w-xl px-4 ${pinned ? "hidden" : "pt-5"}`}>
          <DayHeader day={day} />
        </div>
        <div
          ref={mapChromeRef}
          data-trip-map=""
          className={
            pinned
              ? "sticky top-0 z-40 bg-cream shadow-[0_8px_20px_rgba(26,20,12,0.08)]"
              : "mx-auto max-w-xl px-4"
          }
        >
          <DayMap
            day={day}
            pinned={pinned}
            onTogglePin={togglePin}
            onPrev={() => goPrev("start")}
            onNext={() => goNext("start")}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        </div>
        {transition?.mode === "stay" ? (
          <DayMorph
            from={transition.from}
            to={transition.to}
            direction={transition.direction}
            fromScroll={transition.fromScroll}
            onDone={finishTransition}
          />
        ) : transition?.mode === "jump" ? (
          <DayCrossfade
            from={transition.from}
            to={transition.to}
            direction={transition.direction}
            fromScroll={transition.fromScroll}
            headerH={chromeH}
            onDone={finishTransition}
          />
        ) : (
          <DayPane
            day={day}
            caught={caught}
            onPrev={() => goPrev("start")}
            onNext={() => goNext("start")}
          />
        )}
      </div>
    </div>
    </MealPicksProvider>
  );
}
