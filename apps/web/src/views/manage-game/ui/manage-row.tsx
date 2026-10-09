import { HStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { ServerLink } from "@/shared/ui";

import { MANAGE_ROW_ACTION, type ManageRow as Row } from "../model/manage-row-state";
import { AttendanceRowButton } from "./attendance-row-button";
import { ManageRowButton } from "./manage-row-button";
import { ManageRowContent } from "./manage-row-content";

const manageRow = cva("min-h-16 px-175 py-150", {
  variants: {
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
    blocked: { true: "bg-danger-50 hover:bg-danger-50", false: "" },
  },
});

interface ManageRowProps {
  row: Row;
  gameId: string;
  plannedEndAt: Date | null;
}

export function ManageRow({ row, gameId, plannedEndAt }: ManageRowProps) {
  if (row.action === MANAGE_ROW_ACTION.endSession && plannedEndAt) {
    return (
      <AttendanceRowButton gameId={gameId} plannedEndAt={plannedEndAt}>
        <ManageRowContent row={row} chevron />
      </AttendanceRowButton>
    );
  }

  const container = row.href ? <ServerLink path={row.href} /> : <div />;

  const content = (
    <HStack
      align="center"
      gap="150"
      render={container}
      className={manageRow({ interactive: Boolean(row.href), blocked: row.state === "blocked" })}
    >
      <ManageRowContent row={row} chevron={Boolean(row.href)} />
    </HStack>
  );
  if (!row.button) return content;

  return (
    <div>
      {content}
      <ManageRowButton button={row.button} />
    </div>
  );
}
