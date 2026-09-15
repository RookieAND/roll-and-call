import { Avatar, Button, Text } from "@trpg/ui";
import Link from "next/link";

export function MyPageHeader({
  name,
  avatarUrl,
  bio,
}: {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}) {
  const bioText = bio || "한 줄 소개를 적어보세요.";
  const bioForeground = bio ? "muted" : "hint";

  return (
    <div className="flex items-center gap-[13px]">
      <Avatar src={avatarUrl} name={name} size="2xl" />
      <div className="min-w-0 flex-1">
        <Text
          typography="heading2"
          render={<h1 />}
          className="text-[17px] font-extrabold tracking-[-0.015em]"
        >
          {name}
        </Text>
        <Text typography="body3" foreground={bioForeground} className="mt-[3px] block truncate">
          {bioText}
        </Text>
      </div>
      <Button
        asChild
        variant="outline"
        className="h-9 flex-none rounded-[10px] px-3 text-[12.5px] font-bold"
      >
        <Link href="/me/edit">편집</Link>
      </Button>
    </div>
  );
}
