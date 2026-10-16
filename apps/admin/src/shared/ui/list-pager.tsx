"use client";

import { Pagination, Text } from "@roll-and-call/ui";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { PAGE_SIZE } from "@/shared/lib";

import { PageSizeSelector } from "./page-size-selector";

interface ListPagerProps {
  page: number;
  totalPages: number;
  total: number;
  unit: string;
  pageSize?: number;
  pageSizeSelectable?: boolean;
}

export function ListPager({
  page,
  totalPages,
  total,
  unit,
  pageSize = PAGE_SIZE,
  pageSizeSelectable = true,
}: ListPagerProps) {
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
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-150 border-t border-(--rc-color-border-subtle) px-175 py-125 whitespace-nowrap">
      <Text typography="body4" foreground="muted">
        전체 {total}
        {unit} 중 {from}–{to}
      </Text>
      <Pagination
        page={page}
        totalPages={totalPages}
        siblings={1}
        hrefFor={hrefFor}
        renderLink={(href) => <Link href={href} />}
        className="**:data-[slot^=pagination-]:h-8 **:data-[slot^=pagination-]:min-w-8"
      />
      <div className="col-start-3 flex justify-end">
        {pageSizeSelectable ? <PageSizeSelector value={pageSize} /> : null}
      </div>
    </div>
  );
}
