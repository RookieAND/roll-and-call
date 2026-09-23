"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface CheckboxFieldProps {
  className?: string;
  children: ReactNode;
}

// 체크 상자와 글씨를 한 히트 영역으로 묶는다. 최소 44px.
export function CheckboxField({ className, children }: CheckboxFieldProps) {
  return (
    <label
      data-slot="checkbox-field"
      className={cn("inline-flex min-h-11 cursor-pointer items-center gap-125", className)}
    >
      {children}
    </label>
  );
}
