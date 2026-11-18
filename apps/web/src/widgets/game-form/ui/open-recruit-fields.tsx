"use client";

import { VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { RECRUIT_METHOD } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { ApplicationNoteField } from "./application-note-field";
import { InProgressLock } from "./in-progress-lock";
import { RecruitMethodField } from "./recruit-method-field";
import { RecruitMethodNote } from "./recruit-method-note";
import { WaitlistField } from "./waitlist-field";

interface OpenRecruitFieldsProps {
  form: UseFormReturn<GameFormValues>;
  locked?: boolean;
  inProgress?: boolean;
}

// 일반 모집에만 있는 신청글 받기와 모집 방식(선착순이면 대기 신청 받기까지).
export function OpenRecruitFields({
  form,
  locked = false,
  inProgress = false,
}: OpenRecruitFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const method = watch("recruitMethod");
  const isFirstCome = method === RECRUIT_METHOD.firstCome;

  return (
    <>
      <InProgressLock locked={inProgress} note>
        <ApplicationNoteField
          value={watch("applicationNoteEnabled")}
          locked={locked}
          onChange={(enabled) => setValue("applicationNoteEnabled", enabled, { shouldDirty: true })}
          question={watch("applicationQuestion")}
          onQuestionChange={(question) =>
            setValue("applicationQuestion", question, { shouldDirty: true, shouldValidate: true })
          }
          questionError={errors.applicationQuestion?.message}
        />
      </InProgressLock>

      <VStack gap="100">
        <InProgressLock locked={inProgress} note>
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
        </InProgressLock>
        {isFirstCome && (
          <InProgressLock locked={inProgress}>
            <WaitlistField
              value={watch("waitlistEnabled")}
              onChange={(enabled) => setValue("waitlistEnabled", enabled, { shouldDirty: true })}
            />
          </InProgressLock>
        )}
      </VStack>
    </>
  );
}
