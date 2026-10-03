import {
  BADGE_LADDER,
  HIDDEN_LADDER,
  type BadgeLadderKey,
  type HiddenLadderKey,
} from "@roll-and-call/database/badges/model";

type LadderMeta = { title: string; unit: string; verb: string };

const SPECIAL_META: LadderMeta = { title: "특별 칭호", unit: "", verb: "" };

const HIDDEN_META = Object.fromEntries(
  Object.values(HIDDEN_LADDER).map((ladder) => [ladder, SPECIAL_META]),
) as Record<HiddenLadderKey, LadderMeta>;

export const LADDER_META: Record<BadgeLadderKey, LadderMeta> = {
  [BADGE_LADDER.playerTotal]: { title: "누적 참여", unit: "회", verb: "참석" },
  [BADGE_LADDER.playerRule]: { title: "룰별 참여", unit: "회", verb: "참석" },
  [BADGE_LADDER.playerReviews]: { title: "작성한 후기", unit: "개", verb: "작성" },
  [BADGE_LADDER.playerMonthly]: { title: "이달의 PL", unit: "회", verb: "참여" },
  [BADGE_LADDER.gmTotal]: { title: "누적 운영", unit: "회", verb: "진행" },
  [BADGE_LADDER.gmRule]: { title: "룰별 운영", unit: "회", verb: "진행" },
  [BADGE_LADDER.gmVariety]: { title: "다양한 룰 운영", unit: "종", verb: "진행" },
  [BADGE_LADDER.gmReviews]: { title: "받은 후기", unit: "개", verb: "받음" },
  [BADGE_LADDER.gmMonthly]: { title: "이달의 GM", unit: "회", verb: "진행" },
  [BADGE_LADDER.developer]: SPECIAL_META,
  [BADGE_LADDER.guildMaster]: SPECIAL_META,
  ...HIDDEN_META,
};
