"use client";

import { Avatar, Button, Chip, Field, Text, TextInput, Textarea, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SLOT_PRESETS } from "@/entities/profile";
import { toast } from "@/shared/lib/toast";
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
  const [username, setUsername] = useState(defaultUsername);
  const [bio, setBio] = useState(defaultBio);
  const [slots, setSlots] = useState<string[]>(defaultSlots);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleSlot(key: string) {
    setSlots((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateProfile({ username, bio, defaultSlots: slots });
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("프로필을 저장했습니다");
      if (result.redirect) router.push(result.redirect);
    });
  }

  return (
    <form onSubmit={submit}>
      <VStack gap={4}>
        <VStack gap={2} className="items-center">
          <Avatar src={avatarUrl} name={username} size="3xl" />
          <Text typography="subtitle2" foreground="primary">
            Discord 아바타 다시 불러오기
          </Text>
        </VStack>
        <Field
          label="표시 이름"
          htmlFor="username"
          description="구인 카드와 참여자 목록에 보이는 이름입니다."
          error={error ?? undefined}
        >
          <TextInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            invalid={!!error}
            maxLength={30}
          />
        </Field>
        <Field label="한 줄 소개" htmlFor="bio">
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
        <Button type="submit" size="lg" className="h-[50px] w-full" loading={pending}>
          저장
        </Button>
      </VStack>
    </form>
  );
}
