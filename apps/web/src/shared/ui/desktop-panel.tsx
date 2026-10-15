import type { ReactNode } from "react";

interface DesktopPanelProps {
  children: ReactNode;
}

// 화면 본문 어디에서든 넣는 우측 패널(1100px 이상에서만 보인다). 본문 카드 오른쪽 바깥에 320px로 걸리고 top 16px에 붙어 따라 내려온다.
// 패널이 없는 화면은 이 컴포넌트를 쓰지 않으므로 빈 패널이 생기지 않는다. 틀(AppFrame)이 data-desktop-panel을 보고 카드 위치를 맞춘다.
export function DesktopPanel({ children }: DesktopPanelProps) {
  return (
    <aside
      data-desktop-panel
      className="absolute top-0 bottom-0 left-[calc(100%+24px)] hidden w-80 desktop:block"
    >
      <div className="sticky top-4 flex flex-col gap-150">{children}</div>
    </aside>
  );
}
