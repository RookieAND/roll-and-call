export const PAGE_SIZE = 10;

// 주소의 page 값(1부터)으로 한 페이지만 잘라 낸다. 범위를 벗어나면 가까운 끝 페이지로 맞춘다.
export function paginate<Row>(rows: Row[], pageParam: string | undefined) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const requested = Number.parseInt(pageParam ?? "", 10) || 1;
  const page = Math.min(totalPages, Math.max(1, requested));
  return { page, totalPages, rows: rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}
