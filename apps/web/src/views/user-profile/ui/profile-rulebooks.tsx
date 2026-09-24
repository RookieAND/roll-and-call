"use client";

import { Button, Chip, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { Check, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { toKst } from "@/shared/lib";

import { ProfileBlockLabel } from "./profile-block-label";

const FOLDED_COUNT = 4;

interface ProfileRulebook {
  id: string;
  label: string;
  approvedAt: Date;
  gameCount: number;
}

interface ProfileRulebooksProps {
  userId: string;
  rulebooks: ProfileRulebook[];
}

// 인증된 룰북 배지. 네 개를 넘으면 "+N"으로 접고, 배지를 누르면 인증일과 이 룰로 연 구인 수를 보여 준다.
export function ProfileRulebooks({ userId, rulebooks }: ProfileRulebooksProps) {
  const [expanded, setExpanded] = useState(false);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const shown = expanded ? rulebooks : rulebooks.slice(0, FOLDED_COUNT);
  const hiddenCount = rulebooks.length - shown.length;
  const opened = rulebooks.find((rulebook) => rulebook.id === openedId);

  return (
    <section className="px-200 pb-200">
      <HStack align="baseline" gap="100">
        <ProfileBlockLabel label="GM 룰북" />
        <Text typography="body4" foreground="hint" numeric>
          {rulebooks.length}
        </Text>
      </HStack>
      <HStack gap="075" wrap>
        {shown.map((rulebook) => (
          <Chip
            key={rulebook.id}
            tone="outline"
            selected={rulebook.id === openedId}
            aria-label={`${rulebook.label} 인증 룰북`}
            onClick={() => setOpenedId(rulebook.id)}
          >
            <Check size={13} strokeWidth={3} aria-hidden className="mr-050 text-success-700" />
            {rulebook.label}
          </Chip>
        ))}
        {hiddenCount > 0 && (
          <Chip
            tone="outline"
            aria-label={`인증 룰북 ${hiddenCount}개 더 보기`}
            onClick={() => setExpanded(true)}
          >
            +{hiddenCount}
          </Chip>
        )}
      </HStack>

      <Sheet.Root open={Boolean(opened)} onOpenChange={(open) => !open && setOpenedId(null)}>
        <Sheet.Overlay />
        <Sheet.Popup aria-label={opened?.label}>
          <Sheet.Handle />
          {opened && (
            <Sheet.Body>
              <VStack gap="150">
                <Text typography="heading2" render={<h2 />}>
                  {opened.label}
                </Text>
                <VStack gap="075">
                  <HStack align="center" gap="075" className="text-success-700">
                    <CircleCheck size={16} strokeWidth={2.4} aria-hidden />
                    <Text typography="body3" weight="bold" foreground="inherit">
                      {toKst(opened.approvedAt).format("YYYY.MM.DD")} 인증
                    </Text>
                  </HStack>
                  <Text typography="body3" foreground="muted">
                    이 GM이 이 룰로 연 구인{" "}
                    <Text weight="bold" foreground="normal">
                      {opened.gameCount}개
                    </Text>
                  </Text>
                </VStack>
                <Button
                  render={<Link href={`/u/${userId}/sessions?tab=host`} />}
                  size="lg"
                  className="mt-075 w-full"
                >
                  이 GM의 구인 보기
                </Button>
              </VStack>
            </Sheet.Body>
          )}
        </Sheet.Popup>
      </Sheet.Root>
    </section>
  );
}
