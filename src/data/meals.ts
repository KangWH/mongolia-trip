export type MealSlot = "breakfast" | "lunch" | "dinner" | "street";

export type MealPlace = {
  id: string;
  name: string;
  area: string;
  note: string;
  lat: number;
  lng: number;
  maps: string;
  confirmed?: boolean;
};

export type DayMeals = {
  breakfast: MealPlace[];
  lunch: MealPlace[];
  dinner: MealPlace[];
  street?: MealPlace[];
  after: Partial<Record<MealSlot, number>>;
};

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function place(
  id: string,
  name: string,
  area: string,
  note: string,
  lat: number,
  lng: number,
  query = name,
  confirmed = false,
): MealPlace {
  return {
    id,
    name,
    area,
    note,
    lat,
    lng,
    maps: mapsSearch(query),
    confirmed,
  };
}

const icn = { lat: 37.4602, lng: 126.4407 };
const ubn = { lat: 47.6469, lng: 106.8198 };
const elsen = { lat: 47.3313, lng: 103.6895 };
const khustain = { lat: 47.6958, lng: 105.8731 };
const turtle = { lat: 47.9085, lng: 107.4238 };
const campTurtle = { lat: 47.9058, lng: 107.4262 };
const tereljLodge = { lat: 47.904, lng: 107.418 };
const tereljStar = { lat: 47.912, lng: 107.432 };
const statue = { lat: 47.808, lng: 107.5366 };

const millies = place(
  "millies",
  "Millie's Cafe",
  "초이진 사원 옆",
  "20년 된 시내 카페. 조식 콤보·디저트.",
  47.91431,
  106.91789,
  "Millie's Cafe Choijin Ulaanbaatar",
);
const modernMuseum = place(
  "modern-museum",
  "Modern Nomads 칭기스칸 박물관",
  "바가토이루 · 시내",
  "보즈·초이완 등 전통 요리를 관광객이 시키기 쉬운 체인.",
  47.9206,
  106.9188,
  "Modern Nomads Chinggis Khaan Museum Ulaanbaatar",
);
const modernMetro = place(
  "modern-metro",
  "Modern Nomads 메트로몰",
  "바가토이루 · 메트로몰 앞",
  "시내 서쪽에 가깝다. 점심·저녁 모두 무난.",
  47.9178,
  106.9118,
  "Modern Nomads Metro Mall Ulaanbaatar",
);
const veranda = place(
  "veranda",
  "Veranda",
  "자먄 거리 · 초이진 사원",
  "피자·파스타. 주말 저녁은 예약.",
  47.91519,
  106.91743,
  "Veranda Restaurant Choijin Ulaanbaatar",
);
const choijinRest = place(
  "choijin-rest",
  "Choijin Temple Restaurant",
  "초이진 라마 사원 뒤",
  "리조토·샐러드. 사원 관람 직후 점심·저녁.",
  47.9147,
  106.9185,
  "Choijin Temple Restaurant Ulaanbaatar",
);
const bullBluemon = place(
  "bull-bluemon",
  "The Bull 블루몬",
  "잠부 거리 · 블루몬 센터",
  "샤브샤브. 한국 여행객이 많이 간다.",
  47.9184,
  106.9112,
  "The Bull Hotpot Bluemon Ulaanbaatar",
);
const bds = place(
  "bds",
  "BD's Mongolian Barbeque",
  "메트로몰 앞",
  "재료를 골라 볶는 그릴. 셋이서 저녁으로 무난.",
  47.9179,
  106.9115,
  "BD's Mongolian Barbeque Metro Mall Ulaanbaatar",
);
const grandKhaan = place(
  "grand-khaan",
  "Grand Khaan Irish Pub",
  "수흐바타르 광장 근처",
  "펍 메뉴·맥주. 도착 첫날 가볍게.",
  47.9174,
  106.9168,
  "Grand Khaan Irish Pub Ulaanbaatar",
);
const sakura = place(
  "sakura",
  "Sakura",
  "국립백화점 근처",
  "가츠·우동. 점심 줄이 길다.",
  47.9169,
  106.9064,
  "Sakura restaurant State Department Store Ulaanbaatar",
);
const sds = place(
  "sds-cafe",
  "국립백화점 푸드코트",
  "칭겔테이 · 평화대로",
  "한식·분식·커피를 빨리 해결.",
  47.91703,
  106.90625,
  "State Department Store Ulaanbaatar",
);
const namaste = place(
  "namaste",
  "Namaste 플라워 호텔",
  "평화대로",
  "인도 커리. 육식에 질렸을 때.",
  47.9162,
  106.9268,
  "Namaste Restaurant Flower Hotel Ulaanbaatar",
);
const mongolians = place(
  "mongolians",
  "Mongolians",
  "샹그릴라몰 꼭대기",
  "전통 요리를 조금 더 차려서. 테라스.",
  47.9134,
  106.9206,
  "Mongolians restaurant Shangri-La Mall Ulaanbaatar",
);
const macu = place(
  "macu",
  "MACU Fromagerie",
  "시내",
  "몽골 치즈 플레이트·브런치.",
  47.9158,
  106.9125,
  "MACU Fromagerie Ulaanbaatar",
);
const greenZone = place(
  "green-zone",
  "The Green Zone",
  "배낭객 거리",
  "후무스·피자. 고기 없는 점심.",
  47.9164,
  106.9058,
  "The Green Zone restaurant Ulaanbaatar",
);
const lovingHut = place(
  "loving-hut",
  "Loving Hut",
  "자나바자르 미술관 근처",
  "비건 보즈·호쇼르.",
  47.9202,
  106.9116,
  "Loving Hut Zanabazar Ulaanbaatar",
);
const ketomo = place(
  "ketomo",
  "Ketomo",
  "시내",
  "바삭한 호쇼르로 유명.",
  47.9172,
  106.9134,
  "Ketomo restaurant Ulaanbaatar",
);
const sura = place(
  "sura",
  "Sura 한식당",
  "블루몬 센터",
  "비빔밥·찌개. 입이 맞을 때.",
  47.9183,
  106.911,
  "Sura Korean Restaurant Bluemon Ulaanbaatar",
);
const rosewood = place(
  "rosewood",
  "Rosewood Kitchen",
  "서울 거리",
  "스테이크·와인. 마지막 시내 저녁.",
  47.9148,
  106.9085,
  "Rosewood Kitchen Seoul Street Ulaanbaatar",
);

