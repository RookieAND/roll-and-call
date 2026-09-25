import type { RulebookKind } from "@roll-and-call/database";

export const RULEBOOK_KIND_DESCRIPTION = {
  core: "GM에 필요한 책입니다. 같은 카테고리·판본의 기본 룰북을 모두 인증해야 GM이 될 수 있습니다.",
  supplement:
    "기본 룰북에 더하는 책입니다. 같은 카테고리·판본의 기본 룰북을 인증한 사람만 인증을 신청할 수 있습니다.",
  handbook: "플레이어용 책입니다. 인증은 받을 수 있지만 GM 자격은 생기지 않습니다.",
} as const satisfies Record<RulebookKind, string>;
