"use client";

import { SegmentError } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <SegmentError appBarTitle="튜토리얼 퀘스트" subject="퀘스트를" retry={retry} />;
}
