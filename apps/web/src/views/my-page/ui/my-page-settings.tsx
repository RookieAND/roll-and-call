import { Text } from "@trpg/ui";

import { SignOutButton } from "@/features/auth";
import { ThemeSetting } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

export function MyPageSettings({ handleLabel }: { handleLabel: string | null }) {
  return (
    <section className="flex flex-col gap-2.5">
      <Text typography="heading3" render={<h2 />}>
        설정
      </Text>
      <div className={MY_PAGE_GROUP_CLASS}>
        <div className="flex h-[52px] items-center gap-3 border-b border-gray-100 px-[13px]">
          <Text typography="subtitle1" className="flex-1">
            화면 테마
          </Text>
          <ThemeSetting />
        </div>
        <SignOutButton className="h-[52px] w-full justify-between rounded-none border-0 px-[13px] text-[14px] font-bold text-gray-900">
          로그아웃
          {handleLabel && (
            <Text typography="body3" foreground="hint" render={<span />}>
              {handleLabel}
            </Text>
          )}
        </SignOutButton>
      </div>
    </section>
  );
}
