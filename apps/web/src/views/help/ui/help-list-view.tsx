import { Button, Container, Text, VStack } from "@trpg/ui";
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
        <VStack gap={5} className="py-[18px]">
          <Link
            href="/onboarding"
            className="flex items-center gap-3 rounded-[14px] border border-tinted-border bg-tinted-bg px-[15px] py-3.5 transition-colors hover:bg-tinted-bg-hover"
          >
            <span className="flex size-[38px] flex-none items-center justify-center rounded-[11px] bg-primary-600 text-white">
              <PlayCircle size={19} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <Text typography="subtitle1" render={<span />} className="block">
                서비스 둘러보기
              </Text>
              <Text
                typography="body4"
                foreground="muted"
                render={<span />}
                className="mt-0.5 block"
              >
                처음 봤던 소개 4장을 다시 봅니다
              </Text>
            </span>
            <ChevronRight size={18} className="flex-none text-gray-400" aria-hidden />
          </Link>

          {HELP_CATEGORIES.map((category) => (
            <section key={category}>
              <Text typography="subtitle2" foreground="muted" render={<h2 />} className="mb-2">
                {category}
              </Text>
              <div className="overflow-hidden rounded-[14px] border border-gray-200">
                {HELP_DOCS.filter((doc) => doc.category === category).map((doc) => (
                  <HelpDocRow key={doc.slug} slug={doc.slug} title={doc.title} />
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[14px] border border-gray-200 bg-gray-50 p-[15px]">
            <div className="flex items-center gap-2.5">
              <span className="flex-none text-discord">
                <BrandMark service="discord" size={17} />
              </span>
              <Text typography="subtitle1" render={<h2 />}>
                여기에 없는 게 궁금하면
              </Text>
            </div>
            <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
              디스코드 서버에서 물어보세요.
              <br />
              운영자와 다른 GM들이 같이 봅니다.
            </Text>
            <Button asChild variant="outline" className="mt-3 h-11 w-full">
              <a href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
                디스코드 서버 열기
                <ExternalLink size={15} aria-hidden />
              </a>
            </Button>
          </section>
        </VStack>
      </Container>
    </>
  );
}
