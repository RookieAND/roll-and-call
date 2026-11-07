import { compact } from "es-toolkit";

// 빈 링크 칸은 빼고 보낸다.
export function filledLinks(links: string[]) {
  return compact(links.map((link) => link.trim()));
}
