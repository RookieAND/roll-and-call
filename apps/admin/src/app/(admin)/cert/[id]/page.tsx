import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCertReview, requireStaff } from "@/shared/server";
import { CertReviewView } from "@/views/cert-review";

export async function generateMetadata({ params }: PageProps<"/cert/[id]">): Promise<Metadata> {
  const review = await getCertReview((await params).id);
  return { title: review ? `${review.applicant.nickname} 룰북 인증 심사` : "룰북 인증 심사" };
}

export default async function CertReviewPage({ params, searchParams }: PageProps<"/cert/[id]">) {
  const [{ id }, { mode }, staff] = await Promise.all([params, searchParams, requireStaff()]);
  const review = await getCertReview(id);
  if (!review) notFound();
  return <CertReviewView review={review} viewer={staff.nickname} rejecting={mode === "reject"} />;
}
