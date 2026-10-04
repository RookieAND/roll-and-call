import { OutcomePanel } from "@/shared/ui";

interface GrantSummaryProps {
  rulebookLabel?: string;
  nicknames: string[];
  approvingNicknames: string[];
}

export function GrantSummary({ rulebookLabel, nicknames, approvingNicknames }: GrantSummaryProps) {
  return (
    <OutcomePanel
      items={[
        {
          label: "인증을 부여할 룰북",
          value: rulebookLabel ? "1개" : "0개",
          sub: rulebookLabel,
        },
        {
          label: "인증을 받는 유저",
          value: `${nicknames.length}명`,
          sub: nicknames.join(", ") || undefined,
        },
        {
          label: "승인으로 처리되는 심사",
          value: `${approvingNicknames.length}건`,
          sub: approvingNicknames.join(", ") || undefined,
        },
      ]}
    />
  );
}
