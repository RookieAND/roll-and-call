"use client";

import { Chip, HStack, Text } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import { useState } from "react";

import { ProfileBlockLabel } from "./profile-block-label";

const FOLDED_COUNT = 4;

interface ProfileRulebooksProps {
  rulebooks: { id: string; label: string }[];
}

// 인증된 룰북 칩. 표시만 하고, 네 개를 넘으면 "+N"으로 접는다.
export function ProfileRulebooks({ rulebooks }: ProfileRulebooksProps) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? rulebooks : rulebooks.slice(0, FOLDED_COUNT);
  const hiddenCount = rulebooks.length - shown.length;

  return (
    <section className="px-200 pt-200">
      <HStack align="baseline" gap="075">
        <ProfileBlockLabel label="인증한 룰북" />
        <Text typography="body4" foreground="hint" numeric>
          {rulebooks.length}
        </Text>
      </HStack>
      <HStack gap="075" wrap>
        {shown.map((rulebook) => (
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
          <Chip
            tone="outline"
            aria-label={`인증 룰북 ${hiddenCount}개 더 보기`}
            onClick={() => setExpanded(true)}
          >
            +{hiddenCount}
          </Chip>
        )}
      </HStack>
    </section>
  );
}
