"use client";

import { Button, Tooltip, toast } from "@roll-and-call/ui";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";

import { deleteSeller } from "../api/delete-seller";

interface RemoveSellerButtonProps {
  id: string;
  name: string;
}

// 확인 없이 뺀다(D291, 판단 남김). IconButton에 danger 색이 없어 아이콘만 둔 outline danger Button으로 그린다.
export function RemoveSellerButton({ id, name }: RemoveSellerButtonProps) {
  const [pending, startTransition] = useTransition();
  return (
    <Tooltip content="목록에서 빼기">
      <Button
        variant="outline"
        colorPalette="danger"
        size="sm"
        aria-label={`${name} 목록에서 빼기`}
        loading={pending}
        className="w-8 px-0"
        onClick={() =>
          startTransition(async () => {
            await deleteSeller(id);
            toast.success(
              `판매처 ${quoteWithParticle(name, withObjectParticle)} 목록에서 뺐습니다`,
            );
          })
        }
      >
        <Trash2 size={16} aria-hidden />
      </Button>
    </Tooltip>
  );
}
