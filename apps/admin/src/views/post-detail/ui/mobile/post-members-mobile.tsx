import type { PostDetail } from "@/entities/post/server";
import { EMPTY_IMAGE, EmptyState, ListRow, StatusBadges } from "@/shared/ui";

import { memberStatus } from "../../model/member-status";

const EMPTY_COPY = {
  members: {
    title: "확정된 참여자가 없습니다",
    description: "참가 신청이 확정되면 이곳에 표시됩니다.",
  },
  waitlist: {
    title: "대기자가 없습니다",
    description: "정원이 찬 뒤 대기 신청을 하면 이곳에 순서대로 표시됩니다.",
  },
} as const;

interface PostMembersMobileProps {
  members: PostDetail["members"] | PostDetail["waitlist"];
  gmId: string;
  waiting?: boolean;
  // 신청글 받기 구인이면 줄이 신청글 시트를 연다. 아니면 유저 상세로 간다.
  noteHref?: (userId: string) => string;
}

export function PostMembersMobile({ members, gmId, waiting, noteHref }: PostMembersMobileProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.party}
        {...EMPTY_COPY[waiting ? "waitlist" : "members"]}
        className="h-auto"
      />
    );
  }
  return members.map((member) => {
    const note = noteHref && member.hasApplicationNote;
    const status = memberStatus({ member, gmId });
    return (
      <ListRow
        key={member.userId}
        path={note ? noteHref(member.userId) : `/users/${member.userId}`}
        title={member.nickname}
        trailing={<StatusBadges status={status} />}
      />
    );
  });
}
