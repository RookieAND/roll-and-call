import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { ArrowRight } from "lucide-react";

import type { AuditChange } from "@/shared/server";

import { changeKind } from "../model/change-kind";
import { ChangeTag } from "./change-tag";
import { ChangeValue } from "./change-value";

interface ChangeRowProps {
  change: AuditChange;
}

function ListChangeLines({ change }: ChangeRowProps) {
  return (
    <>
      {(change.added ?? []).map((item) => (
        <HStack key={`added-${item}`} align="start" gap="100">
          <ChangeTag kind="added" />
          <ChangeValue>{item}</ChangeValue>
        </HStack>
      ))}
      {(change.removed ?? []).map((item) => (
        <HStack key={`removed-${item}`} align="start" gap="100">
          <ChangeTag kind="removed" />
          <ChangeValue struck>{item}</ChangeValue>
        </HStack>
      ))}
    </>
  );
}

function ScalarChangeLine({ change }: ChangeRowProps) {
  const kind = changeKind(change);
  return (
    <HStack align="start" gap="100" wrap>
      <ChangeTag kind={kind} />
      {!isUndefined(change.before) ? (
        <ChangeValue struck={kind === "removed"}>{change.before}</ChangeValue>
      ) : null}
      {kind === "changed" ? (
        <ArrowRight size={16} aria-label="에서" className="mt-025 shrink-0 text-hint" />
      ) : null}
      {kind !== "removed" && !isUndefined(change.after) ? (
        <ChangeValue>{change.after}</ChangeValue>
      ) : null}
    </HStack>
  );
}

export function ChangeRow({ change }: ChangeRowProps) {
  const isList = !isUndefined(change.added) || !isUndefined(change.removed);
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-x-150 py-100">
      <Text typography="body4" foreground="hint" render={<dt />} className="pt-025">
        {change.field}
      </Text>
      <VStack gap="075" render={<dd />}>
        {isList ? <ListChangeLines change={change} /> : <ScalarChangeLine change={change} />}
      </VStack>
    </div>
  );
}
