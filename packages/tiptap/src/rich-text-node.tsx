import type { ReactNode } from "react";

import type { RichTextNodeData } from "./rich-text-doc";
import { safeHref } from "./safe-href";

// 화이트리스트 렌더러다. 모르는 노드·마크는 버리므로 저장된 JSON에 무엇이 들어 있든 HTML로 새지 않는다.
export function RichTextNode({ node }: { node: RichTextNodeData }) {
  if (node.type === "text") {
    let text: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = <strong>{text}</strong>;
      if (mark.type === "italic") text = <em>{text}</em>;
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

  const children = node.content?.map((child, index) => <RichTextNode key={index} node={child} />);

  switch (node.type) {
    case "paragraph":
      return <p>{children ?? <br />}</p>;
    case "bulletList":
      return <ul>{children}</ul>;
    case "orderedList":
      return <ol>{children}</ol>;
    case "listItem":
      return <li>{children}</li>;
    case "hardBreak":
      return <br />;
    default:
      return null;
  }
}
