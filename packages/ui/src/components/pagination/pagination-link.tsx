import { useRender } from "@base-ui-components/react/use-render";
import type { ComponentPropsWithRef, ReactElement } from "react";

export interface PaginationLinkProps extends ComponentPropsWithRef<"a"> {
  href: string;
  // 앱이 라우터 링크로 바꿀 때 쓴다. 없으면 일반 앵커다.
  renderLink?: (href: string) => ReactElement<Record<string, unknown>>;
}

export function PaginationLink({ href, renderLink, ...props }: PaginationLinkProps) {
  return useRender({
    defaultTagName: "a",
    render: renderLink?.(href),
    props: { href, ...props },
  });
}
