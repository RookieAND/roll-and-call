"use client";

import { Button, Dialog, Field, TextInput, toast } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";

import { saveSeller } from "../api/save-seller";

export function AddSellerButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [duplicate, setDuplicate] = useState(false);

  const save = () =>
    startTransition(async () => {
      const result = await saveSeller(name);
      if (!result.ok) {
        setDuplicate(true);
        return;
      }
      toast.success(`판매처 ${quoteWithParticle(name.trim(), withObjectParticle)} 추가했습니다`);
      setName("");
      setOpen(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || setOpen(nextOpen)}>
      <Dialog.Trigger render={<Button size="sm" className="gap-050" />}>
        <Plus size={14} aria-hidden />
        판매처 추가
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-[480px]">
        <Dialog.Header>
          <Dialog.Title>전자책 판매처 추가</Dialog.Title>
          <Dialog.Description>
            신청자가 전자책을 신청할 때 고르는 목록에 들어갑니다.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <Field.Root
            label="판매처 이름"
            htmlFor="seller-name"
            required
            error={duplicate ? "이미 목록에 있는 판매처입니다" : undefined}
          >
            <TextInput
              id="seller-name"
              maxLength={100}
              placeholder="예: 리디"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setDuplicate(false);
              }}
            />
          </Field.Root>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!name.trim() || pending} onClick={save}>
            추가
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
