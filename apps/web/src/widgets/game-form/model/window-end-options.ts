import { padTwoDigits } from "@/shared/lib";

// 시작 + 1시간부터 시작 + 23시간까지. 값은 0~23으로 저장하고, 자정은 24:00, 넘긴 시각은 (+1)을 붙인다.
export function windowEndOptions(startHour: number): { value: string; label: string }[] {
  return Array.from({ length: 23 }, (_, index) => {
    const hour = startHour + index + 1;
    if (hour <= 24) return { value: String(hour % 24), label: `${padTwoDigits(hour)}:00` };
    return { value: String(hour - 24), label: `${padTwoDigits(hour - 24)}:00(+1)` };
  });
}
