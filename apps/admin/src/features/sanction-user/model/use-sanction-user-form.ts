"use client";

import { reasonLabel, USER_ACTION_REASON } from "@roll-and-call/database/moderation/model";
import { toast } from "@roll-and-call/ui";
import { isNull, isUndefined, sumBy } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { MemberOngoingRow } from "@/entities/user/server";
import { conflictToastText, draftReason, useActionSubmit } from "@/shared/lib";
import { useServerPath } from "@/shared/ui";

import { sanctionUser } from "../api/sanction-user";
import { isOngoingAction } from "./is-ongoing-action";
import { ongoingChoiceRows } from "./ongoing-choice-rows";
import { EMPTY_SANCTION_DRAFT, type SanctionDraft } from "./sanction-draft";
import { sanctionPeriodHint } from "./sanction-period-hint";

const DAY = 86_400_000;

interface UseSanctionUserFormOptions {
  userId: string;
  nickname: string;
  ongoing: MemberOngoingRow[];
  backHref: string;
  now: Date;
}

// 데스크톱 폼과 모바일 폼이 같은 상태·검증·확정 흐름을 쓴다.
export function useSanctionUserForm({
  userId,
  nickname,
  ongoing,
  backHref,
  now,
}: UseSanctionUserFormOptions) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(sanctionUser);
  const [draft, setDraft] = useState<SanctionDraft>(EMPTY_SANCTION_DRAFT);
  const [confirming, setConfirming] = useState(false);

  const days =
    draft.period === "indefinite"
      ? null
      : Number(draft.period === "custom" ? draft.customDays : draft.period);
  const validDays = isNull(days) || (Number.isInteger(days) && days > 0);
  const end = !isNull(days) && validDays ? new Date(now.getTime() + days * DAY) : null;
  const periodHint = sanctionPeriodHint({ validDays, end, now });
  const reason = draftReason({ code: draft.reasonCode, otherText: draft.otherReason });
  const reasonText = reason ? reasonLabel({ ...reason, reasons: USER_ACTION_REASON }) : "";
  const canConfirm = Boolean(reason) && validDays;

  const rows = ongoingChoiceRows({ ongoing, changedSessionIds: draft.changedSessionIds });
  const cancelled = ongoing.filter((_, index) => rows[index]!.value === "cancel");
  const cancelCount = cancelled.length;
  const notifiedCount = sumBy(cancelled, (activity) => activity.notifiedCount);
  const keptCount = rows.filter((row) => row.value === "keep").length;
  const preview = reason
    ? {
        kind: "sanctioned" as const,
        params: { reason: reasonText, until: end?.toISOString() ?? null },
      }
    : null;

  const changeDraft = (changes: Partial<SanctionDraft>) => setDraft({ ...draft, ...changes });

  const changeChoice = (sessionId: string, action: string) =>
    changeDraft({
      changedSessionIds:
        action === "keep"
          ? draft.changedSessionIds.filter((item) => item !== sessionId)
          : [...draft.changedSessionIds, sessionId],
    });

  const confirm = async () => {
    if (!reason) return;
    const result = await submit({
      userId,
      input: {
        days,
        reason,
        staffMemo: draft.staffMemo,
        ongoing: rows.map((row) => ({
          sessionId: row.id,
          action: isOngoingAction(row.value) ? row.value : "keep",
        })),
      },
    });
    if (isUndefined(result)) return;
    setConfirming(false);
    router.push(toServerPath(backHref));
    if (!result.ok) {
      toast.info(
        conflictToastText({ conflict: result.conflict, self: result.self, target: "제재" }),
      );
      return;
    }
    toast.success(`${nickname}님을 제재했습니다`);
  };

  return {
    draft,
    changeDraft,
    changeChoice,
    days,
    end,
    validDays,
    periodHint,
    reason,
    reasonText,
    canConfirm,
    rows,
    cancelCount,
    notifiedCount,
    keptCount,
    preview,
    confirming,
    setConfirming,
    pending,
    networkError,
    confirm,
  };
}
