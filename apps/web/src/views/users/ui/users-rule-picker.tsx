"use client";

import { Button, Grid, Sheet, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useState } from "react";

import { RulebookSheetGroup } from "@/widgets/game-form";

import { groupRuleOptions } from "../model/group-rule-options";
import type { RuleOption } from "../model/rule-option";
import { SheetRadioItem } from "./sheet-radio-item";

interface UsersRulePickerProps {
  title: string;
  options: RuleOption[];
  selected: string | undefined;
  onDone: (id: string | undefined) => void;
}

export function UsersRulePicker({ title, options, selected, onDone }: UsersRulePickerProps) {
  const [id, setId] = useState(selected);
  const [query, setQuery] = useState("");
  const groups = groupRuleOptions({ options, query });

  return (
    <>
      <Sheet.Title className="mb-100">{title}</Sheet.Title>
      <Sheet.Body className="desktop:flex desktop:min-h-0 desktop:flex-1 desktop:flex-col">
        <VStack
          gap="150"
          className="h-[min(60dvh,28rem)] desktop:h-auto desktop:min-h-0 desktop:flex-1"
        >
          <div className="relative">
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-150 z-10 -translate-y-1/2 text-hint"
            />
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="룰 이름 검색"
              aria-label="룰 이름 검색"
              className="pl-9"
            />
          </div>
          <div role="radiogroup" aria-label={title} className="min-h-0 flex-1 overflow-y-auto">
            {groups.map((group) => (
              <RulebookSheetGroup key={group.categoryName} title={group.categoryName}>
                {group.options.map((option) => (
                  <SheetRadioItem
                    key={option.id}
                    selected={id === option.id}
                    onSelect={() => setId(option.id)}
                  >
                    {option.label}
                  </SheetRadioItem>
                ))}
              </RulebookSheetGroup>
            ))}
          </div>
        </VStack>
      </Sheet.Body>
      <Sheet.Footer>
        <Grid cols={2} gap="100">
          <Button variant="outline" size="lg" onClick={() => onDone(undefined)}>
            선택 해제
          </Button>
          <Button size="lg" onClick={() => onDone(id)}>
            적용
          </Button>
        </Grid>
      </Sheet.Footer>
    </>
  );
}
