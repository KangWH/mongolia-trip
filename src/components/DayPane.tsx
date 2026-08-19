import { DayView } from "@/components/DayView";
import { days, dayIndex, trip, type DayPlan } from "@/data/trip";

export function DayPane({
  day,
  caught,
  onPrev,
  onNext,
}: {
  day: DayPlan;
  caught?: "top" | "bottom" | null;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const index = dayIndex(day.slug);
  const prev = days[index - 1];
  const next = days[index + 1];

  return (
    <>
      <DayView day={day} />
      <nav className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 pb-8">
        <button
          type="button"
          disabled={!prev || !onPrev}
          onClick={onPrev}
          className="rounded-2xl bg-paper px-3 py-2.5 text-left text-sm disabled:opacity-30"
        >
          <span className="block text-[11px] text-muted">이전 날</span>
          {prev ? `${prev.dayNum}일 ${prev.weekday}` : "—"}
        </button>
        <button
          type="button"
          disabled={!next || !onNext}
          onClick={onNext}
          className="rounded-2xl bg-paper px-3 py-2.5 text-right text-sm disabled:opacity-30"
        >
          <span className="block text-[11px] text-muted">다음 날</span>
          {next ? `${next.dayNum}일 ${next.weekday}` : "—"}
        </button>
      </nav>
      <p
        className={`px-4 pb-6 text-center text-xs ${caught ? "text-ember" : "text-muted"}`}
      >
        {caught === "bottom" && next
          ? "한 번 더 내리면 다음 날"
          : caught === "top" && prev
            ? "한 번 더 올리면 이전 날"
            : trip.members.join(" · ")}
      </p>
    </>
  );
}
