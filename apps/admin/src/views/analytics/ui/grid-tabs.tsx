"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GRID_MODE, type GridMode } from "../model/grid-mode";

interface GridTabsProps {
  mode: GridMode;
}

// 탭은 주소의 grid로 기억한다. 기본값(진행된 세션)이면 쿼리를 지운다.
export function GridTabs({ mode }: GridTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <SegmentedControl.Root
      value={mode}
      size="sm"
      fullWidth={false}
      aria-label="격자 보기"
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        if (value === GRID_MODE.open) next.set("grid", value);
        else next.delete("grid");
        router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
    >
      <SegmentedControl.Item value={GRID_MODE.finished}>진행된 세션</SegmentedControl.Item>
      <SegmentedControl.Item value={GRID_MODE.open}>모집 중</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
