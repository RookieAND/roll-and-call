export const PAGE_SIZE = 20;
export const CATEGORY_PAGE_SIZE = 12;

// 주소의 page 값(1부터)으로 한 페이지만 잘라 낸다. 범위를 벗어나면 가까운 끝 페이지로 맞춘다.
export function paginate<Row>(rows: Row[], pageParam: string | undefined, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const requested = Number.parseInt(pageParam ?? "", 10) || 1;
  const page = Math.min(totalPages, Math.max(1, requested));
  return { page, totalPages, rows: rows.slice((page - 1) * size, page * size) };
}
