import { games, profiles, sessionReviews } from "#/schema";

export const reviewCardColumns = {
  id: sessionReviews.id,
  gameId: sessionReviews.gameId,
  authorId: sessionReviews.authorId,
  body: sessionReviews.body,
  spoiler: sessionReviews.spoiler,
  photoUrls: sessionReviews.photoUrls,
  createdAt: sessionReviews.createdAt,
  updatedAt: sessionReviews.updatedAt,
  authorName: profiles.username,
  gameTitle: games.title,
};
