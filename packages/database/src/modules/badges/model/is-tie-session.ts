const TIE_ATTENDED_COUNT = 1;

// 타이만(1:1): 불참이 아닌 확정 참여자(GM 제외)가 정확히 1명인 세션. 정원은 보지 않는다.
// 순위는 점수를 따로 매기고(rankingSessionKind), 업적은 이 세션을 센다(toBadgeSessions)고 뺀다.
export function isTieSession(attendedCount: number): boolean {
  return attendedCount === TIE_ATTENDED_COUNT;
}
