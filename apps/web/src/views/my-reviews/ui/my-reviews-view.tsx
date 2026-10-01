import { Container, VStack } from "@roll-and-call/ui";

import { getCurrentSessionUser, getMyReviews, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toMyReviewCard } from "../model/my-review-card";
import { MyReviewsContent } from "./my-reviews-content";

export async function MyReviewsView() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const now = new Date();
  const cards = user
    ? (await getMyReviews({ serverId: server.id, authorId: user.id })).map((row) =>
        toMyReviewCard(row, now),
      )
    : [];

  return (
    <>
      <AppBar back="/me" title="내가 쓴 후기" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <MyReviewsContent signedIn={!!user} cards={cards} />
        </VStack>
      </Container>
    </>
  );
}
