"use client";

import { Button, Grid, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined, sumBy } from "es-toolkit";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { chosenReason, conflictToastText, useActionSubmit } from "@/shared/lib";
import type { MemberOngoingRow, OngoingChoice } from "@/shared/server";
import { NotificationPreview, ServerLink, useServerPath } from "@/shared/ui";

import { sanctionUser } from "../api/sanction-user";
import { ongoingChoiceRows } from "../model/ongoing-choice-rows";
import { EMPTY_SANCTION_DRAFT, type SanctionDraft } from "../model/sanction-draft";
import { sanctionPeriodHint } from "../model/sanction-period-hint";
import { SanctionConfirmDialog } from "./sanction-confirm-dialog";
import { SanctionForm } from "./sanction-form";
import { SanctionSummary } from "./sanction-summary";

const DAY = 86_400_000;

interface SanctionUserFormProps {
  userId: string;
  nickname: string;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
  backHref: string;
}

export function SanctionUserForm({
  userId,
  nickname,
  ongoing,
  staffChannel,
  backHref,
}: SanctionUserFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(sanctionUser);
  const [draft, setDraft] = useState<SanctionDraft>(EMPTY_SANCTION_DRAFT);
  const [confirming, setConfirming] = useState(false);

  const now = new Date();
  const days =
    draft.period === "indefinite"
      ? null
      : Number(draft.period === "custom" ? draft.customDays : draft.period);
  const validDays = isNull(days) || (Number.isInteger(days) && days > 0);
  const end = !isNull(days) && validDays ? new Date(now.getTime() + days * DAY) : null;
  const periodHint = sanctionPeriodHint({ validDays, end, now });
  const reason = chosenReason({ chip: draft.reasonChip, otherText: draft.otherReason });
  const canConfirm = Boolean(reason) && validDays;

  const rows = ongoingChoiceRows({ ongoing, changedSessionIds: draft.changedSessionIds });
  const cancelled = ongoing.filter((_, index) => rows[index]!.value === "cancel");
  const cancelCount = cancelled.length;
  const notifiedCount = sumBy(cancelled, (activity) => activity.notifiedCount);
  const keptCount = rows.filter((row) => row.value === "keep").length;
  const preview = reason
    ? { kind: "sanctioned" as const, params: { reason, until: end?.toISOString() ?? null } }
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
    const result = await submit({
      userId,
      input: {
        days,
        userReason: reason,
        staffMemo: draft.staffMemo,
        ongoing: rows.map((row) => ({
          sessionId: row.id,
          action: row.value as OngoingChoice["action"],
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

  return (
    <>
      <VStack gap="150" className="mx-auto w-full max-w-[1000px] flex-1 p-200">
        <Grid className="grid-cols-[minmax(0,1fr)_320px] items-start gap-200">
          <SanctionForm
            draft={draft}
            periodHint={periodHint}
            validDays={validDays}
            rows={rows}
            onDraftChange={changeDraft}
            onChoiceChange={changeChoice}
          />
          <SanctionSummary
            days={days}
            end={end}
            cancelCount={cancelCount}
            notifiedCount={notifiedCount}
            keptCount={keptCount}
          />
        </Grid>
        <NotificationPreview payload={preview} />
      </VStack>
      <HStack
        align="center"
        gap="125"
        data-full-bleed
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
      >
        {reason ? (
          <Text typography="body4" foreground="hint">
            확정하면 당사자의 알림 탭으로 알리고, 제재는 활동 기록에 남습니다.
          </Text>
        ) : (
          <HStack align="center" gap="075" className="text-hint">
            <TriangleAlert size={14} aria-hidden />
            <Text typography="body4" foreground="hint">
              사유를 입력해야 확정할 수 있습니다
            </Text>
          </HStack>
        )}
        <HStack gap="100" className="ml-auto">
          <Button variant="ghost" colorPalette="gray" render={<ServerLink path={backHref} />}>
            취소
          </Button>
          <Button
            colorPalette="danger"
            disabled={!canConfirm}
            onClick={() => setConfirming(true)}
            className="min-w-[128px]"
          >
            제재 확정
          </Button>
        </HStack>
      </HStack>
      <SanctionConfirmDialog
        open={confirming}
        nickname={nickname}
        days={days}
        end={end}
        userReason={reason}
        cancelCount={cancelCount}
        notifiedCount={notifiedCount}
        staffChannel={staffChannel}
        pending={pending}
        networkError={networkError}
        onBack={() => setConfirming(false)}
        onConfirm={() => void confirm()}
      />
    </>
  );
}
