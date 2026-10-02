import "server-only";
import type { Game } from "@roll-and-call/database";
import { type AuditAction } from "@roll-and-call/database/moderation";
import { rulebookLabel } from "@roll-and-call/database/rulebooks";
import { compact, isNull } from "es-toolkit";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { gameStartsAt } from "./game-starts-at";
import { gameStatus } from "./game-status";
import { loadSharedTables } from "./load-shared-tables";
import { membershipOf } from "./membership-of";
import { noShowId } from "./no-show-id";
import { plainText } from "./plain-text";
import { similarRulebook } from "./similar-rulebook";
import type {
  AdminUser,
  AuditEntry,
  CertApplication,
  CertSeller,
  Certification,
  NoShow,
  QuizQuestion,
  Report,
  Review,
  ReviewReport,
  Rulebook,
  RulebookRequest,
  Session,
  Staff,
  StaffMemo,
} from "./types";

const DAY = 86_400_000;
const NINETY_DAYS = 90 * DAY;

const OUTCOME_ACTION = {
  added: "룰북 추가",
  linked: "룰북 연결",
  rejected: "추가 요청 반려",
} as const satisfies Record<string, AuditAction>;

// ponytail: 요청마다 현재 서버에서 어드민이 보는 표를 통째로 읽어 목업과 같은 모양으로 바꾼다. 서버 규모(수백 건)에서는 충분하고, 수만 건이 되면 화면별 쿼리로 나눈다.
export const loadSnapshot = cache(async () => {
  const now = Date.now();
  const server = await getCurrentServer();
  const {
    profileRows,
    gameRows,
    participantRows,
    rulebookRows,
    requestRows,
    categoryRows,
    applicationRows,
    certificationRows,
    quizRows,
    sellerRows,
    sanctionRows,
    reportRows,
    reviewRows,
    reviewReportRows,
    staffRows,
    memoRows,
    auditRows,
    handleRows,
  } = await loadSharedTables(server.id);
  const handles = new Map(handleRows.map((row) => [row.id, row.handle]));

  const nicknames = new Map(profileRows.map((profile) => [profile.id, profile.username]));
  const nicknameOf = (id: string | null) =>
    id ? (nicknames.get(id) ?? "알 수 없음") : "알 수 없음";
  const labels = new Map(rulebookRows.map((rulebook) => [rulebook.id, rulebookLabel(rulebook)]));
  const gameRulebook = (game: Game) =>
    (game.rulebookId && labels.get(game.rulebookId)) || game.rule;

  const users: AdminUser[] = profileRows.map((profile) => {
    const hosted = gameRows.filter((game) => game.gmId === profile.id);
    const sanction = sanctionRows.find((row) => row.userId === profile.id);
    return {
      id: profile.id,
      nickname: profile.username,
      discordId: profile.discordId,
      discordHandle: handles.get(profile.id) ?? profile.username,
      joinedAt: profile.createdAt,
      hostedCount: hosted.length,
      playedCount: participantRows.filter(
        (row) => row.userId === profile.id && row.status === "confirmed",
      ).length,
      recentHostedCount: hosted.filter((game) => now - gameStartsAt(game).getTime() < NINETY_DAYS)
        .length,
      sanction: sanction
        ? {
            until: sanction.until,
            by: nicknameOf(sanction.createdBy),
            at: sanction.createdAt,
            reason: sanction.reason,
          }
        : undefined,
      membership: membershipOf(profile),
      ban: profile.bannedAt
        ? {
            at: profile.bannedAt,
            by: nicknameOf(profile.bannedBy),
            reason: profile.banReason ?? "",
          }
        : undefined,
    };
  });

  const sessions: Session[] = gameRows.map((game) => {
    const roster = participantRows
      .filter((row) => row.gameId === game.id)
      .toSorted(
        (a, b) =>
          (a.drawRank ?? Infinity) - (b.drawRank ?? Infinity) ||
          a.joinedAt.getTime() - b.joinedAt.getTime(),
      );
    const confirmedJoins = roster
      .filter((row) => row.status === "confirmed")
      .map((row) => row.joinedAt)
      .toSorted((a, b) => a.getTime() - b.getTime());
    return {
      id: game.id,
      title: game.title,
      rulebook: gameRulebook(game),
      rulebookId: game.rulebookId,
      gmId: game.gmId,
      startsAt: gameStartsAt(game),
      timeFixed: !isNull(game.confirmedAt),
      memberIds: roster.filter((row) => row.status === "confirmed").map((row) => row.userId),
      waitingIds: roster.filter((row) => row.status === "waiting").map((row) => row.userId),
      capacity: game.maxPlayers,
      closed: game.endDate.getTime() <= now,
      recruitStatus: gameStatus(game, now),
      createdAt: game.createdAt,
      filledAt: confirmedJoins[game.maxPlayers - 1],
      recruitMethod: game.recruitMethod === "lottery" ? "추첨" : "선착순",
      recruitDeadline: game.endDate,
      playTime: game.playTime ?? undefined,
      genres: game.genres,
      triggers: game.triggers,
      platforms: game.platforms,
      aiImage: game.aiImage,
      joinedAt: new Map(roster.map((row) => [row.userId, row.joinedAt])),
      synopsis: game.synopsis ? plainText(game.synopsis) : undefined,
      notices: game.notice
        ? plainText(game.notice)
            .split("\n")
            .filter((line) => line.trim())
        : [],
      imageUrls: game.images,
      thumbnailUrl: game.thumbnailUrl ?? undefined,
      attendanceConfirmedAt: game.attendanceConfirmedAt ?? undefined,
      hidden: game.hiddenAt
        ? { reason: game.hiddenReason ?? "", by: nicknameOf(game.hiddenBy), at: game.hiddenAt }
        : undefined,
    };
  });

  const attendanceConfirmedAt = new Map(
    gameRows.map((game) => [game.id, game.attendanceConfirmedAt]),
  );
  const noShows: NoShow[] = participantRows
    .filter((row) => row.absent && attendanceConfirmedAt.get(row.gameId))
    .map((row) => ({
      id: noShowId(row.gameId, row.userId),
      userId: row.userId,
      sessionId: row.gameId,
      recordedAt: attendanceConfirmedAt.get(row.gameId)!,
      cancelled: !isNull(row.absenceCancelledAt),
      cancelledBy: row.absenceCancelledBy ? nicknameOf(row.absenceCancelledBy) : undefined,
      cancelledAt: row.absenceCancelledAt ?? undefined,
      cancelReason: row.absenceCancelReason ?? undefined,
    }));

  const rulebookList: Rulebook[] = rulebookRows
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((rulebook) => ({
      id: rulebook.id,
      name: rulebook.name,
      edition: rulebook.edition,
      category: rulebook.category,
      kind: rulebook.kind,
      supersedesId: rulebook.supersedesId,
      aliases: rulebook.aliases,
      certRequired: rulebook.certRequired,
      hidden: rulebook.hidden,
    }));

  const certificationList: Certification[] = certificationRows
    .filter((row) => isNull(row.revokedAt))
    .map((row) => ({
      userId: row.userId,
      rulebookId: row.rulebookId,
      rulebook: labels.get(row.rulebookId) ?? "",
      approvedAt: row.approvedAt,
      approvedBy: nicknameOf(row.approvedBy),
    }));

  const quizList: QuizQuestion[] = quizRows
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((row) => ({
      id: row.id,
      rulebookId: row.rulebookId,
      question: row.question,
      answers: row.answers,
      page: row.page,
      active: row.active,
      askedCount: applicationRows.filter((application) => application.quizQuestionId === row.id)
        .length,
    }));
  const sellerList: CertSeller[] = sellerRows.map((row) => ({ id: row.id, name: row.name }));

  const certApplicationList: CertApplication[] = applicationRows.map((row) => {
    const quiz = quizRows.find((question) => question.id === row.quizQuestionId);
    return {
      id: row.id,
      userId: row.userId,
      rulebookId: row.rulebookId,
      rulebook: labels.get(row.rulebookId) ?? "",
      groupId: row.groupId,
      format: row.format,
      direct: row.direct,
      rejectReason: row.rejectReason ?? undefined,
      appliedAt: row.createdAt,
      memo: row.memo,
      photoUrls: row.photoUrls,
      replacedShots: row.replacedShots,
      purchase: {
        seller: row.seller,
        captureUrl: row.purchaseCaptureUrl,
        receiptUrl: row.receiptUrl,
        orderNumber: row.orderNumber,
        orderDate: row.orderDate,
      },
      // 같은 사람이 같은 룰북으로 먼저 냈다가 반려된 신청이 재신청 이력이다.
      previousRejections: applicationRows
        .filter(
          (earlier) =>
            earlier.userId === row.userId &&
            earlier.rulebookId === row.rulebookId &&
            earlier.status === "rejected" &&
            earlier.createdAt < row.createdAt,
        )
        .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((earlier) => ({
          rejectedAt: earlier.processedAt ?? earlier.createdAt,
          tags: earlier.rejectTag ? [earlier.rejectTag] : [],
          requests: earlier.rejectReason ? [earlier.rejectReason] : [],
        })),
      quiz: quiz
        ? { question: quiz.question, answer: row.quizAnswer ?? "", page: quiz.page }
        : undefined,
      status: row.status,
      flaggedShots: row.flaggedShots,
      processedBy: row.processedBy ? nicknameOf(row.processedBy) : undefined,
      processedAt: row.processedAt ?? undefined,
    };
  });

  const requestList: RulebookRequest[] = requestRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: rulebookLabel(row),
    bookName: row.name,
    edition: row.edition,
    kind: row.kind,
    category:
      categoryRows.find((category) => category.id === row.categoryId)?.name ?? row.categoryName,
    note: compact([row.publisher && `출판사 ${row.publisher}`, row.note]).join(" · "),
    requestedAt: row.createdAt,
    similarTo: similarRulebook(row.name, rulebookList),
    processed:
      row.outcome && row.processedAt
        ? {
            action: OUTCOME_ACTION[row.outcome],
            by: nicknameOf(row.processedBy),
            at: row.processedAt,
          }
        : undefined,
  }));

  const reportList: Report[] = reportRows.map((row) => ({
    id: row.id,
    sessionId: row.gameId,
    reportedAt: row.createdAt,
    resolved: !isNull(row.resolvedAt),
    reporterId: row.reporterId ?? undefined,
    category: row.category,
    detail: row.detail,
    resolvedBy: row.resolvedBy ? nicknameOf(row.resolvedBy) : undefined,
    resolvedAt: row.resolvedAt ?? undefined,
  }));

  const absentKeys = new Set(
    participantRows
      .filter((row) => row.absent && isNull(row.absenceCancelledAt))
      .map((row) => `${row.gameId}:${row.userId}`),
  );
  const reviewList: Review[] = reviewRows.map((row) => ({
    id: row.id,
    sessionId: row.gameId,
    authorId: row.authorId,
    body: row.body,
    spoiler: row.spoiler,
    photoUrls: row.photoUrls,
    createdAt: row.createdAt,
    editedAt: row.updatedAt ?? undefined,
    hidden: row.hiddenAt
      ? { reason: row.hiddenReason ?? "", by: nicknameOf(row.hiddenBy), at: row.hiddenAt }
      : undefined,
    removed: row.removedAt
      ? { reason: row.removedReason ?? "", by: nicknameOf(row.removedBy), at: row.removedAt }
      : undefined,
    held: absentKeys.has(`${row.gameId}:${row.authorId}`),
  }));
  const reviewReportList: ReviewReport[] = reviewReportRows.map((row) => ({
    id: row.id,
    reviewId: row.reviewId,
    reporterId: row.reporterId ?? undefined,
    category: row.category,
    detail: row.detail,
    reportedAt: row.createdAt,
    open: isNull(row.outcome),
  }));

  const discordIds = new Map(profileRows.map((profile) => [profile.id, profile.discordId]));
  const staffList: Staff[] = staffRows.map((row) => ({
    userId: row.userId,
    nickname: nicknameOf(row.userId),
    role: row.role,
    discordId: discordIds.get(row.userId),
    since: row.createdAt,
  }));

  const memoList: StaffMemo[] = memoRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    author: nicknameOf(row.authorId),
    at: row.createdAt,
    body: row.body,
  }));

  const auditList: AuditEntry[] = auditRows
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((row) => ({
      id: row.id,
      at: row.createdAt,
      actor: row.actorKind === "system" ? "시스템" : nicknameOf(row.actorId),
      actorId: row.actorId ?? undefined,
      actorKind: row.actorKind,
      action: row.action as AuditAction,
      target: row.target,
      targetUserId: row.targetUserId ?? undefined,
      reason: row.reason,
      reasonTag: row.reasonTag ?? undefined,
      staffMemo: row.staffMemo ?? undefined,
      before: row.before ?? undefined,
      after: row.after ?? undefined,
      related: row.related.length ? row.related : undefined,
    }));

  return {
    users,
    staff: staffList,
    rulebooks: rulebookList,
    certifications: certificationList,
    certApplications: certApplicationList,
    quizQuestions: quizList,
    sellers: sellerList,
    rulebookRequests: requestList,
    sessions,
    noShows,
    reports: reportList,
    reviews: reviewList,
    reviewReports: reviewReportList,
    auditLog: auditList,
    staffMemos: memoList,
  };
});

export type Snapshot = Awaited<ReturnType<typeof loadSnapshot>>;
