import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { Text } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRow } from "@/entities/rulebook/server";
import { ListRow, Tag } from "@/shared/ui";

import { homebrewMakerNote } from "../../model/homebrew-maker-note";

interface BookRowProps {
  row: RulebookRow;
  last: boolean;
}

// 대부분인 기본 룰북·인증 필요는 줄에서 빼고 예외만 뱃지로 붙인다.
export function BookRow({ row, last }: BookRowProps) {
  const freeBadge = !row.certRequired && !row.homebrew;
  const exceptional = row.kind !== RULEBOOK_KIND.core || freeBadge || row.hidden;
  return (
    <ListRow
      path={`/rules/${row.id}`}
      title={row.name}
      muted={row.hidden}
      description={row.homebrew ? homebrewMakerNote(row.homebrew) : undefined}
      indent
      last={last}
      badges={
        exceptional || row.categoryMiniRule ? (
          <>
            {row.hidden ? <Tag>숨김</Tag> : null}
            {row.kind === RULEBOOK_KIND.core ? null : <Tag>{RULEBOOK_KIND_LABEL[row.kind]}</Tag>}
            {freeBadge ? <Tag>인증 불필요</Tag> : null}
            {row.categoryMiniRule ? <Tag>미니룰</Tag> : null}
          </>
        ) : null
      }
      trailing={
        row.edition ? (
          <Text typography="body3" weight="bold">
            {row.edition}
          </Text>
        ) : null
      }
    />
  );
}
