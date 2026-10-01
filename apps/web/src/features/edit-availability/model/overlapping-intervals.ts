import { formatInterval, type AvailabilityInterval } from "@/entities/profile";

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
