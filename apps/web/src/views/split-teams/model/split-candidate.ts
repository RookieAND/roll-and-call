// 팀 나누기 시트에서 고를 수 있는 사람. subline은 신청글 첫 줄, 없으면 소개다.
export interface SplitCandidate {
  userId: string;
  username: string;
  subline: string | null;
}
