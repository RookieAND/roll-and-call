"use client";

import { Button, toast } from "@roll-and-call/ui";

import { quoteWithParticle, useActionSubmit, withObjectParticle } from "@/shared/lib";

import { deleteSeller } from "../api/delete-seller";

interface RemoveSellerButtonProps {
  id: string;
  name: string;
}

// 확인 없이 뺀다(D291, 판단 남김).
export function RemoveSellerButton({ id, name }: RemoveSellerButtonProps) {
  const { pending, submit } = useActionSubmit(deleteSeller);
  return (
    <Button
      variant="outline"
      colorPalette="danger"
      size="sm"
      aria-label={`${name} 목록에서 빼기`}
      loading={pending}
      onClick={async () => {
        if (!(await submit(id))) {
          toast.danger("판매처를 빼지 못했습니다.", { description: "다시 시도해 주세요." });
          return;
        }
        toast.success(`판매처 ${quoteWithParticle(name, withObjectParticle)} 목록에서 뺐습니다`);
      }}
    >
      빼기
    </Button>
  );
}
