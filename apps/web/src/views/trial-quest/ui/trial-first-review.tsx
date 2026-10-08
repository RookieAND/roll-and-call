"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { useServerPath } from "@/shared/lib";
import { TRIAL_HANDLER, TrialContext, type TrialRuntime } from "@/shared/trial";

import { TRIAL_REVIEW_SCREEN, type TrialReviewScreenName } from "../model/trial-review-screen";
import { endedSessionKind } from "../model/trial-session";
import { TrialLinkGuard } from "./trial-link-guard";
import { TrialReviewScreen } from "./trial-review-screen";
import { useTrialStore } from "./use-trial-store";

interface TrialFirstReviewProps {
  forms: Record<string, ReactNode>;
}

export function TrialFirstReview({ forms }: TrialFirstReviewProps) {
  const { store, dispatch } = useTrialStore();
  const router = useRouter();
  const toServerPath = useServerPath();
  const [screen, setScreen] = useState<TrialReviewScreenName>(TRIAL_REVIEW_SCREEN.write);
  const kind = endedSessionKind(store.applied);

  const runtime = useMemo<TrialRuntime>(
    () => ({
      handlers: {
        [TRIAL_HANDLER.submitReview]: async (input: {
          body: string;
          spoiler: boolean;
          photoUrls: string[];
        }) => {
          dispatch({
            type: "writeReview",
            review: { body: input.body, spoiler: input.spoiler, photoUrls: input.photoUrls },
          });
          setScreen(TRIAL_REVIEW_SCREEN.result);
          return {};
        },
        [TRIAL_HANDLER.discardReviewPhotos]: async () => {},
      },
      guards: {},
      // 후기 쓰기를 닫으면 퀘스트 목록으로 돌아간다.
      navigate: () => router.push(toServerPath("/onboarding")),
    }),
    [dispatch, router, toServerPath],
  );

  return (
    <TrialContext value={runtime}>
      <TrialLinkGuard
        resolve={() => null}
        onNavigate={() => {}}
        onBlocked={() => router.push(toServerPath("/onboarding"))}
      >
        <TrialReviewScreen
          screen={screen}
          kind={kind}
          forms={forms}
          review={store.review}
          onOpen={setScreen}
        />
      </TrialLinkGuard>
    </TrialContext>
  );
}
