import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CERT_SHOTS, CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CancelApplicationButton } from "@/features/certify-rulebook";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { certSummary } from "../model/cert-summary";
import { inquiryUrl } from "../model/inquiry-url";
import { CertSummaryCard } from "./cert-summary-card";
import { SubmittedPhoto } from "./submitted-photo";

interface RulebookCertViewProps {
  rulebookId: string;
}

export async function RulebookCertView({ rulebookId }: RulebookCertViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/rulebooks" title="룰북 인증" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const { rulebooks } = toMyRulebooks(await getRulebookRecords(user.id));
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook?.state) redirect(`/me/rulebooks/apply?rulebook=${rulebookId}`);

  const { state, latestApplication } = rulebook;
  const summary = certSummary(rulebook);
  const rejected = state === CERT_STATE.rejected;
  const inquiry = inquiryUrl();

  return (
    <>
      <AppBar back="/me/rulebooks" title={rulebook.label} />
      <Container size="sm">
        <VStack gap="250" className="pt-225 pb-250">
          <CertSummaryCard state={state} lines={summary.lines} sub={summary.sub} />

          {latestApplication && (
            <VStack gap="125" render={<section />}>
              <Text typography="subtitle1" render={<h2 />}>
                제출한 사진
              </Text>
              <div className="flex gap-100">
                {CERT_SHOTS.map((shot) => {
                  const flagged = latestApplication.flaggedShots.includes(shot);
                  const verdict = rejected ? (flagged ? "flagged" : "ok") : null;
                  return (
                    <SubmittedPhoto
                      key={shot}
                      shot={shot}
                      url={latestApplication.photoUrls[shot]}
                      verdict={verdict}
                    />
                  );
                })}
              </div>
              {state === CERT_STATE.certified && (
                <Text typography="body4" foreground="hint">
                  인증이 유지되는 동안 사진을 보관합니다.
                </Text>
              )}
            </VStack>
          )}
        </VStack>
      </Container>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            {state === CERT_STATE.pending && <CancelApplicationButton rulebookId={rulebookId} />}
            {state === CERT_STATE.certified && (
              <Button
                render={<Link href={`/games/new?rulebook=${rulebookId}`} />}
                size="lg"
                className="w-full"
              >
                이 룰북으로 새 구인 열기
              </Button>
            )}
            {rejected && (
              <Button
                render={<Link href={`/me/rulebooks/apply?rulebook=${rulebookId}`} />}
                size="lg"
                className="w-full"
              >
                다시 신청하기
              </Button>
            )}
            {state === CERT_STATE.revoked && inquiry && (
              <Button
                render={<a href={inquiry} target="_blank" rel="noreferrer" />}
                colorPalette="discord"
                size="lg"
                className="w-full"
              >
                디스코드 문의 채널 열기
              </Button>
            )}
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
