"use client";

import { Card, Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

// manageRows 5행 + CancelGameRow 1행.
const ROW_COUNT = 6;
const STAT_COUNT = 3;

export function ManageGameSkeleton() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AppBar back={`/games/${id}`} title="운영 관리" />
      <Container size="sm" className="px-0">
        <div className="px-200 pt-200">
          <Card.Root padding="md" radius={600}>
            <HStack align="start" gap="100">
              <Skeleton height={28} className="min-w-0 flex-1" />
              <Skeleton width={56} height={21} rounded={300} className="shrink-0" />
            </HStack>
            <HStack align="stretch" className="mt-150 border-t border-gray-200 pt-150">
              {range(STAT_COUNT).map((index) => (
                <VStack key={index} gap="025" align="center" className="min-w-0 flex-1">
                  <Skeleton width={40} height={16} />
                  <Skeleton width={56} height={20} />
                </VStack>
              ))}
            </HStack>
            <HStack align="center" gap="075" className="mt-150">
              <Skeleton width={14} height={14} rounded={100} className="shrink-0" />
              <Skeleton width={200} height={16} />
            </HStack>
          </Card.Root>
        </div>

        <div className="p-200">
          <Card.Root
            radius={600}
            padding="none"
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            {range(ROW_COUNT).map((index) => (
              <HStack key={index} align="center" gap="150" className="min-h-16 px-175 py-150">
                <Skeleton width={34} height={34} rounded={400} className="flex-none" />
                <div className="min-w-0 flex-1">
                  <Skeleton width={96} height={21} />
                  <Skeleton width={160} height={20} className="mt-025" />
                </div>
                <Skeleton width={16} height={16} rounded={100} className="flex-none" />
              </HStack>
            ))}
          </Card.Root>
        </div>
      </Container>
    </>
  );
}
