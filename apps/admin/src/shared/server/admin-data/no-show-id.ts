// 불참 기록은 참가 행(게임·유저) 하나다. uuid에는 _가 없으므로 둘을 _로 잇는다.
export function noShowId(gameId: string, userId: string) {
  return `${gameId}_${userId}`;
}
