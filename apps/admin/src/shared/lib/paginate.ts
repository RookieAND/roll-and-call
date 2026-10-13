export const PAGE_SIZE = 10;
export const CATEGORY_PAGE_SIZE = 12;

export function paginate<Row>(rows: Row[], pageParam: string | undefined, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const requested = Number.parseInt(pageParam ?? "", 10) || 1;
  const page = Math.min(totalPages, Math.max(1, requested));
  return { page, totalPages, rows: rows.slice((page - 1) * size, page * size) };
}
