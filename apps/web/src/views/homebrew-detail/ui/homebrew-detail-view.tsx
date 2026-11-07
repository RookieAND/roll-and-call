import { getMyHomebrewApplication } from "@roll-and-call/database/homebrew";
import {
  Badge,
  Button,
  Callout,
  Card,
  Chip,
  FloatingBar,
  HStack,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { compact } from "es-toolkit";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { signCertPhotoUrls } from "@/entities/rulebook/server";
import { LoginRequired } from "@/features/auth";
import { EditHomebrewSummaryButton, WithdrawHomebrewButton } from "@/features/register-homebrew";
import { isUuid, serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, LineBreaks, PageShell } from "@/shared/ui";

import { HOMEBREW_DETAIL_ACTION, homebrewDetailState } from "../model/homebrew-detail-state";
import { linkDomain } from "../model/link-domain";
import { HomebrewImages } from "./homebrew-images";
import { HomebrewInfoRow } from "./homebrew-info-row";
import { HomebrewNotFound } from "./homebrew-not-found";

const PENDING_GUIDE = [
  "심사 결과는 알림 탭으로 알립니다.",
  "심사가 끝나기 전까지 자료를 고칠 수 없습니다.",
] as const;

interface HomebrewDetailViewProps {
  applicationId: string;
}

export async function HomebrewDetailView({ applicationId }: HomebrewDetailViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const appBar = <AppBar back="/me/rulebooks" title="자작 룰" />;
  if (!user) {
    return (
      <PageShell readable appBar={appBar}>
        <div className={DESKTOP_CARD_CLASS}>
          <VStack className="px-200 py-300">
            <LoginRequired />
          </VStack>
        </div>
      </PageShell>
    );
  }
  const application = isUuid(applicationId)
    ? await getMyHomebrewApplication({ serverId: server.id, userId: user.id, id: applicationId })
    : null;
  if (!application) {
    return (
      <PageShell readable appBar={appBar}>
        <div className={DESKTOP_CARD_CLASS}>
          <HomebrewNotFound />
        </div>
      </PageShell>
    );
  }

  const state = homebrewDetailState(application);
  const signedUrls = await signCertPhotoUrls(application.imageUrls);
  const imageUrls = compact(application.imageUrls.map((key) => signedUrls.get(key)));
  const reapplyHref = serverPath({
    slug: server.slug,
    path: `/me/rulebooks/maker/new?from=${application.id}`,
  });

  return (
    <PageShell readable appBar={appBar}>
      <div className={DESKTOP_CARD_CLASS}>
        <VStack gap="200" className="break-keep px-200 pt-200 pb-250">
          <VStack gap="100">
            <HStack align="baseline" wrap className="gap-x-100">
              <Text typography="heading2" render={<h2 />}>
                {application.name}
              </Text>
              {application.edition && (
                <Text typography="body3" foreground="hint">
                  {application.edition}
                </Text>
              )}
            </HStack>
            <HStack align="center" gap="100">
              <Badge colorPalette={state.badge.colorPalette}>{state.badge.label}</Badge>
              <Text typography="body4" foreground="hint">
                {state.dateLabel}
              </Text>
            </HStack>
          </VStack>

          {state.callout && (
            <Callout.Root colorPalette={state.callout.colorPalette}>
              <Callout.Icon />
              <Callout.Title>{state.callout.title}</Callout.Title>
              {state.callout.lines.length > 0 && (
                <Callout.Description>
                  <LineBreaks lines={state.callout.lines} />
                </Callout.Description>
              )}
            </Callout.Root>
          )}

          <Card.Root
            background="subtle"
            padding="none"
            radius={500}
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            <HomebrewInfoRow
              label="한 줄 소개"
              action={
                state.editable && (
                  <EditHomebrewSummaryButton
                    applicationId={application.id}
                    summary={application.summary}
                  />
                )
              }
            >
              <Text typography="body3">{application.summary}</Text>
            </HomebrewInfoRow>
            {application.links.length > 0 && (
              <HomebrewInfoRow label="링크">
                <HStack wrap gap="075">
                  {application.links.map((link) => (
                    <Chip
                      key={link}
                      tone="outline"
                      render={<a href={link} target="_blank" rel="noopener noreferrer" />}
                    >
                      <ExternalLink size={14} aria-hidden />
                      {linkDomain(link)}
                    </Chip>
                  ))}
                </HStack>
              </HomebrewInfoRow>
            )}
            {imageUrls.length > 0 && (
              <HomebrewInfoRow label="이미지">
                <HomebrewImages urls={imageUrls} />
              </HomebrewInfoRow>
            )}
          </Card.Root>

          {state.action === HOMEBREW_DETAIL_ACTION.withdraw && (
            <Text typography="body4" foreground="hint" render={<p />}>
              <LineBreaks lines={PENDING_GUIDE} />
            </Text>
          )}
        </VStack>

        {state.action && (
          <FloatingBar.Root elevated={false}>
            <FloatingBar.Content>
              {state.action === HOMEBREW_DETAIL_ACTION.withdraw ? (
                <WithdrawHomebrewButton applicationId={application.id} className="w-full" />
              ) : (
                <Button render={<Link href={reapplyHref} />} size="lg" className="w-full">
                  고쳐서 다시 신청
                </Button>
              )}
            </FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        )}
      </div>
    </PageShell>
  );
}
