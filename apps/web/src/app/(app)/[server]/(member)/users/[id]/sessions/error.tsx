"use client";

import { UserSessionsError } from "@/views/user-sessions";

export default function ErrorPage({ retry }: { error: Error; retry: () => void }) {
  return <UserSessionsError retry={retry} />;
}
