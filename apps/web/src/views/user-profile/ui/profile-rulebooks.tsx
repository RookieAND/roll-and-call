"use client";

import { Button, Chip, HStack, Sheet, Text } from "@roll-and-call/ui";
import { Check } from "lucide-react";

import { ProfileBlockLabel } from "./profile-block-label";

const FOLDED_COUNT = 5;

interface ProfileRulebooksProps {
  rulebooks: { id: string; label: string }[];
}

export function ProfileRulebooks({ rulebooks }: ProfileRulebooksProps) {
  const hiddenCount = rulebooks.length - FOLDED_COUNT;
  const sorted = rulebooks.toSorted((left, right) => left.label.localeCompare(right.label, "ko"));

  return (
    <section className="px-200 pt-200">
      <HStack align="baseline" gap="075">
        <ProfileBlockLabel label="인증한 룰북" />
        <Text typography="body4" foreground="hint" numeric>
          {rulebooks.length}
        </Text>
      </HStack>
      <HStack gap="075" wrap>
        {rulebooks.slice(0, FOLDED_COUNT).map((rulebook) => (
          <Chip
            key={rulebook.id}
            tone="outline"
            aria-label={`${rulebook.label} 인증 룰북`}
            render={<span />}
          >
            <Check size={13} strokeWidth={3} aria-hidden className="mr-050 text-success-700" />
            {rulebook.label}
          </Chip>
        ))}
        {hiddenCount > 0 && (
          <Sheet.Root>
            <Sheet.Trigger
              render={<Chip tone="outline" />}
              aria-label={`인증 룰북 ${rulebooks.length}개 모두 보기`}
            >
              +{hiddenCount}
            </Sheet.Trigger>
            <Sheet.Overlay />
            <Sheet.Popup aria-label="인증한 룰북" className="max-h-[78dvh] px-0">
              <Sheet.Handle />
              <HStack align="center" gap="075" className="min-h-12 pr-100 pl-200">
                <Text typography="heading3" render={<h2 />}>
                  인증한 룰북
                </Text>
                <Text typography="heading3" foreground="hint" numeric className="flex-1">
                  {rulebooks.length}
                </Text>
                <Sheet.Close render={<Button variant="ghost" />}>닫기</Sheet.Close>
              </HStack>
              <Text typography="body4" foreground="hint" render={<p />} className="px-200 pb-050">
                가나다순
              </Text>
              <Sheet.Body className="border-t border-gray-200 px-200 pb-200">
                {sorted.map((rulebook) => (
                  <Text
                    key={rulebook.id}
                    typography="body2"
                    weight="medium"
                    render={<div />}
                    className="flex min-h-11 items-center border-t border-gray-200 first:border-t-0"
                  >
                    {rulebook.label}
                  </Text>
                ))}
              </Sheet.Body>
            </Sheet.Popup>
          </Sheet.Root>
        )}
      </HStack>
    </section>
  );
}
