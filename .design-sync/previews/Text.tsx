import { Text, VStack } from "@trpg/ui";

export const Typography = () => (
  <VStack gap={2}>
    <Text typography="display1" render={<h1 />}>TRPG 세션, 한 곳에서</Text>
    <Text typography="heading1">지금 모집 중</Text>
    <Text typography="heading2">구인 목록</Text>
    <Text typography="heading3">크툴루의 부름 — 안개 속의 저택</Text>
    <Text typography="subtitle1">세션 일시</Text>
    <Text typography="subtitle2">구인 목록</Text>
    <Text typography="body1">정원이 찼지만 대기 신청은 가능합니다.</Text>
    <Text typography="body2">참여하려면 로그인이 필요합니다.</Text>
    <Text typography="body3">9월 20일 (토) 오후 8:00 · 4시간</Text>
    <Text typography="body4">GM 김루키 · 참여자 3/5명</Text>
    <Text typography="code1">session-reminders</Text>
  </VStack>
);

export const Foregrounds = () => (
  <VStack gap={1}>
    <Text foreground="normal">모집 중인 구인글입니다.</Text>
    <Text foreground="muted">잠시 후 다시 시도해 주세요.</Text>
    <Text foreground="hint">모집 마감 D-3</Text>
    <Text foreground="primary">일정 조율 중</Text>
    <Text foreground="success">세션이 확정되었습니다</Text>
    <Text foreground="danger">모집 마감 기한을 입력하세요.</Text>
  </VStack>
);
