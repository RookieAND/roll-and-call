import { Container } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";
import { redirect } from "next/navigation";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { RulebookRequestScreen } from "@/features/certify-rulebook";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getRulebookRecords, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookRequestViewProps {
  query: string;
}

export async function RulebookRequestView({ query }: RulebookRequestViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks/apply" title="룰북 추가 요청" />
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
      <AppBar back="/me/rulebooks/apply" title="룰북 추가 요청" heading={false} />
      <RulebookRequestScreen
        categoryNames={uniq(data.rulebooks.map((rulebook) => rulebook.categoryName))}
        pendingRequestNames={data.pendingRequestNames}
        query={query}
      />
    </>
  );
}
