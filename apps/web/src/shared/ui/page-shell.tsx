import { cn } from "@roll-and-call/ui";
import type { CSSProperties, ReactNode } from "react";

import { FRAME_INNER_PX } from "./frame-class";
import { ScrollToTop } from "./scroll-to-top";

interface PageShellProps {
  appBar: ReactNode;
  children: ReactNode;
  // 1100px 이상에서 본문 오른쪽에 붙는 sticky 패널(320px). 없으면 패널 자리를 만들지 않는다.
  panel?: ReactNode;
  // 폼·글 위주 화면: 본문 안쪽을 640px로 줄인다. 패널이 있으면 패널과 한 덩어리로 묶어 가운데에 둔다. 바깥 틀(앱바 띠·패널 자리)은 그대로다.
  readable?: boolean;
  // true면 본문 틀을 두지 않고 children이 FRAME_INNER_PX로 직접 짠다(전폭 띠가 있는 구인 목록).
  bare?: boolean;
  // true면 본문 아래 여백을 없앤다. 화면이 스스로 높이를 채우고 그 끝에 하단 막대를 붙일 때(sticky bottom-0) 쓴다.
  flush?: boolean;
  // true면 1100px 이상에서 앱바 띠를 화면 위에 고정한다(구인 목록). 기본은 본문과 함께 스크롤된다.
  stickyAppBar?: boolean;
  // true면 화면에 들어올 때 맨 위로 올린다.
  scrollTop?: boolean;
}

const NAV_WIDTH = "224px";
const FRAME_PAD = `max(16px, (100% - ${NAV_WIDTH} - 1296px) / 2)`;
// 패널 열(간격 16 + 320)을 뺀 본문 열 폭. 하단 막대가 뷰포트 기준(fixed)으로 이 열의 가장자리에 맞는다.
const bodyWidth = (hasPanel: boolean) =>
  `calc(100% - ${NAV_WIDTH} - 2 * ${FRAME_PAD}${hasPanel ? " - 336px" : ""})`;

// 1100px 이상 모든 화면의 공용 틀: 앱바는 영역 전폭 띠(안쪽 제목은 틀 왼쪽 끝에 맞춘다)이고, 아래에 본문 열과 선택적 패널이 최대 1296px로 가운데에 놓인다.
// 모바일(1100px 미만)은 앱바 아래에 children이 그대로 이어진다.
export function PageShell({
  appBar,
  children,
  panel,
  readable,
  bare,
  flush,
  stickyAppBar,
  scrollTop,
}: PageShellProps) {
  const barStyle = {
    "--bar-body": bodyWidth(!!panel),
    "--bar-w": readable ? "min(640px, var(--bar-body))" : "var(--bar-body)",
    "--bar-left": `calc(${NAV_WIDTH} + ${FRAME_PAD} + (var(--bar-body) - var(--bar-w)) / 2)`,
  } as CSSProperties;
  return (
    <div
      style={barStyle}
      className={cn(
        "contents desktop:[&>header]:px-[max(1rem,calc((100%-1296px)/2))]",
        stickyAppBar
          ? "desktop:[&>header]:sticky desktop:[&>header]:top-0 desktop:[&>header]:z-(--rc-z-sticky) desktop:[&>header]:bg-surface desktop:[&>header]:backdrop-blur-none"
          : "desktop:[&>header]:static",
      )}
    >
      {scrollTop && <ScrollToTop />}
      {appBar}
      {bare ? (
        children
      ) : (
        <div
          className={cn(
            "desktop:flex desktop:items-start desktop:justify-center desktop:gap-200 desktop:pt-300",
            !flush && "desktop:pb-400",
            FRAME_INNER_PX,
          )}
        >
          <div className={cn("min-w-0 desktop:flex-1", readable && "desktop:max-w-160")}>
            {children}
          </div>
          {panel && (
            <aside className="sticky top-4 hidden w-80 flex-none desktop:flex desktop:flex-col desktop:gap-150">
              {panel}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
