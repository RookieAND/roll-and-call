"use client";

import { Button, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  checkServerSettings,
  saveServerSettings,
  SETTING_FIELDS,
  type SettingChecks,
  type SettingFieldKey,
  type SettingIds,
} from "@/features/edit-server-settings";

import { DiscordLinkPanel, type RowCheck } from "./discord-link-panel";
import { SettingsFrame } from "./settings-frame";

interface DiscordSettingsFormProps {
  serverName: string;
  botConnected: boolean;
  savedIds: SettingIds;
  savedChecks: SettingChecks;
}

export function DiscordSettingsForm({
  serverName,
  botConnected,
  savedIds,
  savedChecks,
}: DiscordSettingsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [, startChecking] = useTransition();
  const [ids, setIds] = useState(savedIds);
  const [checks, setChecks] = useState<Partial<Record<SettingFieldKey, RowCheck>>>(savedChecks);

  const changedKeys = SETTING_FIELDS.map((field) => field.key).filter(
    (key) => ids[key].trim() !== savedIds[key].trim(),
  );
  const changedFailed = changedKeys.some((key) => {
    const check = checks[key];
    return check !== "checking" && check?.status === "fail";
  });
  const canSave = changedKeys.length > 0 && !changedFailed && !saving;

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
      const result = await saveServerSettings({ ids });
      if (!result.ok) {
        if ("checks" in result) setChecks((current) => ({ ...current, ...result.checks }));
        return;
      }
      toast.success("서버 설정을 저장했습니다");
      router.refresh();
    });

  return (
    <SettingsFrame
      title="디스코드 연동"
      active="/settings/discord"
      actions={
        <Button loading={saving} disabled={!canSave} onClick={save}>
          변경 저장
        </Button>
      }
    >
      <VStack gap="150" className="max-w-[880px]">
        <DiscordLinkPanel
          ids={ids}
          checks={checks}
          serverName={serverName}
          locked={!botConnected}
          onChange={change}
          onCheck={check}
        />
      </VStack>
    </SettingsFrame>
  );
}
