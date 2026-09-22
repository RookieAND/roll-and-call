"use client";

import type { ReactNode } from "react";

import { cn } from "./cn";

export interface RadioFieldProps {
  className?: string;
  children: ReactNode;
}

export function RadioField({ className, children }: RadioFieldProps) {
  return (
    <label
      data-slot="radio-field"
      className={cn("inline-flex min-h-11 cursor-pointer items-center gap-125", className)}
    >
      {children}
    </label>
  );
}
