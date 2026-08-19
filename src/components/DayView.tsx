import { DayMap } from "@/components/DayMap";
import { DayHeader, StopList } from "@/components/Stops";
import type { DayPlan } from "@/data/trip";

export function DayView({ day }: { day: DayPlan }) {
  return (
    <article className="mx-auto max-w-xl px-4 pb-4 pt-5">
      <DayHeader day={day} />
      <DayMap day={day} />
      <StopList stops={day.stops} />
    </article>
  );
}
