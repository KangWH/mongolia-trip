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

export function DayView({ day }: { day: DayPlan }) {
  const first = day.stops[0];
  const last = day.stops[day.stops.length - 1];
  const middle = day.stops.slice(1, -1);

  return (
    <article className="mx-auto max-w-xl px-4 py-6">
      <header className="mb-6">
        <p className="text-sm text-muted">
          {day.monthLabel} {day.dayNum}일 {day.weekday}요일
        </p>
        <h1 className="mt-1 font-serif text-3xl leading-tight">{day.title}</h1>
        <p className="mt-2 text-sm text-muted">{day.axis}</p>
      </header>

      <ol className="space-y-0">
        <li>
          <AnchorCard stop={first} />
        </li>

        {middle.length > 0 ? (
          <li className="relative py-2 pl-1">
            <div className="absolute top-0 bottom-0 left-[1.15rem] w-px bg-ink/10" />
            <ol className="space-y-3 py-3">
              {middle.map((stop) => (
                <li key={`${stop.time}-${stop.name}`}>
                  <MiddleStop stop={stop} />
                </li>
              ))}
            </ol>
          </li>
        ) : null}

        <li>
          <AnchorCard stop={last} />
        </li>
      </ol>
    </article>
  );
}

function AnchorCard({ stop }: { stop: PlaceStop }) {
  const heading = stop.role ? roleLabel[stop.role] : kindLabel[stop.kind];
  const night = stop.role === "sleep" || stop.role === "arrive";

  return (
    <section
      className={
        night
          ? "rounded-3xl bg-sky-deep px-5 py-5 text-cream"
          : "rounded-3xl border border-ink/10 bg-paper px-5 py-5"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-[11px] tracking-[0.18em] ${night ? "text-sand" : "text-muted"}`}
        >
          {heading}
        </p>
        <KindBadge kind={stop.kind} dark={night} />
      </div>
      <p className={`mt-3 font-mono text-sm ${night ? "text-cream/60" : "text-ember"}`}>
        {stop.time}
      </p>
      <h2 className="mt-1 font-serif text-2xl leading-snug">{stop.name}</h2>
      <p className={`mt-1 text-sm ${night ? "text-cream/70" : "text-muted"}`}>
        {stop.action} · {stop.area}
      </p>
      {stop.detail ? (
        <p
          className={`mt-3 text-sm leading-relaxed ${night ? "text-cream/80" : "text-muted"}`}
        >
          {stop.detail}
        </p>
      ) : null}
      {stop.href ? (
        <a
          className={`mt-4 inline-block text-sm underline underline-offset-4 ${
            night
              ? "text-sand decoration-sand/40"
              : "text-ember decoration-ember/40"
          }`}
          href={stop.href}
          rel="noreferrer"
          target="_blank"
        >
          숙소 보기
        </a>
      ) : null}
    </section>
  );
}

function MiddleStop({ stop }: { stop: PlaceStop }) {
  return (
    <div className="relative ml-8 rounded-2xl border border-ink/10 bg-paper p-4">
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
    </div>
  );
}

function KindBadge({ kind, dark = false }: { kind: PlaceKind; dark?: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] ${
        dark ? "bg-cream/10 text-cream/80" : kindClass[kind]
      }`}
    >
      {kindLabel[kind]}
    </span>
  );
}
