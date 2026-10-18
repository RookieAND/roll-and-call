"use client";

import { Card, HStack, Stepper, Switch, Text, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_RULE_PLAYS_MAX, type GameFormValues } from "@/features/write-game";

const DEFAULT_MIN_PLAYS = 3;

interface ParticipationConditionFieldProps {
  form: UseFormReturn<GameFormValues>;
  // 인증 없이 열 수 있는 룰이면 룰북 인증 줄을 숨긴다.
  certAvailable: boolean;
  // 신청자가 있어도 조건은 바꿀 수 있고, 이미 신청한 사람은 그대로 남는다.
  hasApplicants: boolean;
}

export function ParticipationConditionField({
  form,
  certAvailable,
  hasApplicants,
}: ParticipationConditionFieldProps) {
  const { setValue, watch } = form;
  const rule = watch("rule") || "이 룰";
  const minRulePlays = watch("minRulePlays");
  const requireRulebookCert = watch("requireRulebookCert");

  return (
    <VStack gap="100">
      <Text typography="body4" weight="bold">
        참여 조건
      </Text>
      <Card.Root padding="sm" radius={500}>
        <VStack gap="175">
          <HStack align="start" gap="150">
            <VStack gap="025" className="min-w-0 flex-1">
              <Text typography="subtitle2" render={<label htmlFor="minRulePlays" />}>
                플레이 횟수 제한
              </Text>
              <Text typography="body4" foreground="muted" render={<p />}>
                {rule}을 {minRulePlays === null ? "일정 횟수" : `${minRulePlays}회`} 이상 플레이한
                사람만 신청할 수 있습니다.
              </Text>
            </VStack>
            <Switch.Root
              aria-label="플레이 횟수 제한"
              checked={minRulePlays !== null}
              onCheckedChange={(on) =>
                setValue("minRulePlays", on ? DEFAULT_MIN_PLAYS : null, { shouldDirty: true })
              }
            >
              <Switch.Control />
            </Switch.Root>
          </HStack>
          {minRulePlays !== null && (
            <Stepper
              id="minRulePlays"
              aria-label="최소 플레이 횟수"
              value={minRulePlays}
              min={1}
              max={GAME_RULE_PLAYS_MAX}
              onChange={(count) => setValue("minRulePlays", count, { shouldDirty: true })}
            />
          )}
          {certAvailable && (
            <>
              <div className="h-px bg-gray-200" />
              <HStack align="start" gap="150">
                <VStack gap="025" className="min-w-0 flex-1">
                  <Text typography="subtitle2" render={<label htmlFor="requireRulebookCert" />}>
                    룰북 인증 필요
                  </Text>
                  <Text typography="body4" foreground="muted" render={<p />}>
                    {rule} 룰북을 인증한 사람만 신청할 수 있습니다.
                  </Text>
                </VStack>
                <Switch.Root
                  id="requireRulebookCert"
                  checked={requireRulebookCert}
                  onCheckedChange={(on) =>
                    setValue("requireRulebookCert", on, { shouldDirty: true })
                  }
                >
                  <Switch.Control />
                </Switch.Root>
              </HStack>
            </>
          )}
        </VStack>
      </Card.Root>
      {hasApplicants && (
        <Text typography="body4" foreground="muted" render={<p />}>
          조건을 바꿔도 이미 신청한 사람은 그대로 남습니다. 새로 신청하는 사람부터 적용됩니다.
        </Text>
      )}
    </VStack>
  );
}
