"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { useServerPath } from "@/shared/lib";
import { TRIAL_HANDLER, TrialContext, type TrialRuntime } from "@/shared/trial";

import {
  recruitScreenOfPath,
  TRIAL_RECRUIT_SCREEN,
  type TrialRecruitScreenName,
} from "../model/trial-recruit-screen";
import { TrialBanner } from "./trial-banner";
import { TrialLinkGuard } from "./trial-link-guard";
import { TrialRecruitScreen } from "./trial-recruit-screen";
import { useTrialStore } from "./use-trial-store";

const WIZARD_STEP_INDEXES = [0, 3, 4] as const;
const WIZARD_TOTAL = 5;
const WIZARD_HINTS = {
  0: ["제목과 시놉시스를 바꿔 볼 수 있습니다.", "기본값이 채워져 있습니다."],
  1: ["모집 방식을 바꿔 볼 수 있습니다."],
} as const;

interface TrialFirstRecruitProps {
  form: ReactNode;
}

export function TrialFirstRecruit({ form }: TrialFirstRecruitProps) {
  const { store, dispatch } = useTrialStore();
  const router = useRouter();
  const toServerPath = useServerPath();
  const [screen, setScreen] = useState<TrialRecruitScreenName>(TRIAL_RECRUIT_SCREEN.wizard);
  const [now] = useState(() => new Date());
  const leave = () => router.push(toServerPath("/onboarding"));

  const runtime = useMemo<TrialRuntime>(
    () => ({
      handlers: {
        [TRIAL_HANDLER.createGame]: async (values: {
          title: string;
          recruitMethod: "first_come" | "lottery";
          maxPlayers: string;
        }) => {
          dispatch({
            type: "createRecruit",
            recruit: {
              title: values.title.trim() || "[연습] 달빛 여관의 실종자",
              recruitMethod: values.recruitMethod,
              maxPlayers: Number(values.maxPlayers) || 4,
            },
          });
          setScreen(TRIAL_RECRUIT_SCREEN.result);
          return {};
        },
      },
      guards: {},
      wizard: {
        stepIndexes: WIZARD_STEP_INDEXES,
        total: WIZARD_TOTAL,
        hints: WIZARD_HINTS,
        banner: <TrialBanner />,
      },
      navigate: () => router.push(toServerPath("/onboarding")),
    }),
    [dispatch, router, toServerPath],
  );

  return (
    <TrialContext value={runtime}>
      <TrialLinkGuard onNavigate={(next) => setScreen(next)} resolve={recruitScreenOfPath}>
        <TrialRecruitScreen
          screen={screen}
          form={form}
          recruit={store.recruit}
          now={now}
          applied={store.applied}
          onOpen={setScreen}
          onLeave={leave}
        />
      </TrialLinkGuard>
    </TrialContext>
  );
}
