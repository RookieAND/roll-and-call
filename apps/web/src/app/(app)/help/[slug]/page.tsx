import type { Metadata } from "next";

import { OG_IMAGE } from "@/shared/lib";
import { HELP_DOCS, HelpDocView } from "@/views/help";

export function generateStaticParams() {
  return HELP_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = HELP_DOCS.find((candidate) => candidate.slug === slug);
  if (!doc) return { title: "도움말" };
  return {
    title: doc.title,
    description: doc.description,
    // 부모 openGraph는 통째로 덮이므로 기본 이미지를 여기서도 깐다.
    openGraph: { title: doc.title, description: doc.description, images: [OG_IMAGE] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <HelpDocView slug={slug} />;
}
