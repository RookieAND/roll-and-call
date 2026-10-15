"use client";

import { Button, HStack, Skeleton, Text, TextInput, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import { Tag } from "@/shared/ui";

import { checkBadge } from "../model/check-badge";
import type { SettingCheck } from "../model/setting-check";
import { BOT_DISCONNECTED_MESSAGE } from "../model/setting-check-message";
import { CheckStatus } from "./check-status";

interface MobileIdCardProps {
  id: string;
  label: string;
  purpose?: string;
  value: string;
  check: SettingCheck | "checking" | undefined;
  serverName: string;
  emptyHint?: string;
  locked?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  onCheck?: () => void;
}

// 채널 ID 하나를 카드 한 장으로 보인다. 확인 결과는 오른쪽 위 뱃지와 아래 문장으로 알린다.
export function MobileIdCard({
  id,
  label,
  purpose,
  value,
  check,
  serverName,
  emptyHint,
  locked = false,
  loading = false,
  onChange,
  onCheck,
}: MobileIdCardProps) {
  const checking = check === "checking";
  const disabled = locked || loading;
  const showEmptyHint = !disabled && isUndefined(check) && !isUndefined(emptyHint) && !value.trim();
  const failed = !disabled && check !== "checking" && check?.status === "fail";
  const badge = disabled ? undefined : checkBadge(check);
  const buttonLabel = checking ? "확인 중" : "확인";
  return (
    <VStack
      gap="100"
      render={<section aria-label={label} />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <HStack align="center" gap="100">
        <Text typography="subtitle2" render={<label htmlFor={id} />} className="flex-1">
          {label}
        </Text>
        {badge ? <Tag tone={badge.tone}>{badge.label}</Tag> : null}
      </HStack>
      {purpose ? (
        <Text typography="body4" foreground="hint">
          {purpose}
        </Text>
      ) : null}
      <HStack gap="075">
        <TextInput
          id={id}
          value={value}
          invalid={failed}
          disabled={disabled}
          inputMode="numeric"
          enterKeyHint="done"
          onChange={(event) => onChange?.(event.target.value)}
          className="min-w-0 flex-1"
        />
        <Button
          variant="outline"
          colorPalette="gray"
          disabled={disabled || checking || !value.trim()}
          onClick={onCheck}
          className="min-h-11"
        >
          {buttonLabel}
        </Button>
      </HStack>
      {loading ? <Skeleton width={200} height={14} /> : null}
      {locked ? (
        <Text typography="body4" foreground="hint">
          {BOT_DISCONNECTED_MESSAGE}
        </Text>
      ) : null}
      {!disabled && check ? <CheckStatus check={check} serverName={serverName} /> : null}
      {showEmptyHint ? (
        <Text typography="body4" foreground="hint">
          {emptyHint}
        </Text>
      ) : null}
    </VStack>
  );
}
