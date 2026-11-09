import { notFound } from "next/navigation";

import { RulebookRequestPreview } from "@/features/request-rulebook";

export default function RulebookRequestsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <RulebookRequestPreview />;
}
