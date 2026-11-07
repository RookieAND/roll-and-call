import { Card, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { BrandMark } from "@/entities/profile";
import { AppBar } from "@/shared/ui";

import { HELP_QUEST_FALLBACK_HREF } from "../api/load-help-quest-entry";
import { HELP_CATEGORIES, HELP_DOCS } from "../model/help-docs";
import { HelpDocRow } from "./help-doc-row";
import { HELP_APP_BAR_CLASS, HELP_BODY_CLASS } from "./help-frame-class";
import { HelpQuestCard } from "./help-quest-card";
import { HelpQuestEntry } from "./help-quest-entry";
import { HelpServerButton } from "./help-server-button";

interface HelpListViewProps {
  from: string | null;
}

export function HelpListView({ from }: HelpListViewProps) {
  return (
    <>
      <AppBar back="/" title="도움말" className={HELP_APP_BAR_CLASS} />
      <Container size="sm" className={HELP_BODY_CLASS}>
        <VStack gap="250" className="py-200 break-keep">
          <Suspense fallback={<HelpQuestCard href={HELP_QUEST_FALLBACK_HREF} progress={null} />}>
            <HelpQuestEntry from={from} />
          </Suspense>

          <Card.Root padding="none" className="overflow-hidden">
            <HelpDocRow
              href="/about"
              title="롤앤콜 소개"
              description="롤앤콜이 무엇을 하는지 한 장으로 봅니다"
            />
          </Card.Root>

          {HELP_CATEGORIES.map((category) => (
            <VStack key={category} gap="125" render={<section />}>
              <Text typography="body4" weight="extrabold" foreground="hint" render={<h2 />}>
                {category}
              </Text>
              <Card.Root padding="none" className="overflow-hidden">
                {HELP_DOCS.filter((doc) => doc.category === category).map((doc) => (
                  <HelpDocRow key={doc.slug} href={`/help/${doc.slug}`} title={doc.title} />
                ))}
              </Card.Root>
            </VStack>
          ))}

          <Card.Root background="subtle" render={<section />}>
            <VStack gap="100">
              <HStack align="center" gap="125">
                <span className="flex-none text-discord">
                  <BrandMark service="discord" size={17} />
                </span>
                <Text typography="subtitle1" weight="extrabold" render={<h2 />}>
                  여기에 없는 게 궁금하면
                </Text>
              </HStack>
              <Text typography="body3" foreground="muted" render={<p />} className="text-pretty">
                롤앤콜을 쓰는 디스코드 서버의 운영진에게 물어봐 주세요.
              </Text>
              <Suspense fallback={null}>
                <HelpServerButton from={from} />
              </Suspense>
            </VStack>
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
