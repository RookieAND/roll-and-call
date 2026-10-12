import { REVIEW_WRITE_DAYS } from "@/entities/review";

import { REVIEW_BLOCK } from "./review-block";

export const DISCORD_REVIEW_REFUSAL = {
  ...REVIEW_BLOCK,
  serverNotFound: "server-not-found",
  notRegistered: "not-registered",
  notServerMember: "not-server-member",
  gameNotFound: "game-not-found",
  notParticipant: "not-participant",
  notConfirmed: "not-confirmed",
  removed: "removed",
  noAttendee: "no-attendee",
} as const;

export type DiscordReviewRefusal =
  (typeof DISCORD_REVIEW_REFUSAL)[keyof typeof DISCORD_REVIEW_REFUSAL];

export const DISCORD_REVIEW_REFUSAL_MESSAGE: Record<DiscordReviewRefusal, string> = {
  [DISCORD_REVIEW_REFUSAL.serverNotFound]:
    "이 서버는 롤앤콜에 등록되어 있지 않습니다.\n운영진에게 문의해 주세요.",
  [DISCORD_REVIEW_REFUSAL.notRegistered]:
    "롤앤콜에 가입한 기록이 없습니다.\n가입한 뒤 후기를 써 주세요.",
  [DISCORD_REVIEW_REFUSAL.notServerMember]:
    "이 서버의 멤버가 아닙니다.\n서버에 가입한 뒤 후기를 써 주세요.",
  [DISCORD_REVIEW_REFUSAL.gameNotFound]:
    "세션을 찾을 수 없습니다.\n삭제되었거나 이 서버의 세션이 아닙니다.",
  [DISCORD_REVIEW_REFUSAL.notParticipant]:
    "이 세션에 참여한 기록이 없습니다.\n확정 참여자만 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.notConfirmed]:
    "참여가 확정되지 않은 세션입니다.\n확정 참여자만 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.removed]:
    "참여자 명단에서 제외된 세션입니다.\n확정 참여자만 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.noAttendee]:
    "확정된 참여자가 없는 세션입니다.\n참여자가 있어야 GM 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.attendancePending]:
    "출석 확인이 아직 끝나지 않았습니다.\nGM이 출석을 확정하면 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.writePeriodOver]: `후기 작성 기간이 지났습니다.\n출석이 확정된 뒤 ${REVIEW_WRITE_DAYS}일 안에 쓸 수 있습니다.`,
  [DISCORD_REVIEW_REFUSAL.alreadyWritten]:
    "이미 이 세션의 후기를 썼습니다.\n고치려면 웹의 내 후기에서 수정해 주세요.",
  [DISCORD_REVIEW_REFUSAL.absent]:
    "불참으로 처리된 세션입니다.\n불참한 세션은 후기를 쓸 수 없습니다.",
  [DISCORD_REVIEW_REFUSAL.suspended]: "활동 정지 기간입니다.\n정지가 끝나면 후기를 쓸 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.editPeriodOver]: "수정 기간이 지났습니다.\n이제 삭제만 할 수 있습니다.",
  [DISCORD_REVIEW_REFUSAL.unavailable]:
    "후기를 쓸 수 없는 세션입니다.\n삭제되었거나 권한이 없습니다.",
};
