import { KICK_BLOCK, kickBlockCode } from "@roll-and-call/database/moderation/model";

const KICK_BLOCK_MESSAGE = {
  [KICK_BLOCK.serverOwner]: "서버 소유자는 추방할 수 없습니다",
  [KICK_BLOCK.staff]: "운영진은 추방할 수 없습니다",
} as const;

// 추방 카드를 막는 이유. 막지 않으면 null이다. 서버 액션도 같은 규칙(kickBlockCode)으로 막는다.
export function kickBlockReason(args: Parameters<typeof kickBlockCode>[0]) {
  const code = kickBlockCode(args);
  return code ? KICK_BLOCK_MESSAGE[code] : null;
}
