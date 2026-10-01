import { Container } from "@roll-and-call/ui";
import { redirect } from "next/navigation";
import { z } from "zod";

import { profileDisplay } from "@/entities/profile";
import {
  CERT_OPTION,
  CERT_STATE,
  certApplyHref,
  certOption,
  rejectionSummary,
  toMyRulebooks,
} from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CertApplyForm } from "@/features/certify-rulebook";
import { serverPath } from "@/shared/lib";
import {
  getCertSellers,
  getCurrentSessionUser,
  getProfile,
  getQuizQuestion,
  getRulebookRecords,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookPhotosViewProps {
  rulebookId: string;
}

export async function RulebookPhotosView({ rulebookId }: RulebookPhotosViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="인증 신청" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }
  const [records, profile, sellers, quiz] = await Promise.all([
    getRulebookRecords({ serverId: server.id, userId: user.id }),
    getProfile(server.id, user.id),
    getCertSellers(),
    // 주소의 rulebook 값은 아직 검증 전이라, uuid가 아니면 Postgres 캐스팅 에러 대신 아래 redirect로 보낸다.
    z.uuid().safeParse(rulebookId).success ? getQuizQuestion(rulebookId) : null,
  ]);
  const data = toMyRulebooks(records);
  if (data.suspended) redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
  const rulebook = data.rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook || certOption({ rulebook, rulebooks: data.rulebooks }).type !== CERT_OPTION.pick) {
    redirect(serverPath({ slug: server.slug, path: certApplyHref({ rulebookIds: [rulebookId] }) }));
  }
  const { name, handle } = profileDisplay({ profile, user });
  const rejected = rulebook.state === CERT_STATE.rejected ? rulebook.latestApplication : null;

  return (
    <CertApplyForm
      serverId={server.id}
      rulebook={rulebook}
      nickname={handle ?? name}
      sellers={sellers}
      quiz={quiz}
      rejection={
        rejected
          ? {
              title: `반려 사유 · ${rejectionSummary(rejected)}`,
              lines: rejected.rejectReason?.split("\n").filter(Boolean) ?? [],
            }
          : null
      }
    />
  );
}
