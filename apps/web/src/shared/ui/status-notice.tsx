import { cn } from "@trpg/ui";
import type { ReactNode } from "react";

// 상태 안내 박스: 확정(success) / 마감·잠금(muted) 톤 하나로 통일.
export function StatusNotice({
  tone = "muted",
  className,
  children,
}: {
  tone?: "success" | "muted";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 text-center",
        tone === "success"
          ? "border border-success-200 bg-success-50"
          : "bg-[#F7F7FA] text-sm text-[#7A7A85]",
        className,
      )}
    >
      {children}
    </div>
  );
}
