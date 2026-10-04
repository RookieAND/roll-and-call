import "server-only";

export type {
  Profile,
  Game,
  Availability,
  AvailabilityInterval,
  ProfileLink,
  CertApplication,
  SessionReview,
} from "@roll-and-call/database";
export { getCertSellers, getQuizQuestion } from "@roll-and-call/database/rulebooks";
export {
  getGameAvailabilities,
  findGameServerSlug,
  getGameParticipants,
  getGamesByGm,
  getGamesCounts,
  getJoinedGames,
  getMonthSessions,
  getRecruitingGamesPage,
  getRespondedGameIds,
  getResponseCounts,
  getResponseCountsByGm,
  getScheduleAvailabilityRows,
  getUserConfirmedSlots,
  listGameRuleOptions,
  type GameDetailData,
  type GamesCounts,
  type MonthSessionRow,
} from "@roll-and-call/database/games";
export {
  getGameReviews,
  getMyReviews,
  getReceivedReviews,
  getReviewCounts,
  getReviewDraftTarget,
  getReviewedGames,
  getWrittenReviews,
  type MyReviewRow,
  type ReviewCardRow,
  type ReviewDraftTarget,
  type ReviewedGames,
} from "@roll-and-call/database/reviews";
export { getProfileMemo } from "@roll-and-call/database/profiles";
export { findActiveSanction } from "@roll-and-call/database/moderation";
export { getRulebookRecords, type RulebookRecords } from "@roll-and-call/database/certifications";
export { markBadgesSeen, type BadgeRecord } from "@roll-and-call/database/badges";
export {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "@roll-and-call/database/notifications";
export { type Server } from "@roll-and-call/database";
export {
  evaluateBadges,
  evaluateGameBadges,
  grantRushBadge,
  loadBadgeFacts as getBadgeFacts,
  loadMonthlyAppearances as getMonthlyAppearances,
} from "@roll-and-call/database/badges";
export { notifyGameCreated } from "./discord/notify-game-created";
export { refreshRecruitPost } from "@roll-and-call/game-notices";
export { notifyGameJoined } from "./discord/notify-game-joined";
export { notifyGameLeft, notifyMovedToWaitlist } from "@roll-and-call/game-notices";
export { notifyGameCancelled } from "@roll-and-call/game-notices";
export { postStaffNotice, STAFF_NOTICE_KIND } from "@roll-and-call/game-notices";
export { announceRecruitmentComplete } from "./discord/announce-recruitment-complete";
export { notifyDrawResult } from "./discord/notify-draw-result";
export { notifyDirectConfirmed } from "./discord/notify-direct-confirmed";
export { notifySessionConfirmed } from "./discord/notify-session-confirmed";
export { announceGameOpened } from "./discord/announce-game-opened";
export {
  deleteGameReviewForumPosts,
  syncGameReviewForumPosts,
  syncReviewForumPost,
} from "@roll-and-call/review-forum";
export { getGameById } from "./db/get-game-by-id";
export { getProfile } from "./db/get-profile";
export { getUserBadges } from "./db/get-user-badges";
export { siteOrigin } from "./site-origin";
export { isCronRequest } from "./cron/is-cron-request";
export { removeUnusedGameFiles } from "./game-files";
export { seedAvailabilityFromProfile } from "./seed-availability-from-profile";
export { finishLotteryDraw } from "./finish-lottery-draw";
export { createSupabaseServerClient } from "./auth/create-supabase-server-client";
export { getCurrentUser } from "./auth/get-current-user";
export { getCurrentSessionUser } from "./auth/get-current-session-user";
export { getCurrentServer } from "./auth/get-current-server";
export { removeUnusedCertPhotos } from "./cert-files";
export { signCertPhotoUrls } from "./sign-cert-photo-urls";
export { removeUnusedReviewPhotos } from "./review-files";
export { revalidateReviews } from "./revalidate-reviews";
export { revalidateGamePaths } from "./revalidate-game-paths";
export { getCurrentMembership } from "./membership/get-current-membership";
export { requireMembership } from "./membership/require-membership";
export { getActingMember } from "./membership/get-acting-member";
export { findGuildDisplayName } from "./membership/find-guild-display-name";
export { isDiscordGuildMember } from "./membership/is-discord-guild-member";
export { guildMemberTag } from "./membership/guild-member-tag";
export { handleMemberLeft } from "./membership/handle-member-left";
export { detectRosterDepartures } from "./membership/detect-roster-departures";
export { checkEachMember } from "./membership/check-each-member";
export { findDepartedMembers } from "./membership/find-departed-members";
export { listJoinableServers } from "./membership/list-joinable-servers";
export { MEMBERSHIP_REQUIRED_MESSAGE } from "./membership/membership-required-message";
export { notMemberError } from "./membership/not-member-error";
