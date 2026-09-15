import { toKst } from "./to-kst";

// 입력값은 KST 벽시계 기준이다. 서버(Vercel)는 UTC라 new Date("YYYY-MM-DDTHH:mm")로 읽으면 9시간 밀리므로 반드시 이 헬퍼들을 거친다.
export function toKstDateTimeInput(value: Date | string): string {
  return toKst(value).format("YYYY-MM-DDTHH:mm");
}
