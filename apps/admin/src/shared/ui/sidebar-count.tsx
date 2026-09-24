"use client";

import { Text, cn } from "@roll-and-call/ui";
import { use } from "react";

interface SidebarCountProps {
  countPromise: Promise<number | undefined>;
  active: boolean;
}

// 처리 대기 건수는 값을 받은 뒤에만 그린다. 받는 동안은 자리를 비운다.
export function SidebarCount({ countPromise, active }: SidebarCountProps) {
  const count = use(countPromise);
  if (!count) return null;
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground="inherit"
      numeric
      className={cn(
        "min-w-[18px] rounded-400 px-075 py-025 text-center",
        active ? "bg-primary-600 text-on-primary" : "bg-gray-200 text-gray-600",
      )}
    >
      {count}
    </Text>
  );
}
