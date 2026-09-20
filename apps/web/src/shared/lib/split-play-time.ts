// "3시간 30분" → { hours: 3, minutes: 30 }
export function splitPlayTime(playTime?: string | null) {
  return {
    hours: Number(playTime?.match(/(\d+)\s*시간/)?.[1] ?? 0),
    minutes: Number(playTime?.match(/(\d+)\s*분/)?.[1] ?? 0),
  };
}
