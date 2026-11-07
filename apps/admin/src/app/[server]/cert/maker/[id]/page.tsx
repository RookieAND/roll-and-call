import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomebrewReview } from "@/entities/homebrew/server";
import { MakerReviewMobileView, MakerReviewView } from "@/views/maker-review";

export const metadata: Metadata = { title: "자작 룰 심사" };

export default async function MakerReviewPage({ params }: PageProps<"/[server]/cert/maker/[id]">) {
  const { id } = await params;
  const review = await getHomebrewReview(id);
  if (!review) notFound();
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MakerReviewView review={review} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <MakerReviewMobileView review={review} />
      </div>
    </>
  );
}
