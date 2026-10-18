"use client";

import { Chip, HStack } from "@roll-and-call/ui";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface UrlFilterChipsProps {
  param: string;
  // 첫 칩은 「전체」(값 없음)다.
  options: { label: string; value: string }[];
  allLabel?: string;
}

// 목록 위 필터 칩 한 줄. 넘치면 가로로 스크롤하고, 하나만 켠다.
export function UrlFilterChips({ param, options, allLabel = "전체" }: UrlFilterChipsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? undefined;
  const hrefOf = (value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (value) next.set(param, value);
    else next.delete(param);
    return next.size ? `${pathname}?${next}` : pathname;
  };
  const chips = [{ label: allLabel, value: undefined }, ...options];
  return (
    <HStack gap="075" className="-mx-200 overflow-x-auto px-200 scrollbar-none">
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          selected={current === chip.value}
          render={<Link href={hrefOf(chip.value)} prefetch={false} replace scroll={false} />}
        >
          {chip.label}
        </Chip>
      ))}
    </HStack>
  );
}
