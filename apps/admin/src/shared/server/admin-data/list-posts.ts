import "server-only";
import { db } from "./mock-db";
import { POST_STATUS, type PostStatus } from "./post-status";
import { postStatusOf } from "./post-status-of";

export interface PostListFilter {
  query?: string;
  status?: string;
  rulebook?: string;
  reportedOnly?: boolean;
}

export type PostStaffAction = "숨김" | "수정 요청";

export interface PostRow {
  id: string;
  title: string;
  gmNickname: string;
  rulebook: string;
  startsAt: Date;
  memberCount: number;
  capacity: number;
  status: PostStatus;
  unresolvedReportCount: number;
  staffAction: PostStaffAction | null;
}

// 운영진 목록에는 숨긴 구인도 남기고 조치 칸에 표시한다. 세션 일시 최신순.
export async function listPosts(filter: PostListFilter) {
  const all = db.sessions
    .map((session): PostRow => ({
      id: session.id,
      title: session.title,
      gmNickname: db.users.find((user) => user.id === session.gmId)!.nickname,
      rulebook: session.rulebook,
      startsAt: session.startsAt,
      memberCount: session.memberIds.length,
      capacity: session.capacity,
      status: postStatusOf(session),
      unresolvedReportCount: db.reports.filter(
        (report) => report.sessionId === session.id && !report.resolved,
      ).length,
      staffAction: session.hidden ? "숨김" : session.editRequestedAt ? "수정 요청" : null,
    }))
    .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
  const keyword = filter.query?.trim();
  const rows = all.filter(
    (row) =>
      (!keyword || row.title.includes(keyword) || row.gmNickname.includes(keyword)) &&
      (!filter.status || row.status === filter.status) &&
      (!filter.rulebook || row.rulebook === filter.rulebook) &&
      (!filter.reportedOnly || row.unresolvedReportCount > 0),
  );
  return {
    total: all.length,
    rows,
    reportedCount: all.filter((row) => row.unresolvedReportCount > 0).length,
    actedCount: all.filter((row) => row.staffAction).length,
    statusOptions: Object.values(POST_STATUS),
    rulebookOptions: [...new Set(all.map((row) => row.rulebook))].toSorted(),
  };
}
