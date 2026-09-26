import { Container } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

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
import {
  getCertSellers,
  getCurrentSessionUser,
  getProfile,
  getQuizQuestion,
  getRulebookRecords,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookPhotosViewProps {
  rulebookId: string;
}

// 신청 2·3단계. 지금 낼 수 없는 책이면 1단계로 돌려보낸다. 반려된 책이면 재신청 화면이다.
export async function RulebookPhotosView({ rulebookId }: RulebookPhotosViewProps) {
  const user = await getCurrentSessionUser();
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
  const [records, profile, sellers] = await Promise.all([
    getRulebookRecords(user.id),
    getProfile(user.id),
    getCertSellers(),
  ]);
  const data = toMyRulebooks(records);
  if (data.suspended) redirect("/me/rulebooks");
  const rulebook = data.rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook || certOption(rulebook, data.rulebooks).type !== CERT_OPTION.pick) {
    redirect(certApplyHref([rulebookId]));
  }
  const quiz = await getQuizQuestion(rulebook.id);
  const { name, handle } = profileDisplay({ profile, user });
  const rejected = rulebook.state === CERT_STATE.rejected ? rulebook.latestApplication : null;

  return (
    <CertApplyForm
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
