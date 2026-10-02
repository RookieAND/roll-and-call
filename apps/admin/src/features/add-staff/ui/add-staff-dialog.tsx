"use client";

import { Button, Dialog, Text, VStack, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import type { StaffCandidate } from "@/shared/server";
import { ModalServerLabel, UrlSearchInput } from "@/shared/ui";

import { addStaffMember } from "../api/add-staff-member";
import { StaffCandidateRow } from "./staff-candidate-row";

interface AddStaffDialogProps {
  candidates: StaffCandidate[];
  searched: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStaffDialog({ candidates, searched, open, onOpenChange }: AddStaffDialogProps) {
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = candidates.find((candidate) => candidate.id === selectedId);
  const emptyResult = searched && candidates.length === 0;

  const add = () =>
    startTransition(async () => {
      if (!selected) return;
      await addStaffMember(selected.id);
      toast.success(`${selected.nickname}님을 운영진으로 추가했습니다`);
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[520px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>운영진 추가</Dialog.Title>
          <Dialog.Description>디스코드 서버에 있는 멤버 중에서 찾습니다</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <UrlSearchInput placeholder="디스코드 닉네임 검색" className="w-full" />
            {candidates.length > 0 ? (
              <VStack
                render={<ul aria-label="검색 결과" />}
                className="overflow-hidden rounded-400 border border-gray-200 bg-surface"
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
              <Text typography="body3" foreground="hint">
                찾는 멤버가 없어요. 이미 운영진인 멤버는 목록에 나오지 않습니다.
              </Text>
            ) : null}
            <VStack gap="075">
              <Text typography="body4" weight="bold">
                역할
              </Text>
              <Text typography="body3" foreground="muted">
                운영진은 설정을 뺀 어드민 전체를 쓸 수 있습니다. 소유자는 디스코드 서버장으로 자동
                지정됩니다.
              </Text>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center">
          <Text typography="body4" foreground="hint" className="mr-auto">
            추가하면 당사자에게 디스코드 알림이 전송됩니다
          </Text>
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!selected || pending} onClick={add}>
            운영진으로 추가
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
