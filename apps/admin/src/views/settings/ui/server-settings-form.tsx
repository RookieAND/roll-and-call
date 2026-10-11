"use client";

import type { RankingMode } from "@roll-and-call/database/servers/model";
import { Button, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  normalizeInviteUrl,
  saveRankingMode,
  saveServerSettings,
} from "@/features/edit-server-settings";

import { JoinLinkPanel } from "./join-link-panel";
import { RankingModePanel } from "./ranking-mode-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerSettingsFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedInviteUrl: string;
  savedRankingMode: RankingMode;
  joinUrl: string;
}

export function ServerSettingsForm({
  server,
  savedInviteUrl,
  savedRankingMode,
  joinUrl,
}: ServerSettingsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);
  const [rankingMode, setRankingMode] = useState(savedRankingMode);

  const inviteChanged = inviteUrl.trim() !== savedInviteUrl.trim();
  const invite = normalizeInviteUrl(inviteUrl);
  const inviteError = invite.ok ? undefined : invite.error;
  const rankingChanged = rankingMode !== savedRankingMode;
  const canSave = (inviteChanged || rankingChanged) && invite.ok && !saving;

  const save = () =>
    startSaving(async () => {
      if (inviteChanged) {
        const result = await saveServerSettings({ inviteUrl });
        if (!result.ok) return;
      }
      if (rankingChanged) await saveRankingMode({ rankingMode });
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
        <RankingModePanel
          value={rankingMode}
          savedValue={savedRankingMode}
          disabled={saving}
          onChange={setRankingMode}
        />
      </VStack>
    </SettingsFrame>
  );
}
