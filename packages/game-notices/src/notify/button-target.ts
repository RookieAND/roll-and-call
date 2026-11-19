// 시작 안내 버튼(custom_id)의 대상. 다회차 회차는 구인 id 뒤에 「.회차 번호」를 붙인다.
// supabase/functions/session-reminders/start-notice.ts가 같은 모양으로 만든다.
const ROUND_SEPARATOR = ".";

export function parseButtonTarget(value: string): { gameId: string; roundNo?: number } {
  const [gameId = "", round] = value.split(ROUND_SEPARATOR);
  const roundNo = Number(round);
  return Number.isInteger(roundNo) && roundNo >= 1 ? { gameId, roundNo } : { gameId };
}
