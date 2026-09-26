"use client";

import { Button, toast } from "@roll-and-call/ui";
import { useTransition } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";

import { deleteSeller } from "../api/delete-seller";

interface RemoveSellerButtonProps {
  id: string;
  name: string;
}

export function RemoveSellerButton({ id, name }: RemoveSellerButtonProps) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      size="sm"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteSeller(id);
          toast.success(`판매처 ${quoteWithParticle(name, withObjectParticle)} 목록에서 뺐습니다`);
        })
      }
    >
      목록에서 빼기
    </Button>
  );
}