const narantuul = place(
  "narantuul",
  "나란툴 시장 포장마차",
  "바얀주르흐 · 블랙마켓",
  "호쇼르·보즈·아롤. 화요일 휴장, 대략 09–18시. 소매치기 주의.",
  47.90919,
  106.94806,
  "Narantuul Market Ulaanbaatar",
);
const peaceKhuushuur = place(
  "peace-khuushuur",
  "평화대로 호쇼르",
  "시내 포장 가게",
  "기름진 튀김 만두. 이동 전 한두 개.",
  47.9172,
  106.91,
  "khuushuur Peace Avenue Ulaanbaatar",
);
const dairyStall = place(
  "dairy",
  "시장 유제품 코너",
  "나란툴 · 식료품 구역",
  "아롤(건조 치즈), 아이락, 보르츠(육포).",
  47.9093,
  106.9478,
  "Narantuul Market food stalls Ulaanbaatar",
);
const nightKiosk = place(
  "kiosk",
  "시내 편의점·키오스크",
  "수흐바타르 일대",
  "늦은 도착이면 빵·요구르트·육포로 때운다.",
  47.9188,
  106.9176,
  "Sukhbaatar Square Ulaanbaatar",
);

const ubBreakfast = [
  millies,
  modernMuseum,
  sds,
  macu,
  sakura,
  lovingHut,
];

const ubLunch = [
  modernMuseum,
  sakura,
  choijinRest,
  greenZone,
  namaste,
  ketomo,
  mongolians,
];

