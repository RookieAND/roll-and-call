import { Text, VStack } from "@roll-and-call/ui";

export const TypeScale = () => (
  <VStack gap="100">
    <Text typography="heading1" render={<h1 />}>
      일정 조율 현황
    </Text>
    <Text typography="heading2" render={<h2 />}>
      크툴루의 부름 단편
    </Text>
    <Text typography="heading3" render={<h3 />}>
      참여자 3명 · 대기 2명
    </Text>
    <Text typography="subtitle1">토요일 오후 2시 확정</Text>
    <Text typography="subtitle2">GM 달빛</Text>
    <Text typography="body3">
      신청 순서대로 자리가 찹니다. 정원이 차면 이후 신청자는 대기 명단에 남습니다.
    </Text>
    <Text typography="body4" foreground="hint">
      마감까지 2일 남았습니다
    </Text>
  </VStack>
);

export const Foreground = () => (
  <VStack gap="075">
    <Text foreground="normal">제목과 본문</Text>
    <Text foreground="muted">설명문 — 읽히라고 쓴 글</Text>
    <Text foreground="hint">보조 문구 — 여기보다 옅게 쓰지 않는다</Text>
    <Text foreground="primary">일정 조율하러 가기</Text>
    <Text foreground="success">세션이 확정되었습니다</Text>
    <Text foreground="warning">마감이 3일 남았습니다</Text>
    <Text foreground="danger">정원을 더 줄일 수 없습니다</Text>
  </VStack>
);
