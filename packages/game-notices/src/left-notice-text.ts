export function leftNoticeText({
  name,
  removedByGm,
  leftServer,
}: {
  name: string;
  removedByGm: boolean;
  leftServer: boolean;
}): string {
  if (leftServer) return `**${name}** 님이 디스코드 서버를 나가 참여가 취소되었습니다.`;
  if (removedByGm) return `**${name}**님이 참여 목록에서 제외됐어요.`;
  return `**${name}**님이 참여를 취소했어요.`;
}
