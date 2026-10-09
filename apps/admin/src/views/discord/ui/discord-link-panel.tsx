"use client";

import { Callout, Text } from "@roll-and-call/ui";

import {
  IdRow,
  SETTING_FIELDS,
  type SettingCheck,
  type SettingFieldKey,
  type SettingIds,
} from "@/features/edit-server-settings";
import { Panel } from "@/shared/ui";

export type RowCheck = SettingCheck | "checking";

interface DiscordLinkPanelProps {
  ids: SettingIds;
  checks: Partial<Record<SettingFieldKey, RowCheck>>;
  serverName: string;
  locked?: boolean;
  loading?: boolean;
  onChange?: (input: { key: SettingFieldKey; value: string }) => void;
  onCheck?: (key: SettingFieldKey) => void;
}

export function DiscordLinkPanel({
  ids,
  checks,
  serverName,
  locked,
  loading,
  onChange,
  onCheck,
}: DiscordLinkPanelProps) {
  return (
    <Panel
      title="디스코드 연동"
      bodyClassName="p-175"
      right={
        <Text typography="body4" foreground="hint">
          ID를 넣고 [확인]을 누르면 봇이 검증합니다
        </Text>
      }
    >
      {SETTING_FIELDS.map((field) => (
        <IdRow
          key={field.key}
          id={`setting-${field.key}`}
          label={field.label}
          purpose={"purpose" in field ? field.purpose : undefined}
          value={ids[field.key]}
          check={checks[field.key]}
          serverName={serverName}
          emptyHint={"emptyHint" in field ? field.emptyHint : undefined}
          locked={locked}
          loading={loading}
          onChange={(value) => onChange?.({ key: field.key, value })}
          onCheck={() => onCheck?.(field.key)}
        />
      ))}
      <Callout.Root className="mt-150">
        <Callout.Icon />
        <Callout.Title>채널을 바꿔도 기존 구인글은 그대로 남습니다</Callout.Title>
        <Callout.Description>
          새 구인부터 바뀐 채널에 올라갑니다. 운영진 채널은 운영진만 볼 수 있는 채널로 정해 주세요.
        </Callout.Description>
      </Callout.Root>
    </Panel>
  );
}
