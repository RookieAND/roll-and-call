"use client";

import { Button, Callout, HStack, Text, VStack } from "@roll-and-call/ui";
import { BookOpen, CircleCheck, Lock } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { RULE_GATE, ruleGate, ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import type { GameFormValues } from "@/features/write-game";
import { LineBreaks, ServerLink } from "@/shared/ui";

import { GameRulebookSheet } from "./game-rulebook-sheet";

interface GameRulebookFieldProps {
  form: UseFormReturn<GameFormValues>;
  rulebooks?: MyRulebooks;
}

export function GameRulebookField({ form, rulebooks }: GameRulebookFieldProps) {
  const [open, setOpen] = useState(false);
  const { setValue, watch, formState } = form;
  const rule = watch("rule");
  const rulebookId = watch("rulebookId");
  const set = rulebooks ? ruleSetOf({ myRulebooks: rulebooks, rulebookId }) : null;
  const gate = set && rulebooks ? ruleGate({ set, myRulebooks: rulebooks }) : null;
  const error = gate?.type === RULE_GATE.blocked ? null : formState.errors.rule?.message;
  const hint = rulebooks
    ? "구인을 열 룰과 판본을 고릅니다."
    : "룰을 잘못 골랐다면 구인을 지우고 새로 열어 주세요.";

  return (
    <VStack gap="100">
      <HStack gap="025">
        <Text typography="body4" weight="bold" id="rulebook-label">
          룰
        </Text>
        <Text typography="body4" weight="bold" foreground="danger" aria-hidden>
          *
        </Text>
      </HStack>

      {rulebooks ? (
        // ponytail: 두 줄 값을 담고 시트를 여는 칸이라 Select 대신 손으로 둔다.
        <button
          type="button"
          id="rule"
          aria-labelledby="rulebook-label"
          aria-invalid={Boolean(error) || gate?.type === RULE_GATE.blocked}
          onClick={() => setOpen(true)}
          className="flex min-h-14 w-full items-center gap-125 rounded-500 border border-gray-300 py-075 pr-075 pl-175 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus aria-invalid:border-danger-600"
        >
          <BookOpen size={18} strokeWidth={2.1} aria-hidden className="flex-none text-gray-600" />
          {set ? (
            <HStack align="baseline" gap="075" className="min-w-0 flex-1">
              <Text typography="body2" weight="bold">
                {set.categoryName}
              </Text>
              {set.edition && (
                <Text typography="body3" foreground="muted">
                  {set.edition}
                </Text>
              )}
            </HStack>
          ) : (
            <Text typography="body2" foreground="hint" className="flex-1">
              룰을 골라 주세요
            </Text>
          )}
          <Text typography="body3" weight="bold" foreground="primary" className="px-100">
            {set ? "바꾸기" : "고르기"}
          </Text>
        </button>
      ) : (
        <HStack
          align="center"
          gap="125"
          aria-disabled="true"
          className="min-h-14 rounded-500 bg-gray-100 px-175 py-100"
        >
          <Text typography="body2" weight="bold" foreground="muted" className="flex-1">
            {rule}
          </Text>
          <Lock size={16} strokeWidth={2.2} aria-label="잠김" className="text-hint" />
        </HStack>
      )}

      {gate?.okText && (
        <HStack align="center" gap="075">
          <CircleCheck size={15} strokeWidth={2.2} aria-hidden className="text-success-700" />
          <Text typography="body3" weight="bold" foreground="success">
            {gate.okText}
          </Text>
        </HStack>
      )}
      {gate && gate.type !== RULE_GATE.open && (
        <Callout.Root colorPalette="danger">
          <Callout.Icon />
          <Callout.Description className="break-keep">
            <LineBreaks lines={gate.lines} />
          </Callout.Description>
          {gate.action && (
            <Callout.Action>
              <Button render={<ServerLink path={gate.action.href} />} size="sm" variant="solid">
                {gate.action.label}
              </Button>
            </Callout.Action>
          )}
        </Callout.Root>
      )}

      {error ? (
        <Text typography="body4" foreground="danger" role="alert">
          {error}
        </Text>
      ) : (
        !gate?.lines.length && (
          <Text typography="body4" foreground="hint">
            {hint}
          </Text>
        )
      )}

      {rulebooks && (
        <GameRulebookSheet
          open={open}
          onOpenChange={setOpen}
          rulebooks={rulebooks}
          selectedKey={set?.key ?? null}
          onSelect={(picked) => {
            setValue("rulebookId", picked.cores[0]!.id, { shouldDirty: true });
            setValue("rule", picked.label, { shouldDirty: true, shouldValidate: true });
          }}
        />
      )}
    </VStack>
  );
}
