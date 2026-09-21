import { HStack, Text } from "@trpg/ui";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { StatusNotice } from "@/shared/ui";

interface ActionNoticeProps {
  title?: ReactNode;
  tone?: "normal" | "success" | "warning" | "danger";
  icon?: LucideIcon;
  children: ReactNode;
}

// 액션 바의 상태 카드 — 굵은 한 줄(선택)과 설명. 아이콘은 제목 색을 따른다.
export function ActionNotice({ title, tone = "normal", icon: Icon, children }: ActionNoticeProps) {
  return (
    <StatusNotice tone="muted" className="text-left">
      {title && (
        <Text
          typography="body2"
          weight="bold"
          foreground={tone}
          numeric
          render={<HStack align="center" gap="075" className="mb-075" />}
        >
          {Icon && <Icon size={15} strokeWidth={2.4} className="shrink-0" aria-hidden />}
          {title}
        </Text>
      )}
      <Text typography="body3" foreground="muted" render={<p />}>
        {children}
      </Text>
    </StatusNotice>
  );
}
