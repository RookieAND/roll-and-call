// 명단 한 사람의 메뉴가 고를 동작을 정하는 게임·명단 상태.
export interface RosterContext {
  gameId: string;
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  isCoordinate: boolean;
  beforeDraw: boolean;
  // 선발을 마치기 전이다.
  selectionOpen: boolean;
  started: boolean;
  capacityRaised: boolean;
}
