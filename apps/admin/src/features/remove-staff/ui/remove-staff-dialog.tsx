"use client";

import {
  AlertDialog,
  Badge,
  Button,
  Checkbox,
  Field,
  Text,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { formatDate, STAFF_ROLE_LABEL, withObjectParticle } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import { FactRows } from "@/shared/ui";

import { removeStaffMember } from "../api/remove-staff-member";

interface RemoveStaffDialogProps {
  staff: StaffRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveStaffDialog({ staff, open, onOpenChange }: RemoveStaffDialogProps) {
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);

  const canRemove = Boolean(reason.trim()) && !pending;

  const remove = () =>
    startTransition(async () => {
      await removeStaffMember(staff.userId, { reason, notify });
      toast.success(`${staff.nickname}님을 운영진에서 해제했습니다`);
      onOpenChange(false);
    });

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup className="max-w-[520px]">
        <AlertDialog.Header>
          <AlertDialog.Title>
            {withObjectParticle(staff.nickname)} 운영진에서 해제할까요?
          </AlertDialog.Title>
          <AlertDialog.Description>
            어드민에는 로그인할 수 없게 되지만, 사용자 앱은 그대로 이용합니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
              <FactRows
                labelWidth={80}
                items={[
                  {
                    label: "역할",
                    value: <Badge colorPalette="gray">{STAFF_ROLE_LABEL[staff.role]}</Badge>,
                  },
                  { label: "추가한 날", value: formatDate(staff.since) },
                  {
                    label: "최근 활동",
                    value: staff.lastActiveAt ? formatDate(staff.lastActiveAt) : "—",
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
            <Checkbox.Field className="items-start">
              <Checkbox.Root checked={notify} onCheckedChange={setNotify} className="mt-025">
                <Checkbox.Indicator />
              </Checkbox.Root>
              <VStack gap="025">
                <Checkbox.Label>당사자에게 디스코드 알림 보내기</Checkbox.Label>
                <Text typography="body4" foreground="hint">
                  해제되었다는 사실만 알리고, 사유는 보내지 않습니다
                </Text>
              </VStack>
            </Checkbox.Field>
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button colorPalette="danger" loading={pending} disabled={!canRemove} onClick={remove}>
            해제 확정
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
