"use client";

import { Button, Field, Text, TextInput, Textarea, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/shared/ui";
import { updateProfile } from "../api/update-profile";
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
  const [pending, startTransition] = useTransition();

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

  // 서버가 지목한 필드 옆에 붙이고, 지목이 없으면 폼 아래에 둔다.
  const usernameError = failure?.field === "username" ? failure.error : undefined;
  const bioError = failure?.field === "bio" ? failure.error : undefined;
  const formError = failure && !failure.field ? failure.error : null;

  return (
    <form onSubmit={submit}>
      <VStack gap={4}>
        <AvatarRefreshField defaultUrl={avatarUrl} name={username} />

        <Field
          label="표시 이름"
          htmlFor="username"
          description="구인 카드와 참여자 목록에 보이는 이름입니다."
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

        <Field label="한 줄 소개" htmlFor="bio" error={bioError}>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="주로 크툴루를 굴립니다. 평일 저녁 선호."
            maxLength={200}
            className="min-h-[76px]"
          />
        </Field>

        <SlotPresetField value={slots} onChange={setSlots} />

        {formError && (
          <Text typography="body2" foreground="danger">
            {formError}
          </Text>
        )}
        <Button type="submit" size="lg" className="h-[50px] w-full" loading={pending}>
          저장
        </Button>
      </VStack>
    </form>
  );
}
