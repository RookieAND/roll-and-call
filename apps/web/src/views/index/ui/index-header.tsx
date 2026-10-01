import { Button, Container, HStack } from "@roll-and-call/ui";
import Link from "next/link";

import { BrandLogo, ThemeToggleButton } from "@/shared/ui";

export function IndexHeader() {
  return (
    <Container render={<header />} className="relative">
      <HStack align="center" gap="050" className="h-16">
        <div className="flex min-w-0 flex-1">
          <BrandLogo label="Roll & Call" />
        </div>
        <Button variant="ghost" size="md" render={<Link href="/help" />}>
          도움말
        </Button>
        <ThemeToggleButton />
      </HStack>
    </Container>
  );
}
