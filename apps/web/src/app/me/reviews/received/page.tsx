import type { Metadata } from "next";

import { ReceivedReviewsView } from "@/views/reviews";

export const metadata: Metadata = { title: "받은 후기" };
export default function Page() {
  return <ReceivedReviewsView />;
}
