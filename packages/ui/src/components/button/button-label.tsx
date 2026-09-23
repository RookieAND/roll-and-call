import { Children, type ReactNode } from "react";

// Pretendard는 어센트(0.952em)가 디센트(0.268em)보다 훨씬 커서, 높이가 정해진 버튼에서 한글이 위로 뜬다.
// 글자만 살짝 내리고 아이콘은 그대로 둔다.
interface ButtonLabelProps {
  children: ReactNode;
}

export function ButtonLabel({ children }: ButtonLabelProps) {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span data-slot="button-label" className="translate-y-[0.08em]">
        {child}
      </span>
    ) : (
      child
    ),
  );
}
