import { AlertDialog, Button, Callout } from "@roll-and-call/ui";

export const DeleteGame = () => (
  <AlertDialog.Root defaultOpen>
    <AlertDialog.Popup size="md">
      <AlertDialog.Header>
        <AlertDialog.Title>구인 취소</AlertDialog.Title>
        <AlertDialog.Description>
          {"이 구인을 취소할까요? 되돌릴 수 없습니다.\n확정 참여자 4명에게 취소 사실이 디스코드로 전해집니다."}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <Callout.Root size="sm" className="mt-150">
        <Callout.Description>
          <ul className="flex list-disc flex-col gap-050 pl-200 text-body4">
            <li>디스코드 모집 공지에 취소가 표시됩니다.</li>
            <li>모집 스레드와 세션 채널에 취소를 알립니다.</li>
          </ul>
        </Callout.Description>
      </Callout.Root>
      <AlertDialog.Footer layout="row">
        <AlertDialog.Close render={<Button variant="outline" className="h-11 flex-1" />}>
          닫기
        </AlertDialog.Close>
        <AlertDialog.Close render={<Button colorPalette="danger" className="h-11 flex-1" />}>
          구인 취소
        </AlertDialog.Close>
      </AlertDialog.Footer>
    </AlertDialog.Popup>
  </AlertDialog.Root>
);

export const RemoveMember = () => (
  <AlertDialog.Root defaultOpen>
    <AlertDialog.Popup size="md">
      <AlertDialog.Header>
        <AlertDialog.Title>참여자 내보내기</AlertDialog.Title>
        <AlertDialog.Description>
          {"달빛님을 내보내면 신청이 취소되고 되돌릴 수 없습니다.\n빈 자리는 저절로 차지 않으니 대기에서 직접 확정시켜 주세요."}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer layout="row">
        <AlertDialog.Close render={<Button variant="outline" className="h-11 flex-1" />}>
          취소
        </AlertDialog.Close>
        <AlertDialog.Close render={<Button colorPalette="danger" className="h-11 flex-1" />}>
          내보내기
        </AlertDialog.Close>
      </AlertDialog.Footer>
    </AlertDialog.Popup>
  </AlertDialog.Root>
);

export const ConfirmSession = () => (
  <AlertDialog.Root defaultOpen>
    <AlertDialog.Popup size="md">
      <AlertDialog.Header>
        <AlertDialog.Title>출석을 확정할까요?</AlertDialog.Title>
        <AlertDialog.Description>신청자 5명 중 1명을 불참으로 표시합니다.</AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer layout="row">
        <AlertDialog.Close render={<Button variant="outline" className="h-11 flex-1" />}>
          다시 보기
        </AlertDialog.Close>
        <AlertDialog.Close render={<Button className="h-11 flex-1" />}>확정하기</AlertDialog.Close>
      </AlertDialog.Footer>
    </AlertDialog.Popup>
  </AlertDialog.Root>
);
