import { EmptyState } from "@/shared/ui";

interface HomeRecordEmptyProps {
  title: string;
  description: string;
}

export function HomeRecordEmpty({ title, description }: HomeRecordEmptyProps) {
  return <EmptyState size="section" className="p-200" title={title} description={description} />;
}
