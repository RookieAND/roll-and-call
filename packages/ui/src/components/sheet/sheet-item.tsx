"use client";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import { Button, type ButtonProps } from "../button/button";

// 시트 안 목록 한 줄. 누르면 무언가를 고르거나 다음 화면으로 넘어간다.
export function SheetItem({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      data-slot="sheet-item"
      className={(state) =>
        cn(
          "h-auto min-h-[52px] w-full justify-between rounded-none border-b border-gray-100 px-0 text-left text-body2 font-normal text-gray-800 last:border-b-0 hover:bg-transparent",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
