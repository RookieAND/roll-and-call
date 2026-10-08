import { ReviewEmpty } from "@/entities/review";
import { LoginRequired } from "@/features/auth";
import { LineBreaks } from "@/shared/ui";

import type { MyReviewCardModel } from "../model/my-review-card";
import { MyReviewCard } from "./my-review-card";

interface MyReviewsContentProps {
  signedIn: boolean;
  cards: MyReviewCardModel[];
}

export function MyReviewsContent({ signedIn, cards }: MyReviewsContentProps) {
  if (!signedIn) return <LoginRequired />;
  if (cards.length === 0)
    return (
      <ReviewEmpty
        text="아직 쓴 후기가 없습니다"
        description={<LineBreaks lines={["참여한 세션이 끝나면", "후기를 남길 수 있습니다."]} />}
      />
    );
  return cards.map((card) => <MyReviewCard key={card.id} card={card} />);
}
