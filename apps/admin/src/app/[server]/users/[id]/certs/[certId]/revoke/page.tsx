import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserDetail, requireStaff } from "@/shared/server";
import { CertRevokeView } from "@/views/cert-revoke";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/users/[id]/certs/[certId]/revoke">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 룰북 인증 반려로 돌리기` : "룰북 인증 반려로 돌리기" };
}

// certId는 인증된 룰북의 id다(한 서버에서 유저·룰북마다 인증은 하나).
export default async function CertRevokePage({
  params,
}: PageProps<"/[server]/users/[id]/certs/[certId]/revoke">) {
  const [{ id, certId }] = await Promise.all([params, requireStaff()]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  if (!user.certifications.some((certification) => certification.rulebookId === certId)) {
    notFound();
  }
  return <CertRevokeView user={user} initialRulebookId={certId} />;
}
