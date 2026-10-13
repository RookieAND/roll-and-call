import { LINK_PROVIDER, type LinkProvider } from "./link-provider";
import { parseDiscordChannelLink } from "./parse-discord-channel-link";
import { parseHttpUrl } from "./parse-http-url";

const GOOGLE_DOCS_PATH_PROVIDERS: ReadonlyArray<[string, LinkProvider]> = [
  ["/spreadsheets/", LINK_PROVIDER.sheets],
  ["/document/", LINK_PROVIDER.docs],
  ["/presentation/", LINK_PROVIDER.slides],
  ["/forms/", LINK_PROVIDER.forms],
];

const DOMAIN_PROVIDERS: ReadonlyArray<[string, LinkProvider]> = [
  ["notion.so", LINK_PROVIDER.notion],
  ["notion.site", LINK_PROVIDER.notion],
  ["postype.com", LINK_PROVIDER.postype],
  ["trpg-diary.co.kr", LINK_PROVIDER.trpgDiary],
];

function isHostOrSubdomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function detectGoogleProvider({ hostname, pathname }: { hostname: string; pathname: string }) {
  if (hostname === "drive.google.com") return LINK_PROVIDER.drive;
  if (hostname === "forms.gle") return LINK_PROVIDER.forms;
  if (hostname !== "docs.google.com") return undefined;
  return GOOGLE_DOCS_PATH_PROVIDERS.find(([prefix]) => pathname.startsWith(prefix))?.[1];
}

// 문자열 포함이 아니라 호스트를 비교한다. notion.so.evil.com 같은 주소가 통과하면 안 된다.
export function detectLinkProvider(href: string): LinkProvider | undefined {
  if (parseDiscordChannelLink(href)) return LINK_PROVIDER.discord;
  const url = parseHttpUrl(href);
  if (!url) return undefined;
  const googleProvider = detectGoogleProvider(url);
  if (googleProvider) return googleProvider;
  return DOMAIN_PROVIDERS.find(([domain]) => isHostOrSubdomain(url.hostname, domain))?.[1];
}
