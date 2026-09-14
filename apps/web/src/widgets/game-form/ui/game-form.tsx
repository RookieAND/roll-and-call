"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { SCHEDULE_MODE } from "@/entities/game";
import { gameFormSchema, type GameFormValues } from "@/features/write-game";
import type { ActionResult } from "@/shared/api";
import { toKstDateTimeInput } from "@/shared/lib";
import type { Game } from "@/shared/server";
import { toast } from "@/shared/ui";
import type { GameEditContext } from "../model/game-form-layout";
import { DEFAULT_PLAY_TIME } from "../model/play-time";
import { GameFormPage } from "./game-form-page";
import { GameFormWizard } from "./game-form-wizard";

type Props = {
  onSubmit: (values: GameFormValues) => Promise<ActionResult | void>;
  defaultGame?: Game;
  submitLabel: string;
  successMessage?: string;
  // 등록은 3단계 위저드(게임 정보 → 이미지 → 일정), 수정은 같은 순서의 단일 페이지.
  wizard?: boolean;
  edit?: GameEditContext;
};

// 폼 상태와 제출만 소유하고, 화면 배치는 두 레이아웃 중 하나에 맡긴다.
export function GameForm({
  onSubmit,
  defaultGame,
  submitLabel,
  successMessage = "저장되었습니다",
  wizard = false,
  edit,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

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
      images: defaultGame?.images ?? [],
      waitlistEnabled: defaultGame?.waitlistEnabled ?? true,
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

  const layoutProps = { form, pending, submitLabel, onValid, edit };

  return wizard ? <GameFormWizard {...layoutProps} /> : <GameFormPage {...layoutProps} />;
}
