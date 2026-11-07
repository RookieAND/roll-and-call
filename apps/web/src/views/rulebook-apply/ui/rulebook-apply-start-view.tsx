import { getRulebookRecords } from "@roll-and-call/database/certifications";
import { listMyHomebrewApplications } from "@roll-and-call/database/homebrew";
import {
  HOMEBREW_APPLICATION_STATUS,
  HOMEBREW_LIMIT,
} from "@roll-and-call/database/homebrew/model";
import { Container, Text, VStack } from "@roll-and-call/ui";
import { BookOpen, PenLine } from "lucide-react";
import { redirect } from "next/navigation";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { ApplyKindCard } from "./apply-kind-card";

const TITLE = "룰북 신청";

export async function RulebookApplyStartView() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <PageShell readable appBar={<AppBar back="/me/rulebooks" title={TITLE} />}>
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm">
            <div className="py-300">
              <LoginRequired />
            </div>
          </Container>
        </div>
      </PageShell>
    );
  }
  const [records, homebrewApplications] = await Promise.all([
    getRulebookRecords({ serverId: server.id, userId: user.id }),
    listMyHomebrewApplications({ serverId: server.id, userId: user.id }),
  ]);
  if (toMyRulebooks(records).sanction) {
    redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
  }
  const pendingCount = homebrewApplications.filter(
    (application) => application.status === HOMEBREW_APPLICATION_STATUS.pending,
  ).length;
  const homebrewLimitReached = pendingCount >= HOMEBREW_LIMIT.pendingPerUser;

  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks" title={TITLE} />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="250" className="pt-200 pb-250">
            <Text typography="heading2" render={<h2 />}>
              무엇을 신청할까요?
            </Text>
            <VStack gap="150">
              <ApplyKindCard
                icon={BookOpen}
                title="공식 룰북 인증"
                lines={[
                  "가지고 있는 룰북을 인증합니다.",
                  "인증하면 그 룰로 구인을 열 수 있습니다.",
                ]}
                path="/me/rulebooks/apply?step=books"
              />
              <VStack gap="100">
                <ApplyKindCard
                  icon={PenLine}
                  title="내가 만든 룰 등록"
                  lines={["직접 만든 룰을 심사받습니다.", "승인되면 서버 룰북으로 등록됩니다."]}
                  path="/me/rulebooks/maker/new"
                  disabled={homebrewLimitReached}
                />
                {homebrewLimitReached && (
                  <Text typography="body4" foreground="hint" className="break-keep" render={<p />}>
                    {`심사 중인 내가 만든 룰 신청은 최대 ${HOMEBREW_LIMIT.pendingPerUser}건까지 낼 수 있습니다.`}
                  </Text>
                )}
              </VStack>
            </VStack>
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
