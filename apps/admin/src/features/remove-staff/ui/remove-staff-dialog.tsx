"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Callout, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NotificationPreview } from "@/entities/notification";
import { formatDate, STAFF_ROLE_LABEL, useActionSubmit, withObjectParticle } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import {
  ActionNetworkError,
  FactRows,
  ModalServerLabel,
  Tag,
  MODAL_FOOTER_CLASS,
  ResponsiveDialog,
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
    <ResponsiveDialog.Root
      alert
      open={open}
      onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}
    >
      <ResponsiveDialog.Popup className="max-w-[520px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>
            {withObjectParticle(staff.nickname)} 운영진에서 해제할까요?
          </ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            권한을 해제하면 어드민에 로그인할 수 없습니다.
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
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
            <Callout.Root colorPalette="danger">
              <Callout.Icon />
              <Callout.Title>어드민 접근이 바로 끊깁니다</Callout.Title>
              <Callout.Description>사용자 앱은 그대로 이용할 수 있습니다.</Callout.Description>
            </Callout.Root>
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
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
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
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
