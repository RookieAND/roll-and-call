import { isLinkServiceKey } from "./is-link-service-key";
import { detectLinkService, toUrl, type LinkServiceKey, type ProfileLink } from "./link-services";

const YOUTUBE_HANDLE = /^(@[\w.-]{1,100}|[\w-]{1,100})$/;

const LINK_ERROR: Partial<Record<LinkServiceKey, string>> = {
  youtube: "유튜브 채널 주소나 @핸들을 입력해 주세요.",
  sheets: "구글 스프레드시트 주소(docs.google.com/spreadsheets/…)를 입력해 주세요.",
  drive: "구글 드라이브 주소(drive.google.com/…)를 입력해 주세요.",
  notion: "노션 주소(notion.so/…)를 입력해 주세요.",
};

function isServiceUrl(value: string, service: LinkServiceKey): boolean {
  const url = toUrl(value);
  if (!url || url.pathname.length < 2 || detectLinkService(value) !== service) return false;
  return service !== "sheets" || url.pathname.startsWith("/spreadsheets");
}

export function linkError({ service, value }: ProfileLink): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!isLinkServiceKey(service)) return null;
  const message = LINK_ERROR[service];
  if (!message) return null;
  if (service === "youtube" && YOUTUBE_HANDLE.test(trimmed)) return null;
  return isServiceUrl(trimmed, service) ? null : message;
}
