// 그사이 다른 운영진이 먼저 처리한 조치. 누가 언제 했는지 모르면 부르는 쪽이 null로 받는다(D296).
export interface ModerationConflict {
  byId: string;
  by: string;
  at: Date;
}
