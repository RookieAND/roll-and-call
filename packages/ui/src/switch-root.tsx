"use client";

import type { ReactNode } from "react";

import { cn } from "./cn";
import { SwitchContext } from "./switch-context";

export interface SwitchRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

// 라벨까지가 하나의 히트 영역이다. 바로 적용되는 설정에만 쓰고, 저장 버튼이 있는 폼에는 체크박스를 쓴다.
export function SwitchRoot({ size = "md", className, children, ...controlProps }: SwitchRootProps) {
  return (
    <SwitchContext.Provider value={{ size, controlProps }}>
      <label
        data-slot="switch"
        className={cn("inline-flex min-h-11 cursor-pointer items-center gap-125", className)}
      >
        {children}
      </label>
    </SwitchContext.Provider>
  );
}
