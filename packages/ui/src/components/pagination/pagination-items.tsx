import { cva } from "class-variance-authority";

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

interface PaginationItemsProps {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  siblings: number;
}

// framework-agnostic: renders plain anchors so @roll-and-call/ui stays free of next/link
export function PaginationItems({ page, totalPages, hrefFor, siblings }: PaginationItemsProps) {
  const start = Math.max(1, page - siblings);
  const end = Math.min(totalPages, page + siblings);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

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

      {pages.map((pageNumber) => (
        <a
          key={pageNumber}
          href={hrefFor(pageNumber)}
          data-slot="pagination-item"
          data-state={pageNumber === page ? "active" : "inactive"}
          aria-current={pageNumber === page ? "page" : undefined}
          className={cell({ tone: pageNumber === page ? "current" : "link" })}
        >
          {pageNumber}
        </a>
      ))}

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
