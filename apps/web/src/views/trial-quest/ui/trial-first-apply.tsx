"use client";

import { useMemo, useState, type ReactNode } from "react";

import { TRIAL_HANDLER, TrialContext, type TrialRuntime } from "@/shared/trial";

import { TRIAL_KIND, trialKindOf, type TrialKind } from "../model/trial-kind";
import { screenOfPath, TRIAL_SCREEN, type TrialScreen } from "../model/trial-screen";
import { TrialApplyScreen } from "./trial-apply-screen";
import { TrialApplySheet } from "./trial-apply-sheet";
import { TrialLinkGuard } from "./trial-link-guard";
import { useTrialStore } from "./use-trial-store";

// 첫 신청 퀘스트. 목록·상세는 실제 화면 컴포넌트를 쓰고, 신청은 체험 저장소만 바꾼다.
interface TrialFirstApplyProps {
  details: Record<string, ReactNode>;
}

export function TrialFirstApply({ details }: TrialFirstApplyProps) {
  const { store, dispatch } = useTrialStore();
  const [now] = useState(() => new Date());
  const [screen, setScreen] = useState<TrialScreen>({ name: TRIAL_SCREEN.list });
  const [confirming, setConfirming] = useState<{ kind: TrialKind; proceed: () => void } | null>(
    null,
  );

  const runtime = useMemo<TrialRuntime>(
    () => ({
      handlers: {
        [TRIAL_HANDLER.joinGame]: async (gameId: string) => {
          const kind = trialKindOf(gameId);
          if (!kind) return { error: "체험에서는 이 구인에 신청할 수 없습니다" };
          dispatch({ type: "apply", kind });
          setScreen({ name: TRIAL_SCREEN.result, kind });
          return { lottery: kind === TRIAL_KIND.lottery };
        },
        [TRIAL_HANDLER.leaveGame]: async (gameId: string) => {
          const kind = trialKindOf(gameId);
          if (kind) dispatch({ type: "cancelApply", kind });
          return {};
        },
      },
      navigate: () => {},
      guards: {
        [TRIAL_HANDLER.joinGame]: (proceed) => {
          if (screen.name === TRIAL_SCREEN.detail) setConfirming({ kind: screen.kind, proceed });
        },
      },
    }),
    [dispatch, screen],
  );

  function confirm() {
    confirming?.proceed();
    setConfirming(null);
  }

  return (
    <TrialContext value={runtime}>
      <TrialLinkGuard resolve={screenOfPath} onNavigate={setScreen}>
        <TrialApplyScreen
          screen={screen}
          applied={store.applied}
          now={now}
          details={details}
          onOpen={setScreen}
        />
      </TrialLinkGuard>
      <TrialApplySheet
        kind={confirming?.kind ?? null}
        onConfirm={confirm}
        onCancel={() => setConfirming(null)}
      />
    </TrialContext>
  );
}
