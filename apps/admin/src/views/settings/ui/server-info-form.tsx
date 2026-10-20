"use client";

import { Button, VStack } from "@roll-and-call/ui";

import { useServerInfoForm } from "../model/use-server-info-form";
import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerInfoFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedInviteUrl: string;
  joinUrl: string;
}

export function ServerInfoForm({ server, savedInviteUrl, joinUrl }: ServerInfoFormProps) {
  const form = useServerInfoForm({ savedInviteUrl });
  return (
    <SettingsFrame
      title="서버 정보"
      active="/settings/server"
      actions={
        <Button loading={form.saving} disabled={!form.canSave} onClick={form.save}>
          변경 저장
        </Button>
      }
    >
      <VStack gap="150" className="max-w-[880px]">
        <ServerBasicPanel name={server.name} slug={server.slug} icon={server.icon} />
        <JoinLinkPanel
          joinUrl={joinUrl}
          inviteUrl={form.inviteUrl}
          inviteError={form.inviteError}
          onInviteUrlChange={form.setInviteUrl}
        />
      </VStack>
    </SettingsFrame>
  );
}
