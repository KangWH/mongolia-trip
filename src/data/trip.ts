export type SlotStatus = "confirmed" | "tour" | "transit" | "note";

export type TimeSlot = {
  time?: string;
  title: string;
  detail?: string;
  status: SlotStatus;
};

export type DayPlan = {
  id: string;
  date: string;
  weekday: string;
  label: string;
  place: string;
  stay: string;
  accent: "sky" | "sand" | "grass" | "night";
  summary: string;
  slots: TimeSlot[];
};

export const trip = {
  title: "몽골",
  englishTitle: "Mongolia",
  period: "2026.08.23 – 08.28",
  startAt: "2026-08-23T07:30:00+09:00",
  members: ["박정호", "강우현", "권도형"],
  route: "인천 → 울란바토르 → 부산",
  compiledFrom: "카카오톡 채팅 정리 · 2026.08.19 기준",
};

export const flights = [
  {
    id: "outbound",
    label: "가는 편",
    date: "8/23 일",
    from: { code: "ICN", name: "인천" },
    to: { code: "UBN", name: "울란바토르" },
    depart: "10:00",
    arriveHint: "약 3시간 30분 · 시차 −1시간",
    notes: [
      "공항 07:30까지 도착 목표",
      "제주항공 · 보잉 737 MAX (충전 포트)",
      "기내 수하물 10kg 기본",
      "위탁 15kg은 박정호만 — 위탁 필요한 짐은 합치기",
    ],
  },
  {
    id: "inbound",
    label: "오는 편",
    date: "8/28 금",
    from: { code: "UBN", name: "울란바토르" },
    to: { code: "PUS", name: "부산" },
    depart: "새벽 출발",
    arriveHint: "부산 도착 06:50 (기존 06:15에서 +35분)",
    notes: [
      "밤·새벽 비행 — 27일 밤 울란바토르/공항 동선 필요",
      "부산역보다 사상역·구포역이 가깝다",
      "무궁화호 등 기차로 이동",
    ],
  },
];

export const stays = [
  {
    nights: "8/23 – 8/24",
    place: "울란바토르",
    type: "에어비앤비",
    note: "수건·세면도구 있음. 23–24 예약 완료.",
  },
  {
    nights: "8/24 – 8/25",
    place: "세미고비",
    type: "투어 게르",
    note: "2일 투어 상품에 포함된 숙박. 8/21 결제 예정으로 잡아 둠.",
  },
  {
    nights: "8/25 – 8/26",
    place: "울란바토르",
    type: "에어비앤비",
    note: "25–26 같은 숙소로 예약.",
  },
  {
    nights: "8/26 – 8/27",
    place: "테를지 · 거북바위",
    type: "럭셔리 게르",
    note: "Camping Turtle Rock. 체크인 15:00–18:00, 3인 약 9만 원, 금연. 조식은 현장에서 약 1만 원 추가 가능. 예약만 걸어 둔 상태(무료 취소).",
    href: "https://www.booking.com/hotel/mn/camping-turtle-rock.ko.html",
  },
  {
    nights: "8/27 – 8/28",
    place: "울란바토르 / 공항",
    type: "미정",
    note: "채팅 요약에는 숙소가 없음. 기마상 이후 시내를 거쳐 새벽 비행에 맞추는 동선.",
  },
];

