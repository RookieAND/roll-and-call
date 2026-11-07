"use client";

import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { Button, Callout, Field, FloatingBar, Text, TextInput, VStack } from "@roll-and-call/ui";
import { compact, isNull, omit } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isValueOf, useServerPath } from "@/shared/lib";
import {
  AppBar,
  ConfirmDialog,
  DESKTOP_CARD_CLASS,
  LARGE_DIALOG_TITLE_CLASS,
  LineBreaks,
  PageShell,
  toast,
  useAction,
  useBeforeUnloadWarning,
} from "@/shared/ui";

import { submitHomebrewApplication } from "../api/submit-homebrew-application";
import { canSubmitHomebrew } from "../model/can-submit-homebrew";
import { filledLinks } from "../model/filled-links";
import { HOMEBREW_ERROR } from "../model/homebrew-error";
import { HOMEBREW_FIELD } from "../model/homebrew-field";
import type { HomebrewImage } from "../model/homebrew-image";
import { HomebrewImageField } from "./homebrew-image-field";
import { HomebrewLinkFields } from "./homebrew-link-fields";

type HomebrewField = (typeof HOMEBREW_FIELD)[keyof typeof HOMEBREW_FIELD];

const KNOWN_ERRORS: string[] = Object.values(HOMEBREW_ERROR);
const isHomebrewField = isValueOf(HOMEBREW_FIELD);
const RETRY_LATER = "잠시 뒤 다시 시도해 주세요.";

interface HomebrewApplyFormProps {
  serverId: string;
  // 반려된 신청을 고쳐 다시 낼 때 이전 값. 이미지는 서명한 미리보기 주소를 함께 받는다.
  previous: {
    id: string;
    name: string;
    edition: string;
    summary: string;
    links: string[];
    images: { key: string; previewUrl: string }[];
  } | null;
}

