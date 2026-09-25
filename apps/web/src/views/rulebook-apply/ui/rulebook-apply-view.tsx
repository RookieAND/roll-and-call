import { Container } from "@roll-and-call/ui";

import { profileDisplay } from "@/entities/profile";
import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CertApplyForm } from "@/features/certify-rulebook";
import { getCurrentSessionUser, getProfile, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

interface RulebookApplyViewProps {
  rulebookIds: string[];
}

export async function RulebookApplyView({ rulebookIds }: RulebookApplyViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="룰북 인증하기" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const [records, profile] = await Promise.all([getRulebookRecords(user.id), getProfile(user.id)]);
  const { name, handle } = profileDisplay({ profile, user });

  return (
    <>
      <AppBar back="/me/rulebooks" title="룰북 인증하기" />
      <CertApplyForm
        rulebooks={toMyRulebooks(records).rulebooks}
        initialRulebookIds={rulebookIds}
        nickname={handle ?? name}
      />
    </>
  );
}
