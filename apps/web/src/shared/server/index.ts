import "server-only";

export {
  db,
  scheduleMode,
  profiles,
  profileMemos,
  games,
  participants,
  availabilities,
  type Profile,
  type Game,
  type Participant,
  type Availability,
  type AvailabilityInterval,
  type ProfileLink,
} from "@trpg/database";
export { getRecruitingGamesPage, GAMES_PAGE_SIZE } from "./db/get-recruiting-games-page";
export { getGamesByGm } from "./db/get-games-by-gm";
export { getJoinedGames } from "./db/get-joined-games";
export { getMonthSessions, type MonthSessionRow } from "./db/get-month-sessions";
export { getGameById, type GameDetailData } from "./db/get-game-by-id";
export { requireGmGame } from "./auth/require-gm-game";
export { getGameParticipants, type GameParticipantsData } from "./db/get-game-participants";
export { getRespondedGameIds } from "./db/get-responded-game-ids";
export { getResponseCounts } from "./db/get-response-counts";
export { getResponseCountsByGm } from "./db/get-response-counts-by-gm";
export { getGameAvailabilities } from "./db/get-game-availabilities";
export { getUserConfirmedSlots } from "./db/get-user-confirmed-slots";
export { getProfile } from "./db/get-profile";
export { getProfileMemo } from "./db/get-profile-memo";
export { notifyGameCreated } from "./discord/notify-game-created";
export { refreshRecruitPost } from "./discord/refresh-recruit-post";
export { notifyGameJoined } from "./discord/notify-game-joined";
export { notifyGameLeft } from "./discord/notify-game-left";
export { notifyGameCancelled } from "./discord/notify-game-cancelled";
export { announceRecruitmentComplete } from "./discord/announce-recruitment-complete";
export { notifyDrawResult } from "./discord/notify-draw-result";
export { notifyDirectConfirmed } from "./discord/notify-direct-confirmed";
export { notifySessionStartingSoon } from "./discord/notify-session-starting-soon";
export { notifySessionConfirmed } from "./discord/notify-session-confirmed";
export { siteOrigin } from "./site-origin";
export { removeUnusedGameFiles } from "./game-files";
export { createSupabaseServerClient } from "./auth/create-supabase-server-client";
export { getCurrentUser } from "./auth/get-current-user";
export { getCurrentSessionUser } from "./auth/get-current-session-user";
