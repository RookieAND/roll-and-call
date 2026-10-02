import { Badge } from "@roll-and-call/ui";
import { isString } from "es-toolkit";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { STATUS_TONE, type StatusTone } from "@/shared/lib";

interface TagProps {
  children: ReactNode;
  tone?: StatusTone;
  // 뱃지에는 아이콘을 넣지 않는다. 색과 글자로 뜻이 전달되지 않을 때만 essential과 함께 준다.
  essentialIcon?: LucideIcon;
}

// 상태·분류 뱃지. 글자가 STATUS_TONE에 있으면 넘긴 tone보다 그 색이 우선한다.
export function Tag({ children, tone = "gray", essentialIcon: Icon }: TagProps) {
  const colorPalette = (isString(children) && STATUS_TONE[children]) || tone;
  return (
    <Badge colorPalette={colorPalette} className="gap-050">
      {Icon ? <Icon size={14} strokeWidth={2} aria-hidden /> : null}
      {children}
    </Badge>
  );
}
