"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";
import { Check, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { CERT_STATE, type MyRulebooks } from "@/entities/rulebook";
import type { GameFormValues } from "@/features/write-game";

import { GameRulebookSheet } from "./game-rulebook-sheet";

interface GameRulebookFieldProps {
  form: UseFormReturn<GameFormValues>;
  // 없으면 수정 화면이다. 룰북은 잠그고 시트를 열지 않는다.
  rulebooks?: MyRulebooks;
}

export function GameRulebookField({ form, rulebooks }: GameRulebookFieldProps) {
  const [open, setOpen] = useState(false);
  const { setValue, watch, formState } = form;
  const rule = watch("rule");
  const rulebookId = watch("rulebookId");
  const error = formState.errors.rule?.message;
  const picked = rulebooks?.rulebooks.find((rulebook) => rulebook.id === rulebookId);
  const pickedCertified = picked?.state === CERT_STATE.certified;
  const pickedTag = picked?.certRequired ? "인증 전" : "무료 배포";
  const hint = rulebooks
    ? "인증한 룰북과 무료 배포 룰 가운데서 고릅니다."
    : "룰북을 잘못 골랐다면 구인을 지우고 새로 열어 주세요.";

  return (
    <VStack gap="100">
      <HStack gap="025">
        <Text typography="body4" weight="bold" id="rulebook-label">
          룰북
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
          aria-invalid={Boolean(error)}
          onClick={() => setOpen(true)}
          className="flex min-h-14 w-full items-center gap-125 rounded-500 border border-gray-300 px-175 py-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus aria-invalid:border-danger-600"
        >
          {picked ? (
            <VStack className="min-w-0 flex-1">
              <Text typography="body2" weight="bold">
                {picked.name}
              </Text>
              <HStack align="center" gap="050">
                <Text typography="body4" foreground="muted">
                  {picked.edition || "기본판"} ·
                </Text>
                {pickedCertified ? (
                  <>
                    <Check size={12} strokeWidth={3} aria-hidden className="text-success-700" />
                    <Text typography="body4" weight="bold" foreground="success">
                      인증한 룰북
                    </Text>
                  </>
                ) : (
                  <Text typography="body4" foreground="muted">
                    {pickedTag}
                  </Text>
                )}
              </HStack>
            </VStack>
          ) : (
            <Text typography="body2" foreground="hint" className="flex-1">
              룰북을 선택해 주세요
            </Text>
          )}
          {picked ? (
            <Text typography="body4" weight="bold" foreground="primary">
              바꾸기
            </Text>
          ) : (
            <ChevronRight size={16} aria-hidden className="text-hint" />
          )}
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

      {error ? (
        <Text typography="body4" foreground="danger" role="alert">
          {error}
        </Text>
      ) : (
        <Text typography="body4" foreground="hint">
          {hint}
        </Text>
      )}

      {rulebooks && (
        <GameRulebookSheet
          open={open}
          onOpenChange={setOpen}
          rulebooks={rulebooks}
          selectedId={rulebookId}
          onSelect={(rulebook) => {
            setValue("rulebookId", rulebook.id, { shouldDirty: true });
            setValue("rule", rulebook.label, { shouldDirty: true, shouldValidate: true });
          }}
        />
      )}
    </VStack>
  );
}
