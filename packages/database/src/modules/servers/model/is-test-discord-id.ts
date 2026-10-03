// ponytail: 테스트 계정은 가짜 디스코드 ID(9000…)라 봇 조회가 늘 "멤버 아님"이다. 탈퇴 감지에서 빼고, 테스트 계정을 지우면 이 파일째 지운다.
export const TEST_DISCORD_ID_PREFIX = "9000000000000000";

export function isTestDiscordId(discordId: string): boolean {
  return discordId.startsWith(TEST_DISCORD_ID_PREFIX);
}
