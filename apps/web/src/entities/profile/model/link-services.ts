import type { ProfileLink } from "@/shared/server";

export const LINK_MAX_COUNT = 6;
export const LINK_VALUE_MAX_LENGTH = 300;

export type { ProfileLink };

export type LinkService = {
  key: string;
  label: string;
  // 핸들만 받는 곳은 접두사로 주소를 만들고, 문서는 주소를 그대로 쓴다.
  handlePrefix?: string;
  placeholder: string;
};

export const LINK_SERVICES = [
  { key: "x", label: "X", handlePrefix: "https://x.com/", placeholder: "@handle" },
  {
    key: "discord",
    label: "디스코드",
    placeholder: "사용자명",
  },
  {
    key: "instagram",
    label: "인스타그램",
    handlePrefix: "https://instagram.com/",
    placeholder: "@handle",
  },
  {
    key: "bluesky",
    label: "블루스카이",
    handlePrefix: "https://bsky.app/profile/",
    placeholder: "handle.bsky.social",
  },
  { key: "youtube", label: "유튜브", handlePrefix: "https://youtube.com/@", placeholder: "@handle" },
  { key: "sheets", label: "스프레드시트", placeholder: "docs.google.com/…" },
  { key: "drive", label: "드라이브", placeholder: "drive.google.com/…" },
  { key: "notion", label: "노션", placeholder: "notion.so/…" },
  { key: "link", label: "기타 주소", placeholder: "https://" },
] as const satisfies ReadonlyArray<LinkService>;

export type LinkServiceKey = (typeof LINK_SERVICES)[number]["key"];

export const OTHER_LINK_SERVICE: LinkServiceKey = "link";

export function linkServiceOf(key: string): LinkService {
  return LINK_SERVICES.find((service) => service.key === key) ?? LINK_SERVICES.at(-1)!;
}

// 주소만 붙여넣어도 서비스를 알아낸다. 목록에 없는 곳은 기타 주소로 둔다.
const HOST_SERVICES: ReadonlyArray<[RegExp, LinkServiceKey]> = [
  [/(^|\.)(x|twitter)\.com$/, "x"],
  [/(^|\.)discord\.(com|gg)$/, "discord"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)bsky\.app$/, "bluesky"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)docs\.google\.com$/, "sheets"],
  [/(^|\.)drive\.google\.com$/, "drive"],
  [/(^|\.)notion\.(so|site)$/, "notion"],
];

export function detectLinkService(value: string): LinkServiceKey {
  const url = toUrl(value);
  if (!url) return OTHER_LINK_SERVICE;
  const host = url.hostname.toLowerCase();
  return HOST_SERVICES.find(([pattern]) => pattern.test(host))?.[1] ?? OTHER_LINK_SERVICE;
}

function toUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("@")) return null;
  try {
    return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
}

// 누르면 열리는 주소. 디스코드 사용자명처럼 열 곳이 없으면 null.
export function linkHref({ service, value }: ProfileLink): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const { handlePrefix } = linkServiceOf(service);
  if (handlePrefix && !/^https?:\/\//i.test(trimmed) && !trimmed.includes("/")) {
    return `${handlePrefix}${trimmed.replace(/^@/, "")}`;
  }
  return toUrl(trimmed)?.toString() ?? null;
}

export function linkLabel({ service, value }: ProfileLink): string {
  const { label } = linkServiceOf(service);
  const trimmed = value.trim();
  return trimmed ? `${label} ${trimmed}` : label;
}

export function normalizeLinks(input: readonly ProfileLink[]): ProfileLink[] {
  return input
    .map((link) => ({
      service: linkServiceOf(link.service).key,
      value: link.value.trim().slice(0, LINK_VALUE_MAX_LENGTH),
    }))
    .filter((link) => link.value)
    .slice(0, LINK_MAX_COUNT);
}
