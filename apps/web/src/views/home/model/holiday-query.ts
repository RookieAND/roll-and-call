import { getHolidayPreset } from "@hyunbinseo/holidays-kr";
import { queryOptions } from "@tanstack/react-query";

type Holidays = Readonly<Record<string, readonly string[]>>;

// ponytail: 데이터가 없는 연도(2018 이전·2028 이후)는 RangeError라 공휴일 없이 그린다. 패키지를 올리면 해가 늘어난다.
export function holidayQuery(year: number) {
  return queryOptions({
    queryKey: ["holidays", year] as const,
    queryFn: (): Promise<Holidays> => getHolidayPreset(String(year)).catch(() => ({})),
    staleTime: Infinity,
  });
}
