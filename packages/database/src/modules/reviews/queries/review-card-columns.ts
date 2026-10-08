import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games, profiles, sessionReviews } from "#/schema";

// 후기 카드 칸. 작성자 이름은 그 서버 닉네임이라 serverId를 받는다(profiles를 join한 쿼리에서 쓴다).
export function reviewCardColumns(serverId: string) {
  return {
    id: sessionReviews.id,
    gameId: sessionReviews.gameId,
    authorId: sessionReviews.authorId,
    body: sessionReviews.body,
    spoiler: sessionReviews.spoiler,
    photoUrls: sessionReviews.photoUrls,
    createdAt: sessionReviews.createdAt,
    updatedAt: sessionReviews.updatedAt,
    authorName: memberNicknameSql(serverId),
    authorAvatarUrl: profiles.avatarUrl,
    gameTitle: games.title,
  };
}
