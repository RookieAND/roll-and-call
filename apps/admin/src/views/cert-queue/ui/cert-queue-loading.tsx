"use client";

import {
  Chip,
  HStack,
  SegmentedControl,
  Select,
  Skeleton,
  Text,
  TextInput,
} from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { CERT_SEGMENTS } from "@/shared/lib";
import { AdminHeader, LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

const RULEBOOK_ALL = [{ label: "룰북 전체", value: "all" }];

// 세그먼트가 onValueChange를 요구해서 클라이언트에서 그린다. 불러오는 동안은 모두 비활성이다.
export function CertQueueLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" sub={<Skeleton width={80} height={12} render={<span />} />} />
      <div className="border-b border-gray-200 bg-surface px-225 py-100">
        <SegmentedControl.Root
          size="sm"
          value="/cert"
          onValueChange={() => {}}
          disabled
          aria-label="룰북 인증 화면"
        >
          {CERT_SEGMENTS.map((item) => (
            <SegmentedControl.Item key={item.href} value={item.href} className="text-body3">
              {item.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      <LoadingRegion label="심사 대기열을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" className="relative w-[220px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="닉네임 검색"
              aria-label="닉네임 검색"
              className="h-[36px] pl-400 text-body3"
            />
          </HStack>
          <div className="w-[150px]">
            <Select.Root items={RULEBOOK_ALL} defaultValue="all" disabled>
              <Select.Trigger className="whitespace-nowrap" />
            </Select.Root>
          </div>
          <Chip disabled>재신청만</Chip>
        </HStack>
        <Panel
          title="심사 대기열"
          right={
            <Text typography="body4" foreground="hint">
              오래 기다린 순
            </Text>
          }
          className="flex-1"
        >
          <SkeletonTable
            columns={[
              { label: "닉네임", kind: "text", width: "w-[140px]" },
              { label: "룰북", kind: "text" },
              { label: "신청일", kind: "date", width: "w-[136px]" },
              { label: "대기 일수", kind: "number", width: "w-[90px]", align: "end" },
              { label: "신청 구분", kind: "badge", width: "w-[100px]" },
              { label: "이전 반려", kind: "number", width: "w-[90px]", align: "end" },
              { label: "", kind: "button", width: "w-[110px]", align: "end" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
