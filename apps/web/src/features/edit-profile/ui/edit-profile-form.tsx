"use client";

import { Button, Field, Text, TextInput, Textarea, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { updateProfile } from "../api/update-profile";
import { BIO_MAX_LENGTH, PROFILE_FIELD, USERNAME_MAX_LENGTH } from "../model/profile-form";
import { AvatarRefreshField } from "./avatar-refresh-field";
import { SlotPresetField } from "./slot-preset-field";

export function EditProfileForm({
  defaultUsername,
  defaultBio = "",
  defaultSlots = [],
  avatarUrl,
}: {
  defaultUsername: string;
  defaultBio?: string;
  defaultSlots?: string[];
  avatarUrl?: string | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [bio, setBio] = useState(defaultBio);
  const [slots, setSlots] = useState<string[]>(defaultSlots);
  const [failure, setFailure] = useState<{ error: string; field?: string } | null>(null);
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const { pending, run } = useAction();

  const dirty =
    username !== defaultUsername ||
    bio !== defaultBio ||
    slots.toSorted().join() !== defaultSlots.toSorted().join();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    run(() => updateProfile({ username, bio, defaultSlots: slots }), {
      onSuccess: () => toast.success("프로필을 저장했습니다"),
      onError: (result) => setFailure({ error: result.error, field: result.field }),
    });
  }

  function requestLeave() {
    if (dirty) setConfirmingLeave(true);
    else router.push("/me");
  }

  const usernameError = failure?.field === PROFILE_FIELD.username ? failure.error : undefined;
  const bioError = failure?.field === PROFILE_FIELD.bio ? failure.error : undefined;
  const formError = failure && !failure.field ? failure.error : null;

  return (
    <form onSubmit={submit} className="flex flex-col">
      <VStack gap={5} className="pb-4">
        <AvatarRefreshField defaultUrl={avatarUrl} name={username} />

        <Field
          label="표시 이름"
          htmlFor="username"
          description="구인 카드와 참여자 명단에 보이는 이름입니다."
          error={usernameError}
        >
          <TextInput
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            invalid={!!usernameError}
            maxLength={USERNAME_MAX_LENGTH}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <Field label="한 줄 소개" htmlFor="bio" error={bioError}>
            <Textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="주로 크툴루를 굴립니다. 평일 저녁 선호."
              maxLength={BIO_MAX_LENGTH}
              invalid={!!bioError}
              className="min-h-[76px]"
            />
          </Field>
          <div className="flex justify-between gap-2">
            <Text typography="body4" foreground="hint">
              마이페이지와 참여자 명단에 함께 보입니다.
            </Text>
            <Text typography="body4" foreground="hint" className="shrink-0 tabular-nums">
              {bio.length} / {BIO_MAX_LENGTH}
            </Text>
          </div>
        </div>

        <SlotPresetField value={slots} onChange={setSlots} />
      </VStack>

      <div className="sticky bottom-[58px] z-10 -mx-4 flex flex-col gap-3 border-t border-gray-200 bg-surface px-4 py-3">
        {formError && (
          <Text typography="body2" foreground="danger" render={<p />}>
            {formError}
          </Text>
        )}
        <div className="flex gap-2 [&>*]:flex-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-[50px]"
            onClick={requestLeave}
          >
            취소
          </Button>
          <Button type="submit" size="lg" className="h-[50px]" loading={pending}>
            저장
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingLeave}
        onOpenChange={setConfirmingLeave}
        title="편집을 그만둘까요?"
        description="바꾼 내용은 저장되지 않습니다."
        cancelLabel="이어서 고치기"
        confirmLabel="그만두기"
        danger
        onConfirm={() => router.push("/me")}
      />
    </form>
  );
}
