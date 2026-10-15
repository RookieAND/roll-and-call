"use client";

import { Button, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";

import { NotificationPreview } from "@/entities/notification";
import type { MemberOngoingRow } from "@/entities/user/server";
import { ServerLink } from "@/shared/ui";

import { useSanctionUserForm } from "../model/use-sanction-user-form";
import { SanctionConfirmDialog } from "./sanction-confirm-dialog";
import { SanctionForm } from "./sanction-form";
import { SanctionSummary } from "./sanction-summary";

interface SanctionUserFormProps {
  userId: string;
  nickname: string;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
  backHref: string;
  // 렌더 중에 시계를 읽으면 서버와 브라우저의 기한 안내가 분 단위로 어긋나 페이지가 받은 시각으로 계산한다.
  now: Date;
}

export function SanctionUserForm({
  userId,
  nickname,
  ongoing,
  staffChannel,
  backHref,
  now,
}: SanctionUserFormProps) {
  const form = useSanctionUserForm({ userId, nickname, ongoing, backHref, now });

  return (
    <>
      <VStack gap="150" className="mx-auto w-full max-w-[1000px] flex-1 p-200">
        <Grid className="grid-cols-[minmax(0,1fr)_320px] items-start gap-200">
          <SanctionForm
            draft={form.draft}
            periodHint={form.periodHint}
            validDays={form.validDays}
            rows={form.rows}
            onDraftChange={form.changeDraft}
            onChoiceChange={form.changeChoice}
          />
          <SanctionSummary
            days={form.days}
            end={form.end}
            cancelCount={form.cancelCount}
            notifiedCount={form.notifiedCount}
            keptCount={form.keptCount}
          />
        </Grid>
        <NotificationPreview payload={form.preview} />
      </VStack>
      <HStack
        align="center"
        gap="125"
        data-full-bleed
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
      >
        {form.reason ? (
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
            disabled={!form.canConfirm}
            onClick={() => form.setConfirming(true)}
            className="min-w-[128px]"
          >
            제재 확정
          </Button>
        </HStack>
      </HStack>
      <SanctionConfirmDialog
        open={form.confirming}
        nickname={nickname}
        days={form.days}
        end={form.end}
        userReason={form.reasonText}
        cancelCount={form.cancelCount}
        notifiedCount={form.notifiedCount}
        staffChannel={staffChannel}
        pending={form.pending}
        networkError={form.networkError}
        onBack={() => form.setConfirming(false)}
        onConfirm={() => void form.confirm()}
      />
    </>
  );
}
