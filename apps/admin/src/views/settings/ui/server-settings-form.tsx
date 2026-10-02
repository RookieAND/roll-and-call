"use client";

import { Button, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  checkServerSettings,
  saveServerSettings,
  type SettingChecks,
  type SettingFieldKey,
  type SettingIds,
} from "@/features/edit-server-settings";
import type { RulebookOption } from "@/shared/server";

import { DiscordLinkPanel, type RowCheck } from "./discord-link-panel";
import { FreeRulebookPanel } from "./free-rulebook-panel";
import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerSettingsFormProps {
  server: { name: string; slug: string; icon: string | null };
  savedIds: SettingIds;
  savedChecks: SettingChecks;
  savedInviteUrl: string;
  joinUrl: string;
  rulebooks: RulebookOption[];
}

export function ServerSettingsForm({
  server,
  savedIds,
  savedChecks,
  savedInviteUrl,
  joinUrl,
  rulebooks,
}: ServerSettingsFormProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [, startChecking] = useTransition();
  const [ids, setIds] = useState(savedIds);
  const [checks, setChecks] = useState<Partial<Record<SettingFieldKey, RowCheck>>>(savedChecks);
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);
  const [freeIds, setFreeIds] = useState(() =>
    rulebooks.filter((rulebook) => rulebook.free).map((rulebook) => rulebook.id),
  );

  const failed = Object.values(checks).some(
    (check) => check !== "checking" && check?.status === "fail",
  );

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
      const result = await saveServerSettings({ ids, inviteUrl, freeRulebookIds: freeIds });
      if (!result.ok) {
        setChecks((current) => ({ ...current, ...result.checks }));
        return;
      }
      router.refresh();
    });

  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/server"
      actions={
        <Button loading={saving} disabled={failed || saving} onClick={save}>
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
          onChange={change}
          onCheck={check}
        />
        <JoinLinkPanel joinUrl={joinUrl} inviteUrl={inviteUrl} onInviteUrlChange={setInviteUrl} />
        <FreeRulebookPanel rulebooks={rulebooks} freeIds={freeIds} onChange={setFreeIds} />
      </VStack>
    </SettingsFrame>
  );
}
