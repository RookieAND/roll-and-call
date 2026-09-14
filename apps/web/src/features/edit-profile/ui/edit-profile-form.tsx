"use client";

import { Button, Field, Text, TextInput, Textarea, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmDialog, toast } from "@/shared/ui";
import { updateProfile } from "../api/update-profile";
import { AvatarRefreshField } from "./avatar-refresh-field";
import { SlotPresetField } from "./slot-preset-field";

const BIO_MAX = 200;

// 프로필 편집. 하단 바는 취소 · 저장 반반, 바꾼 채로 나가면 한 번 묻는다. 로그아웃은 마이페이지 설정 한 곳.
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
  const [pending, startTransition] = useTransition();

  const dirty =
    username !== defaultUsername ||
    bio !== defaultBio ||
    slots.toSorted().join() !== defaultSlots.toSorted().join();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    startTransition(async () => {
      const result = await updateProfile({ username, bio, defaultSlots: slots });
      if (result.error) {
        setFailure({ error: result.error, field: result.field });
        return;
      }
      toast.success("프로필을 저장했습니다");
      if (result.redirect) router.push(result.redirect);
    });
  }

  function requestLeave() {
    if (dirty) setConfirmingLeave(true);
    else router.push("/me");
  }

  // 서버가 지목한 필드 옆에 붙이고, 지목이 없으면 버튼 위에 둔다.
  const usernameError = failure?.field === "username" ? failure.error : undefined;
  const bioError = failure?.field === "bio" ? failure.error : undefined;
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
            onChange={(e) => setUsername(e.target.value)}
            invalid={!!usernameError}
            maxLength={30}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <Field label="한 줄 소개" htmlFor="bio" error={bioError}>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="주로 크툴루를 굴립니다. 평일 저녁 선호."
              maxLength={BIO_MAX}
              invalid={!!bioError}
              className="min-h-[76px]"
            />
          </Field>
          <div className="flex justify-between gap-2">
            <Text typography="body4" foreground="hint">
              마이페이지와 참여자 명단에 함께 보입니다.
            </Text>
            <Text typography="body4" foreground="hint" className="shrink-0 tabular-nums">
              {bio.length} / {BIO_MAX}
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
          <Button type="button" variant="outline" size="lg" className="h-[50px]" onClick={requestLeave}>
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
