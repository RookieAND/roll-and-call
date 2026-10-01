import { Container, HStack, Text } from "@roll-and-call/ui";
import Link from "next/link";

import { BrandLogo } from "@/shared/ui";

import { INQUIRY_URL } from "../model/inquiry-url";
import { BotIcon } from "./bot-icon";

export function IndexFooter() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <HStack align="center" wrap className="gap-x-300 gap-y-150 pt-300 pb-400">
          <HStack align="center" gap="125" className="flex-auto opacity-80">
            <BotIcon size={28} className="rounded-300" />
            <BrandLogo label="Roll & Call" />
          </HStack>
          <HStack render={<nav aria-label="바닥글" />} gap="250">
            <Text
              typography="subtitle2"
              weight="medium"
              foreground="muted"
              render={<Link href="/help" />}
            >
              도움말
            </Text>
            <Text
              typography="subtitle2"
              weight="medium"
              foreground="muted"
              render={<a href={INQUIRY_URL} target="_blank" rel="noreferrer" />}
            >
              도입 문의
            </Text>
          </HStack>
          <Text typography="body4" foreground="hint">
            © 2026 Roll &amp; Call
          </Text>
        </HStack>
      </Container>
    </footer>
  );
}
