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
    grade: 4,
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
  [HIDDEN_LADDER.rush]: hidden({
    emoji: "🖱️",
    name: "광클 마감",
    grade: 3,
    description: "모집을 열자마자 자리가 찼습니다.",
  }),
};
