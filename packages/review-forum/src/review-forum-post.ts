import type { ForumReview } from "@roll-and-call/database/reviews";
import {
  DEFAULT_REVIEW_TEMPLATE,
  renderReviewTemplate,
} from "@roll-and-call/database/servers/model";
import { richTextToMarkdown } from "@roll-and-call/game-notices/rich-text-markdown";

import { extensionOf } from "./extension-of";
import { ruleTagName } from "./rule-tag-name";

const GM_MARK = "[GM 후기]";
const SPOILER_MARK = "[스포있음]";
const TAG = { spoiler: "스포O", noSpoiler: "스포X", trpg: "TRPG" } as const;
const CONTENT_MAX_LENGTH = 2000;
// 스포일러 첨부는 파일 이름이 SPOILER_로 시작하면 디스코드가 흐리게 가린다.
const SPOILER_FILE_PREFIX = "SPOILER_";

const ELLIPSIS = "…";
// 텍스트 채널엔 제목 칸이 없어 본문 첫 줄에 `**제목**` + 줄바꿈을 붙인다.
const TEXT_CHANNEL_TITLE_EXTRA = "****\n".length;

const mention = (discordId: string) => `<@${discordId}>`;

// 스포일러면 ||로 감싼다. 후기 안의 ||는 감싸기가 깨지지 않게 벌린다.
const wrapSpoiler = (text: string, spoiler: boolean) =>
  spoiler ? `||${text.replaceAll("||", "| |")}||` : text;

// 감싸기 전의 원문을 먼저 줄여, 잘려도 ||가 닫히게 한다. 글자 단위(서로게이트 쌍 보호)로 자르고 끝에 …를 붙인다.
function fitText({ text, spoiler, max }: { text: string; spoiler: boolean; max: number }) {
  if (wrapSpoiler(text, spoiler).length <= max) return wrapSpoiler(text, spoiler);
  const chars = [...text];
  const build = (count: number) =>
    wrapSpoiler(`${chars.slice(0, count).join("").trimEnd()}${ELLIPSIS}`, spoiler);
  let low = 0;
  let high = chars.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (build(mid).length <= max) low = mid;
    else high = mid - 1;
  }
  return build(low);
}

// 포럼의 다른 후기처럼 본문은 평문, 사진은 첨부로 올린다. 제목과 본문 모양은 서버가 정한 양식(template)을 따른다.
// 포럼 규칙: 스포일러면 스포 태그는 반드시 붙인다. 제목의 [스포있음]은 기본 양식의 {스포 표시}가 채운다.
export function reviewForumPost({
  review,
  tagIds,
  reviewsUrl,
  template = DEFAULT_REVIEW_TEMPLATE,
  textChannel = false,
}: {
  review: ForumReview;
  tagIds: Map<string, string>;
  reviewsUrl: string | undefined;
  template?: { title: string; body: string };
  // 텍스트 채널이면 제목이 본문 첫 줄로 들어가므로 그만큼 글자 수를 비워 둔다.
  textChannel?: boolean;
}) {
  const text = richTextToMarkdown(review.body);
  const body = wrapSpoiler(text, review.spoiler);
  const values = {
    "구인 제목": review.gameTitle,
    룰: review.category ?? review.rule,
    GM: review.gmName,
    작성자: review.authorName,
    "후기 종류": review.isGmReview ? "GM 후기" : "PL 후기",
    "GM 후기 표시": review.isGmReview ? GM_MARK : undefined,
    "스포 표시": review.spoiler ? SPOILER_MARK : undefined,
    "작성자 멘션": mention(review.authorDiscordId),
    "GM 멘션": mention(review.gmDiscordId),
    "참여자 멘션": review.participantDiscordIds.map(mention).join(" "),
    "롤앤콜 링크": reviewsUrl ? `[롤앤콜에서 보기](<${reviewsUrl}>)` : undefined,
  };
  // 양식을 채운 결과가 비면 기본 양식으로 다시 만든다.
  const render = (part: "title" | "body") =>
    renderReviewTemplate({ template: template[part], values, reviewBody: body }) ||
    renderReviewTemplate({ template: DEFAULT_REVIEW_TEMPLATE[part], values, reviewBody: body });
  const name = render("title");
  const contentMax = textChannel
    ? CONTENT_MAX_LENGTH - name.length - TEXT_CHANNEL_TITLE_EXTRA
    : CONTENT_MAX_LENGTH;
  const withMeta = render("body");
  const tagNames = [
    review.spoiler ? TAG.spoiler : TAG.noSpoiler,
    TAG.trpg,
    ruleTagName(review.category),
  ];

  return {
    name,
    appliedTags: tagNames.flatMap((tagName) => tagIds.get(tagName) ?? []),
    // 넘치면 아래 한 줄을 빼고, 그래도 넘치면 후기 원문을 줄인다.
    content:
      withMeta.length <= contentMax
        ? withMeta
        : fitText({ text, spoiler: review.spoiler, max: contentMax }),
    photos: review.photoUrls.map((photoUrl, index) => ({
      url: photoUrl,
      name: `${review.spoiler ? SPOILER_FILE_PREFIX : ""}photo-${index + 1}${extensionOf(photoUrl)}`,
    })),
  };
}
