import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { ArrowDown } from "lucide-react";

import type { AuditChange } from "@/shared/server";
import { Tag } from "@/shared/ui";

import { changeKind } from "../../model/change-kind";

interface MobileChangeItemProps {
  change: AuditChange;
}

// 칸마다 이전 값(취소선), 아래 화살표, 새 값을 세로로 쌓는다. 목록 칸은 추가가 먼저, 삭제가 뒤다.
export function MobileChangeItem({ change }: MobileChangeItemProps) {
  const isList = !isUndefined(change.added) || !isUndefined(change.removed);
  const kind = changeKind(change);
  return (
    <VStack gap="075" className="border-t border-(--rc-color-border-subtle) py-125">
      <Text typography="body4" weight="bold" foreground="muted">
        {change.field}
      </Text>
      {isList ? (
        <VStack gap="075">
          {(change.added ?? []).map((item) => (
            <HStack key={`added-${item}`} align="start" gap="100">
              <Tag tone="success">추가</Tag>
              <Text typography="body3" className="min-w-0 break-words">
                {item}
              </Text>
            </HStack>
          ))}
          {(change.removed ?? []).map((item) => (
            <HStack key={`removed-${item}`} align="start" gap="100">
              <Tag tone="danger">삭제</Tag>
              <Text
                typography="body3"
                foreground="hint"
                className="min-w-0 break-words line-through"
              >
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      ) : (
        <VStack gap="050">
          {isUndefined(change.before) ? null : (
            <HStack align="start" gap="100">
              <Tag tone={kind === "removed" ? "danger" : "primary"}>
                {kind === "removed" ? "삭제" : "변경"}
              </Tag>
              <Text
                typography="body3"
                foreground="muted"
                className="min-w-0 whitespace-pre-wrap break-words leading-[1.6] line-through"
              >
                {change.before}
              </Text>
            </HStack>
          )}
          {kind === "changed" ? (
            <ArrowDown size={16} aria-label="에서" className="text-hint" />
          ) : null}
          {kind === "removed" || isUndefined(change.after) ? null : (
            <HStack align="start" gap="100">
              {kind === "added" ? <Tag tone="success">추가</Tag> : null}
              <Text
                typography="body3"
                weight="bold"
                className="min-w-0 whitespace-pre-wrap break-words leading-[1.6]"
              >
                {change.after}
              </Text>
            </HStack>
          )}
        </VStack>
      )}
    </VStack>
  );
}
