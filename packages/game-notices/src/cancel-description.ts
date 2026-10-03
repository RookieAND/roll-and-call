import type { Game } from "@roll-and-call/database";

// 취소 기록이 없으면 GM이 지운 구인이다.
export function cancelDescription(kind: Game["cancelKind"]): string {
  if (kind === "staff") return "운영진이 취소한 구인입니다.";
  if (kind === "auto") return "GM이 디스코드 서버를 나가 취소된 구인입니다.";
  return "GM이 세션을 취소했어요.\n신청은 모두 사라졌고, 다시 열리면 새 공지로 올라옵니다.";
}
