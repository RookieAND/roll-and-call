"use client";

import { Button, Field, HStack, TextInput, VStack } from "@roll-and-call/ui";

import { Panel } from "@/shared/ui";

interface JoinLinkPanelProps {
  joinUrl: string;
  inviteUrl: string;
  onInviteUrlChange: (value: string) => void;
}

export function JoinLinkPanel({ joinUrl, inviteUrl, onInviteUrlChange }: JoinLinkPanelProps) {
  const copy = () => navigator.clipboard.writeText(joinUrl);
  return (
    <Panel title="가입 링크" bodyClassName="p-175">
      <VStack gap="175">
        <HStack align="end" gap="100">
          <Field.Root label="서버 가입 링크" htmlFor="server-join-url" className="flex-1">
            <TextInput id="server-join-url" readOnly value={joinUrl} />
          </Field.Root>
          <Button variant="outline" colorPalette="gray" onClick={copy}>
            복사
          </Button>
        </HStack>
        <Field.Root
          label="디스코드 서버 초대 링크"
          htmlFor="server-invite-url"
          description="비워 두면 서버 멤버가 아닌 사람에게 ‘서버 운영진에게 초대를 요청해 주세요’라고 표시됩니다."
        >
          <TextInput
            id="server-invite-url"
            value={inviteUrl}
            onChange={(event) => onInviteUrlChange(event.target.value)}
          />
        </Field.Root>
      </VStack>
    </Panel>
  );
}
