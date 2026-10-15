import {
  defaultMessageHead,
  defaultReviewTemplate,
  MESSAGE_CASES,
  messageTextsOfCase,
  REVIEW_CASE_KEY,
  REVIEW_TEMPLATE_LABEL,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";

import {
  MessageEditor,
  ReviewTemplateEditor,
  type MessageRole,
} from "@/features/edit-discord-messages";
import { ServerLink, Tag } from "@/shared/ui";

import { MobileDiscordFrame } from "./mobile/mobile-discord-frame";

interface MessagesMobileViewProps {
  selected: MessageCaseKey | typeof REVIEW_CASE_KEY;
  heads: Record<MessageCaseKey, { headLine: string; updatedAt: Date | null }>;
  texts: Record<MessageTextKey, { body: string; updatedAt: Date | null }>;
  reviewTemplate: { title: string; body: string; updatedAt: Date | null };
  guildRoles?: MessageRole[];
  readOnly: boolean;
}

// 데스크톱 왼쪽 경우 목록은 한 줄 칩으로 바꾸고, 편집기는 한 열로 그대로 쓴다.
export function MessagesMobileView({
  selected,
  heads,
  texts,
  reviewTemplate,
  guildRoles,
  readOnly,
}: MessagesMobileViewProps) {
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
  const cases = [
    ...MESSAGE_CASES.map(({ key, label }) => ({
      key: key as string,
      label,
      changed: heads[key].headLine !== defaultMessageHead(key),
    })),
    { key: REVIEW_CASE_KEY as string, label: REVIEW_TEMPLATE_LABEL, changed: reviewChanged },
  ];
  const destination = current
    ? `보내는 곳 ${selected === "open" ? "모집 채널 (포럼)" : current.to}`
    : "보내는 곳 후기 채널";

  return (
    <MobileDiscordFrame active="/discord/messages">
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        <Text typography="body3" foreground="muted">
          머리 줄, 설명 문장, 본문 알림 줄, 후기 양식을 경우마다 정합니다. 비워 두면 기본 문구를
          씁니다.
        </Text>
        {readOnly ? (
          <Text typography="body4" foreground="hint">
            서버장만 고칠 수 있습니다.
          </Text>
        ) : null}
        <HStack gap="075" className="-mx-200 overflow-x-auto px-200 scrollbar-none">
          {cases.map((item) => (
            <Chip
              key={item.key}
              selected={item.key === selected}
              aria-current={item.key === selected ? "true" : undefined}
              render={<ServerLink path={`/discord/messages?case=${item.key}`} scroll={false} />}
              className="min-h-11"
            >
              {item.label}
              {item.changed ? <Tag>바꿈</Tag> : null}
            </Chip>
          ))}
        </HStack>
      </VStack>
      <VStack className="px-150 pt-150 pb-200">
        <VStack className="overflow-hidden rounded-600 border border-gray-200 bg-surface">
          <VStack gap="025" className="border-b border-(--rc-color-border-subtle) px-200 py-150">
            <Text typography="heading3" render={<h2 />}>
              {current ? current.label : REVIEW_TEMPLATE_LABEL}
            </Text>
            <Text typography="body4" foreground="hint">
              {destination}
            </Text>
          </VStack>
          {current ? (
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
          ) : (
            <ReviewTemplateEditor
              key={`${selected}:${reviewTemplate.updatedAt?.toISOString() ?? ""}`}
              savedTitle={reviewTemplate.title}
              savedBody={reviewTemplate.body}
              savedAt={reviewTemplate.updatedAt?.toISOString() ?? null}
              readOnly={readOnly}
            />
          )}
        </VStack>
      </VStack>
    </MobileDiscordFrame>
  );
}
