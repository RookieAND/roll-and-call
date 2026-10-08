"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";

import {
  IdRow,
  SETTING_FIELDS,
  type SettingCheck,
  type SettingFieldKey,
  type SettingIds,
} from "@/features/edit-server-settings";
import { Panel } from "@/shared/ui";

import { DISCORD_LINK_NOTES } from "../model/discord-link-notes";

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
      <VStack
        gap="050"
        render={<ul />}
        className="mt-100 border-t border-(--rc-color-border-subtle) pt-125"
      >
        {DISCORD_LINK_NOTES.map((note) => (
          <HStack key={note} gap="075" render={<li />}>
            <Text typography="body4" foreground="hint" aria-hidden>
              ·
            </Text>
            <Text typography="body4" foreground="muted">
              {note}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Panel>
  );
}
