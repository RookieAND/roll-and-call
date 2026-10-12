import { detectLinkProvider } from "./detect-link-provider";
import type { LinkProvider } from "./link-provider";
import type { RichTextNodeData } from "./rich-text-doc";
import { safeHref } from "./safe-href";

export interface ChipLink {
  href: string;
  provider: LinkProvider;
}

// 칩으로 바꾸는 링크는 글자가 주소 그대로인 링크(붙여넣어 자동으로 걸린 링크)뿐이다.
// 글쓴이가 "하우스룰 보기"처럼 직접 이름을 붙인 링크는 그 글자를 살린다. 스포일러가 걸린 글자도 가리기가 풀리면 안 되므로 그대로 둔다.
export function findChipLink(node: RichTextNodeData): ChipLink | undefined {
  if (node.type !== "text" || !node.text) return undefined;
  const marks = node.marks ?? [];
  if (marks.some((mark) => mark.type === "spoiler")) return undefined;
  const linkMark = marks.find((mark) => mark.type === "link");
  const href = safeHref(linkMark?.attrs?.href);
  if (!href || node.text.trim() !== href) return undefined;
  const provider = detectLinkProvider(href);
  return provider ? { href, provider } : undefined;
}
