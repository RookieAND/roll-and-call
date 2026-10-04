"use client";

import { HStack, Table, cn } from "@roll-and-call/ui";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { SORT_DIR, sortHref, type TableSort } from "@/shared/lib";

const CARET_PATH = {
  [SORT_DIR.asc]: "M12 7l6.5 9h-13z",
  [SORT_DIR.desc]: "M12 17 5.5 8h13z",
  none: "M12 3.5 17 10H7z M12 20.5 7 14h10z",
} as const;

const ARIA_SORT = { [SORT_DIR.asc]: "ascending", [SORT_DIR.desc]: "descending" } as const;

interface SortableHeadProps<Column extends string> {
  column: Column;
  label: string;
  sort: TableSort<Column>;
  align?: "start" | "center" | "end";
}

// 머리글 전체가 정렬 링크다(D200). 정렬하지 않는 머리글은 Table.Head를 그대로 쓴다.
export function SortableHead<Column extends string>({
  column,
  label,
  sort,
  align = "start",
}: SortableHeadProps<Column>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = sort.column === column;
  const caret = active ? CARET_PATH[sort.dir] : CARET_PATH.none;
  const ariaSort = active ? ARIA_SORT[sort.dir] : "none";
  const href = sortHref({ href: `${pathname}?${searchParams.toString()}`, sort, column });

  return (
    <Table.Head
      align={align}
      aria-sort={ariaSort}
      className={cn("group/sort p-0 hover:bg-gray-100", active && "font-medium text-gray-900")}
    >
      <HStack
        align="center"
        justify={align}
        gap="050"
        render={<Link href={href} scroll={false} />}
        className="h-full px-150"
      >
        {label}
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className={cn(
            "shrink-0",
            active ? "text-primary-600" : "text-hint group-hover/sort:text-gray-600",
          )}
        >
          <path d={caret} />
        </svg>
      </HStack>
    </Table.Head>
  );
}
