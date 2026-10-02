import { HStack } from "@roll-and-call/ui";
import Link from "next/link";

import { BrandLogo } from "@/shared/ui";

export function JoinHeader() {
  return (
    <HStack
      align="center"
      render={<header />}
      className="relative h-(--rc-size-appbar) flex-none px-200"
    >
      <Link href="/" className="flex h-11 items-center">
        <BrandLogo label="롤앤콜 소개" />
      </Link>
    </HStack>
  );
}
