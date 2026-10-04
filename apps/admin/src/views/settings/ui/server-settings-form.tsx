"use client";

import { Button, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  checkServerSettings,
  normalizeInviteUrl,
  saveServerSettings,
  SETTING_FIELDS,
  type SettingChecks,
  type SettingFieldKey,
  type SettingIds,
} from "@/features/edit-server-settings";

import { DiscordLinkPanel, type RowCheck } from "./discord-link-panel";
import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerSettingsFormProps {
  server: { name: string; slug: string; icon: string | null };
  botConnected: boolean;
  savedIds: SettingIds;
  savedChecks: SettingChecks;
  savedInviteUrl: string;
  joinUrl: string;
}

export function ServerSettingsForm({
  server,
  botConnected,
  savedIds,
  savedChecks,
  savedInviteUrl,
  joinUrl,
}: ServerSettingsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [, startChecking] = useTransition();
  const [ids, setIds] = useState(savedIds);
  const [checks, setChecks] = useState<Partial<Record<SettingFieldKey, RowCheck>>>(savedChecks);
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);

  const changedKeys = SETTING_FIELDS.map((field) => field.key).filter(
    (key) => ids[key].trim() !== savedIds[key].trim(),
  );
  const inviteChanged = inviteUrl.trim() !== savedInviteUrl.trim();
  const invite = normalizeInviteUrl(inviteUrl);
  const inviteError = invite.ok ? undefined : invite.error;
  const changedFailed = changedKeys.some((key) => {
    const check = checks[key];
    return check !== "checking" && check?.status === "fail";
  });
  const canSave =
    (changedKeys.length > 0 || inviteChanged) && !changedFailed && invite.ok && !saving;

  const change = ({ key, value }: { key: SettingFieldKey; value: string }) => {
    setIds((current) => ({ ...current, [key]: value }));
    setChecks((current) => ({ ...current, [key]: undefined }));
  };

  const check = (key: SettingFieldKey) => {
    setChecks((current) => ({ ...current, [key]: "checking" }));
    startChecking(async () => {
      const result = await checkServerSettings({ [key]: ids[key] });
      setChecks((current) => ({ ...current, [key]: result[key] }));
    });
  };

  const save = () =>
    startSaving(async () => {
      const result = await saveServerSettings({ ids, inviteUrl });
      if (!result.ok) {
        if ("checks" in result) setChecks((current) => ({ ...current, ...result.checks }));
        return;
      }
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
        <DiscordLinkPanel
          ids={ids}
          checks={checks}
          serverName={server.name}
          locked={!botConnected}
          onChange={change}
          onCheck={check}
        />
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
