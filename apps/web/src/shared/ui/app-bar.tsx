import { IconButton, Text } from "@trpg/ui";
import { ChevronLeft, X } from "lucide-react";
import type { ReactNode } from "react";

import { BackButton } from "./back-button";
import { BACK_BUTTON_CLASS } from "./back-button-class";

type Props = {
  title: string;
  // 진입 경로가 없을 때(직접 URL·디스코드 링크)만 쓰는 폴백. 평소엔 히스토리 뒤로.
  back?: string;
  onBack?: () => void;
  backIcon?: "back" | "close";
  action?: ReactNode;
};

export function AppBar({ title, back, onBack, backIcon = "back", action }: Props) {
  const hasBack = back !== undefined || onBack !== undefined;
  const BackIcon = backIcon === "close" ? X : ChevronLeft;
  const backLabel = backIcon === "close" ? "닫기" : "뒤로";

  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-1 border-b border-gray-200 bg-surface/90 px-3.5 backdrop-blur">
      {onBack ? (
        <IconButton
          variant="ghost"
          aria-label={backLabel}
          className={BACK_BUTTON_CLASS}
          onClick={onBack}
        >
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
