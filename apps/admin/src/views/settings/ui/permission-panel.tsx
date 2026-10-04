import { Text, VStack } from "@roll-and-call/ui";

import { Panel } from "@/shared/ui";

import { PERMISSION_NOTES } from "../model/permission-notes";
import { PermissionTable } from "./permission-table";

export function PermissionPanel() {
  return (
    <Panel
      title="권한"
      bodyClassName="p-175"
      footer={
        <VStack
          gap="025"
          render={<ul />}
          className="border-t border-(--rc-color-border-subtle) px-175 py-125"
        >
          {PERMISSION_NOTES.map((note) => (
            <Text key={note} typography="body4" foreground="hint" render={<li />}>
              {note}
            </Text>
          ))}
        </VStack>
      }
    >
      <PermissionTable />
    </Panel>
  );
}
