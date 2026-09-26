import { Callout, Container, Progress } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { profileDisplay } from "@/entities/profile";
import { certApplyHref, rejectionSummary, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { CertApplyForm, photoStepBooks } from "@/features/certify-rulebook";
import { getCurrentSessionUser, getProfile, getRulebookRecords } from "@/shared/server";
import { AppBar, LineBreaks } from "@/shared/ui";

import { StepCount } from "./step-count";

interface RulebookPhotosViewProps {
  rulebookIds: string[];
}

// 신청 2단계(사진). 낼 수 없는 책이 섞였으면 1단계로 돌려보낸다. 재신청은 반려 사유를 위에 고정한다.
export async function RulebookPhotosView({ rulebookIds }: RulebookPhotosViewProps) {
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
  const [records, profile] = await Promise.all([getRulebookRecords(user.id), getProfile(user.id)]);
  const data = toMyRulebooks(records);
  if (data.suspended) redirect("/me/rulebooks");
  const { books, retry } = photoStepBooks(data.rulebooks, rulebookIds);
  if (books.length === 0) redirect(certApplyHref(rulebookIds));
  const { name, handle } = profileDisplay({ profile, user });
  const rejected = retry ? books[0]!.latestApplication : null;
  const reasonLines = rejected?.rejectReason?.split("\n").filter(Boolean) ?? [];

  return (
    <>
      {retry ? (
        <AppBar back={`/me/rulebooks/${books[0]!.id}`} title="다시 신청" />
      ) : (
        <>
          <AppBar
            back={certApplyHref(books.map((book) => book.id))}
            title="인증 신청"
            action={<StepCount step={2} />}
          />
          <Progress value={2} max={2} className="h-[3px] rounded-none" aria-label="진행" />
        </>
      )}
      {rejected && (
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) border-b border-gray-100 bg-surface px-200 py-150">
          <Callout.Root colorPalette="danger">
            <Callout.Icon />
            <Callout.Title>반려 사유 · {rejectionSummary(rejected)}</Callout.Title>
            {reasonLines.length > 0 && (
              <Callout.Description className="break-keep">
                <LineBreaks lines={reasonLines} />
              </Callout.Description>
            )}
          </Callout.Root>
        </div>
      )}
      <CertApplyForm rulebooks={books} nickname={handle ?? name} retry={retry} />
    </>
  );
}
