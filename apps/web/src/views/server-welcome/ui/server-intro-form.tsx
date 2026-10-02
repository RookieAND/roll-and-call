"use client";

import { Button, Callout, Field, FloatingBar, Text, Textarea, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Link from "next/link";
import { useState } from "react";

import { KEYWORD_MAX_COUNT, KEYWORD_MAX_LENGTH } from "@/entities/profile";
import { ServerLink, TagInput, toast, useAction } from "@/shared/ui";

import { saveServerIntro } from "../api/save-server-intro";
import { INTRO_BIO_MAX_LENGTH } from "../model/intro-bio-max-length";

interface ServerIntroFormProps {
  defaultBio: string;
  defaultKeywords: string[];
  next: string;
}

export function ServerIntroForm({ defaultBio, defaultKeywords, next }: ServerIntroFormProps) {
  const [bio, setBio] = useState(defaultBio);
  const [keywords, setKeywords] = useState(defaultKeywords);
  const [bioError, setBioError] = useState<string | null>(null);
  const { pending, run } = useAction();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setBioError(null);
    run(() => saveServerIntro({ bio, keywords, next }), {
      onSuccess: () => toast.success("프로필을 저장했어요"),
      onError: (result) => {
        if (result.field) setBioError(result.error);
        else toast.error(result.error);
      },
    });
  }

  const bioInvalid = !isNull(bioError);

  return (
    <form onSubmit={submit} className="flex flex-col">
      <VStack gap="250" className="pb-200">
        <Field.Root
          label="한 줄 소개 (선택)"
          htmlFor="bio"
          counter={`${bio.length} / ${INTRO_BIO_MAX_LENGTH}`}
          description="마이페이지와 참여자 명단에 함께 보여요."
          error={bioError ?? undefined}
        >
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="어떤 판을 즐겨 하는지 한 줄로 적어 주세요."
            maxLength={INTRO_BIO_MAX_LENGTH}
            invalid={bioInvalid}
            rows={3}
          />
        </Field.Root>

        <VStack gap="075">
          <Field.Root
            label="성향 (선택)"
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
            {KEYWORD_MAX_LENGTH}자까지 · 앞에 #가 붙어요.
          </Text>
        </VStack>

        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon />
          <Callout.Description>
            기본 가능 시간은 나중에 마이페이지에서 정해도 돼요. 정해 두면 일정 조율 격자에 미리
            칠해져요.
          </Callout.Description>
          <Callout.Action>
            <Button render={<ServerLink path="/me/availability" />} variant="outline" size="sm">
              설정하기
            </Button>
          </Callout.Action>
        </Callout.Root>
      </VStack>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <VStack gap="050">
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              저장하고 시작하기
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              render={<Link href={next} replace />}
            >
              나중에 하기
            </Button>
          </VStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </form>
  );
}
