import { cn } from "@trpg/ui";
import type { ReactNode } from "react";

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
        "rounded-500 border p-175 text-center",
        tone === "success"
          ? "border-success-200 bg-success-50"
          : "border-gray-200 bg-gray-50 text-sm text-gray-600",
        className,
      )}
    >
      {children}
    </div>
  );
}
