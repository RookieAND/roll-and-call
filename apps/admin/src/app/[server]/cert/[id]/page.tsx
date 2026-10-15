import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseCertQueueFilter } from "@/entities/cert";
import { getCertReview } from "@/entities/cert/server";
import { requireStaff } from "@/shared/server";
import { CertReviewMobileView, CertReviewView } from "@/views/cert-review";

export const metadata: Metadata = { title: "룰북 인증 심사" };

export default async function CertReviewPage({
  params,
  searchParams,
}: PageProps<"/[server]/cert/[id]">) {
  const [{ id }, query, staff] = await Promise.all([params, searchParams, requireStaff()]);
  const filter = parseCertQueueFilter(query);
  const review = await getCertReview({ id, filter });
  if (!review) notFound();
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertReviewView review={review} viewerId={staff.id} filter={filter} />
      </div>
      <div className="contents lg:hidden">
        <CertReviewMobileView review={review} viewerId={staff.id} filter={filter} />
      </div>
    </>
  );
}
