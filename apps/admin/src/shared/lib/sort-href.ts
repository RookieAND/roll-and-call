import { SORT_DIR, type TableSort } from "./table-sort";

interface SortHrefOptions<Column extends string> {
  href: string;
  sort: TableSort<Column>;
  column: Column;
}

// 같은 열이면 방향을 뒤집고 다른 열이면 그 열의 처음 방향으로. 1쪽으로 돌아가고 필터·검색어는 남긴다.
export function sortHref<Column extends string>({ href, sort, column }: SortHrefOptions<Column>) {
  const url = new URL(href, "http://admin.local");
  const flipped = sort.dir === SORT_DIR.asc ? SORT_DIR.desc : SORT_DIR.asc;
  const dir = column === sort.column ? flipped : sort.columns[column];
  url.searchParams.set("sort", column);
  url.searchParams.set("dir", dir);
  url.searchParams.delete("page");
  return `${url.pathname}${url.search}`;
}
