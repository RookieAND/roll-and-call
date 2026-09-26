"use client";

import { Badge, Button, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { RULE_GATE, RulebookOption, type EditionSet, type RuleGate } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

interface RulebookSheetOptionProps {
  set: EditionSet;
  gate: RuleGate;
  selected: boolean;
  onPick: () => void;
}

// 적용일이 지나 막힌 판본은 자물쇠로 시작하고, 누르면 그 자리에서 안내와 인증 버튼을 펼친다.
export function RulebookSheetOption({ set, gate, selected, onPick }: RulebookSheetOptionProps) {
  const [expanded, setExpanded] = useState(false);
  const locked = gate.type === RULE_GATE.blocked;
  const [title, ...body] = gate.lines;
  const badge = set.earned ? (
    <Badge colorPalette="success">인증 완료</Badge>
  ) : set.free ? (
    <Badge colorPalette="primary">무료 배포</Badge>
  ) : (
    <Badge>미인증</Badge>
  );

  return (
    <div className={expanded ? "rounded-400 bg-gray-50" : undefined}>
      <RulebookOption
        name={set.edition || set.categoryName}
        edition=""
        selected={selected}
        locked={locked}
        expanded={expanded}
        reason={badge}
        onClick={locked ? () => setExpanded(!expanded) : onPick}
      />
      {expanded && (
        <VStack gap="125" className="pr-150 pb-150 pl-500">
          <VStack className="break-keep">
            <Text typography="body3" weight="bold">
              {title}
            </Text>
            <Text typography="body3" foreground="muted">
              <LineBreaks lines={body} />
            </Text>
          </VStack>
          {gate.action && (
            <Button render={<Link href={gate.action.href} />} variant="tinted" className="w-full">
              {gate.action.label}
            </Button>
          )}
        </VStack>
      )}
    </div>
  );
}
