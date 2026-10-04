"use client";

import {
  Button,
  Dialog,
  Field,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { chosenReason, conflictToastText, useActionSubmit } from "@/shared/lib";
import {
  ActionNetworkError,
  FactBox,
  FactSub,
  FormSection,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
} from "@/shared/ui";

import { editMemberNickname } from "../api/edit-member-nickname";
import { NICKNAME_REASONS, type NicknameReason } from "../model/nickname-reasons";
import { NICKNAME_TAKEN_ERROR } from "../model/nickname-rule";
import { quoteWithDirection } from "../model/quote-with-direction";
import { useNicknameCheck } from "../model/use-nickname-check";

interface EditNicknameDialogProps {
  userId: string;
  nickname: string;
  discordHandle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNicknameDialog({
  userId,
  nickname,
  discordHandle,
  open,
  onOpenChange,
}: EditNicknameDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(editMemberNickname);
  const [nextNickname, setNextNickname] = useState("");
  const [reasonTag, setReasonTag] = useState<NicknameReason | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [takenNickname, setTakenNickname] = useState<string | null>(null);

  const typed = nextNickname.trim();
  const check = useNicknameCheck({ userId, nickname: typed });
  const nicknameError = takenNickname === typed ? NICKNAME_TAKEN_ERROR : (check?.error ?? null);
  const nicknameUsable = Boolean(check) && !nicknameError && typed !== nickname;
  const reason = chosenReason({ chip: reasonTag, otherText: otherReason });
  const filled = nicknameUsable && Boolean(reason);
  const canConfirm = filled && !pending;
  const preview = filled
    ? { kind: "nickname_changed" as const, params: { nickname: typed, reason } }
    : null;

  const confirm = async () => {
    if (!reasonTag) return;
    const result = await submit({
      userId,
      input: { expected: nickname, nickname: typed, reasonTag, reason, staffMemo },
    });
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`닉네임을 ${quoteWithDirection(typed)} 바꿨습니다`);
      onOpenChange(false);
      router.refresh();
      return;
    }
    if ("taken" in result) {
      setTakenNickname(typed);
      return;
    }
    onOpenChange(false);
    router.refresh();
    toast.info(
      conflictToastText({ conflict: result.conflict, self: result.self, target: "닉네임" }),
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[600px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>닉네임 수정</Dialog.Title>
          <Dialog.Description>
            수정한 닉네임은 앱 전체와 지난 구인, 후기에 바로 반영됩니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="200">
            {networkError ? <ActionNetworkError /> : null}
            <FactBox
              items={[
                {
                  label: "현재 닉네임",
                  value: (
                    <Text typography="body3" weight="bold">
                      {nickname}
                    </Text>
                  ),
                },
                {
                  label: "디스코드 ID",
                  value: (
                    <>
                      {`@${discordHandle}`}
                      <FactSub> · 바뀌지 않습니다</FactSub>
                    </>
                  ),
                },
              ]}
            />
            <VStack gap="250">
              <FormSection
                title="1. 새 닉네임"
                description="2~12자의 한글, 영문, 숫자를 쓸 수 있습니다."
              >
                <Field.Root
                  htmlFor="nickname-next"
                  error={nicknameError ?? undefined}
                  description={nicknameUsable ? "사용할 수 있는 닉네임입니다." : undefined}
                >
                  <TextInput
                    id="nickname-next"
                    aria-label="새 닉네임"
                    placeholder="새 닉네임을 입력해 주세요"
                    value={nextNickname}
                    invalid={Boolean(nicknameError)}
                    onChange={(event) => setNextNickname(event.target.value)}
                  />
                </Field.Root>
              </FormSection>
              <FormSection
                title="2. 수정 사유"
                description="고른 사유는 당사자의 알림 탭에 그대로 보입니다."
              >
                <ReasonChips
                  ariaLabel="수정 사유"
                  reasons={NICKNAME_REASONS}
                  value={reasonTag}
                  otherText={otherReason}
                  onValueChange={(value) => setReasonTag(value as NicknameReason)}
                  onOtherTextChange={setOtherReason}
                  otherLabel="사용자에게 보여줄 사유"
                  disabled={pending}
                />
                <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="nickname-staff-memo">
                  <Textarea
                    id="nickname-staff-memo"
                    rows={1}
                    placeholder="선택"
                    value={staffMemo}
                    onChange={(event) => setStaffMemo(event.target.value)}
                  />
                </Field.Root>
              </FormSection>
            </VStack>
            <NotificationPreview
              payload={preview}
              emptyText="새 닉네임과 사유를 정하면 알림 미리보기가 표시됩니다."
            />
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <HStack align="center" gap="075" className="mr-auto text-hint">
            <ScrollText size={14} aria-hidden />
            <Text typography="body4" foreground="hint">
              수정 내역은 활동 기록에 남습니다
            </Text>
          </HStack>
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button
            loading={pending}
            disabled={!canConfirm}
            onClick={() => void confirm()}
            className="min-w-[112px]"
          >
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "수정 확정"}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
