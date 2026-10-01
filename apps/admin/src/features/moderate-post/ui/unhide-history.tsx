import { Check, Eye } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ItemCard } from "@/shared/ui";

interface UnhideHistoryProps {
  hidden: NonNullable<PostDetail["hidden"]>;
  gmEdit: PostDetail["gmEditSinceHidden"];
}

export function UnhideHistory({ hidden, gmEdit }: UnhideHistoryProps) {
  return (
    <>
      <ItemCard
        icon={Eye}
        tone="warning"
        title={`${formatDateTime(hidden.at)}에 숨김`}
        meta={hidden.by}
      >
        사유: {hidden.reason}
      </ItemCard>
      {gmEdit ? (
        <ItemCard icon={Check} tone="primary" title={gmEdit.title} meta={formatDateTime(gmEdit.at)}>
          {gmEdit.body}
        </ItemCard>
      ) : null}
    </>
  );
}
