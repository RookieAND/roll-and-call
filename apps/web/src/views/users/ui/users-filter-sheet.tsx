"use client";

import { Button, Grid, HStack, Sheet, Switch, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useServerPath } from "@/shared/lib";
import { FilterButton, reportError } from "@/shared/ui";

import { countFilteredUsers } from "../api/count-filtered-users";
import { EMPTY_FILTER_DRAFT, type FilterDraft } from "../model/filter-draft";
import type { RuleOption } from "../model/rule-option";
import type { UsersFilter } from "../model/users-filter";
import { usersFilterCount } from "../model/users-filter-count";
import { usersHref } from "../model/users-href";
import { UsersRulePicker } from "./users-rule-picker";

const RULE_PICKER = { cert: "cert", host: "host" } as const;

const RULE_PICKER_TITLE = {
  cert: "룰북을 인증한 유저",
  host: "구인을 연 룰",
} as const satisfies Record<keyof typeof RULE_PICKER, string>;

const NO_SELECTION_LABEL = "선택 안 함";

interface UsersFilterSheetProps {
  filter: UsersFilter;
  total: number;
  ruleOptions: RuleOption[];
}

// 시트 안에서 고른 것은 [유저 N명 보기]를 눌러야 주소에 들어간다. 건수는 고를 때마다 서버에서 다시 세고, 요청 순서 번호로 마지막 요청의 답만 반영한다.
export function UsersFilterSheet({ filter, total, ruleOptions }: UsersFilterSheetProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(EMPTY_FILTER_DRAFT);
  const [draftCount, setDraftCount] = useState(total);
  const [picking, setPicking] = useState<keyof typeof RULE_PICKER | null>(null);
  const [counting, setCounting] = useState(false);
  const requestRef = useRef(0);

  const ruleLabel = (id: string | undefined) =>
    ruleOptions.find((option) => option.id === id)?.label ?? NO_SELECTION_LABEL;

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      requestRef.current += 1;
      setDraft({ cert: filter.cert, host: filter.host, recruiting: filter.recruiting });
      setDraftCount(total);
      setCounting(false);
      setPicking(null);
    }
    setOpen(nextOpen);
  }

  function update(next: FilterDraft) {
    setDraft(next);
    const request = ++requestRef.current;
    setCounting(true);
    countFilteredUsers({
      filter: { q: filter.q, ...next, recruiting: next.recruiting ? "1" : "0" },
    })
      .then((count) => {
        if (request === requestRef.current) setDraftCount(count);
      })
      .catch((error: unknown) => {
        if (request === requestRef.current) reportError({ error });
      })
      .finally(() => {
        if (request === requestRef.current) setCounting(false);
      });
  }

  function apply() {
    setOpen(false);
    router.push(toServerPath(usersHref({ ...filter, ...draft })));
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Trigger render={<FilterButton count={usersFilterCount(filter)} />} />
      <Sheet.Popup>
        <Sheet.Handle />
        {picking ? (
          <UsersRulePicker
            title={RULE_PICKER_TITLE[picking]}
            options={ruleOptions}
            selected={draft[picking]}
            onDone={(id) => {
              update({ ...draft, [picking]: id });
              setPicking(null);
            }}
          />
        ) : (
          <>
            <Sheet.Title className="mb-100">필터</Sheet.Title>
            <Sheet.Body>
              <VStack>
                {Object.values(RULE_PICKER).map((key) => (
                  <Sheet.Item key={key} onClick={() => setPicking(key)}>
                    {RULE_PICKER_TITLE[key]}
                    <HStack align="center" gap="050" className="min-w-0">
                      <Text truncate typography="body3" foreground="muted">
                        {ruleLabel(draft[key])}
                      </Text>
                      <ChevronRight size={16} aria-hidden className="flex-none" />
                    </HStack>
                  </Sheet.Item>
                ))}
                <Switch.Root
                  checked={draft.recruiting}
                  onCheckedChange={(recruiting) => update({ ...draft, recruiting })}
                  className="min-h-13 w-full justify-between"
                >
                  <Switch.Label>모집 중인 구인이 있는 유저</Switch.Label>
                  <Switch.Control />
                </Switch.Root>
              </VStack>
            </Sheet.Body>
            <Sheet.Footer>
              <Grid cols={2} gap="100">
                <Button variant="outline" size="lg" onClick={() => update(EMPTY_FILTER_DRAFT)}>
                  초기화
                </Button>
                <Button size="lg" disabled={counting} onClick={apply}>
                  유저 {draftCount}명 보기
                </Button>
              </Grid>
            </Sheet.Footer>
          </>
        )}
      </Sheet.Popup>
    </Sheet.Root>
  );
}
