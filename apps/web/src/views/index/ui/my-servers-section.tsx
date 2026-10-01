import { Button, Container, Text, VStack } from "@roll-and-call/ui";

import { EmptyState } from "@/shared/ui";

import { INQUIRY_URL } from "../model/inquiry-url";
import type { MemberServer } from "../model/member-server";
import { ServerCard } from "./server-card";

interface MyServersSectionProps {
  servers: MemberServer[];
  userId: string;
}

export function MyServersSection({ servers, userId }: MyServersSectionProps) {
  return (
    <Container render={<section aria-labelledby="my-servers-title" />} className="relative pt-300">
      <VStack gap="175">
        <Text id="my-servers-title" typography="heading2" render={<h2 />}>
          내 서버
        </Text>
        {servers.length === 0 ? (
          <EmptyState
            size="section"
            title="아직 들어간 서버가 없어요"
            description="우리 서버에도 Roll & Call을 쓰고 싶다면 문의해 주세요."
            className="bg-surface"
            action={
              <Button
                variant="outline"
                size="md"
                render={<a href={INQUIRY_URL} target="_blank" rel="noreferrer" />}
              >
                도입 문의하기
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-150">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} userId={userId} />
            ))}
          </div>
        )}
      </VStack>
    </Container>
  );
}
