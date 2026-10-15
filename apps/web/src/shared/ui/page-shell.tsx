import { cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { DesktopWideFrame } from "./desktop-wide-frame";

interface PageShellProps {
  appBar: ReactNode;
  children: ReactNode;
  // 1100px 이상에서 본문 열 오른쪽에 붙는 sticky 패널(320px). 없으면 패널 자리를 만들지 않는다.
  panel?: ReactNode;
  // true면 본문 열·패널 틀을 두지 않고 children이 영역 전체를 직접 짠다(구인 목록).
  bare?: boolean;
  // true면 1100px 이상에서 앱바 띠를 화면 위에 고정한다(구인 목록). 기본은 본문과 함께 스크롤된다.
  stickyAppBar?: boolean;
  // 폭 변형. 본문 열 폭(--shell-w)을 바꾼다. 예: "desktop:[--shell-w:880px]"
  className?: string;
}

const BAND_PADDING =
  "desktop:[&>header]:px-[max(var(--shell-pad,2rem),calc((100%-var(--shell-w)-var(--shell-extra))/2))]";

// 1100px 이상 화면의 공용 틀: 앱바는 영역 전폭 띠이고(안쪽 제목은 본문 열 왼쪽 끝에 맞춘다), 아래에 본문 열(기본 640px)과 선택적 패널이 가운데 정렬로 놓인다.
// 모바일(1100px 미만)은 앱바 아래에 children이 그대로 이어진다.
export function PageShell({
  appBar,
  children,
  panel,
  bare,
  stickyAppBar,
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "contents desktop:[--shell-w:640px]",
        panel ? "desktop:[--shell-extra:344px]" : "desktop:[--shell-extra:0px]",
        BAND_PADDING,
        stickyAppBar
          ? "desktop:[&>header]:sticky desktop:[&>header]:top-0 desktop:[&>header]:z-(--rc-z-sticky) desktop:[&>header]:bg-surface desktop:[&>header]:backdrop-blur-none"
          : "desktop:[&>header]:static",
        className,
      )}
    >
      <DesktopWideFrame />
      {appBar}
      {bare ? (
        children
      ) : (
        <div className="desktop:flex desktop:items-start desktop:justify-center desktop:gap-300 desktop:px-400 desktop:pt-300 desktop:pb-400">
          <div className="min-w-0 desktop:w-(--shell-w) desktop:flex-none">{children}</div>
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
