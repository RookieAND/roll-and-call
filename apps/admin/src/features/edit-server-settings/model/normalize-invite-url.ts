export const INVITE_URL_ERROR = "디스코드 초대 링크(https://discord.gg/…)를 넣어 주세요";

const INVITE_HOSTS: readonly string[] = ["discord.gg", "discord.com", "www.discord.com"];

type NormalizeInviteUrlResult = { ok: true; url: string | null } | { ok: false; error: string };

// 사용자 앱이 이 값을 그대로 링크(href)로 쓰므로 디스코드 https 주소만 받는다. discord.gg/xxx처럼 넣으면 https://를 붙인다. 비우면 null.
export function normalizeInviteUrl(value: string): NormalizeInviteUrlResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, url: null };
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = URL.parse(withScheme);
  const valid =
    url?.protocol === "https:" &&
    INVITE_HOSTS.includes(url.hostname) &&
    url.pathname.length > 1 &&
    (url.hostname === "discord.gg" || url.pathname.startsWith("/invite/"));
  if (!url || !valid) return { ok: false, error: INVITE_URL_ERROR };
  return { ok: true, url: url.toString() };
}
