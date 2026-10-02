"use client";

import {
  Button,
  Chip,
  Dialog,
  Field,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  cn,
  toast,
} from "@roll-and-call/ui";
import { ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  ConflictNotice,
  FactBox,
  FactSub,
  FormSection,
  ModalServerLabel,
  UserPreview,
} from "@/shared/ui";

import { editMemberNickname } from "../api/edit-member-nickname";
import {
  NICKNAME_REASONS,
  OTHER_NICKNAME_REASON,
  type NicknameReason,
} from "../model/nickname-reasons";
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
  const [pending, startTransition] = useTransition();
  const [nextNickname, setNextNickname] = useState("");
  const [reasonTag, setReasonTag] = useState<NicknameReason | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [takenNickname, setTakenNickname] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ from: string; to: string } | null>(null);

  const typed = nextNickname.trim();
  const check = useNicknameCheck({ userId, nickname: typed });
  const nicknameError = takenNickname === typed ? NICKNAME_TAKEN_ERROR : (check?.error ?? null);
  const nicknameUsable = Boolean(check) && !nicknameError && typed !== nickname;
  const other = reasonTag === OTHER_NICKNAME_REASON;
  const reason = other ? otherReason.trim() : (reasonTag ?? "");
  const filled = nicknameUsable && Boolean(reason);
  const canConfirm = filled && !pending && !conflict;

  const reset = () => {
    setNextNickname("");
    setReasonTag(null);
    setOtherReason("");
    setStaffMemo("");
    setTakenNickname(null);
    setConflict(null);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const reload = () => {
    reset();
    router.refresh();
  };

  const confirm = () =>
    startTransition(async () => {
      if (!reasonTag) return;
      const result = await editMemberNickname(userId, {
        expected: nickname,
        nickname: typed,
        reasonTag,
        reason,
        staffMemo,
      });
      if (result.ok) {
        toast.success(`닉네임을 ${quoteWithDirection(typed)} 바꿨습니다`);
        close();
        router.refresh();
        return;
      }
      if ("taken" in result) setTakenNickname(typed);
      else setConflict(result.conflict);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || nextOpen || close()}>
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
            {conflict ? (
              <ConflictNotice
                title="사용자가 방금 닉네임을 직접 바꿨습니다"
                description={`‘${conflict.from}’에서 ${quoteWithDirection(conflict.to)} 바뀌었습니다. 입력한 내용은 저장되지 않았습니다.`}
                actions={null}
              />
            ) : null}
            <VStack
              gap="200"
              aria-hidden={conflict ? true : undefined}
              className={cn(conflict && "pointer-events-none opacity-50")}
            >
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
                  description="고른 사유는 사용자에게 그대로 보입니다."
                >
                  <HStack role="radiogroup" aria-label="수정 사유" gap="075" wrap>
                    {NICKNAME_REASONS.map((item) => (
                      <Chip
                        key={item}
                        role="radio"
                        aria-checked={reasonTag === item}
                        selected={reasonTag === item}
                        onClick={() => setReasonTag(item)}
                      >
                        {item}
                      </Chip>
                    ))}
                  </HStack>
                  {other ? (
                    <Field.Root
                      label="사용자에게 보여줄 사유"
                      htmlFor="nickname-other-reason"
                      required
                      description="입력한 사유는 사용자 화면에서 ‘사유:’ 뒤에 그대로 표시됩니다. 명사형으로 짧게 적어 주세요."
                    >
                      <TextInput
                        id="nickname-other-reason"
                        value={otherReason}
                        onChange={(event) => setOtherReason(event.target.value)}
                      />
                    </Field.Root>
                  ) : null}
                  <Field.Root
                    label="운영진 메모 (사용자에게 안 보임)"
                    htmlFor="nickname-staff-memo"
                  >
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
              <UserPreview>
                {filled
                  ? `운영진이 닉네임을 ${quoteWithDirection(typed)} 바꿨어요. 사유: ${reason}. 이의가 있다면 디스코드 #문의 채널로 알려주세요.`
                  : "새 닉네임과 사유를 정하면 사용자에게 보일 문구가 여기에 표시됩니다."}
              </UserPreview>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <HStack align="center" gap="075" className="mr-auto text-hint">
            <ScrollText size={14} aria-hidden />
            <Text typography="body4" foreground="hint">
              수정 내역은 활동 기록에 남습니다
            </Text>
          </HStack>
          {conflict ? (
            <>
              <Button variant="ghost" colorPalette="gray" onClick={close}>
                닫기
              </Button>
              <Button onClick={reload}>다시 불러오기</Button>
            </>
          ) : (
            <>
              <Dialog.Close
                render={<Button variant="ghost" colorPalette="gray" />}
                disabled={pending}
              >
                취소
              </Dialog.Close>
              <Button
                loading={pending}
                disabled={!canConfirm}
                onClick={confirm}
                className="min-w-[112px]"
              >
                수정 확정
              </Button>
            </>
          )}
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
