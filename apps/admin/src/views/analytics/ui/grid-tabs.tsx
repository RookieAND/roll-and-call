"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GRID_MODE, GRID_MODE_LABEL, type GridMode } from "../model/grid-mode";

interface GridTabsProps {
  mode: GridMode;
  disabled?: boolean;
}

export function GridTabs({ mode, disabled }: GridTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <SegmentedControl.Root
      value={mode}
      size="sm"
      fullWidth={false}
      aria-label="격자 보기"
      disabled={disabled}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        if (value === GRID_MODE.open) next.set("grid", value);
        else next.delete("grid");
        router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
    >
      {Object.values(GRID_MODE).map((value) => (
        <SegmentedControl.Item key={value} value={value}>
          {GRID_MODE_LABEL[value]}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
