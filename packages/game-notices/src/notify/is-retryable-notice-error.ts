import { DiscordApiError } from "@roll-and-call/discord";

// 보낸 권리를 돌려줘 다시 보내도 되는 실패인가.
// 디스코드가 거절한 4xx(스레드 삭제·권한 없음)는 다시 보내도 실패하고, 시간 초과는 이미 올라갔을 수 있어 돌려주지 않는다.
export function isRetryableNoticeError(error: unknown) {
  if (error instanceof DiscordApiError) return error.status >= 500 || error.status === 429;
  return !(error instanceof Error && error.name === "TimeoutError");
}
