"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { SCHEDULE_MODE } from "@/entities/game";
import { gameFormSchema, type GameFormValues } from "@/features/write-game";
import type { ActionResult } from "@/shared/api";
import { toKstDateTimeInput } from "@/shared/lib";
import { toast } from "@/shared/ui";
import { formatPlayTime, initialPlayTime } from "../model/play-time";
import { GameFormPage } from "./game-form-page";
import { GameFormWizard } from "./game-form-wizard";
import type { Game } from "@/shared/server";

type Props = {
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
  // 시안 3a: 등록은 2-Step 위저드, 수정(3b)은 단일 페이지.
  wizard?: boolean;
};

// 폼 상태와 제출만 소유하고, 화면 배치는 두 레이아웃 중 하나에 맡긴다.
export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  wizard = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const playTime = initialPlayTime(defaultGame?.playTime);

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: defaultGame?.title ?? "",
      rule: defaultGame?.rule ?? "",
      synopsis: defaultGame?.synopsis ?? "",
      playTime: defaultGame?.playTime ?? formatPlayTime(playTime.hours, playTime.minutes),
      maxPlayers: String(defaultGame?.maxPlayers ?? 4),
      scheduleMode: defaultGame?.scheduleMode ?? SCHEDULE_MODE.coordinate,
      endDate: defaultGame?.endDate ? toKstDateTimeInput(defaultGame.endDate) : "",
      confirmedAt: defaultGame?.confirmedAt ? toKstDateTimeInput(defaultGame.confirmedAt) : "",
      rangeStart: defaultGame?.rangeStart ?? "",
      rangeEnd: defaultGame?.rangeEnd ?? "",
      thumbnailUrl: defaultGame?.thumbnailUrl ?? "",
    },
  });

  function onValid(values: GameFormValues) {
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result?.error) {
        form.setError("root", { message: result.error });
        return;
      }
      toast.success(successMessage);
      if (result?.redirect) router.push(result.redirect);
    });
  }

  const layoutProps = {
    form,
    pending,
    submitLabel,
    defaultPlayTime: defaultGame?.playTime,
    onValid,
  };

  return wizard ? <GameFormWizard {...layoutProps} /> : <GameFormPage {...layoutProps} />;
}
