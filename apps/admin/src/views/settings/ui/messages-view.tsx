import {
  defaultMessageHead,
  MESSAGE_CASES,
  messageTextsOfCase,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { MessageEditor, type MessageRole } from "@/features/edit-discord-messages";
import { Panel, ServerLink, Tag } from "@/shared/ui";

import { SettingsFrame } from "./settings-frame";

interface MessagesViewProps {
  selected: MessageCaseKey;
  heads: Record<MessageCaseKey, { headLine: string; updatedAt: Date | null }>;
  texts: Record<MessageTextKey, { body: string; updatedAt: Date | null }>;
  guildRoles?: MessageRole[];
  recruitForum: boolean;
  readOnly: boolean;
}

export function MessagesView({
  selected,
  heads,
  texts,
  guildRoles,
  recruitForum,
  readOnly,
}: MessagesViewProps) {
  const current = MESSAGE_CASES.find((messageCase) => messageCase.key === selected)!;
  const currentTexts = messageTextsOfCase(selected).map((text) => ({
    key: text.key,
    label: text.label,
    place: text.place,
    savedBody: texts[text.key].body,
    savedAt: texts[text.key].updatedAt?.toISOString() ?? null,
  }));
  return (
    <SettingsFrame title="디스코드 메시지" active="/settings/messages">
      <VStack gap="025">
        <Text typography="heading2" render={<h2 />}>
          디스코드 메시지
        </Text>
        <Text typography="body3" foreground="muted">
          머리 줄, 설명 문장, 본문 알림 줄을 경우마다 정합니다. 비워 두면 기본 문구를 씁니다.
        </Text>
        {readOnly ? (
          <Text typography="body4" foreground="hint">
            서버장만 고칠 수 있습니다.
          </Text>
        ) : null}
      </VStack>
      <div className="grid grid-cols-[216px_minmax(0,1fr)] items-start gap-150">
        <Panel bodyClassName="p-0">
          {MESSAGE_CASES.map(({ key, label }, index) => {
            const head = heads[key].headLine;
            const on = key === selected;
            return (
              <HStack
                key={key}
                align="center"
                gap="075"
                aria-current={on ? "true" : undefined}
                render={<ServerLink path={`/settings/messages?case=${key}`} scroll={false} />}
                className={cn(
                  "min-h-11 px-150 hover:bg-gray-50",
                  index > 0 && "border-t border-(--rc-color-border-subtle)",
                  on &&
                    "bg-tinted-bg shadow-[inset_4px_0_0_var(--rc-color-bg-primary)] hover:bg-tinted-bg",
                )}
              >
                <Text
                  typography="subtitle2"
                  className={cn("whitespace-nowrap", on && "text-(--rc-color-fg-primary-strong)")}
                >
                  {label}
                </Text>
                {head !== defaultMessageHead(key) ? <Tag>바꿈</Tag> : null}
              </HStack>
            );
          })}
        </Panel>
        <Panel
          title={current.label}
          right={
            <Text typography="body4" foreground="hint">
              보내는 곳 {current.to}
            </Text>
          }
          bodyClassName="p-0"
        >
          <MessageEditor
            key={`${selected}:${heads[selected].updatedAt?.toISOString() ?? ""}`}
            texts={currentTexts}
            caseKey={selected}
            label={current.label}
            savedHead={heads[selected].headLine}
            savedAt={heads[selected].updatedAt?.toISOString() ?? null}
            guildRoles={guildRoles}
            recruitForum={recruitForum}
            readOnly={readOnly}
          />
        </Panel>
      </div>
    </SettingsFrame>
  );
}
