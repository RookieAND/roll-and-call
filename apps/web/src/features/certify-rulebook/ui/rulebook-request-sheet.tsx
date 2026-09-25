"use client";

import { Button, Field, SegmentedControl, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebook } from "../api/request-rulebook";
import {
  needsCategory,
  REQUEST_KIND_LABEL,
  REQUEST_KINDS,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";
import { SheetTitleRow } from "./sheet-title-row";

const EMPTY: RulebookRequestValues = {
  name: "",
  edition: "",
  kind: "core",
  category: "",
  publisher: "",
  note: "",
};

interface RulebookRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 서플리먼트·핸드북의 룰을 고를 때 보여 줄 카테고리 이름.
  categoryNames: string[];
}

export function RulebookRequestSheet({
  open,
  onOpenChange,
  categoryNames,
}: RulebookRequestSheetProps) {
  const [values, setValues] = useState(EMPTY);
  const { pending, run } = useAction();
  const askCategory = needsCategory(values.kind);
  const category = values.category.trim();
  const filled = values.name.trim() !== "" && (!askCategory || category !== "");

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
              목록에 없는 룰북을 알려 주시면 운영진이 확인하고 목록에 추가합니다.
              <br />
              추가되면 그 룰북으로 인증을 신청할 수 있습니다.
            </Text>
            <Field.Root label="룰북 이름" htmlFor="rulebook-request-name" required>
              <TextInput maxLength={100} placeholder="예: 펄프 크툴루" {...field("name")} />
            </Field.Root>
            <Field.Root
              label="판본"
              description="없으면 비워 주세요."
              htmlFor="rulebook-request-edition"
            >
              <TextInput maxLength={50} placeholder="예: 7판, 3rd" {...field("edition")} />
            </Field.Root>
            <VStack gap="100">
              <Text typography="body3" weight="bold">
                종류
              </Text>
              <SegmentedControl.Root
                value={values.kind}
                onValueChange={(kind) =>
                  setValues((current) => ({
                    ...current,
                    kind: kind as RulebookRequestValues["kind"],
                  }))
                }
                aria-label="종류"
              >
                {REQUEST_KINDS.map((kind) => (
                  <SegmentedControl.Item key={kind} value={kind}>
                    {REQUEST_KIND_LABEL[kind]}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl.Root>
            </VStack>
            {askCategory && (
              <Field.Root
                label="어느 룰의 책인가요?"
                htmlFor="rulebook-request-category"
                required
                description={
                  category && !categoryNames.includes(category)
                    ? "목록에 없는 룰입니다. 적은 이름 그대로 보냅니다."
                    : undefined
                }
              >
                <TextInput
                  maxLength={100}
                  list="rulebook-request-categories"
                  placeholder="예: 크툴루의 부름"
                  {...field("category")}
                />
                <datalist id="rulebook-request-categories">
                  {categoryNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </Field.Root>
            )}
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
