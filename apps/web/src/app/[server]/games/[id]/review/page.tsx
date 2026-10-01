import type { Metadata } from "next";

import { WriteReviewView } from "@/views/write-review";

export const metadata: Metadata = { title: "후기 쓰기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WriteReviewView gameId={id} />;
}
