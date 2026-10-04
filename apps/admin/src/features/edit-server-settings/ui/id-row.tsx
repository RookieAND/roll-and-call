"use client";

import { Button, Grid, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import type { SettingCheck } from "../model/setting-check";
import { CheckStatus } from "./check-status";

interface IdRowProps {
  id: string;
  label: string;
  value: string;
  check: SettingCheck | "checking" | undefined;
  serverName: string;
  emptyHint?: string;
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
  onChange,
  onCheck,
}: IdRowProps) {
  const checking = check === "checking";
  const showEmptyHint = isUndefined(check) && !isUndefined(emptyHint) && !value.trim();
  const failed = check !== "checking" && check?.status === "fail";
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
            inputMode="numeric"
            onChange={(event) => onChange(event.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={checking || !value.trim()}
            onClick={onCheck}
          >
            {buttonLabel}
          </Button>
        </HStack>
        {check ? <CheckStatus check={check} serverName={serverName} /> : null}
        {showEmptyHint ? (
          <Text typography="body4" foreground="hint">
            {emptyHint}
          </Text>
        ) : null}
      </VStack>
    </Grid>
  );
}
