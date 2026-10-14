"use client";

import { SegmentError } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <SegmentError appBarTitle="구인 등록" back="/games" subject="구인 등록 화면을" retry={retry} />;
}
