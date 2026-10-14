"use client";

import { SegmentError } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <SegmentError appBarTitle="마이페이지" back="/" subject="마이페이지를" retry={retry} />;
}
