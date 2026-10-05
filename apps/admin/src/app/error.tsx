"use client";

import { ErrorScreen } from "@/shared/ui";

export default function RootError({ retry }: { retry: () => void }) {
  return <ErrorScreen retry={retry} />;
}
