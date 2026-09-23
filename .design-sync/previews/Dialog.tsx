import { Button, Dialog, Text } from "@roll-and-call/ui";

export const SessionDetail = () => (
  <Dialog.Root defaultOpen>
    <Dialog.Popup size="md">
      <Dialog.Header>
        <Dialog.Title>다음 세션 안내</Dialog.Title>
        <Dialog.Description>
          {"9월 27일 토요일 오후 7시\n달빛 여관 · 4시간 예정"}
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <Text typography="body4" foreground="muted">
          참여자 전원에게 디스코드로 같은 안내가 전달됩니다.
        </Text>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close render={<Button />}>확인</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Popup>
  </Dialog.Root>
);

export const InviteLink = () => (
  <Dialog.Root defaultOpen>
    <Dialog.Popup size="sm">
      <Dialog.Header>
        <Dialog.Title>초대 링크</Dialog.Title>
        <Dialog.Description>이 링크로 들어오면 바로 신청 화면이 열립니다.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <Text
          typography="code2"
          foreground="hint"
          render={<p />}
          className="rounded-300 border border-gray-200 bg-gray-50 px-150 py-100"
        >
          roll-and-call.app/g/moonlight-inn
        </Text>
      </Dialog.Body>
      <Dialog.Footer layout="row">
        <Dialog.Close render={<Button variant="outline" className="flex-1" />}>닫기</Dialog.Close>
        <Button className="flex-1">복사하기</Button>
      </Dialog.Footer>
    </Dialog.Popup>
  </Dialog.Root>
);

export const AnnouncementLong = () => (
  <Dialog.Root defaultOpen>
    <Dialog.Popup size="lg">
      <Dialog.Header>
        <Dialog.Title>운영 공지</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Text typography="body4" foreground="muted" render={<p />} className="leading-relaxed">
          {"추석 연휴 기간(9월 25일 ~ 9월 29일)에는 GM 확인이 늦어질 수 있습니다.\n"}
          {"이 기간에 등록한 구인은 확정까지 최대 이틀이 걸릴 수 있으니 참고해 주세요.\n"}
          {"마감이 임박한 구인은 우선으로 처리합니다.\n"}
          {"문의는 디스코드 운영 채널로 남겨 주시면 순서대로 답변드립니다."}
        </Text>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close render={<Button />}>알겠습니다</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Popup>
  </Dialog.Root>
);
