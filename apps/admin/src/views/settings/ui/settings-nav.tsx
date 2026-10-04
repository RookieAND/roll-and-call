import { Text, VStack, cn } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { SETTINGS_NAV_ITEMS, type SettingsHref } from "../model/settings-nav-items";

interface SettingsNavProps {
  active: SettingsHref;
}

export function SettingsNav({ active }: SettingsNavProps) {
  return (
    <VStack
      render={<nav aria-label="설정 메뉴" />}
      className="w-[220px] shrink-0 border-r border-gray-200 bg-surface"
    >
      <Text
        typography="subtitle2"
        foreground="muted"
        className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        설정
      </Text>
      {SETTINGS_NAV_ITEMS.map((item) => {
        const current = item.href === active;
        return (
          <Text
            key={item.href}
            typography="body3"
            foreground={current ? "inherit" : "muted"}
            weight={current ? "bold" : "medium"}
            aria-current={current ? "page" : undefined}
            render={<ServerLink path={item.href} />}
            className={cn(
              "border-b border-(--rc-color-border-subtle) px-175 py-125 hover:bg-gray-50",
              current &&
                "bg-tinted-bg text-(--rc-color-fg-primary-strong) shadow-[inset_4px_0_0_var(--rc-color-bg-primary)] hover:bg-tinted-bg",
            )}
          >
            {item.label}
          </Text>
        );
      })}
    </VStack>
  );
}
