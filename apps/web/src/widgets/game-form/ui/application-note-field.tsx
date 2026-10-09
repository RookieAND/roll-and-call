"use client";

import { HStack, Switch, Text, VStack } from "@roll-and-call/ui";

import { LockedModeNotice } from "./locked-mode-notice";

interface ApplicationNoteFieldProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
  locked?: boolean;
}

export function ApplicationNoteField({
  value,
  onChange,
  locked = false,
}: ApplicationNoteFieldProps) {
  return (
    <VStack gap="100">
      <HStack align="start" gap="150">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle2" render={<label htmlFor="applicationNoteEnabled" />}>
            신청글 받기
          </Text>
          <Text
            typography="body4"
            foreground="muted"
            render={<p />}
            id="applicationNoteEnabled-hint"
          >
            켜면 참가자가 신청글을 쓴 뒤 신청합니다.
          </Text>
        </VStack>
        <Switch.Root
          id="applicationNoteEnabled"
          checked={value}
          disabled={locked}
          onCheckedChange={onChange}
          aria-describedby="applicationNoteEnabled-hint"
        >
          <Switch.Control />
        </Switch.Root>
      </HStack>
      {locked && <LockedModeNotice label="신청글 받기" particle="는" />}
    </VStack>
  );
}
