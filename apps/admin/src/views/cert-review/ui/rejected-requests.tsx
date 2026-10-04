import { HStack, Text, VStack } from "@roll-and-call/ui";

interface RejectedRequestsProps {
  requests: string[];
}

// 지난 사유가 하나면 번호 목록 대신 문장으로 둔다.
export function RejectedRequests({ requests }: RejectedRequestsProps) {
  if (requests.length <= 1) {
    return <Text typography="body3">{requests[0] ?? ""}</Text>;
  }
  return (
    <VStack gap="075" render={<ol />} className="py-100">
      {requests.map((request, index) => (
        <HStack key={request} align="baseline" gap="100" render={<li />}>
          <Text
            typography="body4"
            weight="bold"
            foreground="muted"
            className="grid size-[18px] shrink-0 place-items-center rounded-full bg-gray-100"
          >
            {index + 1}
          </Text>
          <Text typography="body3">{request}</Text>
        </HStack>
      ))}
    </VStack>
  );
}
