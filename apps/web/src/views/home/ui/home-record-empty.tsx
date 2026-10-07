import type { UiAssetName } from "@roll-and-call/ui";

import { EmptyState } from "@/shared/ui";

interface HomeRecordEmptyProps {
  image?: UiAssetName;
  title: string;
  description: string;
}

export function HomeRecordEmpty({ image, title, description }: HomeRecordEmptyProps) {
  return (
    <EmptyState
      image={image}
      size="section"
      className="p-200"
      title={title}
      description={description}
    />
  );
}
