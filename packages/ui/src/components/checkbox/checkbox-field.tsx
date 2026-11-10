"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface CheckboxFieldProps {
  className?: string;
  children: ReactNode;
}

export function CheckboxField({ className, children }: CheckboxFieldProps) {
  return (
    <label
      data-slot="checkbox-field"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-125",
        "has-[[data-slot=checkbox-content]]:items-start has-[[data-slot=checkbox-content]]:py-050 has-[[data-slot=checkbox-content]]:[&>[data-slot=checkbox]]:mt-025",
        className,
      )}
    >
      {children}
    </label>
  );
}
