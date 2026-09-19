import { formatInterval, type AvailabilityInterval } from "@/entities/profile";

// 같은 요일에서 앞 구간과 겹치는 구간은 담기지 않는다. 뒤 구간만 짚어 고칠 자리를 하나로 둔다.
export function overlappingIntervals(intervals: AvailabilityInterval[]): Map<number, string> {
  const messages = new Map<number, string>();

  intervals.forEach((interval, index) => {
    const earlier = intervals.find(
      (other, otherIndex) =>
        otherIndex < index &&
        other.day === interval.day &&
        other.from < interval.to &&
        interval.from < other.to,
    );
    if (earlier) {
      messages.set(index, `앞 구간 ${formatInterval(earlier)}과 겹칩니다.`);
    }
  });

  return messages;
}
