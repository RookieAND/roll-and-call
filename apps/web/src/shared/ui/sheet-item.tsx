"use client";

import { Button, type ButtonProps, cn } from "@roll-and-call/ui";

export function SheetItem({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto min-h-[52px] w-full justify-between rounded-none border-b border-gray-100 px-0 text-left text-body2 font-normal text-gray-800 last:border-b-0 hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
