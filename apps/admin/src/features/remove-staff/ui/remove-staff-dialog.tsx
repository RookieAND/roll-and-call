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

import { formatDate, formatMonthDay, STAFF_ROLE_LABEL } from "@/shared/lib";
import type { StaffRow } from "@/shared/server";
import { EntityHead, UserInitial } from "@/shared/ui";

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

  const lastActive = staff.lastActiveAt ? ` · 최근 활동 ${formatMonthDay(staff.lastActiveAt)}` : "";
  const canRemove = Boolean(reason.trim()) && !pending;

  const remove = () =>
    startTransition(async () => {
      await removeStaffMember(staff.nickname, { reason, notify });
      toast.success(`${staff.nickname}님을 운영진에서 해제했습니다`);
      onOpenChange(false);
    });

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup className="max-w-[520px]">
        <AlertDialog.Header>
          <AlertDialog.Title>{staff.nickname} 운영진 해제</AlertDialog.Title>
          <AlertDialog.Description>
            어드민에 더 이상 로그인할 수 없게 됩니다. 사용자 앱 이용에는 영향이 없습니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            <EntityHead
              title={staff.nickname}
              lead={<UserInitial nickname={staff.nickname} />}
              badges={<Badge colorPalette="gray">{STAFF_ROLE_LABEL[staff.role]}</Badge>}
              meta={`${formatDate(staff.since)} 추가${lastActive}`}
            />
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
                <Checkbox.Label>
                  <Text typography="body3" weight="bold">
                    당사자에게 디스코드 알림 보내기
                  </Text>
                </Checkbox.Label>
                <Text typography="body4" foreground="hint">
                  운영진에서 해제됐다는 사실만 알리고, 사유는 보내지 않습니다
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
            해제
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
