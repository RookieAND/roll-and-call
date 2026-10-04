"use client";

import { Button, Field, HStack, TextInput, VStack, toast } from "@roll-and-call/ui";

import { Panel } from "@/shared/ui";

interface JoinLinkPanelProps {
  joinUrl: string;
  inviteUrl?: string;
  inviteError?: string;
  disabled?: boolean;
  onInviteUrlChange?: (value: string) => void;
}

export function JoinLinkPanel({
  joinUrl,
  inviteUrl = "",
  inviteError,
  disabled = false,
  onInviteUrlChange,
}: JoinLinkPanelProps) {
  const copy = async () => {
    await navigator.clipboard.writeText(joinUrl);
    toast.success("가입 링크를 복사했습니다");
  };
  return (
    <Panel title="가입 링크" bodyClassName="p-175">
      <VStack gap="175">
        <HStack align="end" gap="100">
          <Field.Root label="서버 가입 링크" htmlFor="server-join-url" className="flex-1">
            <TextInput id="server-join-url" readOnly disabled={disabled} value={joinUrl} />
          </Field.Root>
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={disabled}
            onClick={() => void copy()}
          >
            복사
          </Button>
        </HStack>
        <Field.Root
          label="디스코드 서버 초대 링크"
          htmlFor="server-invite-url"
          description="비워 두면 서버 멤버가 아닌 사람에게 「서버 운영진에게 초대를 요청해 주세요」라고 표시됩니다."
          error={inviteError}
        >
          <TextInput
            id="server-invite-url"
            placeholder="https://discord.gg/…"
            value={inviteUrl}
            invalid={Boolean(inviteError)}
            disabled={disabled}
            onChange={(event) => onInviteUrlChange?.(event.target.value)}
          />
        </Field.Root>
      </VStack>
    </Panel>
  );
}
