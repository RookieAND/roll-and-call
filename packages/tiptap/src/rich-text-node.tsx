import type { ReactNode } from "react";

import { findChipLink } from "./find-chip-link";
import type { RichTextNodeData } from "./rich-text-doc";
import { RichTextLinkChip } from "./rich-text-link-chip";
import { safeHref } from "./safe-href";

interface RichTextNodeProps {
  node: RichTextNodeData;
  // 주소 → 칩에 보여 줄 이름. 저장 때 가져온 값이라 렌더링 중에는 외부 호출이 없다.
  linkLabels?: Record<string, string>;
}

// 화이트리스트 렌더러다. 모르는 노드·마크는 버리므로 저장된 JSON에 무엇이 들어 있든 HTML로 새지 않는다.
export function RichTextNode({ node, linkLabels }: RichTextNodeProps) {
  if (node.type === "text") {
    const chip = findChipLink(node);
    if (chip) {
      return (
        <RichTextLinkChip
          href={chip.href}
          provider={chip.provider}
          label={linkLabels?.[chip.href]}
        />
      );
    }

    let text: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = <strong>{text}</strong>;
      if (mark.type === "italic") text = <em>{text}</em>;
      if (mark.type === "underline") text = <u>{text}</u>;
      if (mark.type === "strike") text = <s>{text}</s>;
      if (mark.type === "code") text = <code>{text}</code>;
      // 클릭해서 펼치는 스포일러. 체크박스 하나면 되는 일이라 클라이언트 컴포넌트를 만들지 않는다.
      if (mark.type === "spoiler") {
        text = (
          <label className="spoiler">
            <input type="checkbox" hidden />
            {text}
          </label>
        );
      }
      const href = mark.type === "link" ? safeHref(mark.attrs?.href) : undefined;
      if (href) {
        text = (
          <a href={href} target="_blank" rel="noreferrer">
            {text}
          </a>
        );
      }
    }
    return <>{text}</>;
  }

  const children = node.content?.map((child, index) => (
    <RichTextNode key={index} node={child} linkLabels={linkLabels} />
  ));

  switch (node.type) {
    case "paragraph":
      return <p>{children ?? <br />}</p>;
    case "bulletList":
      return <ul>{children}</ul>;
    case "orderedList":
      return <ol>{children}</ol>;
    case "listItem":
      return <li>{children}</li>;
    case "blockquote":
      return <blockquote>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre>
          <code>{children}</code>
        </pre>
      );
    case "hardBreak":
      return <br />;
    default:
      return null;
  }
}
