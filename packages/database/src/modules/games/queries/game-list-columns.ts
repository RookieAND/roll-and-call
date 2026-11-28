// 목록·카드는 본문을 그리지 않는다. 시놉시스·공지가 구인 행의 60%쯤이라 목록 조회에서 빼 DB 전송량을 줄인다.
export const GAME_LIST_COLUMNS = { synopsis: false, notice: false } as const;
