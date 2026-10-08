import { EmptyState } from "@/shared/ui";

interface ReviewEmptyProps {
  text: string;
}

export function ReviewEmpty({ text }: ReviewEmptyProps) {
  return <EmptyState image="empty-review" size="section" title={text} />;
}
