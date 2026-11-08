// 조율 기간은 시작일을 포함해 14일까지다. 구인 등록과 같다.
export const SPLIT_TEAMS_RANGE_MAX_DAYS = 14;

export const SPLIT_TEAMS_MESSAGE = {
  capacityMismatch: "정원과 선택한 참여자 수가 같아야 합니다.",
  capacityTooSmall: "정원은 선택한 참여자 수보다 작을 수 없습니다.",
  notWaiting: "대기 명단에 없는 사람이 있습니다. 화면을 새로 고친 뒤 다시 골라 주세요.",
  excluded: "활동이 정지되었거나 서버를 떠난 사람은 새 구인에 참여시킬 수 없습니다.",
  range: "조율 기간은 오늘부터 최대 14일까지 고를 수 있습니다.",
  window: "조율 시간대를 다시 골라 주세요.",
  startsAt: "세션 일시는 지금 이후로 정해야 합니다.",
  deadline: "모집 마감은 지금 이후로 정해야 합니다.",
  minPlayers: "최소 인원은 정원보다 클 수 없습니다.",
  recruit: "모집 방식을 다시 골라 주세요.",
  deadlineLate: "모집 마감은 세션 시작보다 늦을 수 없습니다.",
} as const;
