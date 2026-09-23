"use client";

import {
  Button,
  Field,
  FloatingBar,
  HStack,
  Text,
  Textarea,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  KEYWORD_MAX_COUNT,
  KEYWORD_MAX_LENGTH,
  type AvailabilityInterval,
  type ProfileLink,
} from "@/entities/profile";
import { ConfirmDialog, TagInput, toast, useAction } from "@/shared/ui";

import { updateProfile } from "../api/update-profile";
import { BIO_MAX_LENGTH, PROFILE_FIELD, USERNAME_MAX_LENGTH } from "../model/profile-form";
import { AvailabilitySummaryField } from "./availability-summary-field";
import { AvatarRefreshField } from "./avatar-refresh-field";
import { ProfileLinksField } from "./profile-links-field";

interface EditProfileFormProps {
  defaultUsername: string;
  defaultBio?: string;
  defaultKeywords?: string[];
  defaultLinks?: ProfileLink[];
  availability?: AvailabilityInterval[];
  avatarUrl?: string | null;
}

export function EditProfileForm({
  defaultUsername,
  defaultBio = "",
  defaultKeywords = [],
  defaultLinks = [],
  availability = [],
  avatarUrl,
}: EditProfileFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [bio, setBio] = useState(defaultBio);
  const [keywords, setKeywords] = useState(defaultKeywords);
  const [links, setLinks] = useState(defaultLinks);
  const [failure, setFailure] = useState<{ error: string; field?: string } | null>(null);
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const { pending, run } = useAction();

  const dirty =
    username !== defaultUsername ||
    bio !== defaultBio ||
    keywords.join() !== defaultKeywords.join() ||
    JSON.stringify(links) !== JSON.stringify(defaultLinks);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    run(() => updateProfile({ username, bio, keywords, links }), {
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
      <VStack gap="250" className="pb-200">
        <AvatarRefreshField defaultUrl={avatarUrl} name={username} />

        <Field.Root
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
        </Field.Root>

        <Field.Root
          label="한 줄 소개 (선택)"
          htmlFor="bio"
          counter={`${bio.length} / ${BIO_MAX_LENGTH}`}
          description="마이페이지와 참여자 명단에 함께 보입니다."
          error={bioError}
        >
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="어떤 판을 즐겨 하는지 한 줄로 적어주세요."
            maxLength={BIO_MAX_LENGTH}
            invalid={!!bioError}
            rows={3}
          />
        </Field.Root>

        <VStack gap="075">
          <Field.Root
            label="성향"
            htmlFor="keywords"
            counter={`${keywords.length} / ${KEYWORD_MAX_COUNT}`}
          >
            <TagInput
              id="keywords"
              value={keywords}
              onChange={setKeywords}
              max={KEYWORD_MAX_COUNT}
              maxLength={KEYWORD_MAX_LENGTH}
              prefix="#"
              placeholder="수사중심"
            />
          </Field.Root>
          <Text typography="body4" foreground="hint" render={<p />}>
            {KEYWORD_MAX_LENGTH}자까지 · 앞에 #가 붙습니다.
          </Text>
        </VStack>

        <ProfileLinksField value={links} onChange={setLinks} />

        <AvailabilitySummaryField intervals={availability} />
      </VStack>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <VStack gap="150">
            {formError && (
              <Text typography="body2" foreground="danger" render={<p />}>
                {formError}
              </Text>
            )}
            <HStack gap="100" className="[&>*]:flex-1">
              <Button type="button" variant="outline" size="lg" onClick={requestLeave}>
                취소
              </Button>
              <Button type="submit" size="lg" loading={pending}>
                저장
              </Button>
            </HStack>
          </VStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

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
