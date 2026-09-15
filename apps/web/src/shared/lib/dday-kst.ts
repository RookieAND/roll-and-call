import { dayjs } from "./dayjs";
import { toKst } from "./to-kst";

// 서버·클라이언트 타임존과 무관하게 KST 날짜 차이로 센다(날짜 경계에서 값이 갈리지 않게).
export function ddayKst(target: Date | string, now: Date = new Date()): number {
  const kstDay = (value: Date | string) => dayjs.utc(toKst(value).format("YYYY-MM-DD"));
  return kstDay(target).diff(kstDay(now), "day");
}
