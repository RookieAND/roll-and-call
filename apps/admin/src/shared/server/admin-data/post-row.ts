import type { PostStatus } from "./post-status";

export type PostStaffAction = "숨김";

export interface PostRow {
  id: string;
  title: string;
  gmNickname: string;
  rulebook: string;
  // 세션 일시가 정해지지 않았으면 null(「미정」).
  sessionAt: Date | null;
  memberCount: number;
  capacity: number;
  status: PostStatus;
  staffAction: PostStaffAction | null;
}
