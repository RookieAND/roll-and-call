import { IconButton, Text } from "@trpg/ui";
import { ChevronLeft, X } from "lucide-react";
import type { ReactNode } from "react";
import { BACK_BUTTON_CLASS, BackButton } from "./back-button";

type Props = {
  // 그 화면 하나의 이름만. 게임명 같은 맥락은 본문 첫 줄로 내린다.
  title: string;
  // 진입 경로가 없을 때(직접 URL·디스코드 링크) 돌아갈 흐름의 부모. 평소엔 히스토리 뒤로.
  back?: string;
  // back과 배타: 핸들러가 있으면 뒤로가기를 링크 대신 버튼으로 렌더(예: 위저드 단계 뒤로, 이탈 확인).
  onBack?: () => void;
  // onBack 버튼 모양. 작업을 그만두는 자리(위저드 첫 단계)는 ✕.
  backIcon?: "back" | "close";
  // 오른쪽은 한 자리만: 주 액션 또는 ⋯ 중 하나.
  action?: ReactNode;
};

export function AppBar({ title, back, onBack, backIcon = "back", action }: Props) {
  const hasBack = back !== undefined || onBack !== undefined;
  const BackIcon = backIcon === "close" ? X : ChevronLeft;
  const backLabel = backIcon === "close" ? "닫기" : "뒤로";

  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-1 border-b border-gray-200 bg-surface/90 px-3.5 backdrop-blur">
      {onBack ? (
        <IconButton variant="ghost" aria-label={backLabel} className={BACK_BUTTON_CLASS} onClick={onBack}>
          <BackIcon size={22} />
        </IconButton>
      ) : (
        back && <BackButton fallback={back} />
      )}
      <Text
        typography={hasBack ? "heading3" : "heading2"}
        render={<span />}
        className={hasBack ? "truncate tracking-tight" : "tracking-tight"}
      >
        {title}
      </Text>
      <span className="flex-1" />
      {action}
    </header>
  );
}
