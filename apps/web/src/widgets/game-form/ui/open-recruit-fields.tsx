"use client";

import { VStack } from "@roll-and-call/ui";
import type { UseFormReturn } from "react-hook-form";

import { RECRUIT_METHOD } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

import { ApplicationNoteField } from "./application-note-field";
import { RecruitMethodField } from "./recruit-method-field";
import { RecruitMethodNote } from "./recruit-method-note";
import { WaitlistField } from "./waitlist-field";

interface OpenRecruitFieldsProps {
  form: UseFormReturn<GameFormValues>;
  locked?: boolean;
}

// 일반 모집에만 있는 신청글 받기와 모집 방식(선착순이면 대기 신청 받기까지).
export function OpenRecruitFields({ form, locked = false }: OpenRecruitFieldsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const method = watch("recruitMethod");
  const isFirstCome = method === RECRUIT_METHOD.firstCome;

  return (
    <>
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
  );
}
