import { HStack, Skeleton, Table, VStack } from "@roll-and-call/ui";

import { CertRouteTabs } from "@/entities/cert";
import { AdminHeader, LoadingRegion, Panel } from "@/shared/ui";

import { MakerQueueHead } from "./maker-queue-head";

const ROW_COUNT = 5;

export function MakerQueueLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertRouteTabs value="/cert/maker" />
      <LoadingRegion label="심사 대기열을 불러오는 중입니다" className="p-200">
        <VStack gap="150">
          <Panel>
            <Table.Root className="table-equal">
              <MakerQueueHead linked={false} />
              <Table.Body>
                {Array.from({ length: ROW_COUNT }, (_, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <HStack align="center" gap="100">
                        <Skeleton width={24} height={24} rounded="full" />
                        <Skeleton width={72} height={14} />
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton width={220} height={14} />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton width={140} height={14} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Panel>
        </VStack>
      </LoadingRegion>
    </>
  );
}
