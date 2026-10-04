// 「YYYYMMDDTHHmmssZ」: .ics와 구글 일정 링크가 함께 쓰는 UTC 시각 표기.
export function utcStamp(value: Date) {
  return value
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}
