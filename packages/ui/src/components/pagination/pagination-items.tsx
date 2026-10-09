import { cva } from "class-variance-authority";

import { PAGINATION_ELLIPSIS, paginationRange } from "./pagination-range";

const cell = cva(
  "inline-flex h-10 min-w-10 items-center justify-center rounded-400 px-100 text-body3",
  {
    variants: {
      tone: {
        link: "border border-gray-200 text-gray-700 hover:bg-gray-50",
        current: "bg-primary-600 font-bold text-white",
        disabled: "border border-gray-200 text-gray-400",
        ellipsis: "text-hint",
      },
    },
    defaultVariants: { tone: "link" },
  },
);

interface PaginationItemsProps {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  siblings: number;
}

// framework-agnostic: renders plain anchors so @roll-and-call/ui stays free of next/link
export function PaginationItems({ page, totalPages, hrefFor, siblings }: PaginationItemsProps) {
  const entries = paginationRange({ page, totalPages, siblings });

  return (
    <>
      {page > 1 ? (
        <a
          href={hrefFor(page - 1)}
          data-slot="pagination-previous"
          className={cell()}
          aria-label="이전"
        >
          ‹
        </a>
      ) : (
        <span
          data-slot="pagination-previous"
          data-disabled=""
          className={cell({ tone: "disabled" })}
          aria-hidden
        >
          ‹
        </span>
      )}

      {entries.map((entry, index) =>
        entry === PAGINATION_ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            data-slot="pagination-ellipsis"
            className={cell({ tone: "ellipsis" })}
            aria-hidden
          >
            …
          </span>
        ) : (
          <a
            key={entry}
            href={hrefFor(entry)}
            data-slot="pagination-item"
            data-state={entry === page ? "active" : "inactive"}
            aria-current={entry === page ? "page" : undefined}
            aria-label={`${entry}쪽`}
            className={cell({ tone: entry === page ? "current" : "link" })}
          >
            {entry}
          </a>
        ),
      )}

      {page < totalPages ? (
        <a
          href={hrefFor(page + 1)}
          data-slot="pagination-next"
          className={cell()}
          aria-label="다음"
        >
          ›
        </a>
      ) : (
        <span
          data-slot="pagination-next"
          data-disabled=""
          className={cell({ tone: "disabled" })}
          aria-hidden
        >
          ›
        </span>
      )}
    </>
  );
}
