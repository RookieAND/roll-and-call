import { Badge, Button, HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CERT_FORMAT_LABEL } from "@/shared/lib";
import type { CertReview } from "@/shared/server";

interface SiblingLinksProps {
  siblings: CertReview["siblings"];
}

// 여러 권을 한 번에 낸 신청의 다른 책. 심사는 책마다 하므로 오가며 쪽지·구매 기록을 비교한다.
export function SiblingLinks({ siblings }: SiblingLinksProps) {
  return (
    <HStack
      align="center"
      gap="150"
      wrap
      className="border-t border-(--rc-color-border-subtle) px-200 py-125"
    >
      <Text typography="body4" foreground="hint" className="w-[72px] flex-none">
        같이 신청한 책
      </Text>
      <HStack gap="100" wrap className="min-w-0">
        {siblings.map((sibling) => (
          <Button
            key={sibling.id}
            variant="outline"
            colorPalette="gray"
            size="sm"
            render={<Link href={`/cert/${sibling.id}`} />}
          >
            {sibling.format
              ? `${sibling.rulebook} · ${CERT_FORMAT_LABEL[sibling.format]}`
              : sibling.rulebook}
            <Badge colorPalette={sibling.status.palette}>{sibling.status.label}</Badge>
            <ChevronRight size={14} aria-hidden />
          </Button>
        ))}
      </HStack>
    </HStack>
  );
}
