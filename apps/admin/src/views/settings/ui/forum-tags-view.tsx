"use client";

import { Button, HStack, Select, Text, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  saveForumTagsAction,
  type ForumTagForm,
  type ForumTagOptions,
} from "@/features/edit-forum-tags";
import { Panel } from "@/shared/ui";

import { SettingsFrame } from "./settings-frame";

const NONE = "none";

interface ForumTagsViewProps {
  options: ForumTagOptions;
  categories: { id: string; name: string }[];
  saved: ForumTagForm;
}

function TagSelect({
  label,
  value,
  tags,
  onChange,
}: {
  label: string;
  value: string;
  tags: { id: string; name: string }[];
  onChange: (value: string) => void;
}) {
  const items = [
    { label: "연결 안 함", value: NONE },
    ...tags.map((tag) => ({ label: tag.name, value: tag.id })),
  ];
  return (
    <HStack align="center" justify="between" gap="150">
      <Text typography="body3">{label}</Text>
      <Select.Root
        items={items}
        value={value || NONE}
        onValueChange={(next) => onChange(next === NONE ? "" : next)}
      >
        <Select.Trigger aria-label={label} className="w-[220px]" />
        <Select.Popup>
          {items.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Popup>
      </Select.Root>
    </HStack>
  );
}

export function ForumTagsView({ options, categories, saved }: ForumTagsViewProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [form, setForm] = useState(saved);
  const changed = JSON.stringify(form) !== JSON.stringify(saved);

  const save = () =>
    startSaving(async () => {
      const result = await saveForumTagsAction(form);
      if (result.ok) toast.success("포럼 태그를 저장했습니다");
      router.refresh();
    });

  return (
    <SettingsFrame
      title="포럼 태그"
      active="/settings/tags"
      actions={
        <Button loading={saving} disabled={!changed || options.status !== "forum"} onClick={save}>
          변경 저장
        </Button>
      }
    >
      {options.status === "forum" ? (
        <VStack gap="150" className="max-w-[880px]">
          <Panel title="모집 상태" bodyClassName="p-175">
            <VStack gap="125">
              <TagSelect
                label="모집중"
                value={form.open}
                tags={options.tags}
                onChange={(open) => setForm({ ...form, open })}
              />
              <TagSelect
                label="마감"
                value={form.closed}
                tags={options.tags}
                onChange={(closed) => setForm({ ...form, closed })}
              />
              <TagSelect
                label="취소됨"
                value={form.cancelled}
                tags={options.tags}
                onChange={(cancelled) => setForm({ ...form, cancelled })}
              />
            </VStack>
          </Panel>
          <Panel title="룰 분류" bodyClassName="p-175">
            <VStack gap="125">
              {categories.map((category) => (
                <TagSelect
                  key={category.id}
                  label={category.name}
                  value={form.categories[category.id] ?? ""}
                  tags={options.tags}
                  onChange={(tagId) =>
                    setForm({ ...form, categories: { ...form.categories, [category.id]: tagId } })
                  }
                />
              ))}
            </VStack>
          </Panel>
        </VStack>
      ) : (
        <Text typography="body3" foreground="muted">
          {options.status === "notForum"
            ? "모집 채널이 포럼일 때만 태그를 연결할 수 있습니다."
            : "디스코드에서 포럼 태그를 읽지 못했습니다."}
        </Text>
      )}
    </SettingsFrame>
  );
}
