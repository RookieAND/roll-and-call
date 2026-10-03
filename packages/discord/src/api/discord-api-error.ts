// code는 디스코드 JSON 오류 코드(예: 10004 Unknown Guild, 10007 Unknown Member). 본문이 JSON이 아니면 null.
// retryAfter는 429 응답이 알려 준 기다릴 초다.
export class DiscordApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: number | null,
    readonly retryAfter: number | null = null,
  ) {
    super(message);
  }
}
