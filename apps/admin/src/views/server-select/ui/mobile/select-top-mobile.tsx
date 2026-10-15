import { HStack, UiImage } from "@roll-and-call/ui";

import { ThemeToggleButton } from "@/shared/ui";

export function SelectTopMobile() {
  return (
    <HStack
      align="center"
      gap="100"
      render={<header />}
      className="sticky top-0 z-(--rc-z-sticky) h-14 shrink-0 border-b border-gray-200 bg-surface pr-100 pl-200"
    >
      <UiImage name="logo" alt="Roll & Call" width={82} height={20} loading="eager" />
      <div className="ml-auto">
        <ThemeToggleButton />
      </div>
    </HStack>
  );
}
