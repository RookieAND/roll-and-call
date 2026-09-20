import { Text } from "@trpg/ui";

export function EditWithoutApplicantsNotice() {
  return (
    <div className="rounded-500 bg-gray-50 px-175 py-150">
      <Text typography="subtitle2" render={<p />}>
        아직 신청자가 없습니다.
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="mt-025">
        모든 항목을 바꿀 수 있고, 저장하면 디스코드 공지도 다시 올라갑니다.
      </Text>
    </div>
  );
}
