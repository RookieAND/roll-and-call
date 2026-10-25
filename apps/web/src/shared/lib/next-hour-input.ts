import { toKst } from "@roll-and-call/app-kit/date";

// 지금부터 한 시간 뒤의 정시. 17:30이면 18:00이다. 분까지 맞추는 건 입력하는 사람에게 번거로워 버린다.
export function nextHourInput(now: Date = new Date()): string {
  return toKst(now).add(1, "hour").startOf("hour").format("YYYY-MM-DDTHH:mm");
}
