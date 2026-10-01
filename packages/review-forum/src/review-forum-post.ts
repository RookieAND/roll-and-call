import type { ForumReview } from "@roll-and-call/database/reviews";

import { extensionOf } from "./extension-of";
import { ruleTagName } from "./rule-tag-name";

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
  siteOrigin,
}: {
  review: ForumReview;
  tagIds: Map<string, string>;
  siteOrigin: string | undefined;
}) {
  const url = siteOrigin ? `${siteOrigin}/games/${review.gameId}/reviews` : undefined;
  const body = review.spoiler ? `||${review.body.replaceAll("||", "| |")}||` : review.body;
  const meta = [
    `작성자 <@${review.authorDiscordId}>`,
    `룰 ${review.category ?? review.rule}`,
    `GM ${review.gmName}`,
    ...(url ? [`[롤앤콜에서 보기](<${url}>)`] : []),
  ].join(" · ");
  const withMeta = `${body}\n\n-# ${meta}`;
  const tagNames = [
    review.spoiler ? TAG.spoiler : TAG.noSpoiler,
    TAG.trpg,
    ruleTagName(review.category),
  ];

  return {
    name: `${review.spoiler ? SPOILER_TITLE : ""}${review.gameTitle} 후기 · ${review.authorName}`,
    appliedTags: tagNames.flatMap((name) => tagIds.get(name) ?? []),
    content: withMeta.length <= CONTENT_MAX_LENGTH ? withMeta : body,
    photos: review.photoUrls.map((photoUrl, index) => ({
      url: photoUrl,
      name: `${review.spoiler ? SPOILER_FILE_PREFIX : ""}photo-${index + 1}${extensionOf(photoUrl)}`,
    })),
  };
}