export function HomebrewApplyForm({ serverId, previous }: HomebrewApplyFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, run } = useAction();
  const initialLinks = previous?.links.length ? previous.links : [""];
  const [name, setName] = useState(previous?.name ?? "");
  const [edition, setEdition] = useState(previous?.edition ?? "");
  const [summary, setSummary] = useState(previous?.summary ?? "");
  const [links, setLinks] = useState(initialLinks);
  const [images, setImages] = useState<HomebrewImage[]>(
    () => previous?.images.map((image) => ({ ...image, id: image.key, progress: 1 })) ?? [],
  );
  const [errors, setErrors] = useState<Partial<Record<HomebrewField, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [confirmingLeave, setConfirmingLeave] = useState(false);

  const imageKeys = compact(images.map((image) => image.key));
  const uploading = imageKeys.length < images.length;
  const materialCount = filledLinks(links).length + images.length;
  const enabled = canSubmitHomebrew({ name, summary, links, imageCount: imageKeys.length });
  // 이름·소개를 채웠는데 자료만 없을 때 버튼이 왜 꺼졌는지 알린다.
  const materialMissing =
    Boolean(errors.material) ||
    (name.trim() !== "" && summary.trim() !== "" && materialCount === 0);
  const dirty =
    name !== (previous?.name ?? "") ||
    edition !== (previous?.edition ?? "") ||
    summary !== (previous?.summary ?? "") ||
    filledLinks(links).join() !== filledLinks(initialLinks).join() ||
    images.map((image) => image.key).join() !==
      (previous?.images ?? []).map((image) => image.key).join();
  const leaveHref = toServerPath(
    previous ? `/me/rulebooks/maker/${previous.id}` : "/me/rulebooks/apply",
  );
  const title = previous ? "고쳐서 다시 신청" : "자작 룰 등록 신청";
  const failureLines = failure ? ["신청하지 못했습니다.", failure] : [];

  useBeforeUnloadWarning(dirty && !pending);

  function clearErrors(fields: HomebrewField[]) {
    setFailure(null);
    setErrors((current) => omit(current, fields));
  }

  function changeLinks(next: string[]) {
    clearErrors([HOMEBREW_FIELD.links, HOMEBREW_FIELD.material]);
    setLinks(next);
  }

  function changeImageError(error: string | null) {
    clearErrors([HOMEBREW_FIELD.images, HOMEBREW_FIELD.material]);
    if (!isNull(error)) setErrors((current) => ({ ...current, [HOMEBREW_FIELD.images]: error }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    setErrors({});
    run(
      () =>
        submitHomebrewApplication({
          name,
          edition,
          summary,
          links: filledLinks(links),
          imageUrls: imageKeys,
          previousId: previous?.id ?? null,
        }),
      {
        onSuccess: () => toast.success("신청했습니다. 결과는 알림 탭으로 알립니다."),
        onError: (result) => {
          if (isHomebrewField(result.field)) {
            setErrors({ [result.field]: result.error });
            return;
          }
          setFailure(KNOWN_ERRORS.includes(result.error) ? result.error : RETRY_LATER);
        },
      },
    );
  }

  function requestLeave() {
    if (dirty) setConfirmingLeave(true);
    else router.push(leaveHref);
  }

  return (
    <PageShell readable appBar={<AppBar title={title} onBack={requestLeave} />}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack render={<form onSubmit={submit} />} className="break-keep">
          <VStack gap="250" className="px-200 pt-200 pb-250">
            <Field.Root
              label="룰 이름"
              htmlFor="homebrewName"
              required
              counter={`${name.length} / ${HOMEBREW_LIMIT.nameLength}`}
              error={errors.name}
            >
              <TextInput
                id="homebrewName"
                placeholder="예: 달그림자 연대기"
                maxLength={HOMEBREW_LIMIT.nameLength}
                value={name}
                invalid={Boolean(errors.name)}
                onChange={(event) => {
                  clearErrors([HOMEBREW_FIELD.name]);
                  setName(event.target.value);
                }}
              />
            </Field.Root>
            <Field.Root label="판본" htmlFor="homebrewEdition" counter="선택">
              <TextInput
                id="homebrewEdition"
                placeholder="예: 1.0"
                maxLength={HOMEBREW_LIMIT.nameLength}
                value={edition}
                onChange={(event) => setEdition(event.target.value)}
              />
            </Field.Root>
            <Field.Root
              label="한 줄 소개"
              htmlFor="homebrewSummary"
              required
              counter={`${summary.length} / ${HOMEBREW_LIMIT.summaryLength}`}
              error={errors.summary}
            >
              <TextInput
                id="homebrewSummary"
                placeholder="어떤 룰인지 한 줄로 적어 주세요"
                maxLength={HOMEBREW_LIMIT.summaryLength}
                value={summary}
                invalid={Boolean(errors.summary)}
                onChange={(event) => {
                  clearErrors([HOMEBREW_FIELD.summary]);
                  setSummary(event.target.value);
                }}
              />
            </Field.Root>
            <VStack gap="200" className="pt-050">
              <VStack gap="050">
                <Text typography="subtitle2" render={<h2 />}>
                  심사 자료
                </Text>
                <Text typography="body4" foreground="hint" render={<p />}>
                  <LineBreaks
                    lines={[
                      "링크나 이미지를 하나 이상 넣어 주세요.",
                      "운영진이 룰 내용을 확인하는 데 씁니다.",
                    ]}
                  />
                </Text>
              </VStack>
              <HomebrewLinkFields links={links} error={errors.links} onChange={changeLinks} />
              <HomebrewImageField
                serverId={serverId}
                images={images}
                error={errors.images}
                onImagesChange={setImages}
                onErrorChange={changeImageError}
              />
            </VStack>
            {materialMissing && (
              <Callout.Root colorPalette="danger">
                <Callout.Description>{HOMEBREW_ERROR.materialRequired}</Callout.Description>
              </Callout.Root>
            )}
          </VStack>

          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>
              <VStack gap="100">
                {failure && (
                  <Callout.Root colorPalette="danger">
                    <Callout.Description>
                      <LineBreaks lines={failureLines} />
                    </Callout.Description>
                  </Callout.Root>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={pending}
                  disabled={!enabled || uploading}
                >
                  신청하기
                </Button>
              </VStack>
            </FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>

          <ConfirmDialog
            open={confirmingLeave}
            onOpenChange={setConfirmingLeave}
            title="작성 중인 내용이 사라집니다."
            titleClassName={LARGE_DIALOG_TITLE_CLASS}
            cancelLabel="계속 쓰기"
            confirmLabel="나가기"
            danger
            onConfirm={() => router.push(leaveHref)}
          />
        </VStack>
      </div>
    </PageShell>
  );
}
