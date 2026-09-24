"use client";

import {
  Button,
  Dialog,
  Field,
  Text,
  TextInput,
  Textarea,
  VStack,
  cn,
  toast,
} from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { withObjectParticle, withSubjectParticle, withTopicParticle } from "@/shared/lib";
import type { RulebookActionResult, RulebookRequestRow } from "@/shared/server";
import { UserPreview } from "@/shared/ui";

import { rejectRequest } from "../api/reject-request";
import { quoteWithParticle } from "../model/quote-with-particle";
import { RequestConflict } from "./request-conflict";

type Conflict = Extract<RulebookActionResult, { ok: false }>["conflict"];

interface RejectRequestFormProps {
  request: RulebookRequestRow;
  onDone: () => void;
}

export function RejectRequestForm({ request, onDone }: RejectRequestFormProps) {
  const [pending, startTransition] = useTransition();
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [conflict, setConflict] = useState<Conflict | undefined>(undefined);

  const conflicted = conflict !== undefined;
  const canConfirm = Boolean(userReason.trim()) && !pending && !conflicted;

  const confirm = () =>
    startTransition(async () => {
      const result = await rejectRequest(request.id, { userReason, staffMemo });
      if (!result.ok) {
        setConflict(result.conflict);
        return;
      }
      toast.success(`「${request.name}」 추가 요청을 반려했습니다`);
      onDone();
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>룰북 추가 요청 반려</Dialog.Title>
        <Dialog.Description>
          {withSubjectParticle(request.requesterNickname)} 요청한{" "}
          {quoteWithParticle(request.name, withObjectParticle)} 등록하지 않습니다
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflicted ? <RequestConflict conflict={conflict} /> : null}
          <VStack gap="150" className={cn(conflicted && "pointer-events-none opacity-50")}>
            <Field.Root
              label="사용자에게 보이는 사유"
              htmlFor="reject-request-user-reason"
              required
              description="요청자에게 그대로 보이고, 활동 기록에 남습니다."
            >
              <TextInput
                id="reject-request-user-reason"
                value={userReason}
                disabled={conflicted}
                onChange={(event) => setUserReason(event.target.value)}
              />
            </Field.Root>
            <Field.Root
              label="운영진 메모 (사용자에게 안 보임)"
              htmlFor="reject-request-staff-memo"
            >
              <Textarea
                id="reject-request-staff-memo"
                rows={1}
                placeholder="선택"
                value={staffMemo}
                disabled={conflicted}
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
            <UserPreview title="요청자에게 이렇게 보입니다">
              요청하신 {quoteWithParticle(request.name, withTopicParticle)} 등록되지 않았어요. 사유:{" "}
              {userReason.trim() || "…"}
            </UserPreview>
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <Text typography="body4" foreground="hint" className="mr-auto">
          사유를 입력해야 반려할 수 있습니다
        </Text>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button colorPalette="danger" loading={pending} disabled={!canConfirm} onClick={confirm}>
          반려
        </Button>
      </Dialog.Footer>
    </>
  );
}
