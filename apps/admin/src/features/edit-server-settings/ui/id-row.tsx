"use client";

import { Button, Grid, HStack, Skeleton, Text, TextInput, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import type { SettingCheck } from "../model/setting-check";
import { BOT_DISCONNECTED_MESSAGE } from "../model/setting-check-message";
import { CheckStatus } from "./check-status";

interface IdRowProps {
  id: string;
  label: string;
  value: string;
  check: SettingCheck | "checking" | undefined;
  serverName: string;
  emptyHint?: string;
  // 봇 연결이 끊기면 검증할 수 없어 입력을 잠근다.
  locked?: boolean;
  // 불러오는 중에는 확인된 채널 이름 자리만 스켈레톤이다.
  loading?: boolean;
  onChange: (value: string) => void;
  onCheck: () => void;
}

export function IdRow({
  id,
  label,
  value,
  check,
  serverName,
  emptyHint,
  locked = false,
  loading = false,
  onChange,
  onCheck,
}: IdRowProps) {
  const checking = check === "checking";
  const disabled = locked || loading;
  const showEmptyHint = !disabled && isUndefined(check) && !isUndefined(emptyHint) && !value.trim();
  const failed = !disabled && check !== "checking" && check?.status === "fail";
  const buttonLabel = checking ? "확인 중" : "확인";
  return (
    <Grid className="grid-cols-[132px_minmax(0,1fr)] gap-x-200 border-t border-(--rc-color-border-subtle) py-150 first:border-t-0">
      <Text typography="subtitle2" render={<label htmlFor={id} />} className="leading-[40px]">
        {label}
      </Text>
      <VStack gap="075">
        <HStack gap="100">
          <TextInput
            id={id}
            value={value}
            invalid={failed}
            disabled={disabled}
            inputMode="numeric"
            onChange={(event) => onChange(event.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={disabled || checking || !value.trim()}
            onClick={onCheck}
          >
            {buttonLabel}
          </Button>
        </HStack>
        {loading ? <Skeleton width={220} height={14} /> : null}
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
    </Grid>
  );
}
