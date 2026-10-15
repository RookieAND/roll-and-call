"use client";

import { Button, Field, TextInput, toast } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";
import { ModalServerLabel, MODAL_FOOTER_CLASS, ResponsiveDialog } from "@/shared/ui";

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
        if ("error" in result) toast.danger(result.error);
        else setDuplicate(true);
        return;
      }
      toast.success(`판매처 ${quoteWithParticle(name.trim(), withObjectParticle)} 추가했습니다`);
      setName("");
      setOpen(false);
    });

  return (
    <ResponsiveDialog.Root open={open} onOpenChange={(nextOpen) => pending || setOpen(nextOpen)}>
      <ResponsiveDialog.Trigger render={<Button size="sm" className="gap-050" />}>
        <Plus size={14} aria-hidden />
        판매처 추가
      </ResponsiveDialog.Trigger>
      <ResponsiveDialog.Popup className="max-w-[480px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>전자책 판매처 추가</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            신청자가 전자책을 신청할 때 고르는 목록에 들어갑니다.
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
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
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
          <Button loading={pending} disabled={!name.trim() || pending} onClick={save}>
            추가
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