export const days: DayPlan[] = [
  {
    id: "prep",
    date: "08.21 – 22",
    weekday: "금–토",
    label: "출발 전",
    place: "한국",
    stay: "—",
    accent: "night",
    summary: "투어 결제와 인천 쪽 일정을 마무리하는 날.",
    slots: [
      {
        time: "8/21",
        title: "세미고비 2일 투어 결제",
        detail: "미니고비 투어 2일짜리를 8/21 결제하는 걸로 예약해 둔 상태.",
        status: "confirmed",
      },
      {
        time: "8/22",
        title: "인천 일정은 유동",
        detail:
          "출발 전날 인천을 붙이려면 다음날 07:30 공항이 빠듯하다. 지민이 합류·토요일 오전 병원 이슈가 있어 확정은 아님.",
        status: "note",
      },
    ],
  },
  {
    id: "d1",
    date: "08.23",
    weekday: "일",
    label: "도착 · 울란바토르",
    place: "인천 → 울란바토르",
    stay: "울란바토르 에어비앤비",
    accent: "sky",
    summary: "오전 비행으로 들어가 시내에서 첫날을 보낸다.",
    slots: [
      {
        time: "07:30",
        title: "인천공항 도착",
        detail: "10시 출발이라 이 시각까지는 공항에 있어야 한다.",
        status: "confirmed",
      },
      {
        time: "10:00",
        title: "인천 출발",
        detail: "제주항공, 약 3시간 30분. 몽골은 한국보다 1시간 느리다.",
        status: "confirmed",
      },
      {
        title: "공항에서 환전",
        detail: "달러를 가져가서, 도착 후 공항에서 투그릭으로 바꾼다.",
        status: "confirmed",
      },
      {
        title: "울란바토르 체크인",
        detail: "에어비앤비 23–24. 시내 저녁·짐 정리.",
        status: "confirmed",
      },
    ],
  },
  {
    id: "d2",
    date: "08.24",
    weekday: "월",
    label: "세미고비 투어 1일차",
    place: "엘승타사르하이",
    stay: "투어 게르",
    accent: "sand",
    summary: "수도에서 서쪽으로 빠져 미니사막에서 하룻밤.",
    slots: [
      {
        title: "세미고비 2일 투어 출발",
        detail:
          "채팅에서 확정한 구간은 24–25 투어 숙박. 보통은 울란바토르에서 차로 4–5시간, 엘승타사르하이(미니사막)로 간다.",
        status: "tour",
      },
      {
        title: "사막 · 게르",
        detail:
          "낙타·사구·일몰은 상품에 따라 선택. 정확한 픽업 시각과 코스는 예약한 투어 일정표를 따른다.",
        status: "tour",
      },
    ],
  },
  {
    id: "d3",
    date: "08.25",
    weekday: "화",
    label: "세미고비 투어 2일차",
    place: "세미고비 → 울란바토르",
    stay: "울란바토르 에어비앤비",
    accent: "sand",
    summary: "투어를 마치고 다시 수도로 돌아온다.",
    slots: [
      {
        title: "투어 종료 · 울란바토르 복귀",
        detail: "24–25가 투어, 25–26이 다시 울란바토르 숙소.",
        status: "tour",
      },
      {
        title: "시내 숙소 체크인",
        detail: "에어비앤비 25–26. 다음 날 테를지 이동을 위한 짐 재정리.",
        status: "confirmed",
      },
    ],
  },
  {
    id: "d4",
    date: "08.26",
    weekday: "수",
    label: "테를지 · 게르",
    place: "고르히-테를지",
    stay: "거북바위 럭셔리 게르",
    accent: "grass",
    summary: "국립공원으로 넘어가 거북바위 옆에서 잔다.",
    slots: [
      {
        title: "테를지 이동",
        detail:
          "울란바토르에서 버스로 하루 3회. 택시로 거점 지역을 도는 자유여행. 당일치기는 볼륨이 아쉬워 1박으로 잡음.",
        status: "transit",
      },
      {
        time: "15:00–18:00",
        title: "게르 체크인",
        detail:
          "Camping Turtle Rock, 거북바위 바로 옆. 3인 약 9만 원. 금연. 조식은 가서 먹을 가능성이 큼.",
        status: "confirmed",
      },
      {
        title: "공원 안 이동",
        detail: "게르가 있는 권역 위주로 본다. 숙소만 잡고 이동이 안 되면 의미가 없어서, 현지 이동 여건을 보고 움직인다.",
        status: "note",
      },
    ],
  },
  {
    id: "d5",
    date: "08.27",
    weekday: "목",
    label: "기마상 · 복귀 준비",
    place: "테를지 → 울란바토르",
    stay: "시내 또는 공항 동선",
    accent: "grass",
    summary: "테를지를 나와 칭기스칸 기마상을 찍고 새벽 비행에 붙인다.",
    slots: [
      {
        title: "게르 체크아웃",
        detail: "26–27 테를지 게르. 이후 숙소는 채팅에 없음.",
        status: "confirmed",
      },
      {
        title: "칭기스칸 기마상",
        detail: "택시 왕복만 잘 맞으면 된다. 테를지–울란바토르 길 위에 있다.",
        status: "confirmed",
      },
      {
        title: "새벽 부산행 대비",
        detail:
          "오는 편은 밤비행. 부산 06:50 도착이면 울란바토르에서는 새벽 출발. 동선이 빡세다.",
        status: "transit",
      },
    ],
  },
  {
    id: "d6",
    date: "08.28",
    weekday: "금",
    label: "부산 도착",
    place: "울란바토르 → 부산",
    stay: "한국",
    accent: "sky",
    summary: "새벽에 내려 기차로 빠져 나온다.",
    slots: [
      {
        time: "06:50",
        title: "부산 도착",
        detail: "지연 공지 반영. 처음 안내 06:15에서 +35분.",
        status: "confirmed",
      },
      {
        title: "사상역 또는 구포역",
        detail: "부산역보다 공항에서 가깝다. 무궁화호 기준으로 이야기됨.",
        status: "confirmed",
      },
      {
        title: "인천은 돌아오는 날 검토",
        detail: "채팅 후반에 ‘돌아오는 날 인천을 찍기로’라는 이야기가 나왔다. 기차 시간에 따라 유동.",
        status: "note",
      },
    ],
  },
];

export const tips = [
  {
    title: "환전",
    body: "공항에서 달러를 투그릭으로 바꾼다. 한국에서 달러 준비.",
  },
  {
    title: "짐",
    body: "기내 10kg는 전원. 위탁 15kg는 박정호만 있다. 위탁이 필요한 물건은 미리 모은다. 울란바토르 숙소에는 수건·세면도구가 있다.",
  },
  {
    title: "날씨",
    body: "8월인데 기온이 생각보다 낮다. 겉옷과 겹쳐 입을 옷을 넣는다.",
  },
  {
    title: "이동",
    body: "테를지 버스는 하루 3회. 거점 사이는 택시. 세미고비는 투어 차량.",
  },
  {
    title: "개강",
    body: "8/31 개강. 월요일 귀국은 일찌감치 제외하고 23–28로 확정했다.",
  },
];

export const navItems = [
  { id: "overview", label: "개요" },
  { id: "flights", label: "항공" },
  { id: "days", label: "일정" },
  { id: "stays", label: "숙소" },
  { id: "tips", label: "메모" },
];
