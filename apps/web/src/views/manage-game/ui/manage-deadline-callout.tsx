import { Button, Callout } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { ManageDeadlineNote } from "../model/manage-summary";

interface ManageDeadlineCalloutProps {
  note: ManageDeadlineNote;
  // 안내에 붙는 행동 버튼. 줄 안이 아니라 Callout에 둔다.
  action?: { label: string; href: string } | null;
}

export function ManageDeadlineCallout({ note, action }: ManageDeadlineCalloutProps) {
  return (
    <Callout.Root colorPalette={note.urgent ? "warning" : "gray"} size="sm">
      <Callout.Icon />
      <Callout.Description>{note.text}</Callout.Description>
      {action && (
        <Callout.Action>
          <Button
            size="sm"
            colorPalette={note.urgent ? "warning" : "primary"}
            render={<ServerLink path={action.href} />}
          >
            {action.label}
          </Button>
        </Callout.Action>
      )}
    </Callout.Root>
  );
}
