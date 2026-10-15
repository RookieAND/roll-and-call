"use client";

import { Checkbox, Text, VStack, cn } from "@roll-and-call/ui";
import { compact } from "es-toolkit";

import type { GrantOptions } from "@/entities/cert/server";

import type { GrantMemberPlan } from "../model/grant-candidate-status";
import { grantMemberText } from "../model/grant-candidate-text";

interface GrantMemberRowProps {
  member: GrantOptions["members"][number];
  plan: GrantMemberPlan;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function GrantMemberRow({
  member,
  plan,
  checked,
  disabled,
  onCheckedChange,
}: GrantMemberRowProps) {
  // 룰북을 고르기 전에는 잠그지 않는다. 고른 뒤 부여할 책이 하나도 없는 유저만 잠근다.
  const locked = plan.statuses.length > 0 && plan.grantable.length === 0;
  const meta = compact([`@${member.discordHandle}`, grantMemberText(plan)]).join(" · ");
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
