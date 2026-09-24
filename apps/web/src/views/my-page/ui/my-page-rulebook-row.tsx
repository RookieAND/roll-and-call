import Link from "next/link";

import { CertStateRow, certRowMeta, type MyRulebook } from "@/entities/rulebook";

interface MyPageRulebookRowProps {
  rulebook: MyRulebook;
}

export function MyPageRulebookRow({ rulebook }: MyPageRulebookRowProps) {
  return (
    <Link
      href={`/me/rulebooks/${rulebook.id}`}
      className="block border-t border-gray-100 transition-colors hover:bg-gray-50"
    >
      <CertStateRow
        state={rulebook.state!}
        title={rulebook.label}
        meta={certRowMeta(rulebook)}
        statusPlacement="badge"
      />
    </Link>
  );
}
