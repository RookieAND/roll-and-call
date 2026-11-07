"use client";

import { toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useActionSubmit } from "@/shared/lib";
import { useServerPath } from "@/shared/ui";

import { approveHomebrew } from "../api/approve-homebrew";
import { rejectHomebrew } from "../api/reject-homebrew";
import { homebrewDoneText } from "../model/homebrew-done-text";
import { homebrewFailureText } from "../model/homebrew-failure-text";
import { HOMEBREW_REJECT_REASONS } from "../model/homebrew-reject-reasons";
import { rejectFormState } from "../model/reject-form-state";

const QUEUE_PATH = "/cert/maker";

type HomebrewResult = Awaited<ReturnType<typeof approveHomebrew>>;

interface UseHomebrewDecisionOptions {
  applicationId: string;
  name: string;
}

export function useHomebrewDecision({ applicationId, name }: UseHomebrewDecisionOptions) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const approval = useActionSubmit(approveHomebrew);
  const rejection = useActionSubmit(rejectHomebrew);
  const [approveOpen, setApproveOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const rejecting = searchParams.get("mode") === "reject";
  const form = rejectFormState({ reason, message });

  const setRejecting = (next: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("mode", "reject");
    else params.delete("mode");
    // 서버 데이터가 필요 없는 화면 상태라 주소만 바꾼다.
    window.history.replaceState(null, "", params.size ? `${pathname}?${params}` : pathname);
  };

  // 처리하면 대기열로 돌아가 토스트를 띄운다. 거둔 신청은 이 화면을 새로 읽어 안내를 보인다.
  const finish = ({ result, done }: { result: HomebrewResult; done: string }) => {
    setApproveOpen(false);
    if (result.ok) {
      toast.success(done);
      router.push(toServerPath(QUEUE_PATH));
      return;
    }
    const text = homebrewFailureText(result);
    if (!isNull(text)) toast.warning(text);
    if ("blocked" in result || isNull(text)) {
      router.refresh();
      return;
    }
    router.push(toServerPath(QUEUE_PATH));
  };

  const approve = async () => {
    const result = await approval.submit(applicationId);
    if (isUndefined(result)) return;
    finish({ result, done: homebrewDoneText({ name, decision: "approve" }) });
  };

  const reject = async () => {
    const result = await rejection.submit({
      applicationId,
      reasonTag: form.other ? null : reason,
      userReason: message,
    });
    if (isUndefined(result)) return;
    finish({ result, done: homebrewDoneText({ name, decision: "reject" }) });
  };

  const chooseReason = (next: string) => {
    setReason(next);
    setMessage(HOMEBREW_REJECT_REASONS.find((candidate) => candidate.name === next)?.message ?? "");
  };

  const cancelReject = () => {
    setReason(null);
    setMessage("");
    setRejecting(false);
  };

  return {
    rejecting,
    reason,
    message,
    form,
    approveOpen,
    approving: approval.pending,
    approveFailed: approval.networkError,
    rejectingPending: rejection.pending,
    rejectFailed: rejection.networkError,
    openApprove: () => setApproveOpen(true),
    closeApprove: () => setApproveOpen(false),
    startReject: () => setRejecting(true),
    cancelReject,
    chooseReason,
    setMessage,
    approve,
    reject,
  };
}
