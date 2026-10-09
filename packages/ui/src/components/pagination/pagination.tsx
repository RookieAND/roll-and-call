import { useRender } from "@base-ui-components/react/use-render";
import type { ReactElement } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateProps } from "../../lib/state-props";
import { PaginationItems } from "./pagination-items";

type PaginationState = { page: number; totalPages: number };

export interface PaginationProps extends StateProps<PaginationState> {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  siblings?: number;
  renderLink?: (href: string) => ReactElement<Record<string, unknown>>;
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
  siblings = 2,
  renderLink,
  className,
  style,
  render,
}: PaginationProps) {
  const state = { page, totalPages };
  return useRender({
    enabled: totalPages > 1,
    defaultTagName: "nav",
    render,
    state,
    props: {
      "data-slot": "pagination",
      "aria-label": "페이지네이션",
      className: cn(
        "flex items-center justify-center gap-050",
        resolveStateProp({ prop: className, state }),
      ),
      style: resolveStateProp({ prop: style, state }),
      children: (
        <PaginationItems
          page={page}
          totalPages={totalPages}
          hrefFor={hrefFor}
          siblings={siblings}
          renderLink={renderLink}
        />
      ),
    },
  });
}
