"use client";

import { Button, Dialog, RadioCard, RadioGroup, Text, VStack, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";
import type { StaffCandidate, StaffRole } from "@/shared/server";
import { UrlSearchInput } from "@/shared/ui";

import { addStaffMember } from "../api/add-staff-member";
import { ROLE_OPTIONS } from "../model/role-options";

interface AddStaffDialogProps {
  candidates: StaffCandidate[];
  searched: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 검색어는 주소의 ?q=로 옮기고, 후보는 서버가 찾아서 넘긴다.
export function AddStaffDialog({ candidates, searched, open, onOpenChange }: AddStaffDialogProps) {
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [role, setRole] = useState<StaffRole>("staff");

  const selected = candidates.find((candidate) => candidate.id === selectedId);
  const emptyResult = searched && candidates.length === 0;

  const add = () =>
    startTransition(async () => {
      if (!selected) return;
      await addStaffMember(selected.id, role);
      toast.success(`${selected.nickname}님을 운영진으로 추가했습니다`);
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[520px]">
        <Dialog.Header>
          <Dialog.Title>운영진 추가</Dialog.Title>
          <Dialog.Description>디스코드 서버에 있는 멤버 중에서 찾습니다</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <UrlSearchInput placeholder="디스코드 닉네임 검색" className="w-full" />
            {candidates.length > 0 ? (
              <RadioGroup
                value={selectedId ?? ""}
                onValueChange={(value) => setSelectedId(value as string)}
                aria-label="추가할 멤버"
                className="flex flex-col gap-075"
              >
                {candidates.map((candidate) => (
                  <RadioCard.Root
                    key={candidate.id}
                    value={candidate.id}
                    indicator="check"
                    className="px-150 py-125"
                  >
                    <RadioCard.Title>{candidate.nickname}</RadioCard.Title>
                    <RadioCard.Description>
                      @{candidate.discordHandle} · {formatDate(candidate.joinedAt)} 가입
                    </RadioCard.Description>
                    <RadioCard.Indicator />
                  </RadioCard.Root>
                ))}
              </RadioGroup>
            ) : null}
            {emptyResult ? (
              <Text typography="body3" foreground="hint">
                찾는 멤버가 없어요. 이미 운영진인 멤버는 목록에 나오지 않습니다.
              </Text>
            ) : null}
            <VStack gap="075">
              <Text typography="body4" weight="bold" id="add-staff-role-label">
                역할
              </Text>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as StaffRole)}
                aria-labelledby="add-staff-role-label"
                className="flex flex-col gap-075"
              >
                {ROLE_OPTIONS.map((option) => (
                  <RadioCard.Root key={option.value} value={option.value}>
                    <RadioCard.Title>{option.label}</RadioCard.Title>
                    <RadioCard.Description>{option.description}</RadioCard.Description>
                    <RadioCard.Indicator />
                  </RadioCard.Root>
                ))}
              </RadioGroup>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center">
          <Text typography="body4" foreground="hint" className="mr-auto">
            추가하면 당사자에게 디스코드 알림이 갑니다
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
