"use client";

import { useEffect, useRef, useState } from "react";
import { useMealPicks } from "@/components/MealPicks";
import { dayMapPoints, mapsDirUrl, type DayPlan } from "@/data/trip";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const EXPAND_KEY = "mongolia-trip-map-expand";

let mapsLoader: Promise<void> | null = null;

function loadMaps(key: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("window"));
  if (window.google?.maps) return Promise.resolve();
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      mapsLoader = null;
      reject(new Error("script"));
    };
    document.head.appendChild(script);
  });

  return mapsLoader;
}

function markerIcon() {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 12,
    fillColor: "#b4451a",
    fillOpacity: 1,
    strokeColor: "#faf4e8",
    strokeWeight: 2,
  };
}

function mealIcon() {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 9,
    fillColor: "#c48a3a",
    fillOpacity: 1,
    strokeColor: "#faf4e8",
    strokeWeight: 2,
  };
}

function paintRoute(
  map: google.maps.Map,
  day: DayPlan,
  meals: { name: string; lat: number; lng: number }[],
) {
  const route = dayMapPoints(day);
  const markers: google.maps.Marker[] = [];
  let line: google.maps.Polyline | null = null;

  if (route.length === 0 && meals.length === 0) {
    return { markers, line };
  }

  google.maps.event.trigger(map, "resize");

  const bounds = new google.maps.LatLngBounds();
  route.forEach((point, index) => {
    const position = { lat: point.lat, lng: point.lng };
    bounds.extend(position);
    markers.push(
      new google.maps.Marker({
        map,
        position,
        title: point.name,
        zIndex: 1,
        label: {
          text: String(index + 1),
          color: "#faf4e8",
          fontSize: "12px",
          fontWeight: "700",
        },
        icon: markerIcon(),
      }),
    );
  });

  if (route.length > 1) {
    line = new google.maps.Polyline({
      map,
      geodesic: true,
      path: route.map((point) => ({ lat: point.lat, lng: point.lng })),
      strokeColor: "#b4451a",
      strokeOpacity: 0.85,
      strokeWeight: 3,
    });
  }

  meals.forEach((meal) => {
    const position = { lat: meal.lat, lng: meal.lng };
    bounds.extend(position);
    markers.push(
      new google.maps.Marker({
        map,
        position,
        title: meal.name,
        icon: mealIcon(),
        zIndex: 1000,
        optimized: false,
      }),
    );
  });

  if (route.length === 1 && meals.length === 0) {
    map.panTo(route[0]);
    map.setZoom(11);
  } else if (route.length > 0 || meals.length > 0) {
    map.fitBounds(bounds, 48);
  }

  return { markers, line };
}

