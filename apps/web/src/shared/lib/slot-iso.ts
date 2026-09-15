import { padTwoDigits } from "./pad-two-digits";

// KST 벽시계 칸 → UTC ISO. 서버 타임존과 무관하게 읽기·쓰기가 같은 키를 쓴다.
export function slotIso(date: string, hour: number, minute: number): string {
  return new Date(`${date}T${padTwoDigits(hour)}:${padTwoDigits(minute)}:00+09:00`).toISOString();
}
