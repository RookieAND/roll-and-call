import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { postAuditTarget } from "./post-audit-target";
import { postStatusOf } from "./post-status-of";
import { loadSnapshot, type Snapshot } from "./snapshot";

const REVIEW_WINDOW_DAYS = 14;
const DAY = 86_400_000;

const userOf = (db: Snapshot, userId: string) => db.users.find((user) => user.id === userId)!;
const nicknameOf = (db: Snapshot, userId: string) => userOf(db, userId).nickname;

// 구인 상세: 요약·신고·구인 내용·참여자·대기자와 오른쪽 GM 정보. 대기자는 대기 순번 순이다.
export async function getPostDetail(id: string) {
  const db = await loadSnapshot();
  const session = db.sessions.find((candidate) => candidate.id === id);
  if (!session) return null;
  const now = Date.now();
  const gm = db.users.find((user) => user.id === session.gmId)!;
  const gmSessions = db.sessions.filter((candidate) => candidate.gmId === gm.id);
  const gmTargetSuffix = ` · GM ${gm.nickname}`;
  const receivedActions = db.auditLog.filter((entry) => entry.target.endsWith(gmTargetSuffix));
  const reports = db.reports
    .filter((report) => report.sessionId === id)
    .toSorted((a, b) => a.reportedAt.getTime() - b.reportedAt.getTime());
  const waitingIds = session.waitingIds ?? [];
  const reviews = db.reviews
    .filter((review) => review.sessionId === id && !review.removed)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const absentIds = new Set(
    db.noShows
      .filter((noShow) => noShow.sessionId === id && !noShow.cancelled)
      .map((noShow) => noShow.userId),
  );
  // ponytail: 작성 기한은 출석 확인 + 14일로 어드민이 따로 계산한다. 사용자 앱(apps/web)의 계산과 같은 규칙이다.
  const attendanceConfirmedAt = session.attendanceConfirmedAt;

  return {
    id: session.id,
    title: session.title,
    rulebook: session.rulebook,
    status: postStatusOf(session, now),
    auditTarget: postAuditTarget(db, session),
    createdAt: session.createdAt,
    startsAt: session.startsAt,
    memberCount: session.memberIds.length,
    waitingCount: waitingIds.length,
    capacity: session.capacity,
    recruitDeadline: session.recruitDeadline,
    playTime: session.playTime,
    genres: session.genres ?? [],
    triggers: session.triggers ?? [],
    platforms: session.platforms ?? [],
    aiImage: session.aiImage ?? false,
    synopsis: session.synopsis,
    notices: session.notices ?? [],
    imageUrls: session.imageUrls ?? [],
    thumbnailUrl: session.thumbnailUrl,
    hidden: session.hidden,
    gmEditSinceHidden: session.gmEditSinceHidden,
    reports: reports.map((report) => ({
      id: report.id,
      reporterNickname: report.reporterId ? nicknameOf(db, report.reporterId) : "알 수 없음",
      reportedAt: report.reportedAt,
      category: report.category ?? "기타",
      detail: report.detail ?? "",
      resolved: report.resolved,
    })),
    unresolvedReportCount: reports.filter((report) => !report.resolved).length,
    members: session.memberIds.map((userId) => ({
      userId,
      nickname: nicknameOf(db, userId),
      discordHandle: userOf(db, userId).discordHandle,
      joinedAt: session.joinedAt?.get(userId),
      recentNoShowCount: countRecentNoShows(db, userId, now),
    })),
    attendance: {
      confirmedAt: attendanceConfirmedAt,
      reviewDeadline: attendanceConfirmedAt
        ? new Date(attendanceConfirmedAt.getTime() + REVIEW_WINDOW_DAYS * DAY)
        : undefined,
      attendedCount: session.memberIds.filter((userId) => !absentIds.has(userId)).length,
    },
    reviews: reviews.map((review) => ({
      id: review.id,
      authorNickname: nicknameOf(db, review.authorId),
      createdAt: review.createdAt,
      photoCount: review.photoUrls.length,
      spoiler: review.spoiler,
      openReportCount: db.reviewReports.filter(
        (report) => report.reviewId === review.id && report.open,
      ).length,
      hidden: Boolean(review.hidden),
      held: review.held,
    })),
    waitlist: waitingIds.map((userId, index) => ({
      userId,
      queueOrder: index + 1,
      nickname: nicknameOf(db, userId),
      discordHandle: userOf(db, userId).discordHandle,
      joinedAt: session.joinedAt?.get(userId),
    })),
    gm: {
      id: gm.id,
      nickname: gm.nickname,
      joinedAt: gm.joinedAt,
      certifiedRulebooks: db.certifications
        .filter((certification) => certification.userId === gm.id)
        .map((certification) => certification.rulebook),
      hostedCount: Math.max(gm.hostedCount, gmSessions.length),
      ongoingHostedCount: gmSessions.filter((candidate) => candidate.startsAt.getTime() >= now)
        .length,
      editRequestCount: receivedActions.filter((entry) => entry.action === "구인 수정 요청").length,
      hideCount: receivedActions.filter((entry) => entry.action === "구인 숨김").length,
      handledNoShowCount: db.noShows.filter((noShow) =>
        gmSessions.some((candidate) => candidate.id === noShow.sessionId),
      ).length,
    },
  };
}

export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostDetail>>>;
