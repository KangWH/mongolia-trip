import { Countdown } from "@/components/Countdown";
import { SiteNav } from "@/components/SiteNav";
import { days, flights, stays, tips, trip } from "@/data/trip";

const accentBar: Record<(typeof days)[number]["accent"], string> = {
  sky: "bg-sky",
  sand: "bg-sand",
  grass: "bg-grass",
  night: "bg-sky-deep",
};

const statusLabel: Record<(typeof days)[number]["slots"][number]["status"], string> = {
  confirmed: "확정",
  tour: "투어",
  transit: "이동",
  note: "메모",
};

export default function Home() {
  return (
    <div id="top" className="min-h-full bg-cream text-ink">
      <SiteNav />

      <section className="relative overflow-hidden bg-sky-deep text-cream">
        <Horizon />
        <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-24">
          <div>
            <p className="text-sm tracking-[0.28em] text-sand uppercase">
              {trip.period}
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">
              {trip.title}
            </h1>
            <p className="mt-5 max-w-md text-lg text-cream/80">
              울란바토르에서 세미고비를 찍고, 테를지 게르에서 잔 다음
              부산으로 내려온다. {trip.members.join(" · ")}.
            </p>
            <p className="mt-6 text-sm text-cream/55">{trip.compiledFrom}</p>
          </div>
          <div className="flex flex-col justify-end rounded-3xl border border-cream/15 bg-cream/5 p-6">
            <p className="text-xs tracking-[0.2em] text-cream/60">인천공항까지</p>
            <div className="mt-3">
              <Countdown />
            </div>
            <p className="mt-6 text-sm text-cream/70">{trip.route}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <section id="overview" className="scroll-mt-24">
          <SectionHeading kicker="Overview" title="한눈에" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="기간" value="6일" hint="8/23 일 – 8/28 금" />
            <Stat label="인원" value="3명" hint={trip.members.join(" · ")} />
            <Stat label="축" value="3곳" hint="수도 · 사막 · 국립공원" />
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {days
              .filter((day) => day.id !== "prep")
              .map((day) => (
                <li
                  key={day.id}
                  className="rounded-2xl border border-ink/10 bg-paper p-4"
                >
                  <p className="text-xs text-muted">
                    {day.date} {day.weekday}
                  </p>
                  <p className="mt-2 font-serif text-xl">{day.label}</p>
                  <p className="mt-1 text-sm text-muted">{day.stay}</p>
                </li>
              ))}
          </ol>
        </section>

        <section id="flights" className="mt-20 scroll-mt-24">
          <SectionHeading kicker="Flights" title="항공" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {flights.map((flight) => (
              <article
                key={flight.id}
                className="rounded-3xl bg-sky text-cream p-6 shadow-sm"
              >
                <p className="text-xs tracking-[0.2em] text-sand">
                  {flight.label} · {flight.date}
                </p>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <Airport code={flight.from.code} name={flight.from.name} />
                  <div className="mb-3 h-px flex-1 bg-cream/25" />
                  <Airport code={flight.to.code} name={flight.to.name} align="right" />
                </div>
                <p className="mt-5 font-serif text-2xl">{flight.depart}</p>
                <p className="mt-1 text-sm text-cream/70">{flight.arriveHint}</p>
                <ul className="mt-5 space-y-2 text-sm text-cream/80">
                  {flight.notes.map((note) => (
                    <li key={note}>· {note}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="days" className="mt-20 scroll-mt-24">
          <SectionHeading kicker="Itinerary" title="일자별 일정" />
          <div className="mt-10 space-y-8">
            {days.map((day) => (
              <article
                key={day.id}
                id={day.id}
                className="overflow-hidden rounded-3xl border border-ink/10 bg-paper"
              >
                <div className={`h-1.5 ${accentBar[day.accent]}`} />
                <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr] md:p-8">
                  <header>
                    <p className="font-serif text-4xl leading-none">{day.date}</p>
                    <p className="mt-2 text-sm text-muted">{day.weekday}</p>
                    <h2 className="mt-4 font-serif text-2xl">{day.label}</h2>
                    <p className="mt-2 text-sm text-muted">{day.place}</p>
                    <p className="mt-4 text-sm">숙소 · {day.stay}</p>
                  </header>
                  <div>
                    <p className="text-sm leading-relaxed text-muted">{day.summary}</p>
                    <ol className="mt-5 divide-y divide-ink/10">
                      {day.slots.map((slot) => (
                        <li key={slot.title} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            {slot.time ? (
                              <span className="font-mono text-sm text-ember">
                                {slot.time}
                              </span>
                            ) : null}
                            <span className="font-medium">{slot.title}</span>
                            <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-muted">
                              {statusLabel[slot.status]}
                            </span>
                          </div>
                          {slot.detail ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted">
                              {slot.detail}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="stays" className="mt-20 scroll-mt-24">
          <SectionHeading kicker="Stays" title="숙소" />
          <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10">
            {stays.map((stay, index) => (
              <div
                key={stay.nights}
                className={`grid gap-2 px-5 py-5 md:grid-cols-[160px_140px_1fr] md:items-start ${
                  index % 2 === 0 ? "bg-paper" : "bg-cream"
                }`}
              >
                <p className="font-medium">{stay.nights}</p>
                <p>
                  {stay.place}
                  <span className="mt-1 block text-sm text-muted">{stay.type}</span>
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {stay.note}{" "}
                  {stay.href ? (
                    <a
                      className="text-ember underline decoration-ember/40 underline-offset-4"
                      href={stay.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Booking
                    </a>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="tips" className="mt-20 scroll-mt-24">
          <SectionHeading kicker="Notes" title="챙길 것" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {tips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-3xl border border-ink/10 bg-paper p-6"
              >
                <h2 className="font-serif text-2xl">{tip.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10 px-4 py-10 text-center text-sm text-muted">
        {trip.members.join(" · ")} · {trip.period}
        <span className="mt-2 block">{trip.compiledFrom}</span>
      </footer>
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.28em] text-sand uppercase">{kicker}</p>
      <h2 className="mt-2 font-serif text-4xl">{title}</h2>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-paper p-5">
      <p className="text-xs tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </div>
  );
}

function Airport({
  code,
  name,
  align = "left",
}: {
  code: string;
  name: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="font-serif text-3xl">{code}</p>
      <p className="mt-1 text-sm text-cream/70">{name}</p>
    </div>
  );
}

function Horizon() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-sky"
      preserveAspectRatio="none"
      viewBox="0 0 1200 200"
    >
      <path
        d="M0 140 C 180 80 280 170 460 120 C 640 70 760 160 980 100 C 1100 70 1160 90 1200 80 L 1200 200 L 0 200 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M0 170 C 220 120 340 190 560 150 C 780 110 900 180 1200 140 L 1200 200 L 0 200 Z"
        fill="#0c1c2e"
      />
    </svg>
  );
}
