"use client";

import { useEffect, useRef, useState } from "react";
import { dayMapPoints, mapsDirUrl, type DayPlan } from "@/data/trip";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f3ead7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#1a140c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#faf4e8" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c4b59a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e8dcc4" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d4c4a4" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c5d4dc" }] },
];

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

export function DayMap({ day }: { day: DayPlan }) {
  const points = dayMapPoints(day);
  const dirUrl = mapsDirUrl(points);
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!MAPS_KEY);

  useEffect(() => {
    const route = dayMapPoints(day);
    if (!MAPS_KEY || route.length === 0) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const markers: google.maps.Marker[] = [];
    let line: google.maps.Polyline | undefined;

    const draw = async () => {
      try {
        await loadMaps(MAPS_KEY);
        if (cancelled || !hostRef.current) return;

        const bounds = new google.maps.LatLngBounds();
        const map = new google.maps.Map(hostRef.current, {
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: mapStyles,
          backgroundColor: "#f3ead7",
        });

        route.forEach((point, index) => {
          const position = { lat: point.lat, lng: point.lng };
          bounds.extend(position);
          markers.push(
            new google.maps.Marker({
              map,
              position,
              title: point.name,
              label: {
                text: String(index + 1),
                color: "#faf4e8",
                fontSize: "12px",
                fontWeight: "700",
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#b4451a",
                fillOpacity: 1,
                strokeColor: "#faf4e8",
                strokeWeight: 2,
              },
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

        if (route.length === 1) {
          map.setCenter(route[0]);
          map.setZoom(11);
        } else {
          map.fitBounds(bounds, 48);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const previousAuth = window.gm_authFailure;
    window.gm_authFailure = () => {
      setFailed(true);
      previousAuth?.();
    };

    void draw();

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuth;
      markers.forEach((marker) => marker.setMap(null));
      line?.setMap(null);
    };
  }, [day]);

  if (points.length === 0) return null;

  return (
    <section className="mb-5">
      {failed ? (
        <a
          href={dirUrl ?? undefined}
          rel="noreferrer"
          target="_blank"
          className="flex h-44 items-center justify-center rounded-3xl border border-ink/10 bg-paper text-sm text-ember underline decoration-ember/40 underline-offset-4"
        >
          Google 지도에서 오늘 경로 보기
        </a>
      ) : (
        <div
          ref={hostRef}
          className="h-52 overflow-hidden rounded-3xl border border-ink/10 bg-paper"
        />
      )}
      {dirUrl && !failed ? (
        <a
          href={dirUrl}
          rel="noreferrer"
          target="_blank"
          className="mt-2 inline-block text-sm text-ember underline decoration-ember/40 underline-offset-4"
        >
          Google 지도에서 열기
        </a>
      ) : null}
    </section>
  );
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
