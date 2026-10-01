"use client";

import { Button, Checkbox, CheckboxGroup, Grid, Popover, Text, VStack } from "@roll-and-call/ui";
import { compact } from "es-toolkit";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { actionTriggerLabel } from "../model/action-trigger-label";

interface ActionFilterProps {
  groups: readonly { label: string; actions: readonly string[] }[];
}

const PARAM = "actions";

export function ActionFilter({ groups }: ActionFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = compact(searchParams.get(PARAM)?.split(",") ?? []);

  const triggerLabel = actionTriggerLabel(selected);

  const change = (actions: string[]) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (actions.length) next.set(PARAM, actions.join(","));
    else next.delete(PARAM);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button
            variant="outline"
            colorPalette="gray"
            className="h-[44px] w-[140px] justify-between font-normal"
          />
        }
      >
        <Text typography="body3" truncate>
          {triggerLabel}
        </Text>
        <ChevronDown size={14} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="start" className="w-[600px] max-w-[600px] px-200 py-050">
        <CheckboxGroup.Root value={selected} onValueChange={change} aria-label="조치 종류">
          <VStack className="divide-y divide-gray-200">
            {groups.map((group) => (
              <Grid key={group.label} className="grid-cols-[88px_minmax(0,1fr)] gap-x-150 py-100">
                <Text typography="body4" weight="bold" foreground="hint" className="leading-[32px]">
                  {group.label}
                </Text>
                <Grid className="grid-cols-3 gap-x-150">
                  {group.actions.map((action) => (
                    <Checkbox.Field key={action} className="min-h-[32px] gap-100">
                      <Checkbox.Root name={action} value={action}>
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                      <Checkbox.Label>{action}</Checkbox.Label>
                    </Checkbox.Field>
                  ))}
                </Grid>
              </Grid>
            ))}
          </VStack>
        </CheckboxGroup.Root>
      </Popover.Popup>
    </Popover.Root>
  );
}
