"use client";

import { Button, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import type { PurchaseRecord } from "../model/purchase-record";
import { PurchaseRecordFields } from "./purchase-record-fields";
import { SheetTitleRow } from "./sheet-title-row";

interface PurchaseRecordRowProps {
  value: PurchaseRecord;
  onChange: (value: PurchaseRecord) => void;
}

// 실물의 선택 구매 기록. 비었으면 추가 줄, 채웠으면 요약과 [수정]. 입력은 시트에서 한다.
export function PurchaseRecordRow({ value, onChange }: PurchaseRecordRowProps) {
  const [open, setOpen] = useState(false);
  const filled = Boolean(value.captureUrl || value.orderNumber.trim() || value.orderDate.trim());
  const summary = [
    value.orderNumber.trim() && `주문번호 ${value.orderNumber.trim()}`,
    value.orderDate.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {filled ? (
        <HStack
          align="center"
          gap="125"
          className="min-h-14 rounded-500 border border-gray-200 py-075 pr-075 pl-100"
        >
          {value.captureUrl ? (
            // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
            <img
              src={value.captureUrl}
              alt=""
              className="size-10 flex-none rounded-300 object-cover"
            />
          ) : (
            <span className="size-10 flex-none rounded-300 bg-secondary-strong" />
          )}
          <VStack className="min-w-0 flex-1">
            <Text typography="body3" weight="bold">
              구매 기록
            </Text>
            <Text typography="body4" foreground="hint" numeric truncate>
              {summary || "캡처 1장"}
            </Text>
          </VStack>
          <Button variant="ghost" onClick={() => setOpen(true)}>
            수정
          </Button>
        </HStack>
      ) : (
        <Button
          variant="outline"
          colorPalette="primary"
          size="lg"
          onClick={() => setOpen(true)}
          className="h-auto min-h-14 w-full justify-start border-dashed py-100"
        >
          <Plus size={16} strokeWidth={2.4} aria-hidden />
          <VStack className="items-start">
            <Text typography="body3" weight="bold" foreground="inherit">
              구매 기록 추가
            </Text>
            <Text typography="body4" foreground="hint">
              선택 · 캡처, 주문번호, 주문일
            </Text>
          </VStack>
        </Button>
      )}
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Overlay />
        <Sheet.Popup aria-label="구매 기록" className="px-0">
          <Sheet.Handle />
          <SheetTitleRow title="구매 기록" />
          <Sheet.Body className="px-200 pb-250">
            <VStack gap="175">
              <Text typography="body3" foreground="muted" render={<p />}>
                사진만으로 확인하기 어려울 때 참고합니다.
              </Text>
              <PurchaseRecordFields value={value} onChange={onChange} />
              <Button size="lg" className="w-full" onClick={() => setOpen(false)}>
                완료
              </Button>
            </VStack>
          </Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
    </>
  );
}
