import type { ReactNode } from "react";

import { EmptyState } from "@/shared/ui";

interface ReviewEmptyProps {
  text: string;
  description?: ReactNode;
}

export function ReviewEmpty({ text, description }: ReviewEmptyProps) {
  return <EmptyState image="empty-review" size="section" title={text} description={description} />;
}
