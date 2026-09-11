import { HStack, IconButton } from "@trpg/ui";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { ProfileIdentity } from "@/entities/profile";
import { ThemeToggle } from "@/shared/ui";

// 내 신원 + 이 화면에서만 쓰는 계정 조작(테마 전환 · 프로필 편집).
export function MyPageHeader({
  name,
  avatarUrl,
  handle,
}: {
  name: string;
  avatarUrl: string | null;
  handle?: string | null;
}) {
  return (
    <HStack justify="between" align="center">
      <ProfileIdentity name={name} avatarUrl={avatarUrl} handle={handle} />
      <HStack gap={2} align="center">
        <ThemeToggle />
        <IconButton
          asChild
          variant="outline"
          aria-label="프로필 편집"
          className="h-9 w-9 border-gray-200 text-gray-600"
        >
          <Link href="/me/edit">
            <Pencil size={16} />
          </Link>
        </IconButton>
      </HStack>
    </HStack>
  );
}
