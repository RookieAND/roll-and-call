import { Button, HStack } from "@roll-and-call/ui";

import { MobileActionBar, MobileMoreSheet, ServerLink } from "@/shared/ui";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";
import { REQUEST_ACTION_LABEL } from "../model/request-action-label";

interface MobileRequestActionsProps {
  similar: boolean;
  actionHrefs: Record<RequestAction, string>;
}

// 데스크톱 행 메뉴와 같은 순서. 주 조치는 화면 아래, 나머지는 [⋯] 시트에 둔다.
export function MobileRequestActions({ similar, actionHrefs }: MobileRequestActionsProps) {
  const primary = similar ? REQUEST_ACTION.link : REQUEST_ACTION.add;
  const others = Object.values(REQUEST_ACTION).filter((action) => action !== primary);
  return (
    <MobileActionBar>
      <HStack gap="100">
        <Button
          size="lg"
          render={<ServerLink path={actionHrefs[primary]} scroll={false} />}
          className="flex-1"
        >
          {REQUEST_ACTION_LABEL[primary]}
        </Button>
        <MobileMoreSheet title="요청 처리">
          {others.map((action) => (
            <Button
              key={action}
              variant="outline"
              colorPalette={action === REQUEST_ACTION.reject ? "danger" : "gray"}
              size="lg"
              render={<ServerLink path={actionHrefs[action]} scroll={false} />}
            >
              {REQUEST_ACTION_LABEL[action]}
            </Button>
          ))}
        </MobileMoreSheet>
      </HStack>
    </MobileActionBar>
  );
}
