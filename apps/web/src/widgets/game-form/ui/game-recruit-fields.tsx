"use client";

import { Callout, Field, Stepper, VStack } from "@roll-and-call/ui";
import { CircleAlert, Lock } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { RECRUIT_METHOD } from "@/entities/game";
import { GAME_MAX_PLAYERS, type GameFormValues } from "@/features/write-game";

import { PreConfirmedField } from "./pre-confirmed-field";
import { RecruitMethodField } from "./recruit-method-field";
import { WaitlistField } from "./waitlist-field";

interface GameRecruitFieldsProps {
  form: UseFormReturn<GameFormValues>;
  minPlayers?: number;
  locked?: boolean;
  preConfirmable?: boolean;
}

export function GameRecruitFields({
  form,
  minPlayers = 1,
  locked = false,
  preConfirmable = false,
}: GameRecruitFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const method = watch("recruitMethod");
  const isLottery = method === RECRUIT_METHOD.lottery;
  const maxPlayers = Number(watch("maxPlayers"));
  const preConfirmed = watch("preConfirmed");
  const playersFloor = Math.max(minPlayers, preConfirmed.length);

  return (
    <>
      <VStack gap="100">
        <Field
          label="최대 참여 인원"
          htmlFor="maxPlayers"
          required
          error={errors.maxPlayers?.message}
        >
          <Stepper
            id="maxPlayers"
            value={maxPlayers}
            min={playersFloor}
            max={GAME_MAX_PLAYERS}
            invalid={!!errors.maxPlayers}
            onChange={(count) =>
              setValue("maxPlayers", String(count), { shouldDirty: true, shouldValidate: true })
            }
          />
        </Field>
        {minPlayers > 1 && (
          <Callout
            tone="danger"
            size="sm"
            icon={<CircleAlert size={14} strokeWidth={2.2} />}
            title={`확정 참여자가 ${minPlayers}명이라 정원을 ${minPlayers}명보다 줄일 수 없습니다.`}
          >
            줄이려면 참여자 관리에서 확정을 먼저 풀어주세요.
          </Callout>
        )}
      </VStack>

      {preConfirmable && (
        <PreConfirmedField
          players={preConfirmed}
          maxPlayers={maxPlayers}
          isLottery={isLottery}
          onAdd={(players) =>
            setValue("preConfirmed", [...preConfirmed, ...players], {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          onRemove={(userId) =>
            setValue(
              "preConfirmed",
              preConfirmed.filter((player) => player.userId !== userId),
              { shouldDirty: true, shouldValidate: true },
            )
          }
        />
      )}

      <VStack gap="125">
        <RecruitMethodField
          value={method}
          locked={locked}
          onChange={(next) => setValue("recruitMethod", next, { shouldDirty: true })}
        />

        {isLottery ? (
          <Callout size="sm" icon={<Lock size={14} strokeWidth={2.2} />}>
            추첨에서는 대기 접수 설정을 쓰지 않습니다.
            <br />
            뽑히지 않은 신청자는 대기 명단에 순서대로 남습니다.
          </Callout>
        ) : (
          <WaitlistField
            value={watch("waitlistEnabled")}
            onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
          />
        )}
      </VStack>
    </>
  );
}
