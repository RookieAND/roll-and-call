export const PAGINATION_ELLIPSIS = "ellipsis";

export type PaginationEntry = number | typeof PAGINATION_ELLIPSIS;

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

// 첫·끝 쪽은 늘 보이고 현재 쪽 둘레(siblings)만 펼친다. 가장자리에서도 칸 수가 같아 누를 때 버튼 자리가 흔들리지 않는다.
export function paginationRange({
  page,
  totalPages,
  siblings,
}: {
  page: number;
  totalPages: number;
  siblings: number;
}): PaginationEntry[] {
  const totalSlots = siblings * 2 + 5;
  if (totalPages <= totalSlots) return range(1, totalPages);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, totalPages);
  const showLeftEllipsis = left > 3;
  const showRightEllipsis = right < totalPages - 2;
  const edgeCount = siblings * 2 + 3;

  if (!showLeftEllipsis) {
    return [...range(1, edgeCount), PAGINATION_ELLIPSIS, totalPages];
  }
  if (!showRightEllipsis) {
    return [1, PAGINATION_ELLIPSIS, ...range(totalPages - edgeCount + 1, totalPages)];
  }
  return [1, PAGINATION_ELLIPSIS, ...range(left, right), PAGINATION_ELLIPSIS, totalPages];
}
