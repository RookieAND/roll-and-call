import { Button, Sheet, Text } from "@roll-and-call/ui";

export const PickSchedule = () => (
  <Sheet.Root defaultOpen>
    <Sheet.Popup>
      <Sheet.Handle />
      <Sheet.Header>
        <Sheet.Title>일정 조율</Sheet.Title>
      </Sheet.Header>
      <Sheet.Body>
        <Sheet.Item>토요일 오후 2시 · 4명 가능</Sheet.Item>
        <Sheet.Item>일요일 저녁 7시 · 3명 가능</Sheet.Item>
        <Sheet.Item>금요일 저녁 8시 · 2명 가능</Sheet.Item>
      </Sheet.Body>
      <Sheet.Footer>
        <Button>이 시간으로 확정하기</Button>
        <Sheet.Close render={<Button variant="outline" />}>닫기</Sheet.Close>
      </Sheet.Footer>
    </Sheet.Popup>
  </Sheet.Root>
);

export const MemberMenu = () => (
  <Sheet.Root defaultOpen>
    <Sheet.Popup>
      <Sheet.Handle />
      <Sheet.Title>달빛 님</Sheet.Title>
      <Sheet.Item>프로필 보기</Sheet.Item>
      <Sheet.Item>확정 풀기</Sheet.Item>
      <Sheet.Item>
        <Text foreground="danger">내보내기</Text>
      </Sheet.Item>
    </Sheet.Popup>
  </Sheet.Root>
);
