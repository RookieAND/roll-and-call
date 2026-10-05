"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Dialog, Text, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import type { StaffCandidate } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  UrlSearchInput,
} from "@/shared/ui";

import { addStaffMember } from "../api/add-staff-member";
import { StaffCandidateRow } from "./staff-candidate-row";

interface AddStaffDialogProps {
  candidates: StaffCandidate[];
  searched: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStaffDialog({ candidates, searched, open, onOpenChange }: AddStaffDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(addStaffMember);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = candidates.find((candidate) => candidate.id === selectedId);
  const emptyResult = searched && candidates.length === 0;
  const confirmLabel = networkError ? "다시 시도" : "운영진으로 추가";

  const add = async () => {
    if (!selected) return;
    const result = await submit(selected.id);
    if (isUndefined(result)) return;
    onOpenChange(false);
    if (result.ok) {
      toast.success(`${selected.nickname}님을 운영진으로 추가했습니다`);
      return;
    }
    toast.info(conflictToastText({ conflict: null, self: false, target: "운영진" }));
    router.refresh();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[520px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>운영진 추가</Dialog.Title>
          <Dialog.Description>이 서버에 가입한 멤버 중에서 찾습니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <UrlSearchInput placeholder="가입한 유저 닉네임 검색" className="w-full" />
            {candidates.length > 0 ? (
              <VStack
                render={<ul aria-label="검색 결과" />}
                className="overflow-hidden rounded-400 border border-gray-200 bg-surface [&>li:first-child>button]:border-t-0"
              >
                {candidates.map((candidate) => (
                  <li key={candidate.id}>
                    <StaffCandidateRow
                      candidate={candidate}
                      selected={candidate.id === selectedId}
                      onToggle={() =>
                        setSelectedId(candidate.id === selectedId ? null : candidate.id)
                      }
                    />
                  </li>
                ))}
              </VStack>
            ) : null}
            {emptyResult ? (
              <VStack gap="025">
                <Text typography="body3" weight="medium">
                  찾는 멤버가 없습니다.
                </Text>
                <Text typography="body4" foreground="hint">
                  이미 운영진인 멤버는 목록에 나오지 않습니다.
                </Text>
              </VStack>
            ) : null}
            <NotificationPreview
              payload={{ kind: NOTIFICATION_KIND.staffAdded, params: {} }}
              recipients="당사자의 알림 탭으로 알립니다."
            />
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button
            loading={pending}
            disabled={!selected || pending}
            onClick={() => void add()}
            className="gap-050"
          >
            {networkError ? <RotateCcw size={14} aria-hidden /> : null}
            {confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
