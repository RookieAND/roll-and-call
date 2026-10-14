"use client";

import { SegmentError } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <SegmentError appBarTitle="구인" back="/games" subject="구인 정보를" retry={retry} />;
}
