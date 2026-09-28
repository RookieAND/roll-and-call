import { DISCORD_COLOR, type DiscordForumPostInput } from "@roll-and-call/discord";

import type { ForumReview } from "./load-forum-review";
import { ruleTagName } from "./rule-tag-name";

const SPOILER_TITLE = "[스포있음] ";
const TAG = { spoiler: "스포O", noSpoiler: "스포X", trpg: "TRPG" } as const;
// 같은 url을 가진 임베드는 디스코드가 한 장의 사진 묶음으로 보여 준다. 최대 4장까지다.
const GALLERY_MAX = 4;

// 포럼 규칙: 스포일러면 제목에 [스포있음], 스포 태그는 반드시 붙인다.
// 스포일러 후기는 본문을 가리고 사진은 올리지 않는다(임베드 사진은 가릴 수 없다).
export function reviewForumPost(
  review: ForumReview,
  tagIds: Map<string, string>,
  siteOrigin: string | undefined,
): DiscordForumPostInput {
  const url = siteOrigin ? `${siteOrigin}/games/${review.gameId}/reviews` : undefined;
  const body = review.spoiler ? `||${review.body.replaceAll("||", "| |")}||` : review.body;
  const photos = review.spoiler ? [] : review.photoUrls.slice(0, GALLERY_MAX);
  const hiddenPhotoCount = review.photoUrls.length - photos.length;
  const tagNames = [
    review.spoiler ? TAG.spoiler : TAG.noSpoiler,
    TAG.trpg,
    ruleTagName(review.category),
  ];
  const [firstPhoto, ...restPhotos] = photos;

  return {
    name: `${review.spoiler ? SPOILER_TITLE : ""}${review.gameTitle} 후기 · ${review.authorName}`,
    appliedTags: tagNames.flatMap((name) => tagIds.get(name) ?? []),
    message: {
      embeds: [
        {
          author: { name: review.authorName, icon_url: review.authorAvatar ?? undefined },
          title: review.gameTitle,
          url,
          description: body,
          color: DISCORD_COLOR.review,
          fields: [
            { name: "룰", value: review.category ?? review.rule, inline: true },
            { name: "GM", value: review.gmName, inline: true },
          ],
          image: firstPhoto ? { url: firstPhoto } : undefined,
          footer: hiddenPhotoCount
            ? { text: `사진 ${hiddenPhotoCount}장은 롤앤콜에서 볼 수 있어요` }
            : undefined,
        },
        ...restPhotos.map((photo) => ({ url, image: { url: photo } })),
      ],
      buttons: url ? [{ label: "롤앤콜에서 보기", url }] : [],
    },
  };
}
