import { HStack, Text } from "@roll-and-call/ui";
import { Clock } from "lucide-react";

import type { ManageDeadlineNote } from "../model/manage-summary";

interface ManageDeadlineLineProps {
  note: ManageDeadlineNote;
}

export function ManageDeadlineLine({ note }: ManageDeadlineLineProps) {
  return (
    <HStack align="center" gap="075" className="mt-150">
      <Clock size={14} aria-hidden className="shrink-0 text-hint" />
      <Text
        typography="body4"
        weight={note.urgent ? "bold" : "regular"}
        foreground={note.urgent ? "warning" : "muted"}
        render={<p />}
        className="min-w-0 flex-1 text-pretty"
      >
        {note.text}
      </Text>
    </HStack>
  );
}
