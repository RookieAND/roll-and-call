"use client";

import { useForm } from "react-hook-form";

import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import type { GameFormValues } from "@/features/write-game";
import type { ActionResult } from "@/shared/api";
import { toKstDateTimeInput } from "@/shared/lib";
import type { Game } from "@/shared/server";
import { toast, useAction } from "@/shared/ui";

import type { GameEditContext } from "../model/game-form-layout";
import { gameFormResolver } from "../model/game-form-resolver";
import { GAME_FORM_STEPS } from "../model/game-form-steps";
import { DEFAULT_PLAY_TIME } from "../model/play-time-options";
import { GameFormWizard } from "./game-form-wizard";

interface GameFormProps {
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
  edit?: GameEditContext;
  // 등록에서만 쓴다. 수정은 룰북을 바꿀 수 없다.
  rulebooks?: MyRulebooks;
  initialRulebookId?: string;
}

export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  edit,
  rulebooks,
  initialRulebookId,
}: GameFormProps) {
  const { pending, run } = useAction();
  // 주소로 넘어온 책(서플리먼트일 수도 있다)은 그 판본의 룰로 바꿔 채운다.
  const initialSet =
    rulebooks && initialRulebookId ? ruleSetOf(rulebooks, initialRulebookId) : null;

  const form = useForm<GameFormValues>({
    resolver: gameFormResolver(rulebooks),
    defaultValues: {
      title: defaultGame?.title ?? "",
      rule: defaultGame?.rule ?? initialSet?.label ?? "",
      rulebookId: defaultGame?.rulebookId ?? initialSet?.cores[0]?.id ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      genres: defaultGame?.genres ?? [],
      triggers: defaultGame?.triggers ?? [],
      platforms: defaultGame?.platforms ?? [],
      notice: defaultGame?.notice ?? "",
      aiImage: defaultGame?.aiImage ?? false,
      playTime: defaultGame ? (defaultGame.playTime ?? "") : DEFAULT_PLAY_TIME,
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      recruitMethod: defaultGame?.recruitMethod ?? RECRUIT_METHOD.firstCome,
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toKstDateTimeInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt ? toKstDateTimeInput(defaultGame.confirmedAt) : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
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
        // 서버가 막은 칸이 있으면 그 칸도 붉게 하고, 이유는 제출 버튼 위 한 곳에서 읽는다.
        if (result.field && result.field in values) {
          form.setError(result.field as keyof GameFormValues, { message: result.error });
        }
        form.setError("root", { message: result.error });
      },
    });
  }

  return (
    <GameFormWizard
      form={form}
      pending={pending}
      submitLabel={submitLabel}
      onValid={onValid}
      steps={GAME_FORM_STEPS}
      edit={edit}
      rulebooks={rulebooks}
    />
  );
}
