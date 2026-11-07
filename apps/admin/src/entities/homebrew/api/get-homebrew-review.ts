import "server-only";
import { loadHomebrewReview } from "@roll-and-call/database/homebrew";

import { getCurrentServer, requireStaff } from "@/shared/server";

import { signHomebrewImages } from "./sign-homebrew-images";

export async function getHomebrewReview(id: string) {
  await requireStaff();
  const server = await getCurrentServer();
  const review = await loadHomebrewReview({ serverId: server.id, id });
  if (!review) return null;
  return { ...review, images: await signHomebrewImages(review.application.imageUrls) };
}

export type HomebrewReview = NonNullable<Awaited<ReturnType<typeof getHomebrewReview>>>;
