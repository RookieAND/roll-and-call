"use client";

import type { ComponentProps } from "react";

import { EditProfileForm } from "@/features/edit-profile";
import { ProfileBannerUpload } from "@/features/upload-thumbnail";

interface EditProfileWithBannerProps extends Omit<
  ComponentProps<typeof EditProfileForm>,
  "renderBannerField"
> {
  serverId: string;
}

// 배너 올리기는 다른 feature라 여기서 조립한다. 함수는 서버 컴포넌트에서 넘길 수 없어 클라이언트에서 만든다.
export function EditProfileWithBanner({ serverId, ...props }: EditProfileWithBannerProps) {
  return (
    <EditProfileForm
      {...props}
      renderBannerField={({ value, onChange }) => (
        <ProfileBannerUpload serverId={serverId} value={value} onChange={onChange} />
      )}
    />
  );
}
