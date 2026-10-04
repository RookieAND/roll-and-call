import { formatDate, RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRequestRow } from "@/shared/server";
import { FactRows, Panel } from "@/shared/ui";

interface RequestSummaryProps {
  request: RulebookRequestRow;
}

export function RequestSummary({ request }: RequestSummaryProps) {
  return (
    <Panel title="요청 내용" bodyClassName="px-175 py-050">
      <FactRows
        labelWidth={120}
        items={[
          { label: "요청자", value: request.requesterNickname },
          { label: "요청일", value: formatDate(request.requestedAt) },
          { label: "요청한 룰북", value: request.name },
          {
            label: "요청 종류",
            value: request.kind ? RULEBOOK_KIND_LABEL[request.kind] : "잘 모름",
          },
          { label: "요청 메모", value: request.note || "—" },
        ]}
      />
    </Panel>
  );
}
