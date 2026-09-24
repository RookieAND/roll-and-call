import Link from "next/link";

import { CERT_STATE, CertStateRow, certRowMeta, type MyRulebook } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

interface MyPageRulebookRowProps {
  rulebook: MyRulebook;
}

export function MyPageRulebookRow({ rulebook }: MyPageRulebookRowProps) {
  const meta =
    rulebook.state === CERT_STATE.pending && rulebook.stateAt
      ? `${toKst(rulebook.stateAt).format("MM.DD")} 신청 · 확인하고 있습니다`
      : certRowMeta(rulebook);
  return (
    <Link
      href={`/me/rulebooks/${rulebook.id}`}
      className="block border-t border-gray-200 transition-colors hover:bg-gray-50"
    >
      <CertStateRow
        state={rulebook.state!}
        title={rulebook.label}
        meta={meta}
        statusPlacement="badge"
        size="sm"
      />
    </Link>
  );
}
