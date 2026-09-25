"use client";

import { HStack, Pagination, Text } from "@roll-and-call/ui";
import { usePathname, useSearchParams } from "next/navigation";

import { PAGE_SIZE } from "@/shared/lib";

interface ListPagerProps {
  page: number;
  totalPages: number;
  total: number;
  unit: string;
  pageSize?: number;
}

// 목록 패널 바닥. 왼쪽에 지금 보는 범위, 오른쪽에 페이지 이동. 행이 없으면 그리지 않는다.
// 다른 쿼리(필터·탭)는 그대로 두고 page만 바꾼다.
export function ListPager({ page, totalPages, total, unit, pageSize = PAGE_SIZE }: ListPagerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (!total) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const hrefFor = (target: number) => {
    const next = new URLSearchParams(searchParams);
    if (target === 1) next.delete("page");
    else next.set("page", String(target));
    return next.size ? `${pathname}?${next}` : pathname;
  };

  return (
    <HStack
      align="center"
      gap="150"
      className="shrink-0 border-t border-(--rc-color-border-subtle) px-175 py-100 whitespace-nowrap"
    >
      <Text typography="body4" foreground="hint">
        전체 {total}
        {unit} 중 {from}–{to}
      </Text>
      <Pagination
        page={page}
        totalPages={totalPages}
        siblings={1}
        hrefFor={hrefFor}
        className="ml-auto"
      />
    </HStack>
  );
}
