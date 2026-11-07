"use client";

import {
  HOMEBREW_RULE_SCOPES,
  HOMEBREW_SCOPE_LABEL,
  type HomebrewRuleScope,
} from "@roll-and-call/database/homebrew/model";
import { SegmentedControl } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Panel } from "@/shared/ui";

import { runHomebrewScopeChange } from "../model/run-homebrew-scope-change";

interface HomebrewScopeCardProps {
  rulebookId: string;
  scope: HomebrewRuleScope;
  hidden: boolean;
  viewerId: string;
}

// 바뀐 값은 다시 읽은 화면이 scope로 내려 준다. 부르는 쪽이 key={scope}로 새로 그린다.
export function HomebrewScopeCard({ rulebookId, scope, hidden, viewerId }: HomebrewScopeCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [requested, setRequested] = useState<HomebrewRuleScope | null>(null);
  const value = requested ?? scope;

  const change = (next: string) => {
    const to = HOMEBREW_RULE_SCOPES.find((candidate) => candidate === next);
    if (!to || to === scope) return;
    setRequested(to);
    startTransition(async () => {
      await runHomebrewScopeChange({
        rulebookId,
        from: scope,
        to,
        viewerId,
        refresh: () => router.refresh(),
      });
      setRequested(null);
    });
  };

  return (
    <Panel title="사용 범위" bodyClassName="p-175">
      <SegmentedControl.Root
        value={value}
        onValueChange={change}
        disabled={hidden || pending}
        aria-label="사용 범위"
      >
        {HOMEBREW_RULE_SCOPES.map((candidate) => (
          <SegmentedControl.Item key={candidate} value={candidate}>
            {HOMEBREW_SCOPE_LABEL[candidate]}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </Panel>
  );
}
