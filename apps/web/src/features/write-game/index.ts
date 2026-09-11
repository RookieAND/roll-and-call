// 구인 글을 쓴다(등록·수정). 두 액션은 같은 검증 스키마를 공유하므로 한 슬라이스다.
export { createGame } from "./api/create-game";
export { updateGame } from "./api/update-game";
export { gameFormSchema, GAME_RANGE_MAX_DAYS, type GameFormValues } from "./model/game-form";
