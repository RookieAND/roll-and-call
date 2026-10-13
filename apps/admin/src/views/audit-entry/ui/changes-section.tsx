import { Text, VStack } from "@roll-and-call/ui";

import type { AuditChange } from "@/shared/server";

import { ChangeRow } from "./change-row";
import { EntrySection } from "./entry-section";

interface ChangesSectionProps {
  changes: AuditChange[];
}

export function ChangesSection({ changes }: ChangesSectionProps) {
  return (
    <EntrySection
      title="바뀐 내용"
      right={
        <Text typography="body4" foreground="hint">
          {changes.length}칸
        </Text>
      }
    >
      <VStack render={<dl />} className="divide-y divide-(--rc-color-border-subtle)">
        {changes.map((change) => (
          <ChangeRow key={change.field} change={change} />
        ))}
      </VStack>
    </EntrySection>
  );
}
