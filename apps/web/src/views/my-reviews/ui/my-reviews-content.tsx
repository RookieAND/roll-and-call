import { ReviewEmpty } from "@/entities/review";
import { LoginRequired } from "@/features/auth";

import type { MyReviewCardModel } from "../model/my-review-card";
import { MyReviewCard } from "./my-review-card";

interface MyReviewsContentProps {
  signedIn: boolean;
  cards: MyReviewCardModel[];
}

export function MyReviewsContent({ signedIn, cards }: MyReviewsContentProps) {
  if (!signedIn) return <LoginRequired />;
  if (cards.length === 0) return <ReviewEmpty text="아직 쓴 후기가 없습니다" />;
  return cards.map((card) => <MyReviewCard key={card.id} card={card} />);
}
