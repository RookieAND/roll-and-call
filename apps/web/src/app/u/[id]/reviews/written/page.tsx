import type { Metadata } from "next";

import { WrittenReviewsView } from "@/views/reviews";

export const metadata: Metadata = { title: "작성한 후기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WrittenReviewsView userId={id} />;
}
