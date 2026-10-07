"use client";

import { Button, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { normalizeInviteUrl, saveServerSettings } from "@/features/edit-server-settings";

import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerSettingsFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedInviteUrl: string;
  joinUrl: string;
}

export function ServerSettingsForm({ server, savedInviteUrl, joinUrl }: ServerSettingsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);

  const inviteChanged = inviteUrl.trim() !== savedInviteUrl.trim();
  const invite = normalizeInviteUrl(inviteUrl);
  const inviteError = invite.ok ? undefined : invite.error;
  const canSave = inviteChanged && invite.ok && !saving;

  const save = () =>
    startSaving(async () => {
      const result = await saveServerSettings({ inviteUrl });
      if (!result.ok) return;
      toast.success("서버 설정을 저장했습니다");
      router.refresh();
    });

  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/server"
      actions={
        <Button loading={saving} disabled={!canSave} onClick={save}>
          변경 저장
        </Button>
      }
    >
      <VStack gap="150" className="max-w-[880px]">
        <ServerBasicPanel name={server.name} slug={server.slug} icon={server.icon} />
        <JoinLinkPanel
          joinUrl={joinUrl}
          inviteUrl={inviteUrl}
          inviteError={inviteError}
          onInviteUrlChange={setInviteUrl}
        />
      </VStack>
    </SettingsFrame>
  );
}
