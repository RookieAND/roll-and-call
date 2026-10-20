"use client";

import { Button, Callout, Text, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ForumTagForm, ForumTagOptions } from "@/features/edit-forum-tags";
import { MobileActionBar } from "@/shared/ui";

import { ADULT_ROWS, KIND_ROWS, PLAY_TYPE_ROWS, STATUS_ROWS } from "../model/forum-tag-rows";
import { MobileDiscordFrame } from "./mobile/mobile-discord-frame";
import { MobileForumTagSection } from "./mobile/mobile-forum-tag-section";

interface ForumTagsMobileViewProps {
  onSave: (form: ForumTagForm) => Promise<{ ok: boolean }>;
  options: ForumTagOptions;
  categories: { id: string; name: string }[];
  saved: ForumTagForm;
}

export function ForumTagsMobileView({
  options,
  categories,
  saved,
  onSave,
}: ForumTagsMobileViewProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [form, setForm] = useState(saved);
  const forum = options.status === "forum";
  const linkedRows = [
    ...STATUS_ROWS.map(({ key, label }) => ({ label, id: form[key] })),
    ...categories.map(({ id, name }) => ({ label: name, id: form.categories[id] })),
    ...PLAY_TYPE_ROWS.map(({ key, label }) => ({ label, id: form.playTypes[key] })),
    ...KIND_ROWS.map(({ key, label }) => ({ label, id: form[key] })),
    ...ADULT_ROWS.map(({ key, label }) => ({ label, id: form[key] })),
  ];
  const deletedLabels = forum
    ? linkedRows
        .filter((row) => row.id && !options.tags.some((tag) => tag.id === row.id))
        .map((row) => row.label)
    : [];
  const changed = JSON.stringify(form) !== JSON.stringify(saved);
  const unavailableNote =
    options.status === "notForum"
      ? "모집 채널이 포럼일 때만 태그를 연결할 수 있습니다."
      : "디스코드에서 포럼 태그를 읽지 못했습니다.";

  const save = () =>
    startSaving(async () => {
      const result = await onSave(form);
      if (result.ok) toast.success("포럼 태그를 저장했습니다");
      router.refresh();
    });

  return (
    <MobileDiscordFrame active="/discord/tags">
      {forum ? (
        <VStack gap="150" className="px-150 pt-150 pb-200">
          <Text typography="body3" foreground="muted">
            모집 상태와 룰 분류마다 디스코드 포럼 태그를 하나씩 연결합니다. 연결하지 않으면 해당
            태그는 붙지 않습니다.
          </Text>
          <MobileForumTagSection
            title="모집 상태"
            tags={options.tags}
            rows={STATUS_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form[key],
              savedValue: saved[key],
            }))}
            onChange={(key, tagId) => setForm({ ...form, [key as "open"]: tagId })}
          />
          <MobileForumTagSection
            title="룰 분류"
            tags={options.tags}
            rows={categories.map((category) => ({
              key: category.id,
              label: category.name,
              value: form.categories[category.id] ?? "",
              savedValue: saved.categories[category.id] ?? "",
            }))}
            onChange={(id, tagId) =>
              setForm({ ...form, categories: { ...form.categories, [id]: tagId } })
            }
          />
          <MobileForumTagSection
            title="플레이 유형"
            optional
            tags={options.tags}
            rows={PLAY_TYPE_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form.playTypes[key],
              savedValue: saved.playTypes[key],
            }))}
            onChange={(key, tagId) =>
              setForm({ ...form, playTypes: { ...form.playTypes, [key]: tagId } })
            }
          />
          <MobileForumTagSection
            title="구분"
            optional
            tags={options.tags}
            rows={KIND_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form[key],
              savedValue: saved[key],
            }))}
            onChange={(key, tagId) => setForm({ ...form, [key as "briefing"]: tagId })}
          />
          <MobileForumTagSection
            title="성인 구분"
            optional
            tags={options.tags}
            rows={ADULT_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form[key],
              savedValue: saved[key],
            }))}
            onChange={(key, tagId) => setForm({ ...form, [key as "adult"]: tagId })}
          />
          <Text typography="body4" foreground="hint">
            서버 설정에서 성인 전용 구인 표기를 켠 서버에서만 쓰입니다. 성인 전용으로 올린 구인에 이
            태그가 붙습니다.
          </Text>
          {deletedLabels.length > 0 ? (
            <Callout.Root colorPalette="warning">
              <Callout.Icon />
              <Callout.Title>연결한 디스코드 태그가 삭제되었습니다</Callout.Title>
              <Callout.Description>
                {deletedLabels.join(", ")}에 연결해 둔 태그를 다시 고르거나 연결 안 함으로 바꾸어
                주세요.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <Text typography="body4" foreground="hint">
            플레이 유형과 구분은 연결하지 않아도 구인이 정상적으로 게시됩니다.
          </Text>
        </VStack>
      ) : (
        <Text typography="body3" foreground="muted" className="px-200 py-200">
          {unavailableNote}
        </Text>
      )}
      <MobileActionBar>
        <Button
          size="lg"
          loading={saving}
          disabled={!changed || !forum}
          onClick={save}
          className="text-body2"
        >
          변경 저장
        </Button>
      </MobileActionBar>
    </MobileDiscordFrame>
  );
}
