import type { Metadata } from "next";

import { MyReviewsView } from "@/views/my-reviews";

export const metadata: Metadata = { title: "내가 쓴 후기" };
export default function Page() {
  return <MyReviewsView />;
}
