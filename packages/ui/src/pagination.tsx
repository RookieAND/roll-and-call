import { cn } from "./cn";

export type PaginationProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  siblings?: number;
  className?: string;
};

const cell =
  "inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-[9px] px-2 text-[13px]";

// framework-agnostic: renders plain anchors so @trpg/ui stays free of next/link
export function Pagination({
  page,
  totalPages,
  hrefFor,
  siblings = 2,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - siblings);
  const end = Math.min(totalPages, page + siblings);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {page > 1 ? (
        <a
          href={hrefFor(page - 1)}
          className={cn(cell, "border border-gray-200 text-gray-700 hover:bg-gray-50")}
          aria-label="이전"
        >
          ‹
        </a>
      ) : (
        <span className={cn(cell, "border border-gray-200 text-gray-400")} aria-hidden>
          ‹
        </span>
      )}

      {pages.map((p) => (
        <a
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            cell,
            p === page
              ? "bg-primary-600 font-bold text-white"
              : "border border-gray-200 text-gray-700 hover:bg-gray-50",
          )}
        >
          {p}
        </a>
      ))}

      {page < totalPages ? (
        <a
          href={hrefFor(page + 1)}
          className={cn(cell, "border border-gray-200 text-gray-700 hover:bg-gray-50")}
          aria-label="다음"
        >
          ›
        </a>
      ) : (
        <span className={cn(cell, "border border-gray-200 text-gray-400")} aria-hidden>
          ›
        </span>
      )}
    </nav>
  );
}
