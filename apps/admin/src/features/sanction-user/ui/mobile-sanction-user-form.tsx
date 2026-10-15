"use client";

import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { NotificationPreview } from "@/entities/notification";
import type { MemberOngoingRow } from "@/entities/user/server";
import { MobileActionBar, ServerLink } from "@/shared/ui";

import { useSanctionUserForm } from "../model/use-sanction-user-form";
import { SanctionConfirmDialog } from "./sanction-confirm-dialog";
import { SanctionForm } from "./sanction-form";
import { SanctionSummary } from "./sanction-summary";

interface MobileSanctionUserFormProps {
  userId: string;
  nickname: string;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
  backHref: string;
  now: Date;
}

// 모바일은 기간·사유·진행 중인 활동을 위에서 아래로 쌓고 확정 버튼을 화면 아래에 고정한다.
export function MobileSanctionUserForm({
  userId,
  nickname,
  ongoing,
  staffChannel,
  backHref,
  now,
}: MobileSanctionUserFormProps) {
  const form = useSanctionUserForm({ userId, nickname, ongoing, backHref, now });
  return (
    <>
      <VStack gap="150" className="p-150">
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
        <NotificationPreview payload={form.preview} />
      </VStack>
      <MobileActionBar elevated={false}>
        <Text typography="body4" foreground="hint">
          {form.reason
            ? "확정하면 당사자의 알림 탭으로 알리고, 제재는 활동 기록에 남습니다."
            : "사유를 입력해야 확정할 수 있습니다"}
        </Text>
        <HStack gap="100">
          <Button
            variant="outline"
            size="lg"
            render={<ServerLink path={backHref} />}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            colorPalette="danger"
            size="lg"
            disabled={!form.canConfirm}
            onClick={() => form.setConfirming(true)}
            className="flex-1"
          >
            제재 확정
          </Button>
        </HStack>
      </MobileActionBar>
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
