"use client";

import { HStack, Select, Text, VStack } from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

import { describeStatus } from "../../model/describe-forum-tag-status";

const NONE = "none";

interface ForumTagRow {
  key: string;
  label: string;
  value: string;
  savedValue: string;
}

interface MobileForumTagSectionProps {
  title: string;
  optional?: boolean;
  rows: ForumTagRow[];
  tags: { id: string; name: string; emoji: string | null }[];
  onChange: (key: string, tagId: string) => void;
}

// 데스크톱 표 한 줄을 카드 안 한 묶음(이름 + 상태 뱃지, 아래 태그 고르기)으로 쌓는다.
export function MobileForumTagSection({
  title,
  optional = false,
  rows,
  tags,
  onChange,
}: MobileForumTagSectionProps) {
  const items = [
    { label: "연결 안 함", value: NONE },
    ...tags.map((tag) => ({ label: tag.name, value: tag.id })),
  ];
  const linked = rows.filter((row) => row.value).length;
  return (
    <VStack
      render={<section aria-label={title} />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <HStack align="center" gap="100" className="pb-075">
        <Text typography="subtitle1" render={<h2 />}>
          {title}
        </Text>
        <Text typography="body4" foreground="hint" className="ml-auto">
          {linked} / {rows.length} 연결
        </Text>
      </HStack>
      {rows.map((row) => {
        const deleted = Boolean(row.value) && !tags.some((tag) => tag.id === row.value);
        const status = describeStatus({ row, deleted, optional });
        return (
          <VStack
            key={row.key}
            gap="075"
            className="border-t border-(--rc-color-border-subtle) py-125"
          >
            <HStack align="center" gap="100">
              <Text typography="body3" weight="bold" truncate className="min-w-0 flex-1">
                {row.label}
              </Text>
              <Tag tone={status.tone}>{status.label}</Tag>
            </HStack>
            <Select.Root
              items={items}
              value={deleted ? "" : row.value || NONE}
              onValueChange={(next) => onChange(row.key, next === NONE ? "" : next)}
            >
              <Select.Trigger
                aria-label={`${row.label} 태그`}
                placeholder="태그를 다시 고르세요"
                className="w-full"
              />
              <Select.Popup>
                {items.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Root>
          </VStack>
        );
      })}
    </VStack>
  );
}
