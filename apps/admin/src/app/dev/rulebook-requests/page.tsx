import { notFound } from "next/navigation";

import { RulebookRequestsPreview } from "@/views/rulebooks";

export default async function RulebookRequestsPreviewPage({
  searchParams,
}: PageProps<"/dev/rulebook-requests">) {
  if (process.env.NODE_ENV !== "development") notFound();
  const query = await searchParams;
  return (
    <RulebookRequestsPreview
      selectedId={typeof query.request === "string" ? query.request : undefined}
    />
  );
}
