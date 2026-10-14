"use client";

import { SegmentError } from "@/shared/ui";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <SegmentError appBarTitle="알림" subject="알림을" retry={retry} />;
}
