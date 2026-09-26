import { Button, cn, HStack, Text } from "@roll-and-call/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { PaletteLauncher } from "./palette-launcher";

interface AdminHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  // 오른쪽 조치 패널이 있는 화면. 왼쪽 끝은 본문 카드에, 오른쪽 끝은 패널 안 카드에 맞춘다.
  withAside?: boolean;
}

export function AdminHeader({ title, sub, back, actions, withAside }: AdminHeaderProps) {
  return (
    <HStack
      align="center"
      gap="125"
      render={<header data-full-bleed />}
      className={cn(
        "sticky top-0 z-(--rc-z-sticky) h-(--rc-size-appbar) shrink-0 border-b border-gray-200 bg-surface whitespace-nowrap",
        withAside ? "pr-150 pl-center-200" : "px-page",
      )}
    >
      {back ? (
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          render={<Link href={back.href} />}
          className="gap-075 rounded-full pr-150 pl-100"
        >
          <ArrowLeft size={14} aria-hidden />
          {back.label}
        </Button>
      ) : null}
      <Text typography="heading2" render={<h1 />}>
        {title}
      </Text>
      {sub ? (
        <Text typography="body4" foreground="hint">
          {sub}
        </Text>
      ) : null}
      <HStack align="center" gap="100" className="ml-auto">
        <PaletteLauncher />
        {actions}
      </HStack>
    </HStack>
  );
}
