"use client";

import { HOMEBREW_SCOPE_LABEL } from "@roll-and-call/database/homebrew/model";
import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import type { HomebrewRuleInfo } from "@/entities/homebrew/server";
import { formatFullDateTime } from "@/shared/lib";
import { FactRows, Panel } from "@/shared/ui";

import { HomebrewMaker } from "./homebrew-maker";
import { HomebrewMaterialDialog } from "./homebrew-material-dialog";

interface HomebrewInfoPanelProps {
  ruleLabel: string;
  info: HomebrewRuleInfo;
}

export function HomebrewInfoPanel({ ruleLabel, info }: HomebrewInfoPanelProps) {
  const [materialOpen, setMaterialOpen] = useState(false);
  return (
    <Panel
      title="자작 룰 정보"
      right={
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={() => setMaterialOpen(true)}
        >
          심사 자료 보기
        </Button>
      }
      bodyClassName="px-175"
    >
      <FactRows
        labelWidth={120}
        items={[
          { label: "제작자", value: <HomebrewMaker info={info} /> },
          { label: "승인 일시", value: formatFullDateTime(info.approvedAt) },
          { label: "사용 범위", value: HOMEBREW_SCOPE_LABEL[info.scope] },
        ]}
      />
      <HomebrewMaterialDialog
        open={materialOpen}
        ruleLabel={ruleLabel}
        info={info}
        onClose={() => setMaterialOpen(false)}
      />
    </Panel>
  );
}
