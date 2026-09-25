"use client";

import { Button, Callout, Dialog, Field, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { BookOpen, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

import type { GrantCandidate } from "@/shared/server";
import { UrlSearchInput, UserPreview } from "@/shared/ui";

import { grantRulebookCertification } from "../api/grant-rulebook-certification";
import { GrantCandidateRow } from "./grant-candidate-row";

interface GrantGmDialogProps {
  rulebookId: string;
  rulebookLabel: string;
  categoryEdition: string;
  candidates: GrantCandidate[];
  searched: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 검색어는 주소의 ?q=로 옮기고, 후보와 인증 상태는 서버가 찾아서 넘긴다.
export function GrantGmDialog({
  rulebookId,
  rulebookLabel,
  categoryEdition,
  candidates,
  searched,
  open,
  onOpenChange,
}: GrantGmDialogProps) {
  const [pending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState("");

  const selected = candidates.find(
    (candidate) => candidate.id === selectedId && candidate.state !== "certified",
  );
  const canConfirm = Boolean(selected && evidence.trim()) && !pending;
  const missingCores = selected?.missingCores.join(", ") ?? "";

  const confirm = () =>
    startTransition(async () => {
      if (!selected) return;
      const result = await grantRulebookCertification(rulebookId, selected.id, evidence);
      if (!result.ok) {
        toast.info(`${selected.nickname}님은 이미 이 룰북으로 인증됐습니다`);
        setSelectedId(null);
        return;
      }
      toast.success(`${selected.nickname}님을 ${rulebookLabel}로 인증했습니다`);
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[600px]">
        <Dialog.Header>
          <Dialog.Title>{rulebookLabel}에 GM 직접 추가</Dialog.Title>
          <Dialog.Description>
            사진 심사 없이 운영진의 판단으로 이 룰북을 인증합니다
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <VStack gap="075">
              <Text typography="body4" weight="bold">
                인증할 GM
              </Text>
              <UrlSearchInput placeholder="닉네임 또는 디스코드 ID" className="w-full" />
              {candidates.length > 0 ? (
                <VStack
                  render={<ul aria-label="검색 결과" />}
                  className="mt-025 overflow-hidden rounded-400 border border-gray-200 bg-surface"
                >
                  {candidates.map((candidate) => (
                    <li key={candidate.id}>
                      <GrantCandidateRow
                        candidate={candidate}
                        selected={candidate.id === selected?.id}
                        onToggle={() =>
                          setSelectedId(candidate.id === selectedId ? null : candidate.id)
                        }
                      />
                    </li>
                  ))}
                </VStack>
              ) : null}
              {searched && candidates.length === 0 ? (
                <Text typography="body3" foreground="hint">
                  찾는 GM이 없어요.
                </Text>
              ) : null}
            </VStack>
            {selected?.state === "pending" ? (
              <Callout.Root colorPalette="primary">
                <Callout.Icon>
                  <ShieldCheck size={14} aria-hidden />
                </Callout.Icon>
                <Callout.Description>
                  {selected.nickname}의 대기 중인 심사 신청은 이 인증과 함께 승인으로 처리되어 심사
                  대기열에서 빠집니다.
                </Callout.Description>
              </Callout.Root>
            ) : null}
            {selected && missingCores ? (
              <Callout.Root>
                <Callout.Icon>
                  <BookOpen size={14} aria-hidden />
                </Callout.Icon>
                <Callout.Description>
                  {categoryEdition} 구인을 열려면 {missingCores} 인증도 있어야 합니다.{" "}
                  {selected.nickname}님은 아직 이 인증이 없습니다.
                </Callout.Description>
              </Callout.Root>
            ) : null}
            <Field.Root
              label="인증 근거 (운영진 메모, 사용자에게 안 보임)"
              htmlFor="grant-evidence"
              required
              description="사진 없이 인증하므로 근거를 반드시 남겨 주세요. 활동 기록에 함께 표시됩니다."
            >
              <Textarea
                id="grant-evidence"
                rows={2}
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
              />
            </Field.Root>
            <UserPreview>
              「{rulebookLabel}」 룰북 인증이 완료됐어요.{" "}
              {missingCores
                ? `${missingCores}까지 인증되면 이 룰로 구인을 열 수 있어요.`
                : "이제 이 룰북으로 구인을 열 수 있어요."}
            </UserPreview>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center">
          <Text typography="body4" foreground="hint" className="mr-auto">
            확정하면 다른 운영진에게 디스코드 알림이 전송됩니다
          </Text>
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canConfirm} onClick={confirm}>
            인증 확정
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
