"use client";

import { Button, Callout, Text, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ForumTagForm, ForumTagOptions } from "@/features/edit-forum-tags";

import { DiscordFrame } from "./discord-frame";
import { ForumTagSection } from "./forum-tag-section";

const PLAY_TYPE_ROWS = [
  { key: "voice", label: "보이스" },
  { key: "text", label: "텍스트" },
] as const;

const KIND_ROWS = [
  { key: "briefing", label: "설명회" },
  { key: "session", label: "세션" },
] as const;

const STATUS_ROWS = [
  { key: "open", label: "모집중" },
  { key: "closed", label: "마감" },
  { key: "cancelled", label: "취소됨" },
] as const;

interface ForumTagsViewProps {
  // 서버 전용 모듈이 클라이언트 번들에 들어가지 않게 페이지가 서버 액션을 넘긴다.
  onSave: (form: ForumTagForm) => Promise<{ ok: boolean }>;
  options: ForumTagOptions;
  categories: { id: string; name: string }[];
  saved: ForumTagForm;
}

export function ForumTagsView({ options, categories, saved, onSave }: ForumTagsViewProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [form, setForm] = useState(saved);
  const linkedRows = [
    ...STATUS_ROWS.map(({ key, label }) => ({ label, id: form[key] })),
    ...categories.map(({ id, name }) => ({ label: name, id: form.categories[id] })),
    ...PLAY_TYPE_ROWS.map(({ key, label }) => ({ label, id: form.playTypes[key] })),
    ...KIND_ROWS.map(({ key, label }) => ({ label, id: form[key] })),
  ];
  const deletedLabels =
    options.status === "forum"
      ? linkedRows
          .filter((row) => row.id && !options.tags.some((tag) => tag.id === row.id))
          .map((row) => row.label)
      : [];
  const hasDeleted = deletedLabels.length > 0;
  const changed = JSON.stringify(form) !== JSON.stringify(saved);

  const save = () =>
    startSaving(async () => {
      const result = await onSave(form);
      if (result.ok) toast.success("포럼 태그를 저장했습니다");
      router.refresh();
    });

  return (
    <DiscordFrame
      title="포럼 태그"
      active="/discord/tags"
      actions={
        <Button loading={saving} disabled={!changed || options.status !== "forum"} onClick={save}>
          변경 저장
        </Button>
      }
    >
      {options.status === "forum" ? (
        <VStack gap="150" className="max-w-[880px]">
          <Text typography="body3" foreground="muted">
            모집 상태와 룰 분류마다 디스코드 포럼 태그를 하나씩 연결합니다. 연결하지 않으면 해당
            태그는 붙지 않습니다.
          </Text>
          <ForumTagSection
            title="모집 상태"
            columnLabel="모집 단계"
            tags={options.tags}
            rows={STATUS_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form[key],
              savedValue: saved[key],
            }))}
            onChange={(key, tagId) => setForm({ ...form, [key as "briefing" | "session"]: tagId })}
          />
          <ForumTagSection
            title="룰 분류"
            columnLabel="룰 분류"
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
          <ForumTagSection
            title="플레이 유형"
            columnLabel="플레이 유형"
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
          <ForumTagSection
            title="구분"
            columnLabel="구분"
            optional
            tags={options.tags}
            rows={KIND_ROWS.map(({ key, label }) => ({
              key,
              label,
              value: form[key],
              savedValue: saved[key],
            }))}
            onChange={(key, tagId) => setForm({ ...form, [key as "briefing" | "session"]: tagId })}
          />
          {hasDeleted ? (
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
        <Text typography="body3" foreground="muted">
          {options.status === "notForum"
            ? "모집 채널이 포럼일 때만 태그를 연결할 수 있습니다."
            : "디스코드에서 포럼 태그를 읽지 못했습니다."}
        </Text>
      )}
    </DiscordFrame>
  );
}
