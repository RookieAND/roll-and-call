import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { WriteReviewView } from "@/views/write-review";

export const metadata: Metadata = { title: "후기 쓰기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <WriteReviewView gameId={id} />;
}
