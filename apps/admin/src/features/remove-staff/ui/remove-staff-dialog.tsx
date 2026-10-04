"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { AlertDialog, Button, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatDate, STAFF_ROLE_LABEL, useActionSubmit, withObjectParticle } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import {
  ActionNetworkError,
  FactRows,
  ModalServerLabel,
  NotificationPreview,
  Tag,
} from "@/shared/ui";

import { removeStaffMember } from "../api/remove-staff-member";

interface RemoveStaffDialogProps {
  staff: StaffRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveStaffDialog({ staff, open, onOpenChange }: RemoveStaffDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(removeStaffMember);
  const [reason, setReason] = useState("");

  const canRemove = Boolean(reason.trim()) && !pending;
  const confirmLabel = networkError ? "다시 시도" : "해제 확정";

  const remove = async () => {
    const result = await submit(staff.userId, reason);
    if (isUndefined(result)) return;
    onOpenChange(false);
    if (result.ok) {
      toast.success(`${staff.nickname}님을 운영진에서 해제했습니다`);
      return;
    }
    toast.info("이미 해제됐거나 소유자인 사람입니다");
    router.refresh();
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup className="max-w-[520px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>
            {withObjectParticle(staff.nickname)} 운영진에서 해제할까요?
          </AlertDialog.Title>
          <AlertDialog.Description>
            어드민에는 로그인할 수 없게 되지만, 사용자 앱은 그대로 이용합니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
              <FactRows
                labelWidth={80}
                items={[
                  { label: "역할", value: <Tag>{STAFF_ROLE_LABEL[staff.role]}</Tag> },
                  { label: "추가한 날", value: staff.since ? formatDate(staff.since) : "" },
                  {
                    label: "최근 활동",
                    value: staff.lastActiveAt ? formatDate(staff.lastActiveAt) : "",
                  },
                ]}
              />
            </div>
            <Field.Root label="해제 사유" htmlFor="remove-staff-reason" required>
              <Textarea
                id="remove-staff-reason"
                rows={2}
                placeholder="활동 기록에 남습니다"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
            <NotificationPreview payload={{ kind: NOTIFICATION_KIND.staffRemoved, params: {} }} />
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button
            colorPalette="danger"
            loading={pending}
            disabled={!canRemove}
            onClick={() => void remove()}
            className="gap-050"
          >
            {networkError ? <RotateCcw size={14} aria-hidden /> : null}
            {confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
