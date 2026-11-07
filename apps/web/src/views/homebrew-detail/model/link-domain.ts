// 링크 칩에는 도메인만 적는다. www.는 뗀다.
export function linkDomain(link: string) {
  if (!URL.canParse(link)) return link;
  return new URL(link).hostname.replace(/^www\./, "");
}
