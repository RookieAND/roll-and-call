import { Field, TextInput } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookDetail } from "@/entities/rulebook/server";

interface HomebrewLockedFieldsProps {
  rulebook: RulebookDetail;
  idPrefix: string;
  stacked?: boolean;
}

// 자작 룰의 종류·인증 정책·구판 연결은 읽기만 한다. 서버도 이 칸들의 변경을 거부한다.
export function HomebrewLockedFields({ rulebook, idPrefix, stacked }: HomebrewLockedFieldsProps) {
  const certPolicy = rulebook.certRequired ? "인증 필요" : "인증 불필요";
  const supersedes =
    rulebook.allRulebooks.find((row) => row.id === rulebook.supersedesId)?.label ?? "없음";
  const fields = [
    { id: "kind", label: "종류", value: RULEBOOK_KIND_LABEL[rulebook.kind] },
    { id: "cert-policy", label: "인증 정책", value: certPolicy },
    { id: "supersedes", label: "포함하는 구판", value: supersedes },
  ];
  return (
    <div className={stacked ? "grid grid-cols-1 gap-150" : "grid grid-cols-3 items-start gap-125"}>
      {fields.map((field) => (
        <Field.Root key={field.id} label={field.label} htmlFor={`${idPrefix}-${field.id}`}>
          <TextInput id={`${idPrefix}-${field.id}`} value={field.value} disabled readOnly />
        </Field.Root>
      ))}
    </div>
  );
}
