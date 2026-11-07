import { isWebLink } from "./is-web-link";

// 서버는 링크 오류를 칸 없이 돌려준다. 주소 모양이 틀렸거나 앞 칸과 겹치는 첫 칸에 오류를 붙인다.
export function linkErrorRow(links: string[]) {
  const trimmed = links.map((link) => link.trim());
  const row = trimmed.findIndex(
    (link, index) => link !== "" && (!isWebLink(link) || trimmed.indexOf(link) !== index),
  );
  return row === -1 ? links.length - 1 : row;
}
