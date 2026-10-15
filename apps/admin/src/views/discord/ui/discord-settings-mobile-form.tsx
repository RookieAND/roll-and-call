"use client";

import { Button, Callout, VStack } from "@roll-and-call/ui";

import {
  MobileIdCard,
  SETTING_FIELDS,
  type SettingChecks,
  type SettingIds,
} from "@/features/edit-server-settings";
import { MobileActionBar } from "@/shared/ui";

import { useDiscordSettingsForm } from "../model/use-discord-settings-form";
import { MobileDiscordFrame } from "./mobile/mobile-discord-frame";

interface DiscordSettingsMobileFormProps {
  serverName: string;
  botConnected: boolean;
  savedIds: SettingIds;
  savedChecks: SettingChecks;
}

export function DiscordSettingsMobileForm({
  serverName,
  botConnected,
  savedIds,
  savedChecks,
}: DiscordSettingsMobileFormProps) {
  const form = useDiscordSettingsForm({ savedIds, savedChecks });
  return (
    <MobileDiscordFrame active="/discord/link">
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <Callout.Root>
          <Callout.Icon />
          <Callout.Title>채널을 바꿔도 기존 구인글은 그대로 남습니다</Callout.Title>
          <Callout.Description>
            새 구인부터 바뀐 채널에 올라갑니다. 운영진 채널은 운영진만 볼 수 있는 채널로 정해
            주세요.
          </Callout.Description>
        </Callout.Root>
        {SETTING_FIELDS.map((field) => (
          <MobileIdCard
            key={field.key}
            id={`mobile-setting-${field.key}`}
            label={field.label}
            purpose={"purpose" in field ? field.purpose : undefined}
            value={form.ids[field.key]}
            check={form.checks[field.key]}
            serverName={serverName}
            emptyHint={"emptyHint" in field ? field.emptyHint : undefined}
            locked={!botConnected}
            onChange={(value) => form.change({ key: field.key, value })}
            onCheck={() => form.check(field.key)}
          />
        ))}
      </VStack>
      <MobileActionBar>
        <Button
          size="lg"
          loading={form.saving}
          disabled={!form.canSave}
          onClick={form.save}
          className="text-body2"
        >
          변경 저장
        </Button>
      </MobileActionBar>
    </MobileDiscordFrame>
  );
}
