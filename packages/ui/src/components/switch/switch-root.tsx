"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
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
