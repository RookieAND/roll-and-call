"use client";

import { Button, HStack, Text, toast } from "@roll-and-call/ui";
import { useState } from "react";

import { quoteWithParticle, useActionSubmit, withObjectParticle } from "@/shared/lib";
import { ResponsiveDialog } from "@/shared/ui";

import { deleteSeller } from "../api/delete-seller";

interface MobileSellerRowProps {
  id: string;
  name: string;
  certifiedCount: number;
}

// 모바일은 줄에 버튼을 두지 않는다. 줄을 누르면 빼기 확인 시트가 열린다.
export function MobileSellerRow({ id, name, certifiedCount }: MobileSellerRowProps) {
  const [open, setOpen] = useState(false);
  const { pending, submit } = useActionSubmit(deleteSeller);
  const remove = async () => {
    if (!(await submit(id))) {
      toast.danger("판매처를 빼지 못했습니다.", { description: "다시 시도해 주세요." });
      return;
    }
    setOpen(false);
    toast.success(`판매처 ${quoteWithParticle(name, withObjectParticle)} 목록에서 뺐습니다`);
  };
  return (
    <ResponsiveDialog.Root alert open={open} onOpenChange={(next) => pending || setOpen(next)}>
      <ResponsiveDialog.Trigger
        render={
          <HStack
            align="center"
            render={<button type="button" />}
            className="min-h-14 w-full border-b border-(--rc-color-border-subtle) bg-surface pr-150 pl-200 text-left active:bg-gray-50"
          />
        }
      >
        {/* ponytail: 목록 줄 전체가 시트를 여는 버튼이라 DS 버튼 모양을 쓰지 않는다. */}
        <Text typography="body2" weight="bold" truncate className="flex-1">
          {name}
        </Text>
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Popup>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>
            {`${withObjectParticle(name)} 목록에서 뺄까요?`}
          </ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            {`이 판매처로 인증된 책은 ${certifiedCount}권입니다.`}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <Text typography="body4" foreground="hint">
            목록에 없는 판매처는 신청자가 「기타」를 고른 뒤 직접 입력합니다.
          </Text>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row">
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
          <Button colorPalette="danger" loading={pending} onClick={() => void remove()}>
            목록에서 빼기
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
