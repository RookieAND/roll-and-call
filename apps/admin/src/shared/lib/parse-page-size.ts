import { PAGE_SIZE } from "./paginate";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function parsePageSize(param: string | undefined): PageSize {
  const requested = Number.parseInt(param ?? "", 10);
  return PAGE_SIZE_OPTIONS.find((option) => option === requested) ?? PAGE_SIZE;
}
