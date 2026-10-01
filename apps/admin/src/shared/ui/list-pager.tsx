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
