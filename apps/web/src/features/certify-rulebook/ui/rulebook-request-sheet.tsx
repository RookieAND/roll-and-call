"use client";

import { Button, Field, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebook } from "../api/request-rulebook";
import type { RulebookRequestValues } from "../model/rulebook-request-form";
import { SheetTitleRow } from "./sheet-title-row";

const EMPTY: RulebookRequestValues = { name: "", edition: "", publisher: "", note: "" };

interface RulebookRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RulebookRequestSheet({ open, onOpenChange }: RulebookRequestSheetProps) {
  const [values, setValues] = useState(EMPTY);
  const { pending, run } = useAction();
  const filled = values.name.trim() !== "" && values.edition.trim() !== "";

  const field = (key: keyof RulebookRequestValues) => ({
    id: `rulebook-request-${key}`,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  const submit = () =>
    run(() => requestRulebook(values), {
      onSuccess: () => {
        toast.success("추가 요청을 보냈습니다");
        setValues(EMPTY);
        onOpenChange(false);
      },
    });

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="찾는 룰북이 없어요" className="px-0">
        <Sheet.Handle />
        <SheetTitleRow title="찾는 룰북이 없어요" />
        <Sheet.Body className="px-200 pb-250">
          <VStack gap="175">
            <Text
              typography="body3"
              foreground="muted"
              render={<p />}
              className="[text-wrap:pretty]"
            >
              목록에 없는 룰북을 알려 주시면 운영진이 확인한 뒤 목록에 추가합니다.
              <br />
              룰북이 목록에 추가되면 그 룰북으로 인증을 신청할 수 있습니다.
            </Text>
            <Field.Root label="룰북 이름" htmlFor="rulebook-request-name" required>
              <TextInput maxLength={100} {...field("name")} />
            </Field.Root>
            <Field.Root label="판본" htmlFor="rulebook-request-edition" required>
              <TextInput maxLength={50} placeholder="예: 7판, 2024년판" {...field("edition")} />
            </Field.Root>
            <Field.Root label="출판사" htmlFor="rulebook-request-publisher">
              <TextInput maxLength={100} {...field("publisher")} />
            </Field.Root>
            <Field.Root label="메모" htmlFor="rulebook-request-note">
              <TextInput
                maxLength={200}
                placeholder="예: 같은 룰북을 부르는 다른 이름"
                {...field("note")}
              />
            </Field.Root>
            <Button
              size="lg"
              className="mt-050 w-full"
              disabled={!filled}
              loading={pending}
              onClick={submit}
            >
              추가 요청 보내기
            </Button>
          </VStack>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
