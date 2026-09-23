import { Button, Card, Container, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/entities/profile";
import { AppBar } from "@/shared/ui";

import { HELP_CATEGORIES, HELP_DOCS } from "../model/help-docs";
import { HelpDocRow } from "./help-doc-row";

const DISCORD_INVITE_URL = "https://discord.gg/22q39AUyXc";

export function HelpListView() {
  return (
    <>
      <AppBar back="/" title="도움말" />
      <Container size="sm">
        <VStack gap="250" className="py-200">
          <Card.Root
            padding="sm"
            interactive
            render={<Link href="/onboarding" />}
            className="border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover"
          >
            <HStack align="center" gap="150" className="px-050 py-025">
              <span className="flex size-[38px] flex-none items-center justify-center rounded-500 bg-primary-600 text-white">
                <PlayCircle size={19} aria-hidden />
              </span>
              <VStack gap="025" className="min-w-0 flex-1">
                <Text typography="subtitle1" weight="extrabold" render={<span />}>
                  서비스 둘러보기
                </Text>
                <Text typography="body4" foreground="muted" render={<span />}>
                  처음 봤던 소개 5장을 다시 봅니다
                </Text>
              </VStack>
              <ChevronRight size={18} className="flex-none text-hint" aria-hidden />
            </HStack>
          </Card.Root>

          {HELP_CATEGORIES.map((category) => (
            <VStack key={category} gap="125" render={<section />}>
              <Text typography="body4" weight="extrabold" foreground="hint" render={<h2 />}>
                {category}
              </Text>
              <Card.Root padding="none" className="overflow-hidden">
                {HELP_DOCS.filter((doc) => doc.category === category).map((doc) => (
                  <HelpDocRow key={doc.slug} slug={doc.slug} title={doc.title} />
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
                디스코드 서버에서 물어보세요.
                <br />
                운영자와 다른 GM들이 같이 봅니다.
              </Text>
              <Button
                render={<a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer" />}
                variant="outline"
                size="lg"
                className="mt-050 w-full"
              >
                디스코드 서버 열기
                <ExternalLink size={15} aria-hidden />
              </Button>
            </VStack>
          </Card.Root>
        </VStack>
      </Container>
    </>
  );
}
