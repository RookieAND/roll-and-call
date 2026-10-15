"use client";

import { IconButton, Sheet } from "@roll-and-call/ui";
import { X } from "lucide-react";

export function MobileDrawerClose() {
  return (
    <Sheet.Close
      render={<IconButton aria-label="메뉴 닫기" className="ml-auto size-11 text-gray-900" />}
    >
      <X size={22} aria-hidden />
    </Sheet.Close>
  );
}
