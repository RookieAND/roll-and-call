import type { PostStatus } from "@/shared/lib";

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
  // 공개 범위가 비공개. 운영진 조치(staffAction)인 숨김과는 별개다.
  isPrivate: boolean;
  status: PostStatus;
  staffAction: PostStaffAction | null;
}