export function DayMap({
  day,
  pinned = false,
  onTogglePin,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: {
  day: DayPlan;
  pinned?: boolean;
  onTogglePin?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const [failed, setFailed] = useState(!MAPS_KEY);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandReady, setExpandReady] = useState(false);
  const { placesFor, picks } = useMealPicks();
  const mealKey = JSON.stringify(picks[day.slug] ?? {});

  const points = dayMapPoints(day);
  const dirUrl = mapsDirUrl(points);

  useEffect(() => {
    if (!MAPS_KEY) return;
    if (!hostRef.current) return;

    let cancelled = false;
    const previousAuth = window.gm_authFailure;
    window.gm_authFailure = () => {
      setFailed(true);
      previousAuth?.();
    };

    void loadMaps(MAPS_KEY)
      .then(() => {
        if (cancelled || mapRef.current || !hostRef.current) return;
        mapRef.current = new google.maps.Map(hostRef.current, {
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          mapTypeId: "hybrid",
          backgroundColor: "#0c1c2e",
          center: { lat: 47.92, lng: 106.92 },
          zoom: 5,
        });
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuth;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || failed) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    lineRef.current?.setMap(null);

    const painted = paintRoute(map, day, placesFor(day.slug));
    markersRef.current = painted.markers;
    lineRef.current = painted.line;
  }, [day, expanded, failed, mealKey, placesFor, ready]);

  useEffect(() => {
    try {
      setExpanded(window.localStorage.getItem(EXPAND_KEY) === "1");
    } catch {
      /* ignore */
    }
    setExpandReady(true);
  }, []);

  useEffect(() => {
    if (!expandReady) return;
    window.localStorage.setItem(EXPAND_KEY, expanded ? "1" : "0");
  }, [expandReady, expanded]);

  useEffect(() => {
    const map = mapRef.current;
    const host = hostRef.current;
    if (!ready || !map || !host) return;
    google.maps.event.trigger(map, "resize");
    const observer = new ResizeObserver(() => {
      google.maps.event.trigger(map, "resize");
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [expanded, pinned, ready]);

  if (failed && points.length === 0) return null;

  const iconBtn =
    "inline-flex size-9 items-center justify-center rounded-lg text-ember";

  return (
    <section className={points.length === 0 ? "hidden" : pinned ? "" : "mb-5"}>
      {failed ? (
        <a
          href={dirUrl ?? undefined}
          rel="noreferrer"
          target="_blank"
          className="flex h-44 items-center justify-center rounded-lg bg-paper text-sm text-ember underline decoration-ember/40 underline-offset-4"
        >
          Google 지도에서 오늘 경로 보기
        </a>
      ) : (
        <div
          ref={hostRef}
          className={`overflow-hidden bg-sky-deep ${
            expanded ? "h-[55vh]" : "h-52"
          } ${pinned ? "" : "rounded-lg"}`}
        />
      )}
      {dirUrl || onTogglePin ? (
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center ${
            pinned ? "mx-auto max-w-xl px-4 py-1" : "mt-1"
          }`}
        >
          <p className="justify-self-start">
            {dirUrl && !failed ? (
              <a
                className={iconBtn}
                href={dirUrl}
                rel="noreferrer"
                target="_blank"
                title="Google 지도에서 열기"
                aria-label="Google 지도에서 열기"
              >
                <IconExternal />
              </a>
            ) : null}
          </p>
          <div className="justify-self-center">
            {pinned ? (
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label="이전 날"
                  disabled={!hasPrev}
                  onClick={onPrev}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-lg leading-none text-ink disabled:opacity-25"
                >
                  ‹
                </button>
                <p className="min-w-0 px-0.5 text-sm text-muted">
                  {day.monthLabel} {day.dayNum}일 {day.weekday}
                </p>
                <button
                  type="button"
                  aria-label="다음 날"
                  disabled={!hasNext}
                  onClick={onNext}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-lg leading-none text-ink disabled:opacity-25"
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
          <p className="flex items-center justify-self-end">
            {failed ? null : (
              <button
                type="button"
                aria-pressed={expanded}
                aria-label={expanded ? "작게 보기" : "크게 보기"}
                title={expanded ? "작게 보기" : "크게 보기"}
                className={`${iconBtn} cursor-pointer border-0 p-0 ${
                  expanded ? "bg-ember/10" : "bg-transparent"
                }`}
                onClick={() => setExpanded((current) => !current)}
              >
                {expanded ? <IconShrink /> : <IconExpand />}
              </button>
            )}
            {onTogglePin ? (
              <button
                type="button"
                aria-pressed={pinned}
                aria-label={pinned ? "고정 해제" : "지도 고정"}
                title={pinned ? "고정 해제" : "지도 고정"}
                className={`${iconBtn} cursor-pointer border-0 p-0 ${
                  pinned ? "bg-ember/10" : "bg-transparent"
                }`}
                onClick={onTogglePin}
              >
                <IconPin on={pinned} />
              </button>
            ) : null}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function IconExternal() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function IconShrink() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="M14 10l7-7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function IconPin({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v5" />
      <path d="M8 3h8l-.8 7.2h2.6L12 16 6.2 10.2h2.6L8 3z" />
    </svg>
  );
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
