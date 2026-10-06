"use client";

import { Field, HStack, Text, TextInput } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

interface MinPlayersFieldProps {
  form: UseFormReturn<GameFormValues>;
  locked: boolean;
}

export function MinPlayersField({ form, locked }: MinPlayersFieldProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Field.Root error={errors.minPlayers?.message}>
      <Field.Label htmlFor="minPlayers">
        최소 인원{" "}
        <Text render={<span />} typography="body4" foreground="muted">
          선택
        </Text>
      </Field.Label>
      <HStack align="center" gap="100">
        <TextInput
          id="minPlayers"
          inputMode="numeric"
          placeholder="없음"
          invalid={!!errors.minPlayers}
          className="w-24"
          {...register("minPlayers")}
        />
        <Text typography="body3">명</Text>
      </HStack>
      <Text typography="body4" foreground="muted" render={<p />}>
        {locked ? (
          <>
            신청자가 있어 최소 인원은 낮출 수만 있습니다.
            <br />
            올리려면 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.
          </>
        ) : (
          <>
            이 인원이 모이지 않으면
            <br />
            마감 때 구인이 자동으로 취소됩니다.
          </>
        )}
      </Text>
    </Field.Root>
  );
}
