import { BADGE_ROLE, HIDDEN_LADDER, type BadgeGrade, type HiddenLadderKey } from "./badge-ladder";
import type { BadgeLadderDefinition } from "./badge-ladders";

function hidden({
  emoji,
  name,
  grade,
  description,
}: {
  emoji: string;
  name: string;
  grade: BadgeGrade;
  description: string;
}): BadgeLadderDefinition {
  return {
    role: BADGE_ROLE.special,
    perRule: false,
    monthly: false,
    granted: false,
    description,
    steps: [{ threshold: 1, emoji, name, grade }],
  };
}

// 조건은 기획서(R28)에만 적고 화면에는 내보내지 않는다. 판정은 hiddenEvents가 한다.
export const HIDDEN_BADGE_LADDERS: Record<HiddenLadderKey, BadgeLadderDefinition> = {
  [HIDDEN_LADDER.critical]: hidden({
    emoji: "💥",
    name: "대성공",
    grade: 4,
    description: "주사위가 가장 좋은 눈을 보여 주었습니다.",
  }),
  [HIDDEN_LADDER.extreme]: hidden({
    emoji: "✨",
    name: "극단적 성공",
    grade: 2,
    description: "주사위가 아주 좋은 눈을 보여 주었습니다.",
  }),
  [HIDDEN_LADDER.luckySeven]: hidden({
    emoji: "🍀",
    name: "럭키 세븐",
    grade: 4,
    description: "행운의 숫자가 나왔습니다.",
  }),
  [HIDDEN_LADDER.fumble]: hidden({
    emoji: "💀",
    name: "대실패",
    grade: 4,
    description: "주사위가 가장 나쁜 눈을 보여 주었습니다.",
  }),
  [HIDDEN_LADDER.nearMiss]: hidden({
    emoji: "😢",
    name: "한 끗 차이",
    grade: 2,
    description: "아주 조금 모자랐습니다.",
  }),
  [HIDDEN_LADDER.oneMonth]: hidden({
    emoji: "🍃",
    name: "한 달째",
    grade: 1,
    description: "롤앤콜과 함께한 지 한 달이 되었습니다.",
  }),
  [HIDDEN_LADDER.halfYear]: hidden({
    emoji: "🌿",
    name: "반년째",
    grade: 2,
    description: "롤앤콜과 함께한 지 반년이 되었습니다.",
  }),
  [HIDDEN_LADDER.oneYear]: hidden({
    emoji: "🌳",
    name: "1주년",
    grade: 3,
    description: "롤앤콜과 함께한 지 1년이 되었습니다.",
  }),
  [HIDDEN_LADDER.ambidextrous]: hidden({
    emoji: "🤹",
    name: "양손잡이",
    grade: 2,
    description: "GM과 PL을 오가며 테이블에 앉았습니다.",
  }),
  [HIDDEN_LADDER.doubleHeader]: hidden({
    emoji: "⚡",
    name: "더블 헤더",
    grade: 3,
    description: "하루에 두 번 테이블에 앉았습니다.",
  }),
  [HIDDEN_LADDER.tripleHeader]: hidden({
    emoji: "🌩️",
    name: "트리플 헤더",
    grade: 4,
    description: "하루에 세 번 테이블에 앉았습니다.",
  }),
  [HIDDEN_LADDER.expedition]: hidden({
    emoji: "🗺️",
    name: "대규모 원정",
    grade: 3,
    description: "많은 동료와 함께 모험을 떠났습니다.",
  }),
  [HIDDEN_LADDER.popular]: hidden({
    emoji: "🔥",
    name: "인기 폭발",
    grade: 5,
    description: "많은 사람이 이 테이블에 앉고 싶어 했습니다.",
  }),
  [HIDDEN_LADDER.needle]: hidden({
    emoji: "🎟️",
    name: "바늘구멍",
    grade: 3,
    description: "좁은 문을 뚫고 자리를 얻었습니다.",
  }),
  [HIDDEN_LADDER.marathon]: hidden({
    emoji: "🏃",
    name: "마라톤",
    grade: 3,
    description: "긴 모험을 끝까지 함께했습니다.",
  }),
  [HIDDEN_LADDER.rush]: hidden({
    emoji: "🖱️",
    name: "광클 마감",
    grade: 3,
    description: "모집을 열자마자 자리가 찼습니다.",
  }),
  [HIDDEN_LADDER.hundred]: hidden({
    emoji: "🌼",
    name: "백일",
    grade: 1,
    description: "롤앤콜과 함께한 지 100일이 되었습니다.",
  }),
  [HIDDEN_LADDER.owl]: hidden({
    emoji: "🦉",
    name: "올빼미",
    grade: 1,
    description: "모두가 잠든 시간에 테이블이 열렸습니다.",
  }),
  [HIDDEN_LADDER.pullUp]: hidden({
    emoji: "🧗",
    name: "턱걸이",
    grade: 2,
    description: "마지막 자리를 겨우 붙잡았습니다.",
  }),
  [HIDDEN_LADDER.lightning]: hidden({
    emoji: "🎆",
    name: "번개",
    grade: 2,
    description: "구인이 열리자마자 모험이 시작되었습니다.",
  }),
  [HIDDEN_LADDER.wins3]: hidden({
    emoji: "🎰",
    name: "연승",
    grade: 2,
    description: "행운이 세 번 연달아 찾아왔습니다.",
  }),
  [HIDDEN_LADDER.days3]: hidden({
    emoji: "🏁",
    name: "연속 출전",
    grade: 2,
    description: "사흘 내내 테이블에 앉았습니다.",
  }),
  [HIDDEN_LADDER.allNight]: hidden({
    emoji: "🌄",
    name: "밤샘",
    grade: 3,
    description: "해가 뜰 때까지 모험이 이어졌습니다.",
  }),
  [HIDDEN_LADDER.fullCast]: hidden({
    emoji: "🎞️",
    name: "풀 캐스트",
    grade: 3,
    description: "참석자 모두가 이 모험을 기록으로 남겼습니다.",
  }),
  [HIDDEN_LADDER.weekdays]: hidden({
    emoji: "📅",
    name: "요일 수집가",
    grade: 3,
    description: "일주일의 모든 요일에 테이블에 앉았습니다.",
  }),
  [HIDDEN_LADDER.coin]: hidden({
    emoji: "🪙",
    name: "동전 던지기",
    grade: 3,
    description: "주사위가 딱 반반의 눈을 보여 주었습니다.",
  }),
  [HIDDEN_LADDER.revive]: hidden({
    emoji: "🪂",
    name: "기사회생",
    grade: 4,
    description: "나쁜 눈이 나왔지만 자리를 지켜 냈습니다.",
  }),
  [HIDDEN_LADDER.days7]: hidden({
    emoji: "🚄",
    name: "특급 열차",
    grade: 4,
    description: "일주일 내내 멈추지 않고 달렸습니다.",
  }),
  [HIDDEN_LADDER.wins5]: hidden({
    emoji: "💎",
    name: "연전연승",
    grade: 5,
    description: "행운이 다섯 번 연달아 찾아왔습니다.",
  }),
  [HIDDEN_LADDER.days10]: hidden({
    emoji: "🌋",
    name: "불꽃 행진",
    grade: 5,
    description: "열흘 내내 테이블의 열기가 식지 않았습니다.",
  }),
  [HIDDEN_LADDER.allSizes]: hidden({
    emoji: "🪑",
    name: "두루두루",
    grade: 2,
    description: "어떤 규모의 테이블에도 앉아 보았습니다.",
  }),
  [HIDDEN_LADDER.allTimes]: hidden({
    emoji: "🕰️",
    name: "시간 수집가",
    grade: 3,
    description: "하루의 모든 시간에 테이블이 열렸습니다.",
  }),
  [HIDDEN_LADDER.collectorKing]: hidden({
    emoji: "🗃️",
    name: "수집왕",
    grade: 5,
    description: "모든 구간을 빠짐없이 채웠습니다.",
  }),
  [HIDDEN_LADDER.boxOffice]: hidden({
    emoji: "🎪",
    name: "흥행 보증",
    grade: 5,
    description: "여는 테이블마다 사람이 몰렸습니다.",
  }),
};
