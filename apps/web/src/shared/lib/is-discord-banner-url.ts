const DISCORD_BANNER_PATTERN =
  /^https:\/\/cdn\.discordapp\.com\/banners\/\d+\/a?_?[0-9a-f]+\.(png|gif)(\?size=\d+)?$/;

// 디스코드 프로필 배너를 기본 배너로 채운 주소. 직접 올린 배너가 아니어도 프로필 저장 때 그대로 둔다.
export function isDiscordBannerUrl(url: string) {
  return DISCORD_BANNER_PATTERN.test(url);
}
