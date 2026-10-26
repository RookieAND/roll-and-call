"use client";

import { Callout, Field, Stepper, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import {
  GAME_VISIBILITY,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  type GameVisibility,
} from "@/entities/game";
import { GAME_MAX_PLAYERS, type GameFormValues } from "@/features/write-game";

import { ApplicationNoteField } from "./application-note-field";
import { MinPlayersField } from "./min-players-field";
import { PreConfirmedField } from "./pre-confirmed-field";
import { RecruitMethodField } from "./recruit-method-field";
import { RecruitMethodNote } from "./recruit-method-note";
import { VisibilityField } from "./visibility-field";
import { WaitlistField } from "./waitlist-field";

interface GameRecruitFieldsProps {
  form: UseFormReturn<GameFormValues>;
  confirmedCount?: number;
  minPlayersLocked?: boolean;
  savedMinPlayers?: number | null;
  locked?: boolean;
  preConfirmable?: boolean;
  // 수정에서는 공개 범위를 바꾸지 않고, 바꿀 수 없는 이유만 보인다. 새 구인은 null이다.
  visibilityEdit?: { reason: string | null };
}

export function GameRecruitFields({
  form,
  confirmedCount = 1,
  minPlayersLocked = false,
  savedMinPlayers = null,
  locked = false,
  preConfirmable = false,
  visibilityEdit,
}: GameRecruitFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const method = watch("recruitMethod");
  const isFirstCome = method === RECRUIT_METHOD.firstCome;
  const maxPlayers = Number(watch("maxPlayers"));
  const preConfirmed = watch("preConfirmed");
  const visibility = watch("visibility") ?? GAME_VISIBILITY.public;
  const isPrivate = visibility === GAME_VISIBILITY.private;
  const playersFloor = Math.max(confirmedCount, preConfirmed.length);

  function changeVisibility(next: GameVisibility) {
    setValue("visibility", next, { shouldDirty: true, shouldValidate: true });
    // 비공개 구인은 일시 지정형만 열 수 있다. 공개로 돌아와도 이전 모집 입력값은 그대로 둔다.
    if (next === GAME_VISIBILITY.private) {
      setValue("scheduleMode", SCHEDULE_MODE.fixed, { shouldDirty: true });
    }
  }

  return (
    <>
      <VisibilityField
        value={visibility}
        onChange={changeVisibility}
        suggestsPrivate={
          !visibilityEdit && preConfirmed.length > 0 && preConfirmed.length === maxPlayers
        }
        locked={!!visibilityEdit}
        lockedReason={visibilityEdit?.reason}
      />

      <VStack gap="100">
        <Field.Root
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
        </Field.Root>
        {confirmedCount > 1 && (
          <Callout.Root colorPalette="gray" size="sm">
            <Callout.Description>
              {`확정 참여자가 ${confirmedCount}명이라 정원을 ${confirmedCount}명보다 줄일 수 없습니다.`}
              <br />
              줄이려면 참여자 관리에서 확정을 먼저 풀어 주세요.
            </Callout.Description>
          </Callout.Root>
        )}
      </VStack>

      {!isPrivate && (
        <MinPlayersField form={form} locked={minPlayersLocked} savedMinPlayers={savedMinPlayers} />
      )}

      {preConfirmable && (
        <PreConfirmedField
          players={preConfirmed}
          maxPlayers={maxPlayers}
          method={method}
          isPrivate={isPrivate}
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

      {!isPrivate && (
        <>
          <ApplicationNoteField
            value={watch("applicationNoteEnabled")}
            locked={locked}
            onChange={(enabled) =>
              setValue("applicationNoteEnabled", enabled, { shouldDirty: true })
            }
          />

          <VStack gap="100">
            <RecruitMethodField
              value={method}
              locked={locked}
              onChange={(next) => {
                setValue("recruitMethod", next, { shouldDirty: true });
                if (next === RECRUIT_METHOD.selection) {
                  setValue("applicationNoteEnabled", true, { shouldDirty: true });
                }
              }}
            />

            {!locked && <RecruitMethodNote method={method} />}
            {isFirstCome && (
              <WaitlistField
                value={watch("waitlistEnabled")}
                onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
              />
            )}
          </VStack>
        </>
      )}
    </>
  );
}
