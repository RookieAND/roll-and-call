import { cn, HStack, IconButton, Text } from "@trpg/ui";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BackButton } from "./back-button";
import { BACK_BUTTON_CLASS } from "./back-button-class";
import { BrandLogo } from "./brand-logo";

interface AppBarProps {
  title: string;
  // 워드마크로 제목을 대체한다. title은 스크린리더가 읽을 이름으로 남는다.
  brand?: boolean;
  // 진입 경로가 없을 때(직접 URL·디스코드 링크)만 쓰는 폴백. 평소엔 히스토리 뒤로.
  back?: string;
  onBack?: () => void;
  backIcon?: "back" | "close";
  action?: ReactNode;
}

export function AppBar({ title, brand, back, onBack, backIcon = "back", action }: AppBarProps) {
  const hasBack = back !== undefined || onBack !== undefined;
  const BackIcon = backIcon === "close" ? X : ChevronLeft;
  const backLabel = backIcon === "close" ? "닫기" : "뒤로";

  return (
    <HStack
      align="center"
      gap={hasBack ? "050" : "075"}
      render={<header />}
      className={cn(
        "sticky top-0 z-20 h-[52px] border-b border-gray-200 bg-surface/90 backdrop-blur",
        hasBack ? "px-125" : "px-175",
      )}
    >
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
      {brand ? (
        <Link href="/">
          <BrandLogo label={title} />
        </Link>
      ) : (
        <Text
          typography={hasBack ? "heading3" : "heading2"}
          render={<span />}
          className={hasBack ? "truncate tracking-tight" : "tracking-tight"}
        >
          {title}
        </Text>
      )}
      <span className="flex-1" />
      {action}
    </HStack>
  );
}
