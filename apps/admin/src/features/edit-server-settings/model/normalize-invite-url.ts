// 사용자 앱이 이 값을 그대로 링크(href)로 쓰므로 https 주소만 저장한다. discord.gg/xxx처럼 넣으면 https://를 붙인다.
export function normalizeInviteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = URL.parse(withScheme);
  if (!url || url.protocol !== "https:") throw new Error("초대 링크는 https 주소여야 합니다");
  return url.toString();
}
