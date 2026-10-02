import { dayjs, KST } from "./dayjs";

// new Date를 거쳐 기존 파싱 규칙(날짜만 있는 문자열은 UTC 자정)을 그대로 따른다.
export function toKst(value: Date | string) {
  return dayjs(new Date(value)).tz(KST);
}
