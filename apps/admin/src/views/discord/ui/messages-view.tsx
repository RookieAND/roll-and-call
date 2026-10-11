import {
  defaultMessageHead,
  MESSAGE_CASES,
  defaultReviewTemplate,
  messageTextsOfCase,
  REVIEW_CASE_KEY,
  REVIEW_TEMPLATE_LABEL,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import {
  MessageEditor,
  ReviewTemplateEditor,
  type MessageRole,
} from "@/features/edit-discord-messages";
import { Panel, ServerLink, Tag } from "@/shared/ui";

import { DiscordFrame } from "./discord-frame";

interface MessagesViewProps {
  selected: MessageCaseKey | typeof REVIEW_CASE_KEY;
  heads: Record<MessageCaseKey, { headLine: string; updatedAt: Date | null }>;
  texts: Record<MessageTextKey, { body: string; updatedAt: Date | null }>;
  reviewTemplate: { title: string; body: string; updatedAt: Date | null };
  guildRoles?: MessageRole[];
  readOnly: boolean;
}

export function MessagesView({
  selected,
  heads,
  texts,
  reviewTemplate,
  guildRoles,
  readOnly,
}: MessagesViewProps) {
  const reviewSelected = selected === REVIEW_CASE_KEY;
  const reviewChanged =
    reviewTemplate.title !== defaultReviewTemplate("title") ||
    reviewTemplate.body !== defaultReviewTemplate("body");
  const current = MESSAGE_CASES.find((messageCase) => messageCase.key === selected);
  const currentTexts = messageTextsOfCase(reviewSelected ? "" : selected).map((text) => ({
    key: text.key,
    label: text.label,
    place: text.place,
    savedBody: texts[text.key].body,
    savedAt: texts[text.key].updatedAt?.toISOString() ?? null,
  }));
  return (
    <DiscordFrame title="디스코드 메시지" active="/discord/messages">
      <VStack gap="025">
        <Text typography="heading2" render={<h2 />}>
          디스코드 메시지
        </Text>
        <Text typography="body3" foreground="muted">
          머리 줄, 설명 문장, 본문 알림 줄, 후기 양식을 경우마다 정합니다. 비워 두면 기본 문구를
          씁니다.
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
                render={<ServerLink path={`/discord/messages?case=${key}`} scroll={false} />}
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
          <HStack
            align="center"
            gap="075"
            aria-current={reviewSelected ? "true" : undefined}
            render={
              <ServerLink path={`/discord/messages?case=${REVIEW_CASE_KEY}`} scroll={false} />
            }
            className={cn(
              "min-h-11 border-t border-(--rc-color-border-subtle) px-150 hover:bg-gray-50",
              reviewSelected &&
                "bg-tinted-bg shadow-[inset_4px_0_0_var(--rc-color-bg-primary)] hover:bg-tinted-bg",
            )}
          >
            <Text
              typography="subtitle2"
              className={cn(
                "whitespace-nowrap",
                reviewSelected && "text-(--rc-color-fg-primary-strong)",
              )}
            >
              {REVIEW_TEMPLATE_LABEL}
            </Text>
            {reviewChanged ? <Tag>바꿈</Tag> : null}
          </HStack>
        </Panel>
        {current ? (
          <Panel
            title={current.label}
            right={
              <Text typography="body4" foreground="hint">
                보내는 곳 {selected === "open" ? "모집 채널 (포럼)" : current.to}
              </Text>
            }
            bodyClassName="p-0"
          >
            <MessageEditor
              key={`${selected}:${heads[current.key].updatedAt?.toISOString() ?? ""}`}
              texts={currentTexts}
              caseKey={current.key}
              label={current.label}
              savedHead={heads[current.key].headLine}
              savedAt={heads[current.key].updatedAt?.toISOString() ?? null}
              guildRoles={guildRoles}
              readOnly={readOnly}
            />
          </Panel>
        ) : (
          <Panel
            title={REVIEW_TEMPLATE_LABEL}
            right={
              <Text typography="body4" foreground="hint">
                보내는 곳 후기 채널
              </Text>
            }
            bodyClassName="p-0"
          >
            <ReviewTemplateEditor
              key={`${selected}:${reviewTemplate.updatedAt?.toISOString() ?? ""}`}
              savedTitle={reviewTemplate.title}
              savedBody={reviewTemplate.body}
              savedAt={reviewTemplate.updatedAt?.toISOString() ?? null}
              readOnly={readOnly}
            />
          </Panel>
        )}
      </div>
    </DiscordFrame>
  );
}
