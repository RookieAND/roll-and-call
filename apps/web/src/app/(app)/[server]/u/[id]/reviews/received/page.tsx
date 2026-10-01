import type { Metadata } from "next";

import { ReceivedReviewsView } from "@/views/reviews";

export const metadata: Metadata = { title: "진행한 세션 후기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReceivedReviewsView userId={id} />;
}
