import "server-only";
import {
  adminSettings,
  auditLog,
  certApplications,
  certifications,
  db,
  games,
  participants,
  profiles,
  reports,
  rulebookRequests,
  rulebooks,
  sanctions,
  staff,
  staffMemos,
} from "@roll-and-call/database";
import { isNull } from "drizzle-orm";
import { cache } from "react";

import type { AuditAction } from "./audit-actions";
import { gameStartsAt } from "./game-starts-at";
import { gameStatus } from "./game-status";
import { noShowId } from "./no-show-id";
import { plainText } from "./plain-text";
import { rulebookLabel } from "./rulebook-label";
import { similarRulebook } from "./similar-rulebook";
import type {
  AdminUser,
  AuditEntry,
  CertApplication,
  Certification,
  NoShow,
  Report,
  Rulebook,
  RulebookRequest,
  Session,
  Staff,
  StaffMemo,
} from "./types";

const DAY = 86_400_000;
const NINETY_DAYS = 90 * DAY;

// 룰북 추가 요청 결과를 활동 기록의 조치 이름으로 옮긴다.
const OUTCOME_ACTION = {
  added: "룰북 추가",
  linked: "룰북 연결",
  rejected: "추가 요청 반려",
} as const satisfies Record<string, AuditAction>;

// ponytail: 요청마다 어드민이 보는 표를 통째로 읽어 목업과 같은 모양으로 바꾼다. 서버 규모(수백 건)에서는 충분하고, 수만 건이 되면 화면별 쿼리로 나눈다.
export const loadSnapshot = cache(async () => {
  const now = Date.now();
  const [
    profileRows,
    gameRows,
    participantRows,
    rulebookRows,
    requestRows,
    applicationRows,
    certificationRows,
    sanctionRows,
    reportRows,
    staffRows,
    memoRows,
    auditRows,
    [settingsRow],
  ] = await Promise.all([
    db.select().from(profiles),
    db.select().from(games),
    db.select().from(participants),
    db.select().from(rulebooks),
    db.select().from(rulebookRequests),
    db.select().from(certApplications),
    db.select().from(certifications),
    db.select().from(sanctions).where(isNull(sanctions.releasedAt)),
    db.select().from(reports),
    db.select().from(staff),
    db.select().from(staffMemos),
    db.select().from(auditLog),
    db.select().from(adminSettings),
  ]);

  const nicknames = new Map(profileRows.map((profile) => [profile.id, profile.username]));
  const nicknameOf = (id: string | null) =>
    id ? (nicknames.get(id) ?? "알 수 없음") : "알 수 없음";
  const labels = new Map(rulebookRows.map((rulebook) => [rulebook.id, rulebookLabel(rulebook)]));
  const gameRulebook = (game: typeof games.$inferSelect) =>
    (game.rulebookId && labels.get(game.rulebookId)) || game.rule;

  const users: AdminUser[] = profileRows.map((profile) => {
    const hosted = gameRows.filter((game) => game.gmId === profile.id);
    const sanction = sanctionRows.find((row) => row.userId === profile.id);
    return {
      id: profile.id,
      nickname: profile.username,
      discordId: profile.discordId,
      discordHandle: profile.username,
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
      gmId: game.gmId,
      startsAt: gameStartsAt(game),
      timeFixed: game.confirmedAt !== null,
      memberIds: roster.filter((row) => row.status === "confirmed").map((row) => row.userId),
      waitingIds: roster.filter((row) => row.status === "waiting").map((row) => row.userId),
      capacity: game.maxPlayers,
      closed: game.endDate.getTime() <= now,
      recruitStatus: gameStatus(game, now),
      createdAt: game.createdAt,
      filledAt: confirmedJoins[game.maxPlayers - 1],
      recruitMethod: game.recruitMethod === "lottery" ? "추첨" : "선착순",
      recruitDeadline: game.endDate,
      expectedHours: game.playMinutes ? game.playMinutes / 60 : undefined,
      synopsis: game.synopsis ? plainText(game.synopsis) : undefined,
      notices: game.notice ? game.notice.split("\n").filter((line) => line.trim()) : [],
      imageUrls: game.images,
      thumbnailUrl: game.thumbnailUrl ?? undefined,
      editRequestedAt: game.editRequestedAt ?? undefined,
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
      cancelled: row.absenceCancelledAt !== null,
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
      aliases: rulebook.aliases,
      certRequired: rulebook.certRequired,
      hidden: rulebook.hidden,
    }));

  const certificationList: Certification[] = certificationRows.map((row) => ({
    userId: row.userId,
    rulebook: labels.get(row.rulebookId) ?? "",
    approvedAt: row.approvedAt,
    approvedBy: nicknameOf(row.approvedBy),
  }));

  const certApplicationList: CertApplication[] = applicationRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    rulebook: labels.get(row.rulebookId) ?? "",
    appliedAt: row.createdAt,
    memo: row.memo,
    photoUrls: row.photoUrls,
    replacedShots: row.replacedShots,
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
    status: row.status,
    flaggedShots: row.flaggedShots,
    processedBy: row.processedBy ? nicknameOf(row.processedBy) : undefined,
    processedAt: row.processedAt ?? undefined,
  }));

  const requestList: RulebookRequest[] = requestRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: row.name,
    note: row.note,
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
    resolved: row.resolvedAt !== null,
    reporterId: row.reporterId ?? undefined,
    category: row.category,
    detail: row.detail,
    resolvedBy: row.resolvedBy ? nicknameOf(row.resolvedBy) : undefined,
    resolvedAt: row.resolvedAt ?? undefined,
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
      actor: nicknameOf(row.actorId),
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
    rulebookRequests: requestList,
    sessions,
    noShows,
    reports: reportList,
    auditLog: auditList,
    staffMemos: memoList,
    settings: { certEnforcementDate: settingsRow?.certEnforcementDate ?? null },
  };
});

export type Snapshot = Awaited<ReturnType<typeof loadSnapshot>>;
