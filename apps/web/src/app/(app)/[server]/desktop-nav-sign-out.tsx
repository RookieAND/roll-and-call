import { Text } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";

import { SignOutButton } from "@/features/auth";

export function DesktopNavSignOut() {
  return (
    <SignOutButton className="min-h-11 w-full justify-start gap-150 rounded-500 border-0 px-150 text-gray-600 hover:brightness-[.96]">
      <LogOut size={22} strokeWidth={1.9} aria-hidden />
      <Text typography="body2" weight="medium" foreground="inherit">
        로그아웃
      </Text>
    </SignOutButton>
  );
}
