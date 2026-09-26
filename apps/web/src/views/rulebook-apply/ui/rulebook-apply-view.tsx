import { Container, Progress, Text } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { BookPicker } from "@/features/certify-rulebook";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookApplyViewProps {
  rulebookIds: string[];
}

// 신청 1단계(책 고르기). 활동 정지 중이면 내 룰북으로 돌려보낸다.
export async function RulebookApplyView({ rulebookIds }: RulebookApplyViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" backIcon="close" title="인증 신청" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }
  const data = toMyRulebooks(await getRulebookRecords(user.id));
  if (data.suspended) redirect("/me/rulebooks");
  return (
    <>
      <AppBar
        back="/me/rulebooks"
        backIcon="close"
        title="인증 신청"
        action={
          <Text typography="body4" foreground="hint" numeric className="px-100">
            1 / 2
          </Text>
        }
      />
      <Progress value={1} max={2} className="h-[3px] rounded-none" aria-label="진행" />
      <BookPicker
        rulebooks={data.rulebooks}
        initialRulebookIds={rulebookIds}
        recentRulebookIds={data.recentRulebookIds}
        pendingRequestNames={data.pendingRequestNames}
      />
    </>
  );
}
