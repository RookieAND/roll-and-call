"use client";

import { Button, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { RulebookOption, type MyRulebook } from "@/entities/rulebook";

import { canApplyFor } from "../model/can-apply-for";
import { groupRulebooks } from "../model/group-rulebooks";
import { CertOptionReason } from "./cert-option-reason";
import { SheetTitleRow } from "./sheet-title-row";

interface CertRulebookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulebooks: MyRulebook[];
  selectedId: string | null;
  onSelect: (rulebookId: string) => void;
  onRequest: () => void;
}

export function CertRulebookSheet({
  open,
  onOpenChange,
  rulebooks,
  selectedId,
  onSelect,
  onRequest,
}: CertRulebookSheetProps) {
  const [query, setQuery] = useState("");
  const groups = groupRulebooks(rulebooks, query);

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰북 선택" className="max-h-[92dvh] px-0">
        <Sheet.Handle />
        <SheetTitleRow title="룰북 선택" />
        <div className="px-200 pt-050 pb-150">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="룰북 이름으로 찾기 (예: CoC, 콜오크)"
            aria-label="룰북 이름으로 찾기"
          />
        </div>
        <Sheet.Body className="px-200" role="radiogroup" aria-label="룰북">
          {groups.length === 0 && (
            <Text typography="body3" foreground="hint" render={<p />} className="py-200">
              찾는 룰북이 없습니다.
            </Text>
          )}
          {groups.map((group) => (
            <VStack key={group.name}>
              <Text
                typography="body4"
                weight="extrabold"
                foreground="muted"
                className="pt-125 pb-050"
              >
                {group.name}
              </Text>
              {group.editions.map((rulebook) => (
                <RulebookOption
                  key={rulebook.id}
                  name={rulebook.edition || "기본판"}
                  edition=""
                  selected={rulebook.id === selectedId}
                  disabled={!canApplyFor(rulebook)}
                  reason={<CertOptionReason rulebook={rulebook} />}
                  onClick={() => {
                    onSelect(rulebook.id);
                    onOpenChange(false);
                  }}
                />
              ))}
            </VStack>
          ))}
        </Sheet.Body>
        <div className="mt-100 border-t border-gray-100 px-200 pt-050">
          <Button
            variant="ghost"
            colorPalette="primary"
            onClick={onRequest}
            className="min-h-12 w-full justify-between px-0"
          >
            찾는 룰북이 없어요
            <ChevronRight size={16} aria-hidden />
          </Button>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
