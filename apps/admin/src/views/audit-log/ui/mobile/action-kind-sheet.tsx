"use client";

import { Button, Checkbox, CheckboxGroup, Grid, Sheet, Text, VStack } from "@roll-and-call/ui";
import { compact } from "es-toolkit";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { actionTriggerLabel } from "../../model/action-trigger-label";

interface ActionKindSheetProps {
  groups: readonly { label: string; actions: readonly string[] }[];
}

const PARAM = "actions";

// 데스크톱 조치 팝오버의 모바일판: 조치 묶음 단위로 시트에서 고른다(주소에는 조치 이름이 그대로 들어간다).
export function ActionKindSheet({ groups }: ActionKindSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = compact(searchParams.get(PARAM)?.split(",") ?? []);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);

  const checkedGroups = (actions: string[]) =>
    groups
      .filter((group) => group.actions.every((action) => actions.includes(action)))
      .map((group) => group.label);

  const openSheet = (next: boolean) => {
    if (next) setDraft(checkedGroups(selected));
    setOpen(next);
  };

  const apply = () => {
    const actions = groups
      .filter((group) => draft.includes(group.label))
      .flatMap((group) => group.actions);
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (actions.length) next.set(PARAM, actions.join(","));
    else next.delete(PARAM);
    setOpen(false);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <Sheet.Root open={open} onOpenChange={openSheet}>
      <Sheet.Trigger
        render={
          <Button
            variant="outline"
            colorPalette="gray"
            className="h-11 w-full min-w-0 justify-between font-normal"
          />
        }
      >
        <Text typography="body3" truncate>
          {actionTriggerLabel(selected)}
        </Text>
        <ChevronDown size={14} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Header>
          <Sheet.Title className="text-heading3">조치 종류</Sheet.Title>
          <Text typography="body3" foreground="muted">
            여러 종류를 함께 고를 수 있습니다.
          </Text>
        </Sheet.Header>
        <CheckboxGroup.Root value={draft} onValueChange={setDraft} aria-label="조치 종류">
          <VStack gap="075">
            {groups.map((group) => (
              <Checkbox.Field
                key={group.label}
                className="min-h-12 gap-100 rounded-400 border border-gray-200 px-150"
              >
                <Checkbox.Root name={group.label} value={group.label}>
                  <Checkbox.Indicator />
                </Checkbox.Root>
                <Checkbox.Label>{group.label}</Checkbox.Label>
              </Checkbox.Field>
            ))}
          </VStack>
        </CheckboxGroup.Root>
        <Sheet.Footer>
          <Grid cols={2} className="gap-100">
            <Button variant="outline" colorPalette="gray" size="lg" onClick={() => setDraft([])}>
              초기화
            </Button>
            <Button size="lg" onClick={apply}>
              적용
            </Button>
          </Grid>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
