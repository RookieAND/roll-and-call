import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

// 제목과 설명을 한 클릭 영역 안에 묶어, 최소 터치 높이가 두 글 사이를 벌리지 않게 한다.
export function CheckboxContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span data-slot="checkbox-content" className={cn("flex min-w-0 flex-col gap-025", className)}>
      {children}
    </span>
  );
}
