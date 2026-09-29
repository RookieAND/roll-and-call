import { Container, VStack } from "@roll-and-call/ui";

import { ReviewEmpty } from "@/entities/review";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getMyReviews } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { toMyReviewCard } from "../model/my-review-card";
import { MyReviewCard } from "./my-review-card";

// 받은 후기·세션 후기와 달리 본인만 보는 상태(숨김·보류·운영진 삭제)와 수정·삭제 버튼까지 보인다.
export async function MyReviewsView() {
  const user = await getCurrentSessionUser();
  const now = new Date();
  const cards = user ? (await getMyReviews(user.id)).map((row) => toMyReviewCard(row, now)) : [];

  return (
    <>
      <AppBar back="/me" title="내가 쓴 후기" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          {!user ? (
            <LoginRequired />
          ) : cards.length > 0 ? (
            cards.map((card) => <MyReviewCard key={card.id} card={card} />)
          ) : (
            <ReviewEmpty text="아직 쓴 후기가 없습니다" />
          )}
        </VStack>
      </Container>
    </>
  );
}
