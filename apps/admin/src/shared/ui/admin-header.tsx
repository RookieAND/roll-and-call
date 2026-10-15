import { cn, HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { MobileBackLink } from "./mobile/mobile-back-link";
import { MobileMenuButton } from "./mobile/mobile-menu-button";
import { ServerLink } from "./server-link";
import { ThemeToggleButton } from "./theme-toggle-button";

interface AdminHeaderProps {
  title: ReactNode;
  trail?: { href: string; label: ReactNode }[];
  actions?: ReactNode;
  withAside?: boolean;
  // 본문이 가운데 칸인 화면은 제목을 그 칸의 시작선에 맞춘다. true는 920px 칸이고, 숫자는 그 폭(px)의 칸이다.
  contentWidth?: boolean | number;
}

export function AdminHeader({
  title,
  trail = [],
  actions,
  withAside,
  contentWidth,
}: AdminHeaderProps) {
  const lastStep = trail.at(-1);
  return (
    <HStack
      align="center"
      gap="100"
      render={<header data-full-bleed />}
      style={
        typeof contentWidth === "number"
          ? ({ "--container-content": `${contentWidth}px` } as CSSProperties)
          : undefined
      }
      className={cn(
        "sticky top-0 z-(--rc-z-sticky) h-(--rc-size-appbar) shrink-0 border-b border-gray-200 bg-surface whitespace-nowrap",
        withAside && "pr-150 pl-center-200",
        contentWidth && "px-content",
        !withAside && !contentWidth && "px-page",
        "max-lg:h-14 max-lg:gap-050 max-lg:pr-100 max-lg:pl-050",
      )}
    >
      <div className="lg:hidden">
        {lastStep ? (
          <MobileBackLink path={lastStep.href} label={lastStep.label} />
        ) : (
          <MobileMenuButton />
        )}
      </div>
      {trail.map((step, index) => (
        <HStack
          key={index}
          align="center"
          gap="050"
          render={<ServerLink path={step.href} />}
          className="text-hint hover:text-gray-600 max-lg:hidden"
        >
          <Text typography="heading1" weight="medium" foreground="inherit">
            {step.label}
          </Text>
          <ChevronRight size={16} aria-hidden />
        </HStack>
      ))}
      <Text
        typography="heading1"
        render={<h1 />}
        className="max-lg:min-w-0 max-lg:flex-1 max-lg:truncate max-lg:text-heading3 max-lg:font-bold max-lg:tracking-normal"
      >
        {title}
      </Text>
      <HStack align="center" gap="100" className="ml-auto">
        {/* 모바일은 헤더 조치를 화면 아래 고정 바로 옮긴다. */}
        <div className="contents max-lg:hidden">{actions}</div>
        <ThemeToggleButton />
      </HStack>
    </HStack>
  );
}
