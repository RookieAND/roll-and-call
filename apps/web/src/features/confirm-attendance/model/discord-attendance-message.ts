export const DISCORD_ATTENDANCE_MESSAGE = {
  serverNotFound: "이 서버는 롤앤콜에 등록되어 있지 않습니다.\n운영진에게 문의해 주세요.",
  notRegistered: "롤앤콜에 가입한 기록이 없습니다.\n가입한 뒤 출석을 입력해 주세요.",
  notServerMember: "이 서버의 멤버가 아닙니다.\n서버에 가입한 뒤 출석을 입력해 주세요.",
  gameNotFound: "세션을 찾을 수 없습니다.\n삭제되었거나 이 서버의 세션이 아닙니다.",
  gmOnly: "GM만 출석을 입력할 수 있습니다.",
  alreadyConfirmed: "이미 출석이 확정되었습니다.\n고칠 때는 웹의 운영 관리를 이용해 주세요.",
  noAttendee: "확정된 참여자가 없는 세션입니다.",
  tooMany: "참여자가 많아 디스코드에서 고를 수 없습니다.\n웹의 운영 관리에서 입력해 주세요.",
  failed: "출석을 확정하지 못했습니다.\n잠시 뒤에 다시 시도해 주세요.",
} as const;

export function attendanceConfirmedMessage(absentCount: number) {
  return `출석이 확정되었습니다.\n불참으로 처리한 인원은 ${absentCount}명입니다.`;
}
