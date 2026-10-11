import { OutcomePanel } from "@/shared/ui";

interface GrantSummaryProps {
  rulebookLabels: string[];
  nicknames: string[];
  grantCount: number;
  approving: { nickname: string; label: string }[];
}

// 룰북이 여러 권이면 첫 번째 룰북만 보이고 나머지는 「외 N개」로 줄인다.
function foldedLabels(labels: string[]) {
  const [first, ...rest] = labels;
  if (!first) return undefined;
  return rest.length > 0 ? `${first} 외 ${rest.length}개` : first;
}

export function GrantSummary({
  rulebookLabels,
  nicknames,
  grantCount,
  approving,
}: GrantSummaryProps) {
  const several = rulebookLabels.length > 1;
  return (
    <OutcomePanel
      items={[
        {
          label: "인증을 부여할 룰북",
          value: `${rulebookLabels.length}개`,
          sub: foldedLabels(rulebookLabels),
        },
        {
          label: "인증을 받는 유저",
          value: `${nicknames.length}명`,
          sub: nicknames.join(", ") || undefined,
        },
        ...(several
          ? [{ label: "새로 부여되는 인증", value: `${grantCount}건`, sub: undefined }]
          : []),
        {
          label: "승인으로 처리되는 심사",
          value: `${approving.length}건`,
          sub:
            approving
              .map((row) => (several ? `${row.nickname} · ${row.label}` : row.nickname))
              .join(", ") || undefined,
        },
      ]}
    />
  );
}
