import { Children, type ReactNode } from "react";

interface ButtonLabelProps {
  children: ReactNode;
}

// Pretendard는 어센트(0.952em)가 디센트(0.268em)보다 훨씬 커서, 높이가 정해진 버튼에서 한글이 위로 뜬다.
// 글자만 살짝 내리고 아이콘은 그대로 둔다. `{a} 세션 {n}건`처럼 쪼개진 글자는 한 덩어리로 묶는다 —
// 따로 감싸면 flex 항목이 되어 공백 대신 버튼의 gap으로 벌어진다.
export function ButtonLabel({ children }: ButtonLabelProps) {
  const parts: ReactNode[] = [];
  let text = "";

  const flushText = () => {
    if (!text) return;
    parts.push(
      <span key={`label-${parts.length}`} data-slot="button-label" className="translate-y-[0.08em]">
        {text}
      </span>,
    );
    text = "";
  };

  Children.toArray(children).forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child;
      return;
    }
    flushText();
    parts.push(child);
  });
  flushText();

  return parts;
}
