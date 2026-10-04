import { Container, Progress, Text } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { BookPicker } from "@/features/certify-rulebook";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getRulebookRecords, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookApplyViewProps {
  rulebookIds: string[];
}

export async function RulebookApplyView({ rulebookIds }: RulebookApplyViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
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
  const data = toMyRulebooks(await getRulebookRecords({ serverId: server.id, userId: user.id }));
  if (data.sanction) redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
  return (
    <>
      <AppBar
        back="/me/rulebooks"
        backIcon="close"
        title="인증 신청"
        heading={false}
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
