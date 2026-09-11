// 참여자 관리 동작(승격·강등·내보내기)에 필요한 최소 정보. 화면 전용 필드는 위젯이 확장한다.
export type MemberSummary = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  applicationRank: number;
};
