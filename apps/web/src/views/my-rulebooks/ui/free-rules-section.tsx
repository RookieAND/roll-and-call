"use client";

import { Badge, Button, Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { MyRulebook } from "@/entities/rulebook";

interface FreeRulesSectionProps {
  rulebooks: MyRulebook[];
}

// 인증한 룰북과 섞이지 않게 면을 따로 깔고 "무료 배포" 배지를 붙인다. 마이페이지의 링크로 들어오면 펼쳐 둔다.
export function FreeRulesSection({ rulebooks }: FreeRulesSectionProps) {
  const [open, setOpen] = useState(true);
  const ToggleIcon = open ? ChevronUp : ChevronDown;
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} render={<section id="free" />}>
      <VStack gap="125">
        <HStack align="center" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            인증 없이 열 수 있는 룰
          </Text>
          <Text typography="body3" foreground="hint" numeric className="flex-1">
            {rulebooks.length}
          </Text>
          <Collapsible.Trigger render={<Button variant="ghost" size="sm" />}>
            {open ? "접기" : "펼치기"}
            <ToggleIcon size={14} aria-hidden />
          </Collapsible.Trigger>
        </HStack>
        <Collapsible.Panel>
          <VStack gap="125">
            <Text typography="body4" foreground="muted">
              무료 배포 룰은 사진 인증 없이 구인을 열 수 있습니다.
            </Text>
            <VStack className="rounded-600 bg-gray-50 [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-gray-100">
              {rulebooks.map((rulebook) => (
                <HStack key={rulebook.id} align="center" gap="125" className="min-h-12 px-175">
                  <BookOpen size={18} aria-hidden className="flex-none text-hint" />
                  <Text typography="body3" weight="medium" className="min-w-0 flex-1">
                    {rulebook.label}
                  </Text>
                  <Badge>무료 배포</Badge>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Collapsible.Panel>
      </VStack>
    </Collapsible.Root>
  );
}
