"use client";

import { Avatar, Button, Chip, Field, Text, TextInput, Textarea, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SLOT_PRESETS } from "../model/slot-presets";
import { toast } from "@/shared/ui";
import { refreshAvatar } from "../api/refresh-avatar";
import { updateProfile } from "../api/update-profile";

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
  const [avatar, setAvatar] = useState(avatarUrl ?? null);
  const [refreshing, startRefresh] = useTransition();
  const [username, setUsername] = useState(defaultUsername);
  const [bio, setBio] = useState(defaultBio);
  const [slots, setSlots] = useState<string[]>(defaultSlots);
  const [failure, setFailure] = useState<{ error: string; field?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleSlot(key: string) {
    setSlots((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  }

  function reloadAvatar() {
    startRefresh(async () => {
      const result = await refreshAvatar();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setAvatar(result.avatarUrl ?? null);
      toast.success("아바타를 다시 불러왔습니다");
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
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

  const usernameError = failure?.field === "username" ? failure.error : undefined;
  const bioError = failure?.field === "bio" ? failure.error : undefined;
  const formError = failure && !failure.field ? failure.error : null;

  return (
    <form onSubmit={submit}>
      <VStack gap={4}>
        <VStack gap={2} className="items-center">
          <Avatar src={avatar} name={username} size="3xl" />
          <Button variant="ghost" size="sm" loading={refreshing} onClick={reloadAvatar}>
            Discord 아바타 다시 불러오기
          </Button>
        </VStack>
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
        <Field label="기본 가능 시간대" description="일정 조율 그리드의 초기값으로 씁니다.">
          <div className="flex gap-[7px]">
            {SLOT_PRESETS.map((s) => {
              const on = slots.includes(s.key);
              return (
                <Chip key={s.key} shape="block" selected={on} onClick={() => toggleSlot(s.key)}>
                  {s.label}
                </Chip>
              );
            })}
          </div>
        </Field>
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
