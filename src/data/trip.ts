export type PlaceKind =
  | "lodging"
  | "airport"
  | "flight"
  | "attraction"
  | "restaurant"
  | "transit";

export type StopRole = "wake" | "sleep" | "depart" | "arrive";

export type PlaceStop = {
  time: string;
  name: string;
  kind: PlaceKind;
  role?: StopRole;
  area: string;
  action: string;
  detail?: string;
  href?: string;
  stayId?: string;
};

export type DayPlan = {
  slug: string;
  date: string;
  monthLabel: string;
  dayNum: string;
  weekday: string;
  title: string;
  axis: string;
  stops: PlaceStop[];
};

export const trip = {
  title: "몽골",
  period: "2026.08.23 – 08.28",
  members: ["박정호", "강우현", "권도형"],
};

export const kindLabel: Record<PlaceKind, string> = {
  lodging: "숙소",
  airport: "공항",
  flight: "항공",
  attraction: "관광",
  restaurant: "식당",
  transit: "이동",
};

export const roleLabel: Record<StopRole, string> = {
  wake: "기상 · 체크아웃",
  sleep: "숙박 · 체크인",
  depart: "출발",
  arrive: "도착",
};

export const days: DayPlan[] = [
  {
    slug: "23",
    date: "2026-08-23",
    monthLabel: "8월",
    dayNum: "23",
    weekday: "일",
    title: "인천에서 울란바토르로",
    axis: "ICN → UBN",
    stops: [
      {
        time: "07:30",
        name: "인천국제공항",
        kind: "airport",
        role: "depart",
        area: "인천 · ICN",
        action: "출발 수속",
      },
      {
        time: "10:00",
        name: "인천 → 울란바토르",
        kind: "flight",
        area: "제주항공",
        action: "비행",
        detail: "약 3시간 30분. 시차 −1시간.",
      },
      {
        time: "도착 후",
        name: "칭기스칸 국제공항",
        kind: "airport",
        area: "울란바토르 · UBN",
        action: "환전",
        detail: "달러 → 투그릭.",
      },
      {
        time: "저녁",
        name: "울란바토르 에어비앤비",
        kind: "lodging",
        role: "sleep",
        area: "울란바토르 시내",
        action: "체크인",
        stayId: "ub-airbnb",
      },
    ],
  },
  {
    slug: "24",
    date: "2026-08-24",
    monthLabel: "8월",
    dayNum: "24",
    weekday: "월",
    title: "세미고비 1일차",
    axis: "울란바토르 → 엘승타사르하이",
    stops: [
      {
        time: "아침",
        name: "울란바토르 에어비앤비",
        kind: "lodging",
        role: "wake",
        area: "울란바토르 시내",
        action: "체크아웃",
        stayId: "ub-airbnb",
      },
      {
        time: "오전",
        name: "세미고비로 이동",
        kind: "transit",
        area: "투어 차량 · 4–5시간",
        action: "이동",
      },
      {
        time: "오후",
        name: "엘승타사르하이",
        kind: "attraction",
        area: "미니사막",
        action: "관광",
      },
      {
        time: "저녁",
        name: "투어 식사",
        kind: "restaurant",
        area: "세미고비 캠프",
        action: "식사",
      },
      {
        time: "밤",
        name: "세미고비 투어 게르",
        kind: "lodging",
        role: "sleep",
        area: "엘승타사르하이",
        action: "체크인",
        stayId: "gobi-ger",
      },
    ],
  },
  {
    slug: "25",
    date: "2026-08-25",
    monthLabel: "8월",
    dayNum: "25",
    weekday: "화",
    title: "세미고비 2일차",
    axis: "엘승타사르하이 → 울란바토르",
    stops: [
      {
        time: "아침",
        name: "세미고비 투어 게르",
        kind: "lodging",
        role: "wake",
        area: "엘승타사르하이",
        action: "체크아웃",
        stayId: "gobi-ger",
      },
      {
        time: "오전",
        name: "투어 조식",
        kind: "restaurant",
        area: "세미고비 캠프",
        action: "식사",
      },
      {
        time: "낮",
        name: "울란바토르로 복귀",
        kind: "transit",
        area: "투어 차량 · 4–5시간",
        action: "이동",
      },
      {
        time: "저녁",
        name: "울란바토르 에어비앤비",
        kind: "lodging",
        role: "sleep",
        area: "울란바토르 시내",
        action: "체크인",
        stayId: "ub-airbnb",
      },
    ],
  },
  {
    slug: "26",
    date: "2026-08-26",
    monthLabel: "8월",
    dayNum: "26",
    weekday: "수",
    title: "테를지",
    axis: "울란바토르 → 고르히-테를지",
    stops: [
      {
        time: "아침",
        name: "울란바토르 에어비앤비",
        kind: "lodging",
        role: "wake",
        area: "울란바토르 시내",
        action: "체크아웃",
        stayId: "ub-airbnb",
      },
      {
        time: "낮",
        name: "테를지로 이동",
        kind: "transit",
        area: "버스 또는 택시 · 약 2시간",
        action: "이동",
        detail: "버스는 하루 3회.",
      },
      {
        time: "오후",
        name: "거북바위",
        kind: "attraction",
        area: "고르히-테를지",
        action: "관광",
      },
      {
        time: "15:00–18:00",
        name: "Camping Turtle Rock",
        kind: "lodging",
        role: "sleep",
        area: "테를지 · 게르",
        action: "체크인",
        href: "https://www.booking.com/hotel/mn/camping-turtle-rock.ko.html",
        stayId: "turtle-rock",
      },
    ],
  },
  {
    slug: "27",
    date: "2026-08-27",
    monthLabel: "8월",
    dayNum: "27",
    weekday: "목",
    title: "기마상, 공항으로",
    axis: "테를지 → 울란바토르 공항",
    stops: [
      {
        time: "아침",
        name: "Camping Turtle Rock",
        kind: "lodging",
        role: "wake",
        area: "테를지 · 게르",
        action: "체크아웃",
        stayId: "turtle-rock",
      },
      {
        time: "아침",
        name: "게르 조식",
        kind: "restaurant",
        area: "Turtle Rock",
        action: "식사",
      },
      {
        time: "낮",
        name: "칭기스칸 기마상",
        kind: "attraction",
        area: "테를지–울란바토르 길목",
        action: "관광",
      },
      {
        time: "밤",
        name: "칭기스칸 국제공항 · 기내",
        kind: "airport",
        role: "sleep",
        area: "UBN → PUS",
        action: "기내 숙박",
        detail: "새벽 출발. 부산 06:50 도착.",
        stayId: "inflight",
      },
    ],
  },
  {
    slug: "28",
    date: "2026-08-28",
    monthLabel: "8월",
    dayNum: "28",
    weekday: "금",
    title: "부산 도착",
    axis: "UBN → PUS",
    stops: [
      {
        time: "새벽",
        name: "울란바토르 → 부산",
        kind: "flight",
        area: "제주항공",
        action: "기내",
        stayId: "inflight",
      },
      {
        time: "06:50",
        name: "김해국제공항",
        kind: "airport",
        role: "arrive",
        area: "부산 · PUS",
        action: "도착",
      },
    ],
  },
];

export function dayIndex(slug: string) {
  const i = days.findIndex((day) => day.slug === slug);
  return i < 0 ? 0 : i;
}

export function sharedStay(from: DayPlan, to: DayPlan) {
  const fromI = dayIndex(from.slug);
  const toI = dayIndex(to.slug);
  if (toI > fromI) {
    const stayId = from.stops.at(-1)?.stayId;
    if (stayId && stayId === to.stops[0]?.stayId) return stayId;
  }
  if (toI < fromI) {
    const stayId = from.stops[0]?.stayId;
    if (stayId && stayId === to.stops.at(-1)?.stayId) return stayId;
  }
  return null;
}

export function dayBySlug(slug: string) {
  return days.find((day) => day.slug === slug) ?? days[0];
}

export function defaultSlug(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });
  const today = formatter.format(now);
  const match = days.find((day) => day.date === today);
  return match?.slug ?? days[0].slug;
}
