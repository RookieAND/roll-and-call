"use client";

import { DEFAULT_PLAY_MINUTES } from "@roll-and-call/database/games/model";
import { use } from "react";
import { useForm } from "react-hook-form";

import {
  DEFAULT_WINDOW,
  GAME_KIND,
  PLAY_TYPE,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
} from "@/entities/game";
import { ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import type { GameFormValues } from "@/features/write-game";
import type { ActionResult } from "@/shared/api";
import { toKstDateTimeInput } from "@/shared/lib";
import { TrialContext } from "@/shared/trial";
import { toast, useAction } from "@/shared/ui";

import type { GameDefaults } from "../model/game-defaults";
import type { GameEditContext } from "../model/game-form-layout";
import { gameFormResolver } from "../model/game-form-resolver";
import { GAME_FORM_STEPS } from "../model/game-form-steps";
import { GameFormWizard } from "./game-form-wizard";

interface GameFormProps {
  serverId: string;
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: GameDefaults;
  submitLabel: string;
  successMessage?: string;
  edit?: GameEditContext;
  rulebooks?: MyRulebooks;
  initialRulebookId?: string;
}

export function GameForm({
  serverId,
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  edit,
  rulebooks,
  initialRulebookId,
}: GameFormProps) {
  const { pending, run } = useAction();
  // 체험에서는 일부 단계만 보인다.
  const trialStepIndexes = use(TrialContext)?.wizard?.stepIndexes;
  const steps = trialStepIndexes
    ? trialStepIndexes.map((index) => GAME_FORM_STEPS[index]!)
    : GAME_FORM_STEPS;
  // 주소로 넘어온 책(서플리먼트일 수도 있다)은 그 판본의 룰로 바꿔 채운다.
  const initialSet =
    rulebooks && initialRulebookId
      ? ruleSetOf({ myRulebooks: rulebooks, rulebookId: initialRulebookId })
      : null;

  const form = useForm<GameFormValues>({
    resolver: gameFormResolver({ rulebooks, edit }),
    defaultValues: {
      title: defaultGame?.title ?? "",
      kind: defaultGame?.kind ?? GAME_KIND.session,
      playType: defaultGame?.playType ?? PLAY_TYPE.voice,
      rule: defaultGame?.rule ?? initialSet?.label ?? "",
      rulebookId: defaultGame?.rulebookId ?? initialSet?.cores[0]?.id ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      genres: defaultGame?.genres ?? [],
      triggers: defaultGame?.triggers ?? [],
      platforms: defaultGame?.platforms ?? [],
      notice: defaultGame?.notice ?? "",
      aiImage: defaultGame?.aiImage ?? false,
      playMinutes: defaultGame?.playMinutes ?? DEFAULT_PLAY_MINUTES,
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      minPlayers: String(defaultGame?.minPlayers ?? ""),
      recruitMethod: defaultGame?.recruitMethod ?? RECRUIT_METHOD.firstCome,
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toKstDateTimeInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt ? toKstDateTimeInput(defaultGame.confirmedAt) : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
      windowStartHour: String(defaultGame?.windowStartHour ?? DEFAULT_WINDOW.startHour),
      windowEndHour: String(defaultGame?.windowEndHour ?? DEFAULT_WINDOW.endHour),
      thumbnailUrl: defaultGame?.thumbnailUrl ?? "",
      thumbnailSpoiler: defaultGame?.thumbnailSpoiler ?? false,
      images: defaultGame?.images ?? [],
      waitlistEnabled: defaultGame?.waitlistEnabled ?? true,
      preConfirmed: [],
    },
  });

  function onValid(values: GameFormValues) {
    run(async (): Promise<ActionResult> => (await onSubmit(values)) ?? {}, {
      onSuccess: () => toast.success(successMessage),
      onError: (result) => {
        if (result.field && result.field in values) {
          form.setError(result.field as keyof GameFormValues, { message: result.error });
        }
        form.setError("root", { message: result.error });
      },
    });
  }

  return (
    <GameFormWizard
      serverId={serverId}
      form={form}
      pending={pending}
      submitLabel={submitLabel}
      onValid={onValid}
      steps={steps}
      edit={edit}
      rulebooks={rulebooks}
    />
  );
}
