"use client";

import { Field, Stepper, Text, VStack } from "@trpg/ui";
import { Lock } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { RECRUIT_METHOD } from "@/entities/game";
import { GAME_MAX_PLAYERS, type GameFormValues } from "@/features/write-game";

import { GameScheduleFields } from "./game-schedule-fields";
import { HintBox } from "./hint-box";
import { RecruitMethodField } from "./recruit-method-field";
import { WaitlistField } from "./waitlist-field";

interface GameRecruitFieldsProps {
  form: UseFormReturn<GameFormValues>;
  minPlayers?: number;
  lockedReason?: readonly string[] | null;
  sessionNotice?: string | null;
}

export function GameRecruitFields({
  form,
  minPlayers = 1,
  lockedReason,
  sessionNotice,
}: GameRecruitFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const method = watch("recruitMethod");
  const isLottery = method === RECRUIT_METHOD.lottery;

  const playersHint =
    minPlayers > 1
      ? `확정 참여자가 ${minPlayers}명이라 그보다 줄일 수 없습니다.`
      : isLottery
        ? `추첨으로 뽑을 확정 인원입니다. GM 제외 1~${GAME_MAX_PLAYERS}명.`
        : `GM을 뺀 플레이어 수입니다. 1~${GAME_MAX_PLAYERS}명.`;

  return (
    <>
      <VStack gap="075">
        <Field
          label="최대 참여 인원"
          htmlFor="maxPlayers"
          required
          error={errors.maxPlayers?.message}
        >
          <Stepper
            id="maxPlayers"
            value={Number(watch("maxPlayers"))}
            min={minPlayers}
            max={GAME_MAX_PLAYERS}
            invalid={!!errors.maxPlayers}
            aria-describedby="maxPlayers-hint"
            onChange={(count) =>
              setValue("maxPlayers", String(count), { shouldDirty: true, shouldValidate: true })
            }
          />
        </Field>
        <Text typography="body4" foreground="hint" render={<p />} id="maxPlayers-hint">
          {playersHint}
        </Text>
      </VStack>

      <VStack gap="125">
        <RecruitMethodField
          value={method}
          lockedReason={lockedReason}
          onChange={(next) => setValue("recruitMethod", next, { shouldDirty: true })}
        />

        {isLottery ? (
          <HintBox
            icon={<Lock size={14} strokeWidth={2.2} />}
            lines={[
              "추첨에서는 대기 접수 설정을 쓰지 않습니다.",
              "뽑히지 않은 신청자는 대기 명단에 순서대로 남습니다.",
            ]}
          />
        ) : (
          <WaitlistField
            value={watch("waitlistEnabled")}
            onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
          />
        )}
      </VStack>

      <GameScheduleFields
        form={form}
        modeLockedReason={lockedReason}
        sessionNotice={sessionNotice}
      />
    </>
  );
}
