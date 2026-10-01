import type { ReactNode } from "react";

import type { NoShowDetail } from "@/shared/server";

import { CancelForm } from "./cancel-form";
import { CancelledRecord } from "./cancelled-record";

type Cancellation = NonNullable<NoShowDetail["cancellation"]>;

interface NoShowDialogContentProps {
  record: NoShowDetail;
  summary: ReactNode;
  conflict: Cancellation | null;
  nextRecordHref: string | null;
  onConflict: (detail: Cancellation) => void;
  onDone: () => void;
}

export function NoShowDialogContent({
  record,
  summary,
  conflict,
  nextRecordHref,
  onConflict,
  onDone,
}: NoShowDialogContentProps) {
  if (record.cancellation && !conflict) {
    return (
      <CancelledRecord
        gmNickname={record.gmNickname}
        cancellation={record.cancellation}
        summary={summary}
      />
    );
  }
  return (
    <CancelForm
      key={record.id}
      record={record}
      summary={summary}
      conflict={conflict}
      nextRecordHref={nextRecordHref}
      onConflict={onConflict}
      onDone={onDone}
    />
  );
}
