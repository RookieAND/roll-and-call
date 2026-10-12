import { LINK_PROVIDER, type LinkProvider } from "./link-provider";
import { parseDiscordChannelLink } from "./parse-discord-channel-link";
import { parseHttpUrl } from "./parse-http-url";

function isHostOrSubdomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

// 문자열 포함이 아니라 호스트를 비교한다. notion.so.evil.com 같은 주소가 통과하면 안 된다.
export function detectLinkProvider(href: string): LinkProvider | undefined {
  if (parseDiscordChannelLink(href)) return LINK_PROVIDER.discord;
  const url = parseHttpUrl(href);
  if (!url) return undefined;
  if (url.hostname === "docs.google.com" && url.pathname.startsWith("/spreadsheets/")) {
    return LINK_PROVIDER.sheets;
  }
  if (url.hostname === "docs.google.com" && url.pathname.startsWith("/document/")) {
    return LINK_PROVIDER.docs;
  }
  if (
    isHostOrSubdomain(url.hostname, "notion.so") ||
    isHostOrSubdomain(url.hostname, "notion.site")
  ) {
    return LINK_PROVIDER.notion;
  }
  return undefined;
}
