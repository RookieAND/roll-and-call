"use client";

import {
  ABSENCE_ADDED_TAG,
  ABSENCE_ADDED_TAG_LABEL,
  type AbsenceAddedTag,
} from "@roll-and-call/database/games/model";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Dialog, Text, TextInput, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { conflictToastText, formatDateTime, useActionSubmit } from "@/shared/lib";
import type { NoShowSessionCandidate, NoShowSessionSearch } from "@/shared/server";
import {
  ActionNetworkError,
  EMPTY_IMAGE,
  EmptyState,
  ModalServerLabel,
  NotificationPreview,
  UrlSearchInput,
} from "@/shared/ui";

import { addNoShowRecord } from "../api/add-no-show-record";
import { OptionList } from "./option-list";
import { OptionRow } from "./option-row";
import { StepLabel } from "./step-label";

const REASON_MAX = 200;
const TAGS = Object.values(ABSENCE_ADDED_TAG);

interface AddNoShowFormProps {
  search: NoShowSessionSearch;
  onClose: () => void;
  onAdded: (id: string) => void;
}

export function AddNoShowForm({ search, onClose, onAdded }: AddNoShowFormProps) {
  const [session, setSession] = useState<NoShowSessionCandidate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tag, setTag] = useState<AbsenceAddedTag | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const action = useActionSubmit(addNoShowRecord);

  const participant = session?.participants.find((candidate) => candidate.userId === userId);
  const other = tag === ABSENCE_ADDED_TAG.other;
  const reasonFilled = !isNull(tag) && (!other || Boolean(otherReason.trim()));
  const ready = Boolean(session && participant) && reasonFilled && !action.pending;
  const none = search.total === 0;
  const shownSessions = session && participant ? [session] : search.sessions;
  // 처리 중에는 networkError가 꺼진다(runActionSubmit).
  const idleLabel = action.networkError ? "다시 시도" : "불참으로 기록";
  const confirmLabel = action.pending ? "처리 중입니다" : idleLabel;

  const pickSession = (id: string) => {
    setSession(shownSessions.find((candidate) => candidate.id === id) ?? null);
    setUserId(null);
  };

  const confirm = async () => {
    if (!session || !participant || isNull(tag)) return;
    const result = await action.submit({
      gameId: session.id,
      userId: participant.userId,
      tag,
      reason: other ? otherReason.trim() : "",
    });
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`불참으로 기록했습니다 · ${participant.nickname}`);
      onAdded(result.id);
      return;
    }
    toast.info(
      conflictToastText({ conflict: result.conflict, self: result.self, target: "불참 기록" }),
    );
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>불참 기록 추가</Dialog.Title>
        <Dialog.Description>참석으로 기록된 참여자를 불참으로 바꿉니다.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {action.networkError ? <ActionNetworkError /> : null}
          <VStack gap="100">
            <StepLabel id="add-no-show-session" step={1} label="세션" />
            <UrlSearchInput param="sq" placeholder="구인 제목 또는 GM 닉네임" className="w-full" />
            {none ? (
              <EmptyState
                image={EMPTY_IMAGE.schedule}
                title="불참으로 바꿀 수 있는 세션이 없습니다"
                description="출석이 확정되고 30일이 지나지 않은 세션만 고를 수 있습니다."
              />
            ) : null}
            {shownSessions.length > 0 ? (
              <OptionList
                labelledBy="add-no-show-session"
                value={session?.id ?? null}
                disabled={action.pending}
                onValueChange={pickSession}
              >
                {shownSessions.map((candidate) => (
                  <OptionRow
                    key={candidate.id}
                    value={candidate.id}
                    label={`${candidate.title} · GM ${candidate.gmNickname} · ${formatDateTime(candidate.startsAt)}`}
                    note={candidate.autoConfirmed ? "자동 확정" : "GM 확정"}
                    selected={candidate.id === session?.id}
                  />
                ))}
              </OptionList>
            ) : null}
          </VStack>
          {session ? (
            <VStack gap="100">
              <StepLabel id="add-no-show-participant" step={2} label="참여자" />
              <OptionList
                labelledBy="add-no-show-participant"
                value={userId}
                disabled={action.pending}
                onValueChange={setUserId}
              >
                {session.participants.map((candidate) => (
                  <OptionRow
                    key={candidate.userId}
                    value={candidate.userId}
                    label={candidate.nickname}
                    note={candidate.absent ? "이미 불참" : undefined}
                    selected={candidate.userId === userId}
                    disabled={candidate.absent}
                  />
                ))}
              </OptionList>
            </VStack>
          ) : null}
          {participant ? (
            <VStack gap="100">
              <StepLabel id="add-no-show-reason" step={3} label="사유" required />
              <OptionList
                labelledBy="add-no-show-reason"
                value={tag}
                disabled={action.pending}
                onValueChange={(value) => setTag(value as AbsenceAddedTag)}
              >
                {TAGS.map((value) => (
                  <OptionRow
                    key={value}
                    value={value}
                    label={ABSENCE_ADDED_TAG_LABEL[value]}
                    selected={value === tag}
                  />
                ))}
              </OptionList>
              {other ? (
                <TextInput
                  value={otherReason}
                  maxLength={REASON_MAX}
                  required
                  disabled={action.pending}
                  aria-label="기타 사유"
                  onChange={(event) => setOtherReason(event.target.value)}
                />
              ) : null}
              <Text typography="body4" foreground="hint">
                운영진 기록에만 남습니다.
              </Text>
            </VStack>
          ) : null}
          {session ? (
            <NotificationPreview
              payload={
                participant
                  ? {
                      kind: NOTIFICATION_KIND.absenceAddedByStaff,
                      params: { gameId: session.id, gameTitle: session.title },
                    }
                  : null
              }
              recipients="당사자와 GM에게 알립니다."
              emptyText="참여자를 고르면 알림 미리보기가 표시됩니다."
            />
          ) : null}
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <Dialog.Close
          render={<Button variant="ghost" colorPalette="gray" />}
          disabled={action.pending}
          className="ml-auto"
        >
          닫기
        </Dialog.Close>
        <Button disabled={!ready} onClick={() => void confirm()}>
          {action.networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
