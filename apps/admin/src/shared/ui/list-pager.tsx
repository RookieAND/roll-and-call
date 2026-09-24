import { HStack, Pagination, Text } from "@roll-and-call/ui";

import { PAGE_SIZE } from "@/shared/lib";

interface ListPagerProps {
  page: number;
  totalPages: number;
  total: number;
  unit: string;
  hrefFor: (page: number) => string;
}

// 목록 패널 바닥. 왼쪽에 지금 보는 범위, 오른쪽에 페이지 이동.
export function ListPager({ page, totalPages, total, unit, hrefFor }: ListPagerProps) {
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(total, page * PAGE_SIZE);
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
