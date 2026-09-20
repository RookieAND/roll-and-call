import { cva } from "class-variance-authority";

import { cn } from "./cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  siblings?: number;
  className?: string;
}

const cell = cva(
  "inline-flex h-10 min-w-10 items-center justify-center rounded-400 px-100 text-body3",
  {
    variants: {
      tone: {
        link: "border border-gray-200 text-gray-700 hover:bg-gray-50",
        current: "bg-primary-600 font-bold text-white",
        disabled: "border border-gray-200 text-gray-400",
      },
    },
    defaultVariants: { tone: "link" },
  },
);

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
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-050", className)}
    >
      {page > 1 ? (
        <a href={hrefFor(page - 1)} className={cell()} aria-label="이전">
          ‹
        </a>
      ) : (
        <span className={cell({ tone: "disabled" })} aria-hidden>
          ‹
        </span>
      )}

      {pages.map((pageNumber) => (
        <a
          key={pageNumber}
          href={hrefFor(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
          className={cell({ tone: pageNumber === page ? "current" : "link" })}
        >
          {pageNumber}
        </a>
      ))}

      {page < totalPages ? (
        <a href={hrefFor(page + 1)} className={cell()} aria-label="다음">
          ›
        </a>
      ) : (
        <span className={cell({ tone: "disabled" })} aria-hidden>
          ›
        </span>
      )}
    </nav>
  );
}
