import type { Metadata } from "next";

import { MyReviewsView } from "@/views/my-reviews";

export const metadata: Metadata = { title: "작성한 후기" };
export default function Page() {
  return <MyReviewsView />;
}
