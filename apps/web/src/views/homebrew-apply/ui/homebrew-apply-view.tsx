import { getMyHomebrewApplication } from "@roll-and-call/database/homebrew";
import { HOMEBREW_APPLICATION_STATUS } from "@roll-and-call/database/homebrew/model";
import { Container, VStack } from "@roll-and-call/ui";
import { redirect } from "next/navigation";

import { signCertPhotoUrls } from "@/entities/rulebook/server";
import { LoginRequired } from "@/features/auth";
import { HomebrewApplyForm } from "@/features/register-homebrew";
import { isUuid, serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface HomebrewApplyViewProps {
  // 고쳐서 다시 낼 반려 신청 id. 내 반려 신청이 아니면 새 신청으로 연다.
  from: string | undefined;
}

export async function HomebrewApplyView({ from }: HomebrewApplyViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) {
    return (
      <PageShell readable appBar={<AppBar back="/me/rulebooks/apply" title="자작 룰 등록 신청" />}>
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm">
            <VStack className="py-300">
              <LoginRequired />
            </VStack>
          </Container>
        </div>
      </PageShell>
    );
  }
  const application = isUuid(from)
    ? await getMyHomebrewApplication({ serverId: server.id, userId: user.id, id: from })
    : null;
  if (!application) return <HomebrewApplyForm serverId={server.id} previous={null} />;
  if (application.status !== HOMEBREW_APPLICATION_STATUS.rejected || application.reapplied) {
    redirect(serverPath({ slug: server.slug, path: `/me/rulebooks/maker/${application.id}` }));
  }

  const signedUrls = await signCertPhotoUrls(application.imageUrls);
  return (
    <HomebrewApplyForm
      serverId={server.id}
      previous={{
        id: application.id,
        name: application.name,
        edition: application.edition,
        summary: application.summary,
        links: application.links,
        // 정리되어 서명하지 못한 이미지는 다시 보내지 않는다.
        images: application.imageUrls.flatMap((key) => {
          const previewUrl = signedUrls.get(key);
          return previewUrl ? [{ key, previewUrl }] : [];
        }),
      }}
    />
  );
}
