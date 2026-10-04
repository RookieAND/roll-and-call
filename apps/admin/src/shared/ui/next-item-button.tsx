import { Button } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import { ServerLink } from "./server-link";

interface NextItemButtonProps {
  href?: string;
}

// 들어온 목록의 필터·정렬 안에서 다음 행으로 간다. 마지막 건이면 href 없이 비활성이다(D278).
export function NextItemButton({ href }: NextItemButtonProps) {
  if (isUndefined(href)) {
    return (
      <Button variant="outline" size="sm" disabled>
        다음 건
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" render={<ServerLink path={href} />}>
      다음 건
    </Button>
  );
}
