"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { useServerPath } from "@/shared/lib";
import { TRIAL_HANDLER, TrialContext, type TrialRuntime } from "@/shared/trial";

import { TRIAL_CERT_SCREEN, type TrialCertScreenName } from "../model/trial-cert-screen";
import { TrialLinkGuard } from "./trial-link-guard";
import { TrialRulebookCertScreen } from "./trial-rulebook-cert-screen";
import { useTrialStore } from "./use-trial-store";

interface TrialRulebookCertProps {
  form: ReactNode;
}

export function TrialRulebookCert({ form }: TrialRulebookCertProps) {
  const { store, dispatch } = useTrialStore();
  const router = useRouter();
  const toServerPath = useServerPath();
  const [screen, setScreen] = useState<TrialCertScreenName>(TRIAL_CERT_SCREEN.apply);

  const runtime = useMemo<TrialRuntime>(
    () => ({
      handlers: {
        [TRIAL_HANDLER.submitCertification]: async (input: {
          entry: { format: "physical" | "ebook" };
        }) => {
          dispatch({ type: "submitCert", format: input.entry.format });
          setScreen(TRIAL_CERT_SCREEN.result);
          return {};
        },
      },
      guards: {},
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
        <TrialRulebookCertScreen
          screen={screen}
          form={form}
          cert={store.cert}
          onOpen={setScreen}
          onApprove={() => dispatch({ type: "approveCert" })}
        />
      </TrialLinkGuard>
    </TrialContext>
  );
}
