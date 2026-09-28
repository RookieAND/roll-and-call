import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getReviewDetail } from "@/shared/server";
import { ReviewDetailView } from "@/views/review-detail";

export async function generateMetadata({
  params,
}: PageProps<"/posts/reviews/[id]">): Promise<Metadata> {
  const review = await getReviewDetail((await params).id);
  return { title: review ? `${review.author.nickname}의 후기` : "후기 상세" };
}

export default async function ReviewDetailPage({
  params,
  searchParams,
}: PageProps<"/posts/reviews/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { action, from } = query as Record<string, string | undefined>;
  const review = await getReviewDetail(id);
  if (!review) notFound();
  return <ReviewDetailView review={review} action={action} from={from} />;
}
