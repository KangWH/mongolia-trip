import { Fragment } from "react";
import { MealSlotBlock } from "@/components/MealPicks";
import { mealSlotsAfter, type MealSlot } from "@/data/meals";
import {
  kindLabel,
  roleLabel,
  type DayPlan,
  type PlaceKind,
  type PlaceStop,
} from "@/data/trip";

const kindClass: Record<PlaceKind, string> = {
  lodging: "bg-sand/15 text-sand",
  airport: "bg-sky/10 text-sky",
  flight: "bg-sky/10 text-sky",
  attraction: "bg-grass/10 text-grass",
  restaurant: "bg-ember/10 text-ember",
  transit: "bg-ink/5 text-muted",
};

export function DayHeader({ day }: { day: DayPlan }) {
  return (
    <header className="mb-4">
      <p className="text-xs text-muted">
        {day.monthLabel} {day.dayNum}일 {day.weekday}요일
      </p>
      <h1 className="mt-0.5 font-serif text-2xl leading-tight">{day.title}</h1>
      <p className="mt-1 text-sm text-muted">{day.axis}</p>
    </header>
  );
}

function MealSlots({
  slug,
  after,
  inset = false,
}: {
  slug: string;
  after: number;
  inset?: boolean;
}) {
  const slots = mealSlotsAfter(slug, after);
  if (slots.length === 0) return null;
  return (
    <>
      {slots.map((slot: MealSlot) => (
        <li key={slot} className={inset ? "ml-8" : "mt-5"}>
          <MealSlotBlock slug={slug} slot={slot} />
        </li>
      ))}
    </>
  );
}

export function StopList({ day }: { day: DayPlan }) {
  const stops = day.stops;
  if (stops.length === 0) return null;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const middle = stops.length > 2 ? stops.slice(1, -1) : [];
  const only = stops.length === 1;
  const afterFirst = mealSlotsAfter(day.slug, 0);
  const rail = !only && (middle.length > 0 || afterFirst.length > 0);

  return (
    <ol>
      <li>
        <AnchorCard stop={first} />
      </li>
      {rail ? (
        <li className="relative py-2 pl-1">
          <div className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-ink/10" />
          <ol className="space-y-3 py-3">
            <MealSlots slug={day.slug} after={0} inset />
            {middle.map((stop, index) => (
              <Fragment key={`${stop.time}-${stop.name}`}>
                <li>
                  <MiddleStop stop={stop} />
                </li>
                <MealSlots slug={day.slug} after={index + 1} inset />
              </Fragment>
            ))}
          </ol>
        </li>
      ) : null}
      {!only ? (
        <li className="mt-3">
          <AnchorCard stop={last} />
        </li>
      ) : null}
      <MealSlots slug={day.slug} after={stops.length - 1} />
    </ol>
  );
}

export function AnchorCard({ stop }: { stop: PlaceStop }) {
  const heading = stop.role ? roleLabel[stop.role] : kindLabel[stop.kind];

  return (
    <section className="rounded-lg border border-ink/10 bg-paper px-5 pt-3 pb-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.18em] text-muted">{heading}</p>
        <KindBadge kind={stop.kind} />
      </div>
      <p className="mt-2 font-mono text-sm text-ember">{stop.time}</p>
      <h2 className="mt-1 font-serif text-2xl leading-snug">{stop.name}</h2>
      <p className="mt-1 text-sm text-muted">
        {stop.action} · {stop.area}
      </p>
      {stop.detail ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{stop.detail}</p>
      ) : null}
      <StopLinks stop={stop} />
    </section>
  );
}

export function LeadingStops({ stops }: { stops: PlaceStop[] }) {
  if (stops.length === 0) return null;
  const [first, ...rest] = stops;

  return (
    <ol>
      <li>
        <AnchorCard stop={first} />
      </li>
      {rest.length > 0 ? (
        <li className="relative py-2 pl-1">
          <div className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-ink/10" />
          <ol className="space-y-3 py-3">
            {rest.map((stop) => (
              <li key={`${stop.time}-${stop.name}`}>
                <MiddleStop stop={stop} />
              </li>
            ))}
          </ol>
        </li>
      ) : null}
    </ol>
  );
}

export function FollowingStops({ stops }: { stops: PlaceStop[] }) {
  if (stops.length === 0) return null;
  const last = stops[stops.length - 1];
  const anchored =
    last.role === "sleep" || last.role === "arrive" || last.kind === "lodging";
  const lead = anchored ? stops.slice(0, -1) : stops;

  return (
    <ol>
      {lead.length > 0 ? (
        <li className="relative py-2 pl-1">
          <div className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-ink/10" />
          <ol className="space-y-3 py-3">
            {lead.map((stop) => (
              <li key={`${stop.time}-${stop.name}`}>
                <MiddleStop stop={stop} />
              </li>
            ))}
          </ol>
        </li>
      ) : null}
      {anchored ? (
        <li className="mt-3">
          <AnchorCard stop={last} />
        </li>
      ) : null}
    </ol>
  );
}

export function MiddleStop({ stop }: { stop: PlaceStop }) {
  return (
    <div className="relative ml-8 rounded-lg border border-ink/10 bg-paper p-4">
      <span className="absolute top-5 -left-7 h-2.5 w-2.5 rounded-full border-2 border-cream bg-sky-deep" />
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-sm text-ember">{stop.time}</p>
        <KindBadge kind={stop.kind} />
      </div>
      <h2 className="mt-2 text-lg font-medium leading-snug">{stop.name}</h2>
      <p className="mt-1 text-sm text-muted">
        {stop.action} · {stop.area}
      </p>
      {stop.detail ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{stop.detail}</p>
      ) : null}
      <StopLinks stop={stop} compact />
    </div>
  );
}

function StopLinks({
  stop,
  compact = false,
}: {
  stop: PlaceStop;
  compact?: boolean;
}) {
  if (!stop.maps && !stop.href) return null;

  return (
    <p className={`flex flex-wrap gap-x-3 gap-y-1 text-sm ${compact ? "mt-2" : "mt-4"}`}>
      {stop.maps ? (
        <a
          className="text-ember underline decoration-ember/40 underline-offset-4"
          href={stop.maps}
          rel="noreferrer"
          target="_blank"
        >
          지도
        </a>
      ) : null}
      {stop.href ? (
        <a
          className="text-ember underline decoration-ember/40 underline-offset-4"
          href={stop.href}
          rel="noreferrer"
          target="_blank"
        >
          숙소 보기
        </a>
      ) : null}
    </p>
  );
}

function KindBadge({ kind }: { kind: PlaceKind }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] ${kindClass[kind]}`}>
      {kindLabel[kind]}
    </span>
  );
}
