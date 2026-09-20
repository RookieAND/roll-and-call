import type { Metadata } from "next";

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
  return { title: doc?.title ?? "도움말" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <HelpDocView slug={slug} />;
}
