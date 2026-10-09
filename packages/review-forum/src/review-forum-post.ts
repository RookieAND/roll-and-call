import type { ForumReview } from "@roll-and-call/database/reviews";
import { richTextToMarkdown } from "@roll-and-call/game-notices/rich-text-markdown";

import { extensionOf } from "./extension-of";
import { ruleTagName } from "./rule-tag-name";

const GM_TITLE = "[GM 후기] ";
const SPOILER_TITLE = "[스포있음] ";
const TAG = { spoiler: "스포O", noSpoiler: "스포X", trpg: "TRPG" } as const;
const CONTENT_MAX_LENGTH = 2000;
// 스포일러 첨부는 파일 이름이 SPOILER_로 시작하면 디스코드가 흐리게 가린다.
const SPOILER_FILE_PREFIX = "SPOILER_";

// 포럼의 다른 후기처럼 본문은 평문, 사진은 첨부로 올린다.
// 포럼 규칙: 스포일러면 제목에 [스포있음], 스포 태그는 반드시 붙인다.
export function reviewForumPost({
  review,
  tagIds,
  reviewsUrl,
}: {
  review: ForumReview;
  tagIds: Map<string, string>;
  reviewsUrl: string | undefined;
}) {
  const text = richTextToMarkdown(review.body);
  const body = review.spoiler ? `||${text.replaceAll("||", "| |")}||` : text;
  const meta = [
    `작성자 <@${review.authorDiscordId}>`,
    `룰 ${review.category ?? review.rule}`,
    `GM ${review.gmName}`,
    ...(reviewsUrl ? [`[롤앤콜에서 보기](<${reviewsUrl}>)`] : []),
  ].join(" · ");
  const withMeta = `${body}\n\n-# ${meta}`;
  const tagNames = [
    review.spoiler ? TAG.spoiler : TAG.noSpoiler,
    TAG.trpg,
    ruleTagName(review.category),
  ];

  return {
    name: `${review.isGmReview ? GM_TITLE : ""}${review.spoiler ? SPOILER_TITLE : ""}${review.gameTitle} 후기 · ${review.authorName}`,
    appliedTags: tagNames.flatMap((name) => tagIds.get(name) ?? []),
    content: withMeta.length <= CONTENT_MAX_LENGTH ? withMeta : body,
    photos: review.photoUrls.map((photoUrl, index) => ({
      url: photoUrl,
      name: `${review.spoiler ? SPOILER_FILE_PREFIX : ""}photo-${index + 1}${extensionOf(photoUrl)}`,
    })),
  };
}
