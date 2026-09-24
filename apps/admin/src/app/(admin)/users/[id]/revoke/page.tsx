import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserDetail, requireStaff } from "@/shared/server";
import { CertRevokeView } from "@/views/cert-revoke";

export async function generateMetadata({
  params,
}: PageProps<"/users/[id]/revoke">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 룰북 인증 취소` : "룰북 인증 취소" };
}

export default async function CertRevokePage({
  params,
  searchParams,
}: PageProps<"/users/[id]/revoke">) {
  const [{ id }, { rulebook }] = await Promise.all([params, searchParams, requireStaff()]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  return (
    <CertRevokeView
      user={user}
      initialRulebook={typeof rulebook === "string" ? rulebook : undefined}
    />
  );
}
