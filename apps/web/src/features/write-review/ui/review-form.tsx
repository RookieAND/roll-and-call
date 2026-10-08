"use client";

import { RichTextEditor } from "@roll-and-call/tiptap";
import { Button, Callout, Field, FloatingBar, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SessionHeading } from "@/entities/game";
import { REVIEW_BODY_MAX_LENGTH, REVIEW_BODY_MIN_LENGTH } from "@/entities/review";
import { richTextLength, useServerPath } from "@/shared/lib";
import { AppBar, ConfirmDialog, toast, useAction } from "@/shared/ui";

import { discardReviewPhotos } from "../api/discard-review-photos";
import { submitReview } from "../api/submit-review";
import { MY_REVIEWS_HREF, type ReviewBlock } from "../model/review-block";
import { reviewFormNotice } from "../model/review-form-notice";
import { useReviewDraft } from "../model/use-review-draft";
import { useReviewPhotos } from "../model/use-review-photos";
import { ReviewBlockedDialog } from "./review-blocked-dialog";
import { ReviewPhotosField } from "./review-photos-field";
import { ReviewSpoilerField } from "./review-spoiler-field";

interface ReviewFormProps {
  serverId: string;
  gameId: string;
  heading: { title: string; rule: string; subline: string };
  review: {
    id: string;
    body: string;
    spoiler: boolean;
    photoUrls: string[];
    hidden: boolean;
  } | null;
  editUntil: Date;
  initialBlock: ReviewBlock | null;
}

export function ReviewForm({
  serverId,
  gameId,
  heading,
  review,
  editUntil,
  initialBlock,
}: ReviewFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const editing = !isNull(review);
  const initialPhotoUrls = review?.photoUrls ?? [];
  const [body, setBody] = useState(review?.body ?? "");
  const [spoiler, setSpoiler] = useState(review?.spoiler ?? false);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [block, setBlock] = useState(initialBlock);
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  // 에디터는 마운트 뒤 값을 스스로 쥐므로 불러오기·새로 쓰기 때는 키를 바꿔 다시 세운다.
  const [editorKey, setEditorKey] = useState(0);
  const photos = useReviewPhotos({ serverId, initialUrls: initialPhotoUrls });
  const draft = useReviewDraft({
    gameId,
    enabled: !editing,
    onRestore: (saved) => {
      setBody(saved.body);
      setSpoiler(saved.spoiler);
      setEditorKey((key) => key + 1);
    },
  });
  const { pending, run } = useAction();

  const gameHref = toServerPath(`/games/${gameId}`);
  const leaveHref = editing ? toServerPath(MY_REVIEWS_HREF) : gameHref;
  const notice = reviewFormNotice({ review, editUntil });
  const newPhotoUrls = photos.urls.filter((url) => !initialPhotoUrls.includes(url));
  const dirty =
    body !== (review?.body ?? "") ||
    spoiler !== (review?.spoiler ?? false) ||
    photos.urls.join() !== initialPhotoUrls.join();
  const submitLabel = editing ? "고친 내용 저장" : "후기 남기기";

  function changeBody(next: string) {
    setBody(next);
    if (bodyError && richTextLength(next) >= REVIEW_BODY_MIN_LENGTH) setBodyError(null);
    draft.save({ body: next, spoiler });
  }

  function changeSpoiler(next: boolean) {
    setSpoiler(next);
    draft.save({ body, spoiler: next });
  }

  function startOver() {
    draft.clear();
    setBody("");
    setSpoiler(false);
    setEditorKey((key) => key + 1);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitFailed(false);
    if (richTextLength(body) < REVIEW_BODY_MIN_LENGTH) {
      setBodyError("20자 이상 적어 주세요");
      return;
    }
    run(
      () =>
        submitReview({
          gameId,
          reviewId: review?.id ?? null,
          body,
          spoiler,
          photoUrls: photos.urls,
        }),
      {
        onSuccess: () => {
          draft.clear();
          toast.success(editing ? "후기를 고쳤습니다" : "후기를 남겼습니다");
        },
        onError: (result) => {
          if (result.block) setBlock(result.block);
          else if (result.field) setBodyError(result.error);
          else setSubmitFailed(true);
        },
      },
    );
  }

  function requestLeave() {
    if (dirty) setConfirmingLeave(true);
    else router.push(leaveHref);
  }

  function leave() {
    void discardReviewPhotos(newPhotoUrls);
    router.push(leaveHref);
  }

  return (
    <VStack render={<form onSubmit={submit} />} className="break-keep">
      <AppBar
        title={editing ? "후기 고치기" : "후기 쓰기"}
        backIcon="close"
        onBack={requestLeave}
      />
      <VStack gap="250" className="p-200">
        <SessionHeading {...heading} />

        {draft.restored && (
          <Callout.Root colorPalette="primary" size="sm">
            <Callout.Icon />
            <Callout.Description>쓰던 후기를 불러왔습니다</Callout.Description>
            <Callout.Action>
              <Button type="button" variant="ghost" size="sm" onClick={startOver}>
                새로 쓰기
              </Button>
            </Callout.Action>
          </Callout.Root>
        )}

        <Callout.Root colorPalette={notice.palette}>
          <Callout.Icon />
          <Callout.Title>{notice.title}</Callout.Title>
          <Callout.Description>{notice.description}</Callout.Description>
        </Callout.Root>

        <Field.Root
          label="후기"
          htmlFor="reviewBody"
          counter={`${richTextLength(body).toLocaleString()} / ${REVIEW_BODY_MAX_LENGTH.toLocaleString()}`}
          error={bodyError ?? undefined}
        >
          <RichTextEditor
            key={editorKey}
            id="reviewBody"
            value={body}
            onChange={changeBody}
            placeholder="20자 이상 적어 주세요"
            limit={REVIEW_BODY_MAX_LENGTH}
            invalid={!isNull(bodyError)}
          />
        </Field.Root>

        <ReviewPhotosField photos={photos} />

        <ReviewSpoilerField value={spoiler} onChange={changeSpoiler} />

        {submitFailed && (
          <Callout.Root colorPalette="danger">
            <Callout.Icon />
            <Callout.Title>등록하지 못했습니다</Callout.Title>
            <Callout.Description>쓴 내용은 저장되어 있습니다.</Callout.Description>
          </Callout.Root>
        )}
      </VStack>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={pending}
            disabled={photos.uploading}
          >
            {submitLabel}
          </Button>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

      <ConfirmDialog
        open={confirmingLeave}
        onOpenChange={setConfirmingLeave}
        title="작성을 그만둘까요?"
        description={
          editing ? "고친 내용과 새로 올린 사진은 지워집니다." : "글은 저장되고 사진은 지워집니다."
        }
        cancelLabel="계속 쓰기"
        confirmLabel="나가기"
        onConfirm={leave}
      />
      <ReviewBlockedDialog block={block} fallbackHref={gameHref} />
    </VStack>
  );
}
