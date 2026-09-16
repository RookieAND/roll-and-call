"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SCHEDULE_MODE } from "@/entities/game";
import { gameFormSchema, type GameFormValues } from "@/features/write-game";
import type { ActionResult } from "@/shared/api";
import { toKstDateTimeInput } from "@/shared/lib";
import type { Game } from "@/shared/server";
import { toast, useAction } from "@/shared/ui";

import type { GameEditContext } from "../model/game-form-layout";
import { DEFAULT_PLAY_TIME } from "../model/play-time-options";
import { GameFormPage } from "./game-form-page";
import { GameFormWizard } from "./game-form-wizard";

type Props = {
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
  wizard?: boolean;
  edit?: GameEditContext;
};

export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  wizard = false,
  edit,
}: Props) {
  const { pending, run } = useAction();

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: defaultGame?.title ?? "",
      rule: defaultGame?.rule ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      playTime: defaultGame ? (defaultGame.playTime ?? "") : DEFAULT_PLAY_TIME,
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toKstDateTimeInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt ? toKstDateTimeInput(defaultGame.confirmedAt) : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
      thumbnailUrl: defaultGame?.thumbnailUrl ?? "",
      thumbnailSpoiler: defaultGame?.thumbnailSpoiler ?? false,
      images: defaultGame?.images ?? [],
      waitlistEnabled: defaultGame?.waitlistEnabled ?? true,
    },
  });

  function onValid(values: GameFormValues) {
    run(async (): Promise<ActionResult> => (await onSubmit(values)) ?? {}, {
      onSuccess: () => toast.success(successMessage),
      onError: (result) => form.setError("root", { message: result.error }),
    });
  }

  const layoutProps = { form, pending, submitLabel, onValid, edit };

  return wizard ? <GameFormWizard {...layoutProps} /> : <GameFormPage {...layoutProps} />;
}
