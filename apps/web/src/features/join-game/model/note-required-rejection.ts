export const NOTE_REQUIRED_REASON = "NOTE_REQUIRED";

export const NOTE_REQUIRED_MESSAGE = "이 구인은 신청글이 필요합니다.";

// 신청글 받기 구인에 글 없이 신청이 들어왔을 때. 막힘 검사는 모두 통과한 뒤의 거절이다.
export type NoteRequiredRejection = {
  error: string;
  reason: typeof NOTE_REQUIRED_REASON;
};
