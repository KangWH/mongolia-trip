"use client";

import { useEffect, useRef, useState } from "react";
import { useMealPicks } from "@/components/MealPicks";
import { dayMapPoints, mapsDirUrl, type DayPlan } from "@/data/trip";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

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
}: {
  day: DayPlan;
  pinned?: boolean;
  onTogglePin?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const [failed, setFailed] = useState(!MAPS_KEY);
  const [ready, setReady] = useState(false);
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
  }, [day, failed, mealKey, placesFor, ready]);

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
  }, [pinned, ready]);

  if (failed && points.length === 0) return null;

  const actionClass =
    "text-sm text-ember underline decoration-ember/40 underline-offset-4";

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
          className={`h-52 overflow-hidden bg-sky-deep ${pinned ? "" : "rounded-lg"}`}
        />
      )}
      {dirUrl || onTogglePin ? (
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 ${
            pinned ? "mx-auto max-w-xl px-4 py-2" : "mt-2"
          }`}
        >
          {pinned ? (
            <p className="text-sm text-muted">
              {day.monthLabel} {day.dayNum}일 {day.weekday}
            </p>
          ) : null}
          <p className="flex flex-wrap gap-x-3">
            {dirUrl && !failed ? (
              <a
                className={actionClass}
                href={dirUrl}
                rel="noreferrer"
                target="_blank"
              >
                Google 지도에서 열기
              </a>
            ) : null}
            {onTogglePin ? (
              <button
                type="button"
                aria-pressed={pinned}
                className={`${actionClass} cursor-pointer border-0 bg-transparent p-0 font-sans`}
                onClick={onTogglePin}
              >
                {pinned ? "고정 해제" : "지도 고정"}
              </button>
            ) : null}
          </p>
        </div>
      ) : null}
    </section>
  );
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
