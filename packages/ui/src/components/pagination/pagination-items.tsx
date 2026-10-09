import { cva } from "class-variance-authority";
import type { ReactElement } from "react";

import { PaginationLink } from "./pagination-link";
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
  renderLink?: (href: string) => ReactElement<Record<string, unknown>>;
}

// framework-agnostic: 기본은 일반 앵커이고, 라우터 링크는 renderLink로 받아 @roll-and-call/ui가 next/link를 모르게 한다
export function PaginationItems({
  page,
  totalPages,
  hrefFor,
  siblings,
  renderLink,
}: PaginationItemsProps) {
  const entries = paginationRange({ page, totalPages, siblings });

  return (
    <>
      {page > 1 ? (
        <PaginationLink
          renderLink={renderLink}
          href={hrefFor(page - 1)}
          data-slot="pagination-previous"
          className={cell()}
          aria-label="이전"
        >
          ‹
        </PaginationLink>
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
          <PaginationLink
            renderLink={renderLink}
            key={entry}
            href={hrefFor(entry)}
            data-slot="pagination-item"
            data-state={entry === page ? "active" : "inactive"}
            aria-current={entry === page ? "page" : undefined}
            aria-label={`${entry}쪽`}
            className={cell({ tone: entry === page ? "current" : "link" })}
          >
            {entry}
          </PaginationLink>
        ),
      )}

      {page < totalPages ? (
        <PaginationLink
          renderLink={renderLink}
          href={hrefFor(page + 1)}
          data-slot="pagination-next"
          className={cell()}
          aria-label="다음"
        >
          ›
        </PaginationLink>
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
