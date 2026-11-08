"use client";

import { Field, Stepper, Text, VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { GAME_VISIBILITY, SCHEDULE_MODE, type GameVisibility } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";
import {
  CoordinationRangeFields,
  CoordinationWindowField,
  EndDateField,
  FixedSessionField,
  MinPlayersField,
  OpenRecruitFields,
  ScheduleModeField,
  VisibilityField,
} from "@/widgets/game-form";

const MAX_PLAYERS = 20;

interface SplitTeamsStepTwoProps {
  form: UseFormReturn<GameFormValues>;
  capacity: number;
  selectedCount: number;
  capacityError: string | undefined;
  onCapacityChange: (capacity: number) => void;
}

// 구인 등록의 인원·모집 유형·일정 칸을 그대로 쓴다. 선택한 참여자는 1단계에서 정했으므로 여기서 다시 보이지 않는다.
export function SplitTeamsStepTwo({
  form,
  capacity,
  selectedCount,
  capacityError,
  onCapacityChange,
}: SplitTeamsStepTwoProps) {
  const scheduleMode = form.watch("scheduleMode");
  const visibility: GameVisibility = form.watch("visibility") ?? GAME_VISIBILITY.private;
  const isOpen = visibility === GAME_VISIBILITY.public;

  return (
    <VStack gap="250">
      <VisibilityField
        value={visibility}
        onChange={(next) => form.setValue("visibility", next, { shouldDirty: true })}
      />
      <VStack gap="100">
        <Field.Root label="최대 참여 인원" htmlFor="splitCapacity" required>
          <Stepper
            id="splitCapacity"
            value={capacity}
            min={Math.max(selectedCount, 1)}
            max={MAX_PLAYERS}
            invalid={Boolean(capacityError)}
            onChange={onCapacityChange}
          />
        </Field.Root>
        {capacityError && (
          <Text typography="body4" foreground="danger" role="alert" render={<p />}>
            {capacityError}
          </Text>
        )}
      </VStack>
      {isOpen && (
        <>
          <MinPlayersField form={form} locked={false} savedMinPlayers={null} />
          <OpenRecruitFields form={form} />
        </>
      )}
      <ScheduleModeField
        value={scheduleMode}
        onChange={(next) => form.setValue("scheduleMode", next, { shouldDirty: true })}
      />
      {scheduleMode === SCHEDULE_MODE.fixed ? (
        <FixedSessionField form={form} />
      ) : (
        <>
          <CoordinationRangeFields form={form} />
          <CoordinationWindowField form={form} locked={false} />
        </>
      )}
      {isOpen && <EndDateField form={form} />}
    </VStack>
  );
}
