// code는 디스코드 JSON 오류 코드(예: 10004 Unknown Guild, 10007 Unknown Member). 본문이 JSON이 아니면 null.
export class DiscordApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: number | null,
  ) {
    super(message);
  }
}
