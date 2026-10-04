"use client";

import { Checkbox, Text, VStack, cn } from "@roll-and-call/ui";
import { compact } from "es-toolkit";

import type { GrantOptions } from "@/shared/server";

import { GRANT_CANDIDATE_STATUS, type GrantCandidateStatus } from "../model/grant-candidate-status";
import { GRANT_CANDIDATE_TEXT } from "../model/grant-candidate-text";

interface GrantMemberRowProps {
  member: GrantOptions["members"][number];
  status: GrantCandidateStatus | null;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const LOCKED: readonly (GrantCandidateStatus | null)[] = [
  GRANT_CANDIDATE_STATUS.certified,
  GRANT_CANDIDATE_STATUS.blocked,
];

export function GrantMemberRow({
  member,
  status,
  checked,
  disabled,
  onCheckedChange,
}: GrantMemberRowProps) {
  const locked = LOCKED.includes(status);
  const meta = compact([`@${member.discordHandle}`, status && GRANT_CANDIDATE_TEXT[status]]).join(
    " · ",
  );
  return (
    <li
      className={cn(
        "border-t border-(--rc-color-border-subtle) px-150 py-100 first:border-t-0",
        checked && "bg-tinted-bg",
        locked && "opacity-50",
      )}
    >
      <Checkbox.Field>
        <Checkbox.Root
          checked={checked}
          disabled={disabled || locked}
          onCheckedChange={onCheckedChange}
        >
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>
          <VStack render={<span />}>
            <Text typography="body3" weight="bold">
              {member.nickname}
            </Text>
            <Text typography="body4" foreground="hint">
              {meta}
            </Text>
          </VStack>
        </Checkbox.Label>
      </Checkbox.Field>
    </li>
  );
}