const ubDinner = [
  veranda,
  bullBluemon,
  bds,
  modernMetro,
  grandKhaan,
  rosewood,
  sura,
];

const ubStreet = [narantuul, peaceKhuushuur, dairyStall, ketomo, sds];

const campDinner = place(
  "gobi-dinner",
  "세미고비 투어 식사",
  "엘승타사르하이 캠프",
  "일정에 있는 저녁. 초이완·고기 스튜가 흔하다.",
  elsen.lat,
  elsen.lng,
  "Elsen Tasarkhai ger camp",
  true,
);
const campBreakfast = place(
  "gobi-breakfast",
  "세미고비 투어 조식",
  "엘승타사르하이 캠프",
  "일정에 있는 아침. 보르촉·잼·수테이차이.",
  elsen.lat,
  elsen.lng,
  "Elsen Tasarkhai ger camp",
  true,
);
const turtleBreakfast = place(
  "turtle-breakfast",
  "게르 조식",
  "Camping Turtle Rock",
  "일정에 있는 아침. 캠프에서 먹는다.",
  campTurtle.lat,
  campTurtle.lng,
  "Camping Turtle Rock Terelj",
  true,
);

export const slotLabel: Record<MealSlot, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  street: "길거리 · 시장",
};

export const mealsBySlug: Record<string, DayMeals> = {
  "23": {
    after: { breakfast: 0, lunch: 1, dinner: 2, street: 2 },
    breakfast: [
      place(
        "icn-korean",
        "인천공항 한식당",
        "ICN 푸드코트",
        "07:30 수속 전후. 칼국수·비빔밥.",
        icn.lat,
        icn.lng,
        "인천국제공항 식당",
      ),
      place(
        "icn-burger",
        "인천공항 버거·패스트푸드",
        "ICN",
        "빠르게 끝낼 때.",
        icn.lat,
        icn.lng,
        "인천국제공항 쉐이크쉑",
      ),
      place(
        "icn-cafe",
        "인천공항 카페 조식",
        "ICN",
        "커피와 빵. 줄이 짧다.",
        icn.lat,
        icn.lng,
        "인천국제공항 스타벅스",
      ),
      place(
        "icn-samgye",
        "인천공항 국밥·삼계탕",
        "ICN",
        "비행 전 따뜻한 한 그릇.",
        icn.lat,
        icn.lng,
        "인천국제공항 토속촌",
      ),
      place(
        "icn-cvs",
        "공항 편의점",
        "ICN",
        "김밥·과일. 시간이 없을 때.",
        icn.lat,
        icn.lng,
        "인천국제공항 편의점",
      ),
    ],
    lunch: [
      place(
        "7c-meal",
        "제주항공 기내식",
        "인천 → 울란바토르",
        "약 3시간 30분 구간. 메인 점심.",
        icn.lat,
        icn.lng,
        "제주항공 기내식",
      ),
      place(
        "icn-last",
        "탑승 전 푸드코트",
        "ICN 탑승구",
        "기내식이 약하면 여기서 먼저.",
        icn.lat,
        icn.lng,
        "인천국제공항 푸드코트",
      ),
      place(
        "7c-snack",
        "기내 유료 스낵",
        "기내",
        "기내식이 부족할 때.",
        icn.lat,
        icn.lng,
        "제주항공",
      ),
      place(
        "ubn-bene",
        "UBN Caffe Bene",
        "칭기스칸 공항",
        "도착이 늦어 시내 식사가 애매할 때.",
        ubn.lat,
        ubn.lng,
        "Caffe Bene Chinggis Khaan Airport",
      ),
      place(
        "ubn-land",
        "Land & Air",
        "칭기스칸 공항",
        "보즈·호쇼르를 공항에서. 가격은 시내보다 높다.",
        ubn.lat,
        ubn.lng,
        "Land and Air Restaurant UBN",
      ),
    ],
    dinner: ubDinner,
    street: [nightKiosk, peaceKhuushuur, sds],
  },
  "24": {
    after: { breakfast: 0, street: 0, lunch: 1, dinner: 3 },
    breakfast: ubBreakfast,
    lunch: [
      place(
        "tour-lunch",
        "투어 캠프 점심",
        "세미고비 가는 길 · 캠프",
        "포함되어 있으면 그걸 먹는다. 기사에게 확인.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai tourist camp",
      ),
      place(
        "nomad-lunch",
        "유목민 가정 점심",
        "엘승타사르하이 인근",
        "수테이차이와 수제 면·고기. 투어에 넣어 달라고 요청.",
        elsen.lat,
        elsen.lng + 0.02,
        "nomad family Elsen Tasarkhai",
      ),
      place(
        "khustain-cafe",
        "후스틴 누루 방문자 식당",
        "울란바토르 → 세미고비 길목",
        "타키 보호구역 들를 때. 간단한 식사.",
        khustain.lat,
        khustain.lng,
        "Khustain Nuruu visitor center restaurant",
      ),
      place(
        "elsen-ger",
        "엘승타사르하이 게르 식당",
        "미니사막 캠프",
        "모래언덕 도착 후 초이완.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai ger restaurant",
      ),
      place(
        "road-khuushuur",
        "도로변 호쇼르",
        "서쪽 국도",
        "휴게 포장. 위생은 손 많은 집을 고른다.",
        47.55,
        105.2,
        "khuushuur Ulaanbaatar Kharkhorin road",
      ),
      place(
        "ub-packed",
        "시내에서 사 간 도시락",
        "국립백화점 · 카페",
        "출발 전 샌드위치·과일. 차 안에서.",
        47.91703,
        106.90625,
        "State Department Store Ulaanbaatar",
      ),
    ],
    dinner: [
      campDinner,
      place(
        "camp-ala",
        "캠프 게르 식당",
        "엘승타사르하이",
        "투어 식사가 약하면 캠프 알라카르트.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai camp restaurant",
      ),
      place(
        "khorkhog",
        "유목민 호르헉",
        "캠프 인근",
        "돌구이 양고기. 미리 부탁해야 한다.",
        elsen.lat,
        elsen.lng + 0.015,
        "khorkhog Elsen Tasarkhai",
      ),
      place(
        "neighbor-camp",
        "옆 관광 캠프 식당",
        "미니사막",
        "우리 캠프 주방이 쉬면 걸어가 본다.",
        47.328,
        103.695,
        "ger camp restaurant Elsen Tasarkhai",
      ),
      place(
        "camp-tea",
        "수테이차이와 간식",
        "게르",
        "정식이 부담스러우면 밀크티·보르촉.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai ger",
      ),
    ],
    street: [peaceKhuushuur, sds],
  },
  "25": {
    after: { breakfast: 0, lunch: 2, dinner: 2, street: 2 },
    breakfast: [
      campBreakfast,
      place(
        "camp-b2",
        "캠프 계란·빵 조식",
        "세미고비 캠프",
        "투어 조식 외에 빵이 나오면 챙겨 탄다.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai ger camp breakfast",
      ),
      place(
        "boortsog",
        "보르촉과 잼",
        "게르",
        "튀김 빵. 차 안 간식으로도 남긴다.",
        elsen.lat,
        elsen.lng,
        "boortsog Mongolia",
      ),
      place(
        "suutei",
        "수테이차이만",
        "게르",
        "소금 밀크티. 속이 더부룩할 때.",
        elsen.lat,
        elsen.lng,
        "suutei tsai",
      ),
      place(
        "leftover",
        "전날 저녁 남은 고기",
        "캠프",
        "기사·주방과 상의해 싸 온다.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai",
      ),
    ],
    lunch: [
      place(
        "return-camp",
        "출발 전 캠프 점심",
        "엘승타사르하이",
        "오전에 먹고 출발하면 시내 저녁이 편하다.",
        elsen.lat,
        elsen.lng,
        "Elsen Tasarkhai camp lunch",
      ),
      place(
        "return-nomad",
        "유목민 집 점심",
        "복귀 길",
        "가는 길에 못 했으면 오늘 요청.",
        elsen.lat,
        elsen.lng + 0.02,
        "nomad family lunch Mongolia",
      ),
      place(
        "khustain-back",
        "후스틴 누루 식당",
        "복귀 길목",
        "타키를 보면 들르기 좋다.",
        khustain.lat,
        khustain.lng,
        "Khustain Nuruu restaurant",
      ),
      place(
        "ub-late-lunch",
        "시내 늦은 점심",
        "울란바토르",
        "4–5시간 뒤 도착. Sakura나 Modern Nomads.",
        47.9206,
        106.9188,
        "Modern Nomads Ulaanbaatar",
      ),
      sakura,
      ketomo,
    ],
    dinner: ubDinner,
    street: ubStreet,
  },
  "26": {
    after: { breakfast: 0, street: 0, lunch: 1, dinner: 2 },
    breakfast: ubBreakfast,
    lunch: [
      millies,
      modernMuseum,
      sakura,
      place(
        "terelj-lodge-lunch",
        "Terelj Lodge Heritage",
        "거북바위 옆 골짜기",
        "도착 직후 점심. 몽골·양식 뷔페/세트.",
        tereljLodge.lat,
        tereljLodge.lng,
        "Terelj Lodge restaurant",
      ),
      place(
        "turtle-camp-lunch",
        "Camping Turtle Rock 식당",
        "숙소",
        "15시 체크인 전이면 전화로 점심 가능 여부 확인.",
        campTurtle.lat,
        campTurtle.lng,
        "Camping Turtle Rock restaurant",
      ),
      place(
        "terelj-star-lunch",
        "Terelj Star Maral",
        "테를지",
        "세트 점심. 12–14시.",
        tereljStar.lat,
        tereljStar.lng,
        "Terelj Star Resort restaurant",
      ),
    ],
    dinner: [
      place(
        "turtle-dinner",
        "Camping Turtle Rock 저녁",
        "숙소 게르",
        "숙소에서 먹는 게 제일 편하다. 미리 인원 말하기.",
        campTurtle.lat,
        campTurtle.lng,
        "Camping Turtle Rock Terelj dinner",
      ),
      place(
        "lodge-dinner",
        "Terelj Lodge 저녁",
        "거북바위 인근",
        "숙소에서 걸어가거나 짧은 차. 전망.",
        tereljLodge.lat,
        tereljLodge.lng,
        "Terelj Lodge Heritage Restaurant",
      ),
      place(
        "star-dinner",
        "Terelj Star 저녁",
        "테를지",
        "호르헉을 시키려면 낮에 예약.",
        tereljStar.lat,
        tereljStar.lng,
        "Terelj Star Resort Maral restaurant",
      ),
      place(
        "terelj-nomad",
        "테를지 유목민 저녁",
        "거북바위 주변 게르",
        "말 타기 집과 식사 묶기.",
        turtle.lat,
        turtle.lng + 0.01,
        "ger camp dinner Turtle Rock Terelj",
      ),
      place(
        "camp-bbq",
        "캠프 야외 바비큐",
        "Turtle Rock",
        "날 좋으면 야외. 모기·추위 대비.",
        campTurtle.lat,
        campTurtle.lng,
        "Camping Turtle Rock",
      ),
    ],
    street: [peaceKhuushuur, narantuul, sds],
  },
  "27": {
    after: { breakfast: 0, lunch: 2, dinner: 2 },
    breakfast: [
      turtleBreakfast,
      place(
        "lodge-bf",
        "Terelj Lodge 조식",
        "인근 리조트",
        "숙소 조식이 약하면 걸어가서 뷔페.",
        tereljLodge.lat,
        tereljLodge.lng,
        "Terelj Lodge breakfast",
      ),
      place(
        "star-bf",
        "Terelj Star 조식",
        "테를지",
        "08–10시 뷔페.",
        tereljStar.lat,
        tereljStar.lng,
        "Terelj Star Resort breakfast",
      ),
      place(
        "camp-bread",
        "캠프 빵과 잼",
        "Turtle Rock",
        "간단 조식. 기마상 전에 든든히.",
        campTurtle.lat,
        campTurtle.lng,
        "Camping Turtle Rock",
      ),
      place(
        "suutei-terelj",
        "수테이차이",
        "게르",
        "이동 전 따뜻한 한 잔.",
        campTurtle.lat,
        campTurtle.lng,
        "Camping Turtle Rock",
      ),
    ],
    lunch: [
      place(
        "statue-cafe",
        "기마상 단지 식당",
        "촌진 볼도그",
        "전시·엘리베이터 본 뒤. 관광객 메뉴.",
        statue.lat,
        statue.lng,
        "Genghis Khan Equestrian Statue restaurant",
      ),
      place(
        "terelj-out-lunch",
        "테를지 나가는 길 캠프",
        "공원 입구 쪽",
        "기마상 전에 배고프면 먼저.",
        47.95,
        107.45,
        "ger camp restaurant Gorkhi Terelj",
      ),
      modernMuseum,
      sakura,
      place(
        "ubn-lunch",
        "공항 가기 전 시내 점심",
        "울란바토르",
        "저녁은 공항이 될 수 있으니 여기서 제대로.",
        47.9206,
        106.9188,
        "Modern Nomads Chinggis Khaan Museum",
      ),
      mongolians,
    ],
    dinner: [
      place(
        "land-air",
        "Land & Air",
        "UBN 공항",
        "보즈·호쇼르. 새벽 출발 전 마지막 제대로 된 식사.",
        ubn.lat,
        ubn.lng,
        "Land and Air Restaurant Chinggis Khaan Airport",
      ),
      place(
        "ubn-bene-d",
        "Caffe Bene UBN",
        "공항 랜드사이드·에어사이드",
        "샌드위치·커피. 24시간대에 가깝다.",
        ubn.lat,
        ubn.lng,
        "Caffe Bene UBN airport",
      ),
      place(
        "tomntoms",
        "Tom n Toms UBN",
        "공항",
        "커피·간단한 식사. 심야에도 열려 있는 편.",
        ubn.lat,
        ubn.lng,
        "Tom n Toms Chinggis Khaan Airport",
      ),
      place(
        "modern-ubn",
        "Modern Nomads 공항",
        "UBN",
        "체인 전통 요리. 공항에 있으면 편하다.",
        ubn.lat,
        ubn.lng,
        "Modern Nomads Chinggis Khaan Airport",
      ),
      place(
        "link-lounge",
        "Link Business Lounge",
        "UBN 2층 체크인 근처",
        "유료 라운지. 간단한 온·냉 식사, 24시간.",
        ubn.lat,
        ubn.lng,
        "Link Business Lounge UBN",
      ),
    ],
  },
};

export function mealSlotsAfter(slug: string, stopIndex: number): MealSlot[] {
  const meals = mealsBySlug[slug];
  if (!meals) return [];
  const order: MealSlot[] = ["breakfast", "lunch", "street", "dinner"];
  return order.filter((slot) => {
    const items = slot === "street" ? meals.street : meals[slot];
    if (!items?.length) return false;
    return meals.after[slot] === stopIndex;
  });
}

export function selectedMealPlaces(
  slug: string,
  picks: Partial<Record<MealSlot, string>>,
): MealPlace[] {
  const meals = mealsBySlug[slug];
  if (!meals) return [];
  const slots: MealSlot[] = ["breakfast", "lunch", "dinner", "street"];
  const found: MealPlace[] = [];
  for (const slot of slots) {
    const id = picks[slot];
    if (!id) continue;
    const list = slot === "street" ? meals.street : meals[slot];
    const match = list?.find((item) => item.id === id);
    if (match) found.push(match);
  }
  return found;
}
